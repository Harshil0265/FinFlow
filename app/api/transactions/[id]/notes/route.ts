import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { z } from 'zod';

const notesSchema = z.object({
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();

    // Verify authentication
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
    const { notes } = notesSchema.parse(body);

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      { 
        notes: notes || '',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Notes updated successfully',
    });
  } catch (error: any) {
    console.error('Update notes error:', error);
    
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