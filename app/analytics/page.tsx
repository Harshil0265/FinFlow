'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpendingTrends } from '@/components/charts/spending-trends';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { InlineLoading } from '@/components/ui/loading';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';

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

export default function AnalyticsPage() {
  const { accessToken } = useAuth();
  const { format: formatUserCurrency } = useCurrency();
  const { transactions, fetchTransactions, isLoading, hasAuth } = useTransactionsWithAuth();
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

  // Remove useEffect - TransactionProvider handles data fetching

  // Calculate analytics based on timeframe
  const getTimeframeTransactions = () => {
    const now = new Date();
    const start = timeframe === 'month' ? startOfMonth(now) : startOfYear(now);
    const end = timeframe === 'month' ? endOfMonth(now) : endOfYear(now);

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const timeframeTransactions = getTimeframeTransactions();

  // Calculate key metrics
  const totalIncome = timeframeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = timeframeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  // Top spending categories
  const categorySpending = timeframeTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Average transaction amounts
  const avgIncome = timeframeTransactions.filter(t => t.type === 'income').length > 0
    ? totalIncome / timeframeTransactions.filter(t => t.type === 'income').length
    : 0;

  const avgExpense = timeframeTransactions.filter(t => t.type === 'expense').length > 0
    ? totalExpenses / timeframeTransactions.filter(t => t.type === 'expense').length
    : 0;

  // Transaction frequency
  const transactionCount = timeframeTransactions.length;
  const daysInPeriod = timeframe === 'month' ? 30 : 365;
  const avgTransactionsPerDay = transactionCount / daysInPeriod;

  const handleExportAnalytics = async () => {
    try {
      const response = await fetch(`/api/export/pdf?analytics=true&timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${timeframe}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('Analytics report exported successfully');
      }
    } catch (error) {
      alert('Failed to export analytics report');
    }
  };

  if (isLoading) {
    return (
      <ProfessionalLayout>
        <InlineLoading message="Loading analytics..." size="lg" />
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
            <BarChart3 className="w-8 h-8" />
            <span>Financial Analytics</span>
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your spending patterns and financial health
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border rounded-lg">
            <Button
              variant={timeframe === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('month')}
              className="rounded-r-none"
            >
              This Month
            </Button>
            <Button
              variant={timeframe === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('year')}
              className="rounded-l-none"
            >
              This Year
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    Net Income
                  </p>
                  <p className={`text-2xl font-bold ${
                    netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatUserCurrency(netIncome)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeframe === 'month' ? 'This month' : 'This year'}
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${
                  netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
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
                    Savings Rate
                  </p>
                  <p className={`text-2xl font-bold ${
                    savingsRate >= 20 ? 'text-green-600' : 
                    savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {savingsRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Of total income
                  </p>
                </div>
                <PieChart className={`w-8 h-8 ${
                  savingsRate >= 20 ? 'text-green-600' : 
                  savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                }`} />
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
                    Avg. Daily Spending
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatUserCurrency(totalExpenses / daysInPeriod)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Per day average
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Transaction Count
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {transactionCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {avgTransactionsPerDay.toFixed(1)} per day
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map(([category, amount], index) => {
                  const percentage = (amount / totalExpenses) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span>{formatUserCurrency(amount)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}% of total expenses
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  savingsRate >= 20 ? 'text-green-600' : 
                  savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.min(100, Math.max(0, savingsRate * 5)).toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">Out of 100</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Savings Rate</span>
                  <span className={savingsRate >= 20 ? 'text-green-600' : 'text-red-600'}>
                    {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expense Diversity</span>
                  <span className="text-blue-600">
                    {Object.keys(categorySpending).length} categories
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transaction Frequency</span>
                  <span className="text-purple-600">
                    {avgTransactionsPerDay.toFixed(1)}/day
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Income</p>
                  <p className="font-bold text-green-600">
                    {formatUserCurrency(avgIncome)}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Expense</p>
                  <p className="font-bold text-red-600">
                    {formatUserCurrency(avgExpense)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Largest Expense:</span>
                  <span className="font-medium">
                    {formatUserCurrency(Math.max(...timeframeTransactions
                      .filter(t => t.type === 'expense')
                      .map(t => t.amount), 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Largest Income:</span>
                  <span className="font-medium">
                    {formatUserCurrency(Math.max(...timeframeTransactions
                      .filter(t => t.type === 'income')
                      .map(t => t.amount), 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most Used Category:</span>
                  <span className="font-medium">
                    {topCategories[0]?.[0] || 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <SpendingTrends transactions={transactions} />
      </motion.div>
      </div>
    </ProfessionalLayout>
  );
}