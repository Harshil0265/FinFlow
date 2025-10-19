'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Repeat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/hooks/useCurrency';
import { RecurringTransaction } from '@/types';
import { formatDate } from '@/lib/utils';

interface RecurringTransactionCardProps {
  transaction: RecurringTransaction;
  onEdit?: (transaction: RecurringTransaction) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onProcess?: (id: string) => void;
}

export function RecurringTransactionCard({ 
  transaction, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onProcess 
}: RecurringTransactionCardProps) {
  const { format } = useCurrency();
  const [showActions, setShowActions] = useState(false);

  const getFrequencyText = () => {
    const { frequency, interval } = transaction.recurringRule;
    const intervalText = interval > 1 ? `${interval} ` : '';
    
    switch (frequency) {
      case 'daily':
        return `Every ${intervalText}${interval > 1 ? 'days' : 'day'}`;
      case 'weekly':
        return `Every ${intervalText}${interval > 1 ? 'weeks' : 'week'}`;
      case 'monthly':
        return `Every ${intervalText}${interval > 1 ? 'months' : 'month'}`;
      case 'yearly':
        return `Every ${intervalText}${interval > 1 ? 'years' : 'year'}`;
      default:
        return 'Unknown frequency';
    }
  };

  const getNextDueText = () => {
    const now = new Date();
    const dueDate = new Date(transaction.nextDueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return `Due ${formatDate(dueDate)}`;
    }
  };

  const isDue = () => {
    const now = new Date();
    const dueDate = new Date(transaction.nextDueDate);
    return dueDate <= now;
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDate = new Date(transaction.nextDueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className={`relative transition-all duration-200 hover:shadow-md ${
        !transaction.isActive ? 'opacity-60' : ''
      } ${isOverdue() ? 'border-destructive' : isDue() ? 'border-warning' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className={`p-1.5 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <h3 className="font-semibold text-lg">{transaction.title}</h3>
                {!transaction.isActive && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                {isOverdue() && (
                  <Badge variant="destructive">Overdue</Badge>
                )}
                {isDue() && transaction.isActive && (
                  <Badge variant="default">Due</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Repeat className="w-3 h-3" />
                  <span>{getFrequencyText()}</span>
                </span>
                <span>•</span>
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{transaction.paymentMethod}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{format(transaction.amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.totalOccurrences} occurrence{transaction.totalOccurrences !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActions(!showActions)}
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-8 z-10 w-48 bg-background border rounded-md shadow-lg py-1"
                  >
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(transaction);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    )}
                    
                    {onToggleActive && (
                      <button
                        onClick={() => {
                          onToggleActive(transaction._id, !transaction.isActive);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
                      >
                        {transaction.isActive ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                    )}

                    {onProcess && isDue() && transaction.isActive && (
                      <button
                        onClick={() => {
                          onProcess(transaction._id);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-blue-600"
                      >
                        <Play className="w-4 h-4" />
                        <span>Process Now</span>
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(transaction._id);
                          setShowActions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{getNextDueText()}</span>
              </div>
              
              {transaction.endDate && (
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Ends {formatDate(new Date(transaction.endDate))}</span>
                </div>
              )}

              {transaction.maxOccurrences && (
                <div className="text-muted-foreground">
                  <span>{transaction.totalOccurrences}/{transaction.maxOccurrences} completed</span>
                </div>
              )}
            </div>

            {transaction.description && (
              <div className="text-xs text-muted-foreground max-w-xs truncate">
                {transaction.description}
              </div>
            )}
          </div>

          {/* Progress bar for max occurrences */}
          {transaction.maxOccurrences && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((transaction.totalOccurrences / transaction.maxOccurrences) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>

        {/* Click outside to close actions */}
        {showActions && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowActions(false)}
          />
        )}
      </Card>
    </motion.div>
  );
}