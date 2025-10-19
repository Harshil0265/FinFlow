'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionSearch } from '@/components/transactions/transaction-search';
import { BulkOperations } from '@/components/transactions/bulk-operations';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { useAuth } from '@/hooks/useAuth';
import { useSafeDemo } from '@/hooks/useSafeDemo';
import { InlineLoading } from '@/components/ui/loading';
import { DemoBanner } from '@/components/demo/demo-banner';
import { url } from 'inspector';
import { url } from 'inspector';
import { blob } from 'stream/consumers';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { isDemoMode, getDemoTransactions } = useSafeDemo();
  const { 
    transactions, 
    isLoading, 
    fetchTransactions, 
    updateTransactionNotes,
    deleteTransaction,
    hasAuth 
  } = useTransactionsWithAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});

  // Use demo transactions if in demo mode
  const displayTransactions = isDemoMode ? getDemoTransactions() : transactions;

  useEffect(() => {
    if (hasAuth && !isDemoMode) {
      fetchTransactions();
    }
  }, [hasAuth, isDemoMode, fetchTransactions]);

  const filteredTransactions = displayTransactions.filter(transaction => {
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
                readOnly={isDemoMode}
              />
            </motion.div>
          </div>
        </ProfessionalLayout>
      </div>
    </>
  );
}dow.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleRowSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  if (!hasAuth) {
    return (
      <ProfessionalLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Please log in to view transactions.</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Receipt className="w-8 h-8" />
              <span>Transactions</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your financial transactions
            </p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>

        <TransactionSearch
          transactions={transactions}
          onFilteredResults={setFilteredTransactions}
        />

        <BulkOperations
          transactions={filteredTransactions}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onBulkExport={handleBulkExport}
        />

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}

        {!isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {filteredTransactions.length === transactions.length 
                    ? `All Transactions (${transactions.length})`
                    : `Filtered Transactions (${filteredTransactions.length} of ${transactions.length})`
                  }
                </span>
                {filteredTransactions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkExport(filteredTransactions.map(t => t._id))}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export All</span>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2"></th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction._id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(transaction._id)}
                              onChange={(e) => handleRowSelection(transaction._id, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-2">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="max-w-xs truncate" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </td>
                          <td className="p-2">{transaction.category}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{format(transaction.amount)}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(transaction)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(transaction._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {transactions.length === 0 
                      ? 'Create your first transaction to get started.'
                      : 'Try adjusting your search filters.'
                    }
                  </p>
                  <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Transaction</span>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        >
          <TransactionForm
            onSubmit={handleSubmit}
            initialData={editingTransaction || undefined}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </ProfessionalLayout>
  );
}