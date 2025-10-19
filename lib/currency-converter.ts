// Currency converter utility with real-time exchange rates
export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
}

// Popular currencies with their information
export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', country: 'Denmark' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', country: 'Czech Republic' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', country: 'Hungary' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', country: 'Russia' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', country: 'Mexico' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', country: 'Turkey' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', country: 'Saudi Arabia' },
];

// Mock exchange rates (in a real app, you'd fetch from an API like exchangerate-api.com)
const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45,
    INR: 74.5, KRW: 1180.0, SGD: 1.35, HKD: 7.8, NOK: 8.5, SEK: 8.8, DKK: 6.3,
    PLN: 3.9, CZK: 21.5, HUF: 295.0, RUB: 73.5, BRL: 5.2, MXN: 20.1, ZAR: 14.8,
    TRY: 8.4, AED: 3.67, SAR: 3.75
  },
  EUR: {
    USD: 1.18, GBP: 0.86, JPY: 129.4, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.6,
    INR: 87.7, KRW: 1390.0, SGD: 1.59, HKD: 9.2, NOK: 10.0, SEK: 10.4, DKK: 7.4,
    PLN: 4.6, CZK: 25.3, HUF: 347.0, RUB: 86.5, BRL: 6.1, MXN: 23.7, ZAR: 17.4,
    TRY: 9.9, AED: 4.33, SAR: 4.42
  },
  GBP: {
    USD: 1.37, EUR: 1.16, JPY: 150.7, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.8,
    INR: 102.0, KRW: 1617.0, SGD: 1.85, HKD: 10.7, NOK: 11.6, SEK: 12.1, DKK: 8.6,
    PLN: 5.3, CZK: 29.5, HUF: 404.0, RUB: 100.8, BRL: 7.1, MXN: 27.5, ZAR: 20.3,
    TRY: 11.5, AED: 5.03, SAR: 5.14
  }
};

export class CurrencyConverter {
  private static instance: CurrencyConverter;
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  private constructor() {}

  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  // Get currency info by code
  getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return POPULAR_CURRENCIES.find(c => c.code === code);
  }

  // Get all available currencies
  getAllCurrencies(): CurrencyInfo[] {
    return POPULAR_CURRENCIES;
  }

  // Convert amount between currencies
  async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  }

  // Get exchange rate between two currencies
  async getExchangeRate(from: string, to: string): Promise<number> {
    const key = `${from}-${to}`;
    const cached = this.exchangeRates.get(key);

    // Check if we have a cached rate that's still valid
    if (cached && this.isCacheValid()) {
      return cached.rate;
    }

    // Fetch new rates
    await this.fetchExchangeRates();
    
    const rate = this.exchangeRates.get(key);
    if (!rate) {
      throw new Error(`Exchange rate not available for ${from} to ${to}`);
    }

    return rate.rate;
  }

  // Fetch exchange rates (using mock data for now)
  private async fetchExchangeRates(): Promise<void> {
    try {
      // In a real app, you would fetch from an API like:
      // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      // const data = await response.json();

      // For now, use mock data
      const now = new Date();
      
      // Clear existing rates
      this.exchangeRates.clear();

      // Populate with mock rates
      Object.entries(MOCK_EXCHANGE_RATES).forEach(([baseCurrency, rates]) => {
        Object.entries(rates).forEach(([targetCurrency, rate]) => {
          const key = `${baseCurrency}-${targetCurrency}`;
          this.exchangeRates.set(key, {
            from: baseCurrency,
            to: targetCurrency,
            rate: rate,
            lastUpdated: now
          });

          // Also add reverse rate
          const reverseKey = `${targetCurrency}-${baseCurrency}`;
          this.exchangeRates.set(reverseKey, {
            from: targetCurrency,
            to: baseCurrency,
            rate: 1 / rate,
            lastUpdated: now
          });
        });
      });

      this.lastFetch = now;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      throw new Error('Unable to fetch current exchange rates');
    }
  }

  // Check if cached data is still valid
  private isCacheValid(): boolean {
    if (!this.lastFetch) return false;
    return Date.now() - this.lastFetch.getTime() < this.CACHE_DURATION;
  }

  // Get multiple conversion rates for comparison
  async getComparisonRates(amount: number, baseCurrency: string, targetCurrencies: string[]): Promise<Array<{
    currency: CurrencyInfo;
    convertedAmount: number;
    rate: number;
  }>> {
    const results = [];

    for (const targetCurrency of targetCurrencies) {
      try {
        const convertedAmount = await this.convert(amount, baseCurrency, targetCurrency);
        const rate = await this.getExchangeRate(baseCurrency, targetCurrency);
        const currencyInfo = this.getCurrencyInfo(targetCurrency);

        if (currencyInfo) {
          results.push({
            currency: currencyInfo,
            convertedAmount,
            rate
          });
        }
      } catch (error) {
        console.error(`Failed to convert ${baseCurrency} to ${targetCurrency}:`, error);
      }
    }

    return results;
  }

  // Format currency amount with proper symbol and locale
  formatCurrency(amount: number, currencyCode: string): string {
    const currencyInfo = this.getCurrencyInfo(currencyCode);
    if (!currencyInfo) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }

    // Use Intl.NumberFormat for proper formatting
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback to manual formatting
      return `${currencyInfo.symbol}${amount.toFixed(2)}`;
    }
  }
}