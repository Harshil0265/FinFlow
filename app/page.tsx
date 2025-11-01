'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Eye, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  Calendar,
  Calculator,
  Repeat,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Dashboard',
      description: 'Get real-time insights into your spending patterns and financial health with beautiful charts and analytics.',
    },
    {
      icon: Calendar,
      title: 'Transaction Calendar',
      description: 'Visualize your financial activities in an intuitive calendar view to better understand your spending timeline.',
    },
    {
      icon: Repeat,
      title: 'Recurring Transactions',
      description: 'Automate your regular income and expenses. Set it once and let FinFlow handle the rest.',
    },
    {
      icon: Calculator,
      title: 'Currency Converter',
      description: 'Convert between 25+ world currencies with live exchange rates for international transactions.',
    },
    {
      icon: Target,
      title: 'Budget Management',
      description: 'Set smart budgets and track your progress with visual indicators and alerts.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep dive into your financial data with comprehensive reports and trend analysis.',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade encryption and security measures.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technology for instant loading and real-time synchronization.',
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join over 10,000+ users who trust FinFlow to manage their finances effectively.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <span className="font-bold text-xl">FinFlow</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/demo">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Try Demo</span>
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Take Control of Your Finances
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              FinFlow is the smart financial management platform that helps you track expenses, 
              manage budgets, and achieve your financial goals with powerful analytics and automation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="outline" className="flex items-center space-x-2 text-lg px-8 py-6">
                <Eye className="w-5 h-5" />
                <span>Try Interactive Demo</span>
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6">
                Start Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            ✅ Free forever plan • ✅ No credit card required • ✅ 2-minute setup
          </p>
        </motion.div>
      </section>

      {/* Demo CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Eye className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                See FinFlow in Action
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Don't just take our word for it. Experience all the features with realistic sample data. 
                No signup required - start exploring immediately!
              </p>
              <Link href="/demo">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                  <Eye className="w-5 h-5 mr-2" />
                  Launch Interactive Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to make financial management effortless
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 dark:bg-gray-800/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose FinFlow?</h2>
            <p className="text-xl text-muted-foreground">
              Built with security, performance, and user experience in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center space-y-8"
        >
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial management with FinFlow
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Eye className="w-5 h-5 mr-2" />
                Try Demo First
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">FF</span>
              </div>
              <span className="font-semibold">FinFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FinFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}