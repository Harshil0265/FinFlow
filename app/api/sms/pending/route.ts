import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import SMSIntegrationService from '@/lib/sms-integration';

// Get pending transactions for review
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
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

    const smsService = SMSIntegrationService.getInstance();
    const pendingTransactions = await smsService.getPendingTransactions(payload.userId);

    return NextResponse.json({
      success: true,
      data: {
        transactions: pendingTransactions,
        count: pendingTransactions.length
      }
    });

  } catch (error: any) {
    console.error('Pending transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch pending transactions' },
      { status: 500 }
    );
  }
}

// Approve a pending transaction
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
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
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const smsService = SMSIntegrationService.getInstance();
    const success = await smsService.approvePendingTransaction(payload.userId, transactionId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Transaction approved successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Transaction not found or already processed' },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('Transaction approval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to approve transaction' },
      { status: 500 }
    );
  }
}