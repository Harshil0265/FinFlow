'use client';

import { useAuth } from './useAuth';
import { formatCurrency, getCurrencySymbol, getCurrencyInfo } from '@/lib/utils';

export function useCurrency() {
  const { user } = useAuth();
  const userCurrency = user?.preferences?.currency || 'USD';

  const format = (amount: number, currency?: string) => {
    return formatCurrency(amount, currency || userCurrency);
  };

  const getSymbol = (currency?: string) => {
    return getCurrencySymbol(currency || userCurrency);
  };

  const getInfo = (currency?: string) => {
    return getCurrencyInfo(currency || userCurrency);
  };

  return {
    currency: userCurrency,
    format,
    getSymbol,
    getInfo,
  };
}