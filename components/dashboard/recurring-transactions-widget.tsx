'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Repeat, Calendar, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRecurringTransactionsWithAuth } from '@/hooks/useRecurringTransactionsWithAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { RecurringTransaction } from '@/types';
import { ClientOnly } from '@/components/providers/client-only';

export function RecurringTransactionsWidget() {
  const { format } = useCurrency();
  const {
    recurringTransactions,
    isLoading,
    fetchRecurringTransactions,
    hasAuth,
  } = useRecurringTransactionsWithAuth();

  useEffect(() => {
    if (hasAuth) {
      fetchRecurringTransactions('active');
    }
  }, [hasAuth]);

  if (!hasAuth || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Repeat className="w-5 h-5" />
            <span>Recurring Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeTransactions = recurringTransactions.filter((t: RecurringTransaction) => t.isActive);
  
  const stats = {
    total: activeTransactions.length,
    monthlyIncome: activeTransactions
      .filter((t: RecurringTransaction) => t.type === 'income' && t.recurringRule.frequency === 'monthly')
      .reduce((sum: number, t: RecurringTransaction) => sum + t.amount, 0),
    monthlyExpenses: activeTransactions
      .filter((t: RecurringTransaction) => t.type === 'expense' && t.recurringRule.frequency === 'monthly')
      .reduce((sum: number, t: RecurringTransaction) => sum + t.amount, 0),
    dueToday: activeTransactions.filter((t: RecurringTransaction) => {
      const today = new Date();
      const dueDate = new Date(t.nextDueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length,
  };

  const upcomingTransactions = activeTransactions
    .filter((t: RecurringTransaction) => {
      const now = new Date();
      const dueDate = new Date(t.nextDueDate);
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .sort((a: RecurringTransaction, b: RecurringTransaction) => 
      new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
    )
    .slice(0, 3);

  return (
    <ClientOnly fallback={
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Repeat className="w-5 h-5" />
            <span>Recurring Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    }>
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Repeat className="w-5 h-5" />
            <span>Recurring Transactions</span>
          </div>
          <Link href="/recurring">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>Monthly Income</span>
            </div>
            <div className="text-lg font-semibold text-green-600">
              +{format(stats.monthlyIncome)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <TrendingDown className="w-3 h-3" />
              <span>Monthly Expenses</span>
            </div>
            <div className="text-lg font-semibold text-red-600">
              -{format(stats.monthlyExpenses)}
            </div>
          </div>
        </div>

        {/* Due Today Alert */}
        {stats.dueToday > 0 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                {stats.dueToday} transaction{stats.dueToday !== 1 ? 's' : ''} due today
              </span>
            </div>
          </div>
        )}

        {/* Upcoming Transactions */}
        {upcomingTransactions.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Upcoming This Week</h4>
            {upcomingTransactions.map((transaction: RecurringTransaction) => {
              const dueDate = new Date(transaction.nextDueDate);
              const today = new Date();
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let dueDateText = '';
              if (diffDays === 0) dueDateText = 'Today';
              else if (diffDays === 1) dueDateText = 'Tomorrow';
              else dueDateText = `${diffDays} days`;

              return (
                <div key={transaction._id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{transaction.title}</span>
                      <Badge variant={diffDays === 0 ? 'default' : 'secondary'} className="text-xs">
                        {dueDateText}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{transaction.category}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{format(transaction.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Repeat className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {stats.total === 0 
                ? 'No recurring transactions set up'
                : 'No transactions due this week'
              }
            </p>
            {stats.total === 0 && (
              <Link href="/recurring">
                <Button variant="outline" size="sm" className="mt-2">
                  Set Up Recurring Transactions
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {stats.total} active recurring transaction{stats.total !== 1 ? 's' : ''}
            </span>
            <Link href="/recurring">
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </ClientOnly>
  );
}