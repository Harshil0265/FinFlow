'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Calendar, Calculator, Repeat, Target, BarChart3, Sparkles } from 'lucide-react';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { DemoBanner } from '@/components/demo/demo-banner';
import { DemoCTACard } from '@/components/demo/demo-cta-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/hooks/useDemoMode';
import Link from 'next/link';

export default function DemoPage() {
  const { enableDemoMode, getDemoStats } = useDemoMode();
  const stats = getDemoStats();

  useEffect(() => {
    enableDemoMode();
  }, [enableDemoMode]);

  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Dashboard',
      description: 'Get insights into your spending patterns and financial health',
      href: '/dashboard',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Calendar,
      title: 'Transaction Calendar',
      description: 'Visualize your transactions in an intuitive calendar view',
      href: '/calendar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Repeat,
      title: 'Recurring Transactions',
      description: 'Automate your regular income and expenses',
      href: '/recurring',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Calculator,
      title: 'Currency Converter',
      description: 'Convert between 25+ world currencies with live rates',
      href: '/currency',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: Target,
      title: 'Budget Management',
      description: 'Set and track budgets to stay on top of your spending',
      href: '/budgets',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights with charts and spending trends',
      href: '/analytics',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  return (
    <>
      <DemoBanner />
      <div className="pt-16"> {/* Account for fixed banner */}
        <ProfessionalLayout>
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <Eye className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to FinFlow Demo
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore all the powerful features of FinFlow with realistic sample data. 
                See how easy it is to manage your finances like a pro.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${stats.totalIncome.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Monthly Income</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-red-600 rotate-180" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        ${stats.totalExpenses.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${stats.balance.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Net Balance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.transactionCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                Explore All Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Link href={feature.href}>
                        <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                          <CardHeader>
                            <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {feature.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              {feature.description}
                            </p>
                            <Button variant="ghost" className="mt-4 p-0 h-auto font-semibold text-primary">
                              Try it now →
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <DemoCTACard />
            </motion.div>

            {/* Demo Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center"
            >
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                      Demo Mode Active
                    </h3>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    You're currently viewing FinFlow with sample data. All actions are simulated and won't affect real data. 
                    Create a free account to start managing your actual finances.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ProfessionalLayout>
      </div>
    </>
  );
}