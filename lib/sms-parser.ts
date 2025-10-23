/**
 * SMS Transaction Parser
 * Extracts transaction data from SMS messages
 */

export interface SMSTransaction {
  amount: number;
  type: 'debit' | 'credit';
  merchant?: string;
  category?: string;
  date: Date;
  description: string;
  rawMessage: string;
  confidence: number; // 0-1 score for parsing accuracy
}

export interface BankPattern {
  name: string;
  patterns: RegExp[];
  amountPattern: RegExp;
  merchantPattern?: RegExp;
  datePattern?: RegExp;
  typeIndicators: {
    debit: string[];
    credit: string[];
  };
}

// Common bank SMS patterns
const BANK_PATTERNS: BankPattern[] = [
  {
    name: 'Generic Bank',
    patterns: [
      /(?:debited|credited|spent|received|paid|withdrawn|deposited)/i,
      /(?:rs\.?|inr|usd|\$|₹)\s*[\d,]+/i,
      /(?:a\/c|account|card)/i
    ],
    amountPattern: /(?:rs\.?|inr|usd|\$|₹)\s*([\d,]+(?:\.\d{2})?)/i,
    merchantPattern: /(?:at|to|from)\s+([a-z\s]+?)(?:\s+on|\s+dated|\s*$)/i,
    datePattern: /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+\w+\s+\d{2,4})/i,
    typeIndicators: {
      debit: ['debited', 'spent', 'paid', 'withdrawn', 'purchase', 'debit'],
      credit: ['credited', 'received', 'deposited', 'refund', 'credit', 'salary']
    }
  },
  {
    name: 'HDFC Bank',
    patterns: [
      /hdfc\s*bank/i,
      /(?:rs\.?|inr)\s*[\d,]+.*(?:debited|credited)/i
    ],
    amountPattern: /(?:rs\.?|inr)\s*([\d,]+(?:\.\d{2})?)/i,
    merchantPattern: /(?:at|to)\s+([^.]+?)(?:\s+on|\.|$)/i,
    typeIndicators: {
      debit: ['debited', 'spent', 'purchase'],
      credit: ['credited', 'received', 'refund']
    }
  },
  {
    name: 'SBI Bank',
    patterns: [
      /sbi|state\s*bank/i,
      /(?:rs\.?|inr)\s*[\d,]+.*(?:debited|credited)/i
    ],
    amountPattern: /(?:rs\.?|inr)\s*([\d,]+(?:\.\d{2})?)/i,
    merchantPattern: /(?:at|to)\s+([^.]+?)(?:\s+on|\.|$)/i,
    typeIndicators: {
      debit: ['debited', 'spent', 'withdrawn'],
      credit: ['credited', 'received', 'deposited']
    }
  },
  {
    name: 'ICICI Bank',
    patterns: [
      /icici\s*bank/i,
      /(?:rs\.?|inr)\s*[\d,]+.*(?:debited|credited)/i
    ],
    amountPattern: /(?:rs\.?|inr)\s*([\d,]+(?:\.\d{2})?)/i,
    merchantPattern: /(?:at|to)\s+([^.]+?)(?:\s+on|\.|$)/i,
    typeIndicators: {
      debit: ['debited', 'spent', 'purchase'],
      credit: ['credited', 'received', 'refund']
    }
  }
];

// Merchant to category mapping
const MERCHANT_CATEGORIES: Record<string, string> = {
  // Food & Dining
  'swiggy': 'Food & Dining',
  'zomato': 'Food & Dining',
  'dominos': 'Food & Dining',
  'mcdonalds': 'Food & Dining',
  'kfc': 'Food & Dining',
  'pizza': 'Food & Dining',
  'restaurant': 'Food & Dining',
  'cafe': 'Food & Dining',
  
  // Transportation
  'uber': 'Transportation',
  'ola': 'Transportation',
  'rapido': 'Transportation',
  'metro': 'Transportation',
  'petrol': 'Transportation',
  'fuel': 'Transportation',
  'parking': 'Transportation',
  
  // Shopping
  'amazon': 'Shopping',
  'flipkart': 'Shopping',
  'myntra': 'Shopping',
  'ajio': 'Shopping',
  'mall': 'Shopping',
  'store': 'Shopping',
  'market': 'Shopping',
  
  // Utilities
  'electricity': 'Utilities',
  'water': 'Utilities',
  'gas': 'Utilities',
  'internet': 'Utilities',
  'mobile': 'Utilities',
  'recharge': 'Utilities',
  
  // Healthcare
  'hospital': 'Healthcare',
  'pharmacy': 'Healthcare',
  'doctor': 'Healthcare',
  'medical': 'Healthcare',
  
  // Entertainment
  'movie': 'Entertainment',
  'cinema': 'Entertainment',
  'netflix': 'Entertainment',
  'spotify': 'Entertainment',
  'game': 'Entertainment',
  
  // Default categories
  'atm': 'Cash Withdrawal',
  'bank': 'Banking',
  'salary': 'Income',
  'refund': 'Refund'
};

export class SMSTransactionParser {
  /**
   * Parse SMS message to extract transaction information
   */
  static parseSMS(message: string): SMSTransaction | null {
    const cleanMessage = message.trim().toLowerCase();
    
    // Find matching bank pattern
    const bankPattern = this.findBankPattern(cleanMessage);
    if (!bankPattern) {
      return null;
    }
    
    // Extract amount
    const amount = this.extractAmount(cleanMessage, bankPattern);
    if (!amount) {
      return null;
    }
    
    // Determine transaction type
    const type = this.determineTransactionType(cleanMessage, bankPattern);
    
    // Extract merchant/description
    const merchant = this.extractMerchant(cleanMessage, bankPattern);
    
    // Determine category
    const category = this.determineCategory(merchant, cleanMessage);
    
    // Extract or default date
    const date = this.extractDate(cleanMessage, bankPattern) || new Date();
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(cleanMessage, bankPattern, amount, type);
    
    return {
      amount,
      type,
      merchant,
      category,
      date,
      description: this.generateDescription(type, amount, merchant),
      rawMessage: message,
      confidence
    };
  }
  
  /**
   * Find matching bank pattern for the SMS
   */
  private static findBankPattern(message: string): BankPattern | null {
    for (const pattern of BANK_PATTERNS) {
      const matches = pattern.patterns.filter(p => p.test(message));
      if (matches.length >= 1) {
        return pattern;
      }
    }
    return null;
  }
  
  /**
   * Extract amount from SMS
   */
  private static extractAmount(message: string, pattern: BankPattern): number | null {
    const match = message.match(pattern.amountPattern);
    if (!match) return null;
    
    const amountStr = match[1].replace(/,/g, '');
    const amount = parseFloat(amountStr);
    
    return isNaN(amount) ? null : amount;
  }
  
  /**
   * Determine if transaction is debit or credit
   */
  private static determineTransactionType(message: string, pattern: BankPattern): 'debit' | 'credit' {
    const debitIndicators = pattern.typeIndicators.debit;
    const creditIndicators = pattern.typeIndicators.credit;
    
    for (const indicator of debitIndicators) {
      if (message.includes(indicator)) {
        return 'debit';
      }
    }
    
    for (const indicator of creditIndicators) {
      if (message.includes(indicator)) {
        return 'credit';
      }
    }
    
    // Default to debit for expenses
    return 'debit';
  }
  
  /**
   * Extract merchant name from SMS
   */
  private static extractMerchant(message: string, pattern: BankPattern): string | undefined {
    if (!pattern.merchantPattern) return undefined;
    
    const match = message.match(pattern.merchantPattern);
    if (!match) return undefined;
    
    return match[1].trim().replace(/\s+/g, ' ');
  }
  
  /**
   * Determine transaction category based on merchant and message content
   */
  private static determineCategory(merchant?: string, message?: string): string {
    if (!merchant && !message) return 'Other';
    
    const searchText = (merchant || message || '').toLowerCase();
    
    for (const [keyword, category] of Object.entries(MERCHANT_CATEGORIES)) {
      if (searchText.includes(keyword)) {
        return category;
      }
    }
    
    return 'Other';
  }
  
  /**
   * Extract date from SMS or return current date
   */
  private static extractDate(message: string, pattern: BankPattern): Date | null {
    if (!pattern.datePattern) return null;
    
    const match = message.match(pattern.datePattern);
    if (!match) return null;
    
    try {
      return new Date(match[1]);
    } catch {
      return null;
    }
  }
  
  /**
   * Calculate confidence score for the parsed transaction
   */
  private static calculateConfidence(
    message: string,
    pattern: BankPattern,
    amount: number,
    type: 'debit' | 'credit'
  ): number {
    let score = 0.5; // Base score
    
    // Bank pattern match
    const patternMatches = pattern.patterns.filter(p => p.test(message)).length;
    score += (patternMatches / pattern.patterns.length) * 0.3;
    
    // Amount validity
    if (amount > 0 && amount < 1000000) {
      score += 0.2;
    }
    
    // Type indicators
    const hasTypeIndicator = [
      ...pattern.typeIndicators.debit,
      ...pattern.typeIndicators.credit
    ].some(indicator => message.includes(indicator));
    
    if (hasTypeIndicator) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Generate human-readable description
   */
  private static generateDescription(type: 'debit' | 'credit', amount: number, merchant?: string): string {
    const action = type === 'debit' ? 'Payment' : 'Received';
    const merchantText = merchant ? ` at ${merchant}` : '';
    return `${action} of ₹${amount.toFixed(2)}${merchantText}`;
  }
  
  /**
   * Batch parse multiple SMS messages
   */
  static parseMultipleSMS(messages: string[]): SMSTransaction[] {
    return messages
      .map(message => this.parseSMS(message))
      .filter((transaction): transaction is SMSTransaction => transaction !== null)
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
  }
  
  /**
   * Validate if SMS looks like a bank transaction message
   */
  static isTransactionSMS(message: string): boolean {
    const cleanMessage = message.toLowerCase();
    
    // Check for common transaction keywords
    const transactionKeywords = [
      'debited', 'credited', 'spent', 'received', 'paid', 'withdrawn',
      'deposited', 'purchase', 'refund', 'transfer', 'upi', 'card'
    ];
    
    const hasTransactionKeyword = transactionKeywords.some(keyword => 
      cleanMessage.includes(keyword)
    );
    
    // Check for amount pattern
    const hasAmount = /(?:rs\.?|inr|usd|\$|₹)\s*[\d,]+/i.test(message);
    
    // Check for account/card reference
    const hasAccountRef = /(?:a\/c|account|card|xxxx)/i.test(message);
    
    return hasTransactionKeyword && hasAmount && hasAccountRef;
  }
}