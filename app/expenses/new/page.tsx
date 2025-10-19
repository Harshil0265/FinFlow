'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TransactionForm } from '@/components/forms/transaction-form';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { useLoading } from '@/components/providers/loading-provider';
import { type TransactionInput } from '@/lib/validations';

export default function NewExpensePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { addTransaction, hasAuth } = useTransactionsWithAuth();
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (data: TransactionInput) => {
    if (!hasAuth) {
      alert('Please log in to add transactions');
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setLoading(true, 'Saving transaction...');
    
    try {
      await addTransaction(data);
      
      setLoading(true, 'Transaction saved successfully!');
      
      // Small delay for better UX
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      alert(error.message || 'Failed to create transaction');
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Transaction</h1>
          <p className="text-muted-foreground">
            Record your income or expense to keep track of your finances
          </p>
        </div>

        <TransactionForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </motion.div>
      </div>
    </ProfessionalLayout>
  );
}