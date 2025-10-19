import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import connectDB from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';

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

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Generate HTML for PDF
    const html = generatePDFHTML({
      transactions,
      totalIncome,
      totalExpenses,
      balance,
      startDate,
      endDate,
      category,
      type,
    });

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    // Return PDF
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="expense-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generatePDFHTML(data: any) {
  const { transactions, totalIncome, totalExpenses, balance, startDate, endDate, category, type } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Expense Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #3b82f6;
          margin: 0;
        }
        .summary {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item h3 {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }
        .summary-item p {
          margin: 5px 0 0 0;
          font-size: 18px;
          font-weight: bold;
        }
        .income { color: #10b981; }
        .expense { color: #ef4444; }
        .balance { color: #3b82f6; }
        .filters {
          margin-bottom: 20px;
          padding: 15px;
          background: #f1f5f9;
          border-radius: 6px;
        }
        .filters h3 {
          margin: 0 0 10px 0;
          color: #475569;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }
        .amount-income {
          color: #10b981;
          font-weight: 600;
        }
        .amount-expense {
          color: #ef4444;
          font-weight: 600;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #64748b;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Expense Report</h1>
        <p>Generated on ${formatDate(new Date())}</p>
      </div>

      <div class="summary">
        <div class="summary-item">
          <h3>Total Income</h3>
          <p class="income">${formatCurrency(totalIncome)}</p>
        </div>
        <div class="summary-item">
          <h3>Total Expenses</h3>
          <p class="expense">${formatCurrency(totalExpenses)}</p>
        </div>
        <div class="summary-item">
          <h3>Balance</h3>
          <p class="balance">${formatCurrency(balance)}</p>
        </div>
      </div>

      ${generateFiltersHTML({ startDate, endDate, category, type })}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map((transaction: any) => `
            <tr>
              <td>${formatDate(new Date(transaction.date))}</td>
              <td>${transaction.title}</td>
              <td>${transaction.category}</td>
              <td>${transaction.paymentMethod}</td>
              <td class="amount-${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report contains ${transactions.length} transactions</p>
        <p>Generated by Expense Manager - Advanced Financial Tracking</p>
      </div>
    </body>
    </html>
  `;
}

function generateFiltersHTML(filters: any) {
  const activeFilters = [];
  
  if (filters.startDate) activeFilters.push(`Start Date: ${formatDate(new Date(filters.startDate))}`);
  if (filters.endDate) activeFilters.push(`End Date: ${formatDate(new Date(filters.endDate))}`);
  if (filters.category) activeFilters.push(`Category: ${filters.category}`);
  if (filters.type) activeFilters.push(`Type: ${filters.type}`);

  if (activeFilters.length === 0) return '';

  return `
    <div class="filters">
      <h3>Applied Filters:</h3>
      <p>${activeFilters.join(' • ')}</p>
    </div>
  `;
}