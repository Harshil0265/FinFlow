'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { DollarSign, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { budgetSchema, type BudgetInput } from '@/lib/validations';
import { defaultCategories, getTodayDateString } from '@/lib/utils';
import { ClientOnly } from '@/components/providers/client-only';

interface BudgetFormProps {
  onSubmit: (data: BudgetInput) => Promise<void>;
  initialData?: Partial<BudgetInput>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function BudgetForm({ onSubmit, initialData, isLoading, onCancel }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: 'monthly',
      startDate: new Date(),
      ...initialData,
    },
  });

  const expenseCategories = defaultCategories.filter(
    cat => cat.type === 'expense' || cat.type === 'both'
  );

  return (
    <ClientOnly>
      <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>{initialData ? 'Edit Budget' : 'Create New Budget'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {expenseCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Budget Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

          {/* Period */}
          <div className="space-y-2">
            <label htmlFor="period" className="text-sm font-medium">
              Budget Period *
            </label>
            <select
              id="period"
              {...register('period')}
              className={`w-full h-10 px-3 py-2 border rounded-md bg-background ${
                errors.period ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.period && (
              <p className="text-sm text-destructive">{errors.period.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="startDate"
                type="date"
                max={getTodayDateString()}
                className={`pl-10 ${errors.startDate ? 'border-destructive' : ''}`}
                {...register('startDate', {
                  setValueAs: (value) => value ? new Date(value) : new Date(),
                })}
              />
            </div>
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date (Optional) */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="endDate"
                type="date"
                className={`pl-10 ${errors.endDate ? 'border-destructive' : ''}`}
                {...register('endDate', {
                  setValueAs: (value) => value ? new Date(value) : undefined,
                })}
              />
            </div>
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
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
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{initialData ? 'Update Budget' : 'Create Budget'}</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </ClientOnly>
  );
}