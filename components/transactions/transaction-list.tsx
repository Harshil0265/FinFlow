'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StickyNote, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  MoreHorizontal
} from 'lucide-react';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { SimpleDropdown } from '@/components/ui/simple-dropdown';
import { TransactionDetailModal } from './transaction-detail-modal';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdateNotes: (transactionId: string, notes: string) => Promise<void>;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => Promise<void>;
  title?: string;
  description?: string;
  showActions?: boolean;
  maxItems?: number;
  compact?: boolean;
}

export function TransactionList({
  transactions,
  onUpdateNotes,
  onEdit,
  onDelete,
  title = "Transactions",
  description = "Your financial activities",
  showActions = true,
  maxItems,
  compact = false,
}: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const displayTransactions = maxItems 
    ? transactions.slice(0, maxItems) 
    : transactions;

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  if (compact) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayTransactions.length > 0 ? (
                displayTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{transaction.title}</p>
                          {transaction.notes && (
                            <StickyNote className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM dd')}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          onUpdateNotes={onUpdateNotes}
        />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {showActions && <TableHead className="w-[50px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTransactions.length > 0 ? (
                displayTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.title}</p>
                            {transaction.notes && (
                              <StickyNote className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                          {transaction.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </TableCell>
                    {showActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <SimpleDropdown
                          items={[
                            {
                              label: 'View Details',
                              icon: <Eye className="h-4 w-4" />,
                              onClick: () => handleViewDetails(transaction),
                            },
                            ...(onEdit ? [{
                              label: 'Edit',
                              icon: <Edit3 className="h-4 w-4" />,
                              onClick: () => onEdit(transaction),
                            }] : []),
                            ...(onDelete ? [{
                              label: 'Delete',
                              icon: <Trash2 className="h-4 w-4" />,
                              onClick: () => onDelete(transaction._id),
                              className: 'text-red-600 hover:text-red-700',
                            }] : []),
                          ]}
                        />
                      </TableCell>
                    )}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showActions ? 6 : 5} className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onUpdateNotes={onUpdateNotes}
      />
    </>
  );
}