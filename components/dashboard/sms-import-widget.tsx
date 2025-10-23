'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useSMSImport } from '@/hooks/useSMSImport';

export function SMSImportWidget() {
  const { getImportHistory, history, isLoading } = useSMSImport();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getImportHistory();
  }, []);

  if (isLoading && !history) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  const stats = history?.stats;
  const recentTransactions = history?.transactions?.slice(0, 3) || [];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">SMS Import</h3>
            <p className="text-sm text-gray-600">Auto-imported transactions</p>
          </div>
        </div>
        <Link href="/sms-import">
          <Button variant="outline" size="sm">
            Import SMS
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {stats && stats.totalImported > 0 ? (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalImported}</div>
              <div className="text-xs text-gray-600">Total Imported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
              <div className="text-xs text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{stats.totalAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Total Amount</div>
            </div>
          </div>

          {/* Recent Transactions */}
          {recentTransactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recent SMS Imports</span>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
              
              {showDetails && (
                <div className="space-y-2">
                  {recentTransactions.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {transaction.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                        </span>
                        {transaction.confidence && (
                          <Badge 
                            className={`text-xs ${
                              transaction.confidence >= 0.8 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {(transaction.confidence * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Last import: {recentTransactions.length > 0 
                  ? new Date(recentTransactions[0].createdAt).toLocaleDateString()
                  : 'Never'
                }
              </span>
              <Link href="/sms-import" className="text-blue-600 hover:text-blue-700 font-medium">
                Import More →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-gray-900 mb-1">No SMS imports yet</h4>
          <p className="text-sm text-gray-600 mb-4">
            Automatically extract transactions from your bank SMS messages
          </p>
          <Link href="/sms-import">
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Importing
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}