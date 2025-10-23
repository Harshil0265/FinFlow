'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export interface SMSImportStats {
  totalImported: number;
  thisMonth: number;
  totalAmount: number;
}

export interface SMSImportHistory {
  transactions: any[];
  stats: SMSImportStats;
}

export function useSMSImport() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SMSImportHistory | null>(null);

  const importSMS = async (
    messages: string[],
    options: {
      autoApprove?: boolean;
      minConfidence?: number;
    } = {}
  ) => {
    if (!user) {
      toast.error('Please log in to import SMS messages');
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          messages,
          autoApprove: options.autoApprove || false,
          minConfidence: options.minConfidence || 0.7
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        return data.data;
      } else {
        toast.error(data.message || 'Failed to import SMS messages');
        return null;
      }
    } catch (error) {
      console.error('SMS import error:', error);
      toast.error('Failed to process SMS messages');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getImportHistory = async () => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/import', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setHistory(data.data);
        return data.data;
      } else {
        toast.error('Failed to fetch import history');
        return null;
      }
    } catch (error) {
      console.error('History fetch error:', error);
      toast.error('Failed to fetch import history');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const validateSMS = (message: string): boolean => {
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
  };

  const parseSMSBatch = (smsText: string): string[] => {
    // Split SMS messages by common separators
    return smsText
      .split(/\n\s*\n|\n---\n|\n===\n/)
      .map(msg => msg.trim())
      .filter(msg => msg.length > 0 && validateSMS(msg));
  };

  return {
    importSMS,
    getImportHistory,
    validateSMS,
    parseSMSBatch,
    isLoading,
    history
  };
}