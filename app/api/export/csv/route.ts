import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    // Build filter
    const filter: any = { userId: payload.userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    if (category) filter.category = category;
    if (type) filter.type = type;

    // Get transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Generate CSV content
    const csvContent = generateCSV(transactions);

    // Return CSV
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}

function generateCSV(transactions: any[]) {
  // CSV headers
  const headers = [
    'Date',
    'Title',
    'Amount',
    'Type',
    'Category',
    'Payment Method',
    'Description',
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    formatDate(new Date(transaction.date)),
    `"${transaction.title.replace(/"/g, '""')}"`, // Escape quotes
    transaction.amount.toString(),
    transaction.type,
    `"${transaction.category.replace(/"/g, '""')}"`,
    `"${transaction.paymentMethod.replace(/"/g, '""')}"`,
    `"${(transaction.description || '').replace(/"/g, '""')}"`,
  ]);

  // Combine headers and rows
  const csvLines = [headers.join(','), ...rows.map(row => row.join(','))];
  
  return csvLines.join('\n');
}