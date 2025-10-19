'use client';

import { motion } from 'framer-motion';
import { Calculator, Globe, TrendingUp } from 'lucide-react';
import { CurrencyConverter } from '@/components/currency/currency-converter';
import { ProfessionalLayout } from '@/components/layout/professional-layout';

export default function CurrencyPage() {
  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Currency Converter</h1>
              <p className="text-muted-foreground">
                Convert between currencies and compare exchange rates worldwide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">25+ Currencies</h3>
              <p className="text-sm text-muted-foreground">Major world currencies supported</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold">Real-time Rates</h3>
              <p className="text-sm text-muted-foreground">Updated exchange rates</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Calculator className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold">Easy Comparison</h3>
              <p className="text-sm text-muted-foreground">Compare multiple currencies</p>
            </div>
          </div>
        </motion.div>

        {/* Currency Converter Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CurrencyConverter />
        </motion.div>
      </div>
    </ProfessionalLayout>
  );
}
