import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import { getAuthenticatedUserId, createAuthResponse } from '@/lib/clerk-auth';
import { transactionSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const paymentMethod = searchParams.get('paymentMethod');

    // Build filter
    const filter: any = { userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Get transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    const body = await request.json();
    const validatedData = transactionSchema.parse(body);

    // Create transaction
    const transaction = new Transaction({
      ...validatedData,
      userId,
    });

    await transaction.save();

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}