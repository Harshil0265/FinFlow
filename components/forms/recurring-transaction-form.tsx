'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CalendarIcon, Repeat, Tag, CreditCard, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/hooks/useCurrency';
import { recurringTransactionSchema } from '@/lib/validations';
import { defaultCategories, defaultPaymentMethods, getTodayDateString, validateTransactionDate } from '@/lib/utils';
import { RecurringTransaction } from '@/types';
import { ClientOnly } from '@/components/providers/client-only';

type RecurringTransactionInput = {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  description?: string;
  recurringRule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  startDate: string;
  endDate?: string;
  maxOccurrences?: number;
};

interface RecurringTransactionFormProps {
  onSubmit: (data: RecurringTransactionInput) => Promise<void>;
  initialData?: RecurringTransaction;
  isLoading?: boolean;
  onCancel?: () => void;
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const dayOfWeekOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function RecurringTransactionForm({ onSubmit, initialData, isLoading, onCancel }: RecurringTransactionFormProps) {
  const { getSymbol } = useCurrency();
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(
    initialData?.type || 'expense'
  );
  const [selectedFrequency, setSelectedFrequency] = useState<string>(
    initialData?.recurringRule.frequency || 'monthly'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm<RecurringTransactionInput>({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount || 0,
      type: initialData?.type || 'expense',
      category: initialData?.category || '',
      paymentMethod: initialData?.paymentMethod || '',
      description: initialData?.description || '',
      recurringRule: {
        frequency: initialData?.recurringRule.frequency || 'monthly',
        interval: initialData?.recurringRule.interval || 1,
        dayOfWeek: initialData?.recurringRule.dayOfWeek,
        dayOfMonth: initialData?.recurringRule.dayOfMonth,
      },
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : getTodayDateString(),
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      maxOccurrences: initialData?.maxOccurrences,
    },
  });

  const watchedFrequency = watch('recurringRule.frequency');

  useEffect(() => {
    setSelectedFrequency(watchedFrequency);
  }, [watchedFrequency]);

  const handleTypeChange = (type: 'income' | 'expense') => {
    setSelectedType(type);
    setValue('type', type);
  };

  const categories = defaultCategories.filter(cat => cat.type === selectedType);

  return (
    <ClientOnly>
      <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Repeat className="w-5 h-5" />
          <span>{initialData ? 'Edit Recurring Transaction' : 'Create Recurring Transaction'}</span>
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
                variant={selectedType === 'income' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('income')}
                className="flex-1"
              >
                Income
              </Button>
              <Button
                type="button"
                variant={selectedType === 'expense' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('expense')}
                className="flex-1"
              >
                Expense
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Monthly Salary, Weekly Groceries"
              className={errors.title ? 'border-destructive' : ''}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
                {getSymbol()}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`pl-8 ${errors.amount ? 'border-destructive' : ''}`}
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>Category</span>
            </label>
            <select
              id="category"
              className={`w-full px-3 py-2 border rounded-md bg-background ${errors.category ? 'border-destructive' : 'border-input'}`}
              {...register('category')}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
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
            <label htmlFor="paymentMethod" className="text-sm font-medium flex items-center space-x-1">
              <CreditCard className="w-4 h-4" />
              <span>Payment Method</span>
            </label>
            <select
              id="paymentMethod"
              className={`w-full px-3 py-2 border rounded-md bg-background ${errors.paymentMethod ? 'border-destructive' : 'border-input'}`}
              {...register('paymentMethod')}
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

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="Additional notes..."
              {...register('description')}
            />
          </div>

          {/* Recurring Rule */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Recurring Schedule</span>
            </h3>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-background"
                {...register('recurringRule.frequency')}
              >
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Interval */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Every {selectedFrequency === 'daily' ? 'X days' : selectedFrequency === 'weekly' ? 'X weeks' : selectedFrequency === 'monthly' ? 'X months' : 'X years'}
              </label>
              <Input
                type="number"
                min="1"
                max="365"
                placeholder="1"
                {...register('recurringRule.interval', { valueAsNumber: true })}
              />
            </div>

            {/* Day of Week (for weekly) */}
            {selectedFrequency === 'weekly' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Day of Week</label>
                <select
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  {...register('recurringRule.dayOfWeek', { valueAsNumber: true })}
                >
                  <option value="">Same day as start date</option>
                  {dayOfWeekOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Day of Month (for monthly) */}
            {selectedFrequency === 'monthly' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Day of Month</label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Same day as start date"
                  {...register('recurringRule.dayOfMonth', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Start Date</span>
            </label>
            <Input
              id="startDate"
              type="date"
              max={getTodayDateString()}
              className={errors.startDate ? 'border-destructive' : ''}
              {...register('startDate')}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date (Optional) */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date (Optional)
            </label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for indefinite recurring
            </p>
          </div>

          {/* Max Occurrences (Optional) */}
          <div className="space-y-2">
            <label htmlFor="maxOccurrences" className="text-sm font-medium">
              Maximum Occurrences (Optional)
            </label>
            <Input
              id="maxOccurrences"
              type="number"
              min="1"
              placeholder="Unlimited"
              {...register('maxOccurrences', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of times this transaction should repeat
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                initialData ? 'Update Recurring Transaction' : 'Create Recurring Transaction'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </ClientOnly>
  );
}