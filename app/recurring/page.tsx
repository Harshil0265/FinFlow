'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Repeat, Filter, RefreshCw, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { RecurringTransactionForm } from '@/components/forms/recurring-transaction-form';
import { RecurringTransactionCard } from '@/components/recurring/recurring-transaction-card';
import { useRecurringTransactionsWithAuth } from '@/hooks/useRecurringTransactionsWithAuth';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { RecurringTransaction } from '@/types';
import { toast } from 'react-hot-toast';

type FilterStatus = 'all' | 'active' | 'inactive';

export default function RecurringTransactionsPage() {
  const { format } = useCurrency();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    recurringTransactions,
    isLoading,
    error,
    fetchRecurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions,
    hasAuth,
  } = useRecurringTransactionsWithAuth();

  const { fetchTransactions } = useTransactionsWithAuth();

  // Fetch data on mount
  useEffect(() => {
    if (hasAuth) {
      fetchRecurringTransactions(filterStatus === 'all' ? undefined : filterStatus);
    }
  }, [hasAuth, filterStatus]);

  // Filter transactions based on status
  const filteredTransactions = recurringTransactions.filter((transaction: RecurringTransaction) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return transaction.isActive;
    if (filterStatus === 'inactive') return !transaction.isActive;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: recurringTransactions.length,
    active: recurringTransactions.filter((t: RecurringTransaction) => t.isActive).length,
    inactive: recurringTransactions.filter((t: RecurringTransaction) => !t.isActive).length,
    monthlyIncome: recurringTransactions
      .filter((t: RecurringTransaction) => t.isActive && t.type === 'income' && t.recurringRule.frequency === 'monthly')
      .reduce((sum: number, t: RecurringTransaction) => sum + t.amount, 0),
    monthlyExpenses: recurringTransactions
      .filter((t: RecurringTransaction) => t.isActive && t.type === 'expense' && t.recurringRule.frequency === 'monthly')
      .reduce((sum: number, t: RecurringTransaction) => sum + t.amount, 0),
    dueToday: recurringTransactions.filter((t: RecurringTransaction) => {
      const today = new Date();
      const dueDate = new Date(t.nextDueDate);
      return t.isActive && 
        dueDate.toDateString() === today.toDateString();
    }).length,
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingTransaction) {
        await updateRecurringTransaction(editingTransaction._id, data);
        toast.success('Recurring transaction updated successfully!');
      } else {
        await addRecurringTransaction(data);
        toast.success('Recurring transaction created successfully!');
      }
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      try {
        await deleteRecurringTransaction(id);
        toast.success('Recurring transaction deleted successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete recurring transaction');
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateRecurringTransaction(id, { isActive });
      toast.success(`Recurring transaction ${isActive ? 'activated' : 'paused'} successfully!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update recurring transaction');
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);
    try {
      const result = await processRecurringTransactions();
      if (result.data.processedTransactions.length > 0) {
        toast.success(`Processed ${result.data.processedTransactions.length} recurring transactions!`);
        // Refresh both recurring transactions and regular transactions
        await fetchTransactions();
      } else {
        toast.success('No recurring transactions were due for processing.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process recurring transactions');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (!hasAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please log in to view recurring transactions.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Repeat className="w-8 h-8" />
            <span>Recurring Transactions</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Automate your regular income and expenses
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleProcessAll}
            disabled={isProcessing || stats.dueToday === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Process Due ({stats.dueToday})</span>
          </Button>
          
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recurring Transaction</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">
              {stats.active} active, {stats.inactive} inactive
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Monthly Income</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{format(stats.monthlyIncome)}
            </div>
            <div className="text-xs text-muted-foreground">
              From monthly recurring income
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
              <TrendingDown className="w-4 h-4" />
              <span>Monthly Expenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{format(stats.monthlyExpenses)}
            </div>
            <div className="text-xs text-muted-foreground">
              From monthly recurring expenses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Due Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dueToday}</div>
            <div className="text-xs text-muted-foreground">
              Transactions ready to process
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All ({stats.total})
        </Button>
        
        <Button
          variant={filterStatus === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('active')}
        >
          Active ({stats.active})
        </Button>
        
        <Button
          variant={filterStatus === 'inactive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('inactive')}
        >
          Inactive ({stats.inactive})
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Recurring Transactions List */}
      {!isLoading && (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: RecurringTransaction) => (
                <RecurringTransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Repeat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recurring transactions found</h3>
                <p className="text-muted-foreground mb-4">
                  {filterStatus === 'all' 
                    ? 'Create your first recurring transaction to automate your finances.'
                    : `No ${filterStatus} recurring transactions found.`
                  }
                </p>
                <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Recurring Transaction</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingTransaction ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}
      >
        <RecurringTransactionForm
          onSubmit={handleSubmit}
          initialData={editingTransaction || undefined}
          isLoading={isLoading}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}