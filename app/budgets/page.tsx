'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { BudgetCard } from '@/components/budget/budget-card';
import { BudgetForm } from '@/components/forms/budget-form';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { InlineLoading } from '@/components/ui/loading';
import { type BudgetInput } from '@/lib/validations';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  period: string;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'good' | 'warning' | 'exceeded';
}

export default function BudgetsPage() {
  const { accessToken } = useAuth();
  const { format: formatUserCurrency } = useCurrency();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      // Use mock data for now
      const mockBudgets = [
        {
          _id: '1',
          category: 'Food & Dining',
          amount: 500,
          period: 'monthly',
          spent: 320.50,
          remaining: 179.50,
          percentage: 64.1,
          status: 'warning' as const,
        },
        {
          _id: '2',
          category: 'Transportation',
          amount: 200,
          period: 'monthly',
          spent: 145.20,
          remaining: 54.80,
          percentage: 72.6,
          status: 'warning' as const,
        },
        {
          _id: '3',
          category: 'Entertainment',
          amount: 150,
          period: 'monthly',
          spent: 89.99,
          remaining: 60.01,
          percentage: 60.0,
          status: 'good' as const,
        },
      ];
      
      setBudgets(mockBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: BudgetInput) => {
    setIsSubmitting(true);
    try {
      const url = editingBudget ? `/api/budgets/${editingBudget._id}` : '/api/budgets';
      const method = editingBudget ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save budget');
      }

      alert(`Budget ${editingBudget ? 'updated' : 'created'} successfully`);

      setIsModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to save budget'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete budget');
      }

      alert('Budget deleted successfully');

      fetchBudgets();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete budget'}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  // Calculate summary stats
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + budget.remaining, 0);
  const exceededBudgets = budgets.filter(budget => budget.status === 'exceeded').length;

  if (isLoading) {
    return (
      <ProfessionalLayout>
        <InlineLoading message="Loading budgets..." size="lg" />
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">
            Track your spending against your budget goals
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Budget
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatUserCurrency(totalBudget)}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Total Spent
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {formatUserCurrency(totalSpent)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Remaining
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatUserCurrency(totalRemaining)}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Exceeded
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {exceededBudgets}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first budget to start tracking your spending goals
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Budget
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => (
            <motion.div
              key={budget._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BudgetCard
                budget={budget}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Budget Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={editingBudget ? {
            category: editingBudget.category,
            amount: editingBudget.amount,
            period: editingBudget.period as 'weekly' | 'monthly' | 'yearly',
            startDate: new Date(),
          } : undefined}
          isLoading={isSubmitting}
          onCancel={handleCloseModal}
        />
      </Modal>
      </div>
    </ProfessionalLayout>
  );
}