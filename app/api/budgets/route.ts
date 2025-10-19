import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/lib/models/Budget';
import Transaction from '@/lib/models/Transaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { budgetSchema } from '@/lib/validations';
import { startOfMonth, endOfMonth } from 'date-fns';

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

    const budgets = await Budget.find({ userId: payload.userId }).sort({ createdAt: -1 });

    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const currentDate = new Date();
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              category: budget.category,
              type: 'expense',
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const spentAmount = spent.length > 0 ? spent[0].total : 0;
        const remaining = budget.amount - spentAmount;
        const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

        return {
          ...budget.toObject(),
          spent: spentAmount,
          remaining: Math.max(0, remaining),
          percentage: Math.min(100, percentage),
          status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'good'
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: budgetsWithSpent,
    });
  } catch (error: any) {
    console.error('Get budgets error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const validatedData = budgetSchema.parse(body);

    // Check if budget already exists for this category and period
    const existingBudget = await Budget.findOne({
      userId: payload.userId,
      category: validatedData.category,
      period: validatedData.period,
    });

    if (existingBudget) {
      return NextResponse.json(
        { success: false, message: 'Budget already exists for this category and period' },
        { status: 400 }
      );
    }

    const budget = new Budget({
      ...validatedData,
      userId: payload.userId,
    });

    await budget.save();

    return NextResponse.json({
      success: true,
      data: budget,
      message: 'Budget created successfully',
    });
  } catch (error: any) {
    console.error('Create budget error:', error);
    
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