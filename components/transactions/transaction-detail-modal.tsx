'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign, Tag, CreditCard, FileText, StickyNote } from 'lucide-react';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TransactionNotes } from './transaction-notes';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes: (transactionId: string, notes: string) => Promise<void>;
  readOnly?: boolean;
}

export function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onUpdateNotes,
  readOnly = false,
}: TransactionDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!transaction) return null;

  const handleNotesUpdate = async (notes: string) => {
    setIsUpdating(true);
    try {
      await onUpdateNotes(transaction._id, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{transaction.title}</h2>
            <p className="text-sm text-muted-foreground">
              Transaction Details
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Transaction Info */}
        <div className="space-y-4 mb-6">
          {/* Amount */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className={`p-2 rounded-full ${
              transaction.type === 'income' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{transaction.category}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium">{transaction.paymentMethod}</p>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className={`h-4 w-4 rounded-full ${
                transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-medium capitalize">{transaction.type}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Description</p>
              </div>
              <p className="text-sm">{transaction.description}</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <TransactionNotes
          notes={transaction.notes || ''}
          onSave={handleNotesUpdate}
          isLoading={isUpdating}
          readOnly={readOnly}
        />
      </div>
    </Modal>
  );
}