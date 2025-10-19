import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import Budget from '@/lib/models/Budget';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
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

    // Delete all user data
    await Promise.all([
      Transaction.deleteMany({ userId: payload.userId }),
      Budget.deleteMany({ userId: payload.userId }),
      User.findByIdAndDelete(payload.userId),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}