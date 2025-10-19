import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RecurringTransaction from '@/lib/models/RecurringTransaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { recurringTransactionSchema } from '@/lib/validations';

// GET - Fetch specific recurring transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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

    const recurringTransaction = await RecurringTransaction.findOne({
      _id: id,
      userId: payload.userId,
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { success: false, message: 'Recurring transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recurringTransaction,
    });
  } catch (error: any) {
    console.error('Get recurring transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update recurring transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
    const validationResult = recurringTransactionSchema.partial().safeParse(body);
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

    const recurringTransaction = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      { ...data },
      { new: true, runValidators: true }
    );

    if (!recurringTransaction) {
      return NextResponse.json(
        { success: false, message: 'Recurring transaction not found' },
        { status: 404 }
      );
    }

    // Recalculate next due date if recurring rule changed
    if (data.recurringRule || data.startDate) {
      recurringTransaction.nextDueDate = recurringTransaction.calculateNextDueDate();
      await recurringTransaction.save();
    }

    return NextResponse.json({
      success: true,
      data: recurringTransaction,
      message: 'Recurring transaction updated successfully',
    });
  } catch (error: any) {
    console.error('Update recurring transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete recurring transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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

    const recurringTransaction = await RecurringTransaction.findOneAndDelete({
      _id: id,
      userId: payload.userId,
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { success: false, message: 'Recurring transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recurring transaction deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete recurring transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}