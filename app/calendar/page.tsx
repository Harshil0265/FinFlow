'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionCalendar } from '@/components/calendar/transaction-calendar';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { InlineLoading } from '@/components/ui/loading';
import { useCurrency } from '@/hooks/useCurrency';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  date: Date;
  description?: string;
}

export default function CalendarPage() {
  const { format: formatUserCurrency } = useCurrency();
  const { transactions, fetchTransactions, isLoading, hasAuth } = useTransactionsWithAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  // Remove useEffect - TransactionProvider handles data fetching

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventSelect = (transaction: Transaction) => {
    // You could open an edit modal here
    console.log('Selected transaction:', transaction);
  };

  // Get transactions for selected date
  const selectedDateTransactions = selectedDate
    ? transactions.filter(t => 
        new Date(t.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  // Calculate monthly stats
  const currentMonth = new Date();
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth.getMonth() &&
           transactionDate.getFullYear() === currentMonth.getFullYear();
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  if (isLoading) {
    return (
      <ProfessionalLayout>
        <InlineLoading message="Loading calendar..." size="lg" />
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <CalendarIcon className="w-8 h-8" />
            <span>Transaction Calendar</span>
          </h1>
          <p className="text-muted-foreground">
            View your transactions in calendar format
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => router.push('/expenses/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatUserCurrency(monthlyIncome)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Expenses
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatUserCurrency(monthlyExpenses)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Balance
                  </p>
                  <p className={`text-2xl font-bold ${
                    monthlyBalance >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {formatUserCurrency(monthlyBalance)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  monthlyBalance >= 0 
                    ? 'bg-blue-100 dark:bg-blue-900/20' 
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <div className={`w-6 h-6 rounded-full ${
                    monthlyBalance >= 0 ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <TransactionCalendar
            transactions={transactions}
            onDateSelect={handleDateSelect}
            onEventSelect={handleEventSelect}
          />
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate 
                  ? `Transactions for ${selectedDate.toLocaleDateString()}`
                  : 'Select a date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{transaction.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${
                            transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatUserCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Daily Total */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Daily Total:</span>
                        <span className={`font-bold ${
                          selectedDateTransactions.reduce((sum, t) => 
                            sum + (t.type === 'income' ? t.amount : -t.amount), 0
                          ) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatUserCurrency(Math.abs(
                            selectedDateTransactions.reduce((sum, t) => 
                              sum + (t.type === 'income' ? t.amount : -t.amount), 0
                            )
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No transactions on this date
                  </p>
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  Click on a date to view transactions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Transactions:</span>
                <span className="font-medium">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Month:</span>
                <span className="font-medium">{monthlyTransactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Daily:</span>
                <span className="font-medium">
                  {formatUserCurrency(monthlyExpenses / new Date().getDate())}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </ProfessionalLayout>
  );
}