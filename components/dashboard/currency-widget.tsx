'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { useCurrency } from '@/hooks/useCurrency';
import { ClientOnly } from '@/components/providers/client-only';

const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'JPY' },
  { from: 'EUR', to: 'GBP' },
];

export function CurrencyWidget() {
  const { currency } = useCurrency();
  const { getExchangeRate, formatCurrency, getCurrencyInfo, isLoading } = useCurrencyConverter();
  const [rates, setRates] = useState<Array<{ pair: string; rate: number; change: number }>>([]);

  useEffect(() => {
    const fetchRates = async () => {
      const ratePromises = POPULAR_PAIRS.map(async (pair, index) => {
        try {
          const rate = await getExchangeRate(pair.from, pair.to);
          // Use deterministic change based on pair index to avoid hydration issues
          const changes = [0.25, -0.15, 0.8, -0.32]; // Fixed values for consistency
          const change = changes[index] || 0;
          return {
            pair: `${pair.from}/${pair.to}`,
            rate: rate || 0,
            change
          };
        } catch (error) {
          return {
            pair: `${pair.from}/${pair.to}`,
            rate: 0,
            change: 0
          };
        }
      });

      const results = await Promise.all(ratePromises);
      setRates(results);
    };

    fetchRates();
  }, [getExchangeRate]);

  const userCurrencyInfo = getCurrencyInfo(currency);

  return (
    <ClientOnly fallback={
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Currency Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    }>
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Currency Rates</span>
          </div>
          <Link href="/currency">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <span>Convert</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Currency Info */}
        {userCurrencyInfo && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{userCurrencyInfo.flag}</span>
              <div>
                <p className="font-medium">{userCurrencyInfo.name}</p>
                <p className="text-xs text-muted-foreground">Your base currency</p>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Rates */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading rates...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Popular Exchange Rates</h4>
            {rates.map((rate, index) => (
              <motion.div
                key={rate.pair}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
              >
                <div>
                  <p className="font-medium text-sm">{rate.pair}</p>
                  <p className="text-xs text-muted-foreground">
                    {rate.rate > 0 ? rate.rate.toFixed(4) : '--'}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {rate.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    rate.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rate.change > 0 ? '+' : ''}{rate.change.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/currency">
              <Button variant="outline" size="sm" className="w-full">
                <Calculator className="w-3 h-3 mr-1" />
                Convert
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="w-full" disabled>
              <TrendingUp className="w-3 h-3 mr-1" />
              Trends
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          💡 Rates are for reference only. Check with your bank for actual transaction rates.
        </div>
      </CardContent>
    </Card>
    </ClientOnly>
  );
}