'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Smartphone,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface ParsedTransaction {
  amount: number;
  type: 'expense' | 'income';
  merchant?: string;
  category?: string;
  date: Date;
  description: string;
  confidence: number;
  status: 'imported' | 'pending_review';
  rawSMS?: string;
}

interface ImportResults {
  total: number;
  highConfidence: number;
  imported: number;
  skipped: number;
  errors: string[];
  transactions: ParsedTransaction[];
}

export default function SMSImportPage() {
  const { user } = useAuth();
  const [smsText, setSmsText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [autoApprove, setAutoApprove] = useState(false);
  const [minConfidence, setMinConfidence] = useState(0.7);

  const handleImportSMS = async () => {
    if (!smsText.trim()) {
      toast.error('Please paste your SMS messages');
      return;
    }

    setIsProcessing(true);
    try {
      // Split SMS messages by common separators
      const messages = smsText
        .split(/\n\s*\n|\n---\n|\n===\n/)
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0);

      const response = await fetch('/api/sms/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          messages,
          autoApprove,
          minConfidence
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to import SMS messages');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to process SMS messages');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveTransaction = async (transaction: ParsedTransaction, index: number) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          title: transaction.merchant || transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category || 'Other',
          paymentMethod: 'Bank Transfer',
          date: transaction.date,
          description: transaction.description,
          notes: `Imported from SMS (Confidence: ${(transaction.confidence * 100).toFixed(1)}%)`
        })
      });

      if (response.ok) {
        // Update the transaction status in results
        const updatedResults = { ...results! };
        updatedResults.transactions[index].status = 'imported';
        updatedResults.imported++;
        setResults(updatedResults);
        toast.success('Transaction approved and added');
      } else {
        toast.error('Failed to approve transaction');
      }
    } catch (error) {
      toast.error('Failed to approve transaction');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Transaction Import</h1>
              <p className="text-gray-600">Automatically extract and import transactions from your bank SMS messages</p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Smart Parsing</div>
                <div className="text-sm text-blue-700">AI-powered transaction extraction</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Secure Processing</div>
                <div className="text-sm text-green-700">Data processed locally</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-900">Auto Categorization</div>
                <div className="text-sm text-purple-700">Smart category detection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Import Form */}
        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Messages
              </label>
              <textarea
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="Paste your bank SMS messages here. You can paste multiple messages - separate them with blank lines.

Example:
HDFC Bank: Rs.500.00 debited from A/C **1234 on 15-Dec-23 at SWIGGY BANGALORE. Avl Bal: Rs.10,000.00

SBI: Rs.1,200.00 credited to A/C **5678 on 14-Dec-23 salary from COMPANY NAME. Avl Bal: Rs.15,000.00"
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
              />
              <div className="mt-2 text-sm text-gray-500">
                Supported banks: HDFC, SBI, ICICI, and most major Indian banks
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoApprove}
                    onChange={(e) => setAutoApprove(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Auto-approve high confidence transactions
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Transactions with 80%+ confidence will be automatically added
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Confidence: {(minConfidence * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.1"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleImportSMS}
              disabled={isProcessing || !smsText.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing SMS Messages...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Transactions
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {results && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Import Results</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                <div className="text-sm text-blue-700">Total Messages</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.imported}</div>
                <div className="text-sm text-green-700">Imported</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{results.transactions.filter(t => t.status === 'pending_review').length}</div>
                <div className="text-sm text-yellow-700">Pending Review</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{results.skipped}</div>
                <div className="text-sm text-gray-700">Skipped</div>
              </div>
            </div>

            {/* Errors */}
            {results.errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Errors</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {results.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Transactions */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Parsed Transactions</h3>
              {results.transactions.map((transaction, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {transaction.merchant || transaction.description}
                        </span>
                        <Badge className={getConfidenceColor(transaction.confidence)}>
                          {getConfidenceLabel(transaction.confidence)} ({(transaction.confidence * 100).toFixed(0)}%)
                        </Badge>
                        {transaction.status === 'imported' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Imported
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Amount: ₹{transaction.amount.toFixed(2)} ({transaction.type})</div>
                        <div>Category: {transaction.category}</div>
                        <div>Date: {new Date(transaction.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {transaction.status === 'pending_review' && (
                      <Button
                        size="sm"
                        onClick={() => handleApproveTransaction(transaction, index)}
                        className="ml-4"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                  
                  {transaction.rawSMS && (
                    <details className="mt-3">
                      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                        View original SMS
                      </summary>
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                        {transaction.rawSMS}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 mt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">How to use SMS Import</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Step 1:</strong> Copy transaction SMS messages from your phone</p>
                <p><strong>Step 2:</strong> Paste them in the text area above (separate multiple messages with blank lines)</p>
                <p><strong>Step 3:</strong> Adjust settings and click "Import Transactions"</p>
                <p><strong>Step 4:</strong> Review and approve transactions as needed</p>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Privacy Note</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your SMS data is processed securely and never stored permanently. Only the extracted transaction information is saved to your account.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}