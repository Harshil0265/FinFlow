'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  Plus,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { InlineLoading } from '@/components/ui/loading';
import { AvatarShowcase } from '@/components/ui/avatar-showcase';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { TransactionList } from '@/components/transactions/transaction-list';
import { useTransactionsWithAuth, useTransactionStats } from '@/hooks/useTransactionsWithAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { RecurringTransactionsWidget } from '@/components/dashboard/recurring-transactions-widget';
import { CurrencyWidget } from '@/components/dashboard/currency-widget';
import { DemoBanner } from '@/components/demo/demo-banner';
import { DemoCTACard } from '@/components/demo/demo-cta-card';
import { formatCurrency } from '@/lib/utils';

// Mock data for demonstration
const mockStats = {
  totalIncome: 5420.50,
  totalExpenses: 3240.75,
  balance: 2179.75,
  transactionCount: 47,
  topCategories: [
    { category: 'Food & Dining', amount: 850.25, percentage: 26.2 },
    { category: 'Transportation', amount: 420.50, percentage: 13.0 },
    { category: 'Shopping', amount: 380.00, percentage: 11.7 },
    { category: 'Bills & Utilities', amount: 650.00, percentage: 20.1 },
  ],
  monthlyTrend: [
    { month: 'Jan', income: 4200, expenses: 2800 },
    { month: 'Feb', income: 4500, expenses: 3100 },
    { month: 'Mar', income: 5420, expenses: 3240 },
  ],
};

const mockRecentTransactions = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: -85.50,
    category: 'Food & Dining',
    date: new Date(),
    type: 'expense' as const,
  },
  {
    id: '2',
    title: 'Salary',
    amount: 3500.00,
    category: 'Salary',
    date: new Date(Date.now() - 86400000),
    type: 'income' as const,
  },
  {
    id: '3',
    title: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    date: new Date(Date.now() - 172800000),
    type: 'expense' as const,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { format: formatUserCurrency } = useCurrency();
  const { fetchTransactions, isLoading: transactionsLoading, hasAuth, updateTransactionNotes } = useTransactionsWithAuth();
  const realStats = useTransactionStats();
  const { isDemoMode, getDemoUser, getDemoStats } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use demo data if in demo mode
  const displayUser = isDemoMode ? getDemoUser() : user;
  const stats = isDemoMode ? getDemoStats() : realStats;

  useEffect(() => {
    // Just set loading to false after a short delay
    // TransactionProvider handles the data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Balance',
      value: stats.balance,
      icon: DollarSign,
      color: stats.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: stats.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Transactions',
      value: stats.transactionCount,
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      isCount: true,
    },
  ];

  if (isLoading || (!isDemoMode && transactionsLoading)) {
    return (
      <ProfessionalLayout>
        <InlineLoading message="Loading your dashboard..." size="lg" />
      </ProfessionalLayout>
    );
  }

  return (
    <>
      {isDemoMode && <DemoBanner />}
      <div className={isDemoMode ? "pt-16" : ""}>
        <ProfessionalLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <AvatarShowcase user={user} />
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {displayUser?.name}!
              {isDemoMode && <span className="text-lg text-blue-600 ml-2">(Demo Mode)</span>}
            </h1>
            <p className="text-muted-foreground">
              {isDemoMode 
                ? "Explore FinFlow with realistic sample data - see how easy financial management can be!"
                : "Here's your financial overview for this month"
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">
                        {stat.isCount 
                          ? stat.value 
                          : formatUserCurrency(stat.value)
                        }
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TransactionList
            transactions={stats.recentTransactions}
            onUpdateNotes={async (id, notes) => {
              if (!isDemoMode) {
                await updateTransactionNotes(id, notes);
              }
            }}
            title="Recent Transactions"
            description="Your latest financial activities"
            maxItems={5}
            compact={true}
            showActions={false}
          />
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>
                Where your money goes this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-muted-foreground">
                        {formatUserCurrency(category.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recurring Transactions Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="xl:col-span-1"
        >
          <RecurringTransactionsWidget />
        </motion.div>

        {/* Currency Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="xl:col-span-1"
        >
          <CurrencyWidget />
        </motion.div>

        {/* Demo CTA */}
        {isDemoMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <DemoCTACard />
          </motion.div>
        )}
      </div>
      </div>
        </ProfessionalLayout>
      </div>
    </>
  );
}