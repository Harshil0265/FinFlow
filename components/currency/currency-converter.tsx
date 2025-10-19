'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpDown, 
  TrendingUp, 
  Globe, 
  Calculator,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientOnly } from '@/components/providers/client-only';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { CurrencyInfo } from '@/lib/currency-converter';

interface ConversionResult {
  currency: CurrencyInfo;
  convertedAmount: number;
  rate: number;
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [conversionResult, setConversionResult] = useState<number | null>(null);
  const [comparisonResults, setComparisonResults] = useState<ConversionResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const {
    convert,
    getComparisonRates,
    formatCurrency,
    getAllCurrencies,
    getCurrencyInfo,
    isLoading,
    error,
  } = useCurrencyConverter();

  const currencies = getAllCurrencies();
  const popularCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

  // Perform conversion when inputs change
  useEffect(() => {
    const performConversion = async () => {
      const numAmount = parseFloat(amount);
      if (numAmount > 0 && fromCurrency && toCurrency) {
        const result = await convert(numAmount, fromCurrency, toCurrency);
        setConversionResult(result);

        // Get comparison rates for popular currencies
        if (fromCurrency !== 'USD') {
          const comparisons = await getComparisonRates(
            numAmount,
            fromCurrency,
            popularCurrencies.filter(c => c !== fromCurrency)
          );
          setComparisonResults(comparisons);
        }
      }
    };

    const debounceTimer = setTimeout(performConversion, 500);
    return () => clearTimeout(debounceTimer);
  }, [amount, fromCurrency, toCurrency, convert, getComparisonRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopyResult = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);

  return (
    <ClientOnly fallback={
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Currency Converter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading converter...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <div className="space-y-6">
      {/* Main Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Currency Converter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
              min="0"
              step="0.01"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              {fromCurrencyInfo && (
                <p className="text-xs text-muted-foreground">
                  {fromCurrencyInfo.country}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              {toCurrencyInfo && (
                <p className="text-xs text-muted-foreground">
                  {toCurrencyInfo.country}
                </p>
              )}
            </div>
          </div>

          {/* Conversion Result */}
          <AnimatePresence>
            {conversionResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 bg-primary/10 rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Converted Amount</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(conversionResult, toCurrency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(parseFloat(amount) || 0, fromCurrency)} = {formatCurrency(conversionResult, toCurrency)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyResult(conversionResult.toFixed(2), -1)}
                  >
                    {copiedIndex === -1 ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Converting...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Currency Comparison */}
      {comparisonResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Currency Comparison</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              See how {formatCurrency(parseFloat(amount) || 0, fromCurrency)} compares across different currencies
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonResults.map((result, index) => (
                <motion.div
                  key={result.currency.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{result.currency.flag}</span>
                      <div>
                        <p className="font-medium">{result.currency.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.currency.country}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyResult(result.convertedAmount.toFixed(2), index)}
                      className="h-6 w-6"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(result.convertedAmount, result.currency.code)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rate: 1 {fromCurrency} = {result.rate.toFixed(4)} {result.currency.code}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exchange Rate Trends (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Exchange Rate Info</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">24h Change</p>
              <p className="text-lg font-semibold text-green-600">+0.25%</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">7d High</p>
              <p className="text-lg font-semibold">
                {conversionResult ? formatCurrency(conversionResult * 1.02, toCurrency) : '--'}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">7d Low</p>
              <p className="text-lg font-semibold">
                {conversionResult ? formatCurrency(conversionResult * 0.98, toCurrency) : '--'}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Exchange rates are updated hourly. For the most accurate rates for large transactions, 
              please check with your bank or financial institution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </ClientOnly>
  );
}