import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { SMSTransactionParser } from '@/lib/sms-parser';
import Transaction from '@/lib/models/Transaction';
import connectDB from '@/lib/mongodb';
import { z } from 'zod';

const ImportSMSSchema = z.object({
  messages: z.array(z.string()).min(1).max(100), // Limit to 100 messages per request
  autoApprove: z.boolean().default(false), // Whether to auto-approve high confidence transactions
  minConfidence: z.number().min(0).max(1).default(0.7), // Minimum confidence threshold
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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
    const validatedData = ImportSMSSchema.parse(body);
    const { messages, autoApprove, minConfidence } = validatedData;

    // Parse SMS messages
    const parsedTransactions = SMSTransactionParser.parseMultipleSMS(messages);
    
    // Filter by confidence threshold
    const highConfidenceTransactions = parsedTransactions.filter(
      transaction => transaction.confidence >= minConfidence
    );

    const results = {
      total: parsedTransactions.length,
      highConfidence: highConfidenceTransactions.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[],
      transactions: [] as any[]
    };

    // Process transactions
    for (const smsTransaction of highConfidenceTransactions) {
      try {
        // Check for duplicate transactions (same amount, date, and description)
        const existingTransaction = await Transaction.findOne({
          userId: payload.userId,
          amount: smsTransaction.amount,
          date: {
            $gte: new Date(smsTransaction.date.getTime() - 24 * 60 * 60 * 1000), // Within 24 hours
            $lte: new Date(smsTransaction.date.getTime() + 24 * 60 * 60 * 1000)
          },
          description: smsTransaction.description
        });

        if (existingTransaction) {
          results.skipped++;
          continue;
        }

        // Create transaction object
        const transactionData = {
          userId: payload.userId,
          title: smsTransaction.merchant || smsTransaction.description,
          amount: smsTransaction.amount,
          type: smsTransaction.type === 'debit' ? 'expense' : 'income',
          category: smsTransaction.category || 'Other',
          paymentMethod: 'Bank Transfer', // Default for SMS transactions
          date: smsTransaction.date,
          description: smsTransaction.description,
          notes: `Imported from SMS (Confidence: ${(smsTransaction.confidence * 100).toFixed(1)}%)\nOriginal: ${smsTransaction.rawMessage}`,
          source: 'sms_import',
          confidence: smsTransaction.confidence
        };

        // Auto-approve or mark as pending
        if (autoApprove && smsTransaction.confidence >= 0.8) {
          const transaction = new Transaction(transactionData);
          await transaction.save();
          results.imported++;
          results.transactions.push({
            ...transactionData,
            _id: transaction._id,
            status: 'imported'
          });
        } else {
          // Store as pending for manual review
          results.transactions.push({
            ...transactionData,
            status: 'pending_review',
            rawSMS: smsTransaction.rawMessage
          });
        }

      } catch (error: any) {
        results.errors.push(`Failed to process transaction: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Processed ${results.total} SMS messages. ${results.imported} transactions imported, ${results.skipped} duplicates skipped.`
    });

  } catch (error: any) {
    console.error('SMS import error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to import SMS transactions' },
      { status: 500 }
    );
  }
}

// Get SMS import history
export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    // Get SMS imported transactions
    const smsTransactions = await Transaction.find({
      userId: payload.userId,
      source: 'sms_import'
    })
    .sort({ createdAt: -1 })
    .limit(50);

    const stats = {
      totalImported: smsTransactions.length,
      thisMonth: smsTransactions.filter(t => {
        const now = new Date();
        const transactionDate = new Date(t.createdAt);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      }).length,
      totalAmount: smsTransactions.reduce((sum, t) => sum + t.amount, 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        transactions: smsTransactions,
        stats
      }
    });

  } catch (error: any) {
    console.error('SMS history error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch SMS import history' },
      { status: 500 }
    );
  }
}