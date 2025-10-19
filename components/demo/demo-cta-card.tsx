'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DemoCTACard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Take Control of Your Finances?
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            You've seen what FinFlow can do with demo data. Now create your free account 
            to start managing your real financial data with all these powerful features.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Bank-Level Security</h3>
              <p className="text-xs text-muted-foreground">Your data is encrypted and secure</p>
            </div>
            <div className="text-center p-4">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Real-Time Sync</h3>
              <p className="text-xs text-muted-foreground">Access your data anywhere, anytime</p>
            </div>
            <div className="text-center p-4">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Trusted by 10k+ Users</h3>
              <p className="text-xs text-muted-foreground">Join our growing community</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/register" className="flex-1">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Already have an account? Login
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              ✅ Free forever plan available • ✅ No credit card required • ✅ Setup in 2 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}