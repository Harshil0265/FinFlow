'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CalendarIcon, DollarSign, Tag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { transactionSchema, type TransactionInput } from '@/lib/validations';
import { defaultCategories, defaultPaymentMethods, getTodayDateString, validateTransactionDate } from '@/lib/utils';
import { ClientOnly } from '@/components/providers/client-only';

interface TransactionFormProps {
  onSubmit: (data: TransactionInput) => Promise<void>;
  initialData?: Partial<TransactionInput>;
  isLoading?: boolean;
}

export function TransactionForm({ onSubmit, initialData, isLoading }: TransactionFormProps) {
  const { getSymbol } = useCurrency();
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
    initialData?.type || 'expense'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date(),
      ...initialData,
    },
  });

  // Custom date validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const validation = validateTransactionDate(dateValue);
    
    if (!validation.isValid) {
      setError('date', { 
        type: 'manual', 
        message: validation.error || 'Invalid date' 
      });
    } else {
      clearErrors('date');
    }
  };

  const watchedType = watch('type');

  const filteredCategories = defaultCategories.filter(
    cat => cat.type === watchedType || cat.type === 'both'
  );

  const handleTypeChange = (type: 'income' | 'expense') => {
    setSelectedType(type);
    setValue('type', type);
  };

  return (
    <ClientOnly>
      <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>{initialData ? 'Edit Transaction' : 'Add New Transaction'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={selectedType === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleTypeChange('expense')}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={selectedType === 'income' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleTypeChange('income')}
              >
                Income
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter transaction title"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                {getSymbol()}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`pl-10 ${errors.amount ? 'border-destructive' : ''}`}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="category"
                {...register('category')}
                className={`w-full h-10 px-3 py-2 border rounded-md bg-background ${
                  errors.category ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Select category</option>
                {filteredCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                {...register('paymentMethod')}
                className={`w-full h-10 px-3 py-2 border rounded-md bg-background ${
                  errors.paymentMethod ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Select payment method</option>
                {defaultPaymentMethods.map((method) => (
                  <option key={method.name} value={method.name}>
                    {method.icon} {method.name}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date *
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                max={getTodayDateString()}
                className={`pl-10 ${errors.date ? 'border-destructive' : ''}`}
                {...register('date', {
                  setValueAs: (value) => value ? new Date(value) : new Date(),
                  onChange: handleDateChange,
                })}
              />
            </div>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Brief description of the transaction (optional)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
              {...register('description')}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes/Memo
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add personal notes, reminders, or additional context (optional)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
              maxLength={1000}
              {...register('notes')}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Add personal notes, context, or reminders for this transaction
              </p>
              <p className="text-xs text-muted-foreground">
                {watch('notes')?.length || 0}/1000
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{initialData ? 'Update Transaction' : 'Add Transaction'}</span>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
    </ClientOnly>
  );
}