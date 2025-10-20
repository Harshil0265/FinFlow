'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionSearch } from '@/components/transactions/transaction-search';
import { BulkOperations } from '@/components/transactions/bulk-operations';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { InlineLoading } from '@/components/ui/loading';
import { DemoBanner } from '@/components/demo/demo-banner';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { isDemoMode, getDemoTransactions } = useDemoMode();
  const { 
    transactions, 
    isLoading, 
    fetchTransactions, 
    updateTransactionNotes,
    deleteTransaction
  } = useTransactionsWithAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});

  // Use demo transactions if in demo mode
  const displayTransactions = isDemoMode ? getDemoTransactions() : transactions;

  useEffect(() => {
    if (!isDemoMode) {
      fetchTransactions();
    }
  }, [isDemoMode, fetchTransactions]);

  const filteredTransactions = displayTransactions.filter((transaction: any) => {
    // Text search
    const matchesSearch = !searchQuery || 
      transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type
    const matchesType = !filters.type || transaction.type === filters.type;
    
    // Filter by category
    const matchesCategory = !filters.category || transaction.category === filters.category;
    
    // Filter by payment method
    const matchesPaymentMethod = !filters.paymentMethod || transaction.paymentMethod === filters.paymentMethod;

    return matchesSearch && matchesType && matchesCategory && matchesPaymentMethod;
  });

  const handleBulkDelete = async (transactionIds: string[]) => {
    if (isDemoMode) {
      setSelectedTransactions([]);
      return;
    }

    try {
      await Promise.all(transactionIds.map(id => deleteTransaction(id)));
      setSelectedTransactions([]);
    } catch (error) {
      console.error('Failed to delete transactions:', error);
    }
  };

  const handleBulkExport = (transactionIds: string[]) => {
    console.log('Exporting transactions:', transactionIds);
  };

  const handleExport = () => {
    console.log('Exporting all transactions...');
  };

  if (isLoading && !isDemoMode) {
    return (
      <ProfessionalLayout>
        <InlineLoading message="Loading transactions..." size="lg" />
      </ProfessionalLayout>
    );
  }

  return (
    <>
      {isDemoMode && <DemoBanner />}
      <div className={isDemoMode ? "pt-16" : ""}>
        <ProfessionalLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Transactions
                  {isDemoMode && <span className="text-lg text-blue-600 ml-2">(Demo Mode)</span>}
                </h1>
                <p className="text-muted-foreground">
                  {isDemoMode 
                    ? "Explore sample transactions with notes and detailed tracking"
                    : "Manage and track all your financial transactions"
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => window.location.href = '/expenses/new'}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <TransactionSearch
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              onFilter={setFilters}
            />

            {/* Bulk Operations */}
            <BulkOperations
              selectedTransactions={selectedTransactions}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
              onClearSelection={() => setSelectedTransactions([])}
              isVisible={selectedTransactions.length > 0}
            />

            {/* Transactions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TransactionList
                transactions={filteredTransactions}
                onUpdateNotes={async (id, notes) => {
                  if (!isDemoMode) {
                    await updateTransactionNotes(id, notes);
                  }
                }}
                onDelete={async (id) => {
                  if (!isDemoMode) {
                    await deleteTransaction(id);
                  }
                }}
                title={`All Transactions (${filteredTransactions.length})`}
                description="Complete list of your financial transactions with notes"
                showActions={true}
              />
            </motion.div>
          </div>
        </ProfessionalLayout>
      </div>
    </>
  );
}