import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RecurringTransaction from '@/lib/models/RecurringTransaction';
import Transaction from '@/lib/models/Transaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { recurringTransactionSchema } from '@/lib/validations';

// GET - Fetch user's recurring transactions
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // 'active', 'inactive', or 'all'

    const skip = (page - 1) * limit;

    // Build query
    const query: any = { userId: payload.userId };
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const [recurringTransactions, total] = await Promise.all([
      RecurringTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RecurringTransaction.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: recurringTransactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get recurring transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new recurring transaction
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = recurringTransactionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid input data',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Calculate next due date
    const startDate = new Date(data.startDate);
    let nextDueDate = new Date(startDate);

    // Calculate initial next due date based on frequency
    switch (data.recurringRule.frequency) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + (data.recurringRule.interval || 1));
        break;
      case 'weekly':
        if (data.recurringRule.dayOfWeek !== undefined) {
          const daysUntilTarget = (data.recurringRule.dayOfWeek - nextDueDate.getDay() + 7) % 7;
          nextDueDate.setDate(nextDueDate.getDate() + daysUntilTarget);
          if (nextDueDate <= startDate) {
            nextDueDate.setDate(nextDueDate.getDate() + 7);
          }
        } else {
          nextDueDate.setDate(nextDueDate.getDate() + (data.recurringRule.interval || 1) * 7);
        }
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + (data.recurringRule.interval || 1));
        if (data.recurringRule.dayOfMonth) {
          nextDueDate.setDate(Math.min(data.recurringRule.dayOfMonth, new Date(nextDueDate.getFullYear(), nextDueDate.getMonth() + 1, 0).getDate()));
        }
        break;
      case 'yearly':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + (data.recurringRule.interval || 1));
        break;
    }

    const recurringTransaction = new RecurringTransaction({
      ...data,
      userId: payload.userId,
      nextDueDate,
      totalOccurrences: 0,
    });

    await recurringTransaction.save();

    return NextResponse.json({
      success: true,
      data: recurringTransaction,
      message: 'Recurring transaction created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create recurring transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Process due recurring transactions (this would typically be called by a cron job)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // Find all due recurring transactions for this user
    const dueRecurringTransactions = await RecurringTransaction.find({
      userId: payload.userId,
      isActive: true,
      nextDueDate: { $lte: now },
    });

    const processedTransactions = [];
    const updatedRecurringTransactions = [];

    for (const recurring of dueRecurringTransactions) {
      // Check if should process (handles max occurrences and end date)
      if (recurring.shouldProcess()) {
        // Create new transaction
        const newTransaction = new Transaction({
          userId: recurring.userId,
          title: recurring.title,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          paymentMethod: recurring.paymentMethod,
          description: `${recurring.description || ''} (Auto-generated from recurring transaction)`.trim(),
          date: new Date(recurring.nextDueDate),
          recurringTransactionId: recurring._id,
        });

        await newTransaction.save();
        processedTransactions.push(newTransaction);

        // Update recurring transaction
        recurring.lastProcessed = now;
        recurring.totalOccurrences += 1;
        recurring.nextDueDate = recurring.calculateNextDueDate();

        // Check if should deactivate
        if (recurring.maxOccurrences && recurring.totalOccurrences >= recurring.maxOccurrences) {
          recurring.isActive = false;
        }
        if (recurring.endDate && recurring.nextDueDate > recurring.endDate) {
          recurring.isActive = false;
        }

        await recurring.save();
        updatedRecurringTransactions.push(recurring);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processedTransactions,
        updatedRecurringTransactions,
      },
      message: `Processed ${processedTransactions.length} recurring transactions`,
    });
  } catch (error: any) {
    console.error('Process recurring transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}