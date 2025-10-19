import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/lib/models/Budget';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { budgetSchema } from '@/lib/validations';

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
    const validatedData = budgetSchema.parse(body);

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      validatedData,
      { new: true }
    );

    if (!budget) {
      return NextResponse.json(
        { success: false, message: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: budget,
      message: 'Budget updated successfully',
    });
  } catch (error: any) {
    console.error('Update budget error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const budget = await Budget.findOneAndDelete({
      _id: params.id,
      userId: payload.userId,
    });

    if (!budget) {
      return NextResponse.json(
        { success: false, message: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete budget error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}