import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import Budget from '@/lib/models/Budget';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';

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

    // Get all user data
    const [user, transactions, budgets] = await Promise.all([
      User.findById(payload.userId),
      Transaction.find({ userId: payload.userId }).sort({ date: -1 }),
      Budget.find({ userId: payload.userId }).sort({ createdAt: -1 }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const exportData = {
      user: user.toJSON(),
      transactions: transactions.map(t => t.toJSON()),
      budgets: budgets.map(b => b.toJSON()),
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="expense-data-${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Export user data error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export data' },
      { status: 500 }
    );
  }
}