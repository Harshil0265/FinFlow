'use client';

import { useState, useCallback } from 'react';
import { CurrencyConverter, CurrencyInfo } from '@/lib/currency-converter';

interface ConversionResult {
  currency: CurrencyInfo;
  convertedAmount: number;
  rate: number;
}

export function useCurrencyConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const converter = CurrencyConverter.getInstance();

  const convert = useCallback(async (
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<number | null> => {
    if (amount <= 0) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await converter.convert(amount, fromCurrency, toCurrency);
      return result;
    } catch (err: any) {
      setError(err.message || 'Conversion failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [converter]);

  const getComparisonRates = useCallback(async (
    amount: number,
    baseCurrency: string,
    targetCurrencies: string[]
  ): Promise<ConversionResult[]> => {
    if (amount <= 0) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await converter.getComparisonRates(amount, baseCurrency, targetCurrencies);
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to get comparison rates');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [converter]);

  const getExchangeRate = useCallback(async (
    fromCurrency: string,
    toCurrency: string
  ): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const rate = await converter.getExchangeRate(fromCurrency, toCurrency);
      return rate;
    } catch (err: any) {
      setError(err.message || 'Failed to get exchange rate');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [converter]);

  const formatCurrency = useCallback((amount: number, currencyCode: string): string => {
    return converter.formatCurrency(amount, currencyCode);
  }, [converter]);

  const getAllCurrencies = useCallback((): CurrencyInfo[] => {
    return converter.getAllCurrencies();
  }, [converter]);

  const getCurrencyInfo = useCallback((code: string): CurrencyInfo | undefined => {
    return converter.getCurrencyInfo(code);
  }, [converter]);

  return {
    convert,
    getComparisonRates,
    getExchangeRate,
    formatCurrency,
    getAllCurrencies,
    getCurrencyInfo,
    isLoading,
    error,
  };
}