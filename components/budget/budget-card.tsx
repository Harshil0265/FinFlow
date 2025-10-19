'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils';

interface BudgetCardProps {
  budget: {
    _id: string;
    category: string;
    amount: number;
    period: string;
    spent: number;
    remaining: number;
    percentage: number;
    status: 'good' | 'warning' | 'exceeded';
  };
  onEdit: (budget: any) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { format: formatUserCurrency } = useCurrency();
  const getStatusIcon = () => {
    switch (budget.status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'exceeded':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  const getProgressColor = () => {
    switch (budget.status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'exceeded':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              {getStatusIcon()}
              <span>{budget.category}</span>
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(budget)}
                className="h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(budget._id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {budget.period} Budget
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent</span>
              <span className="font-medium">{formatUserCurrency(budget.spent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Budget</span>
              <span className="font-medium">{formatUserCurrency(budget.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining</span>
              <span className={`font-medium ${
                budget.remaining > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatUserCurrency(budget.remaining)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{budget.percentage.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress value={Math.min(budget.percentage, 100)} className="h-3" />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor()}`}
                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
              />
            </div>
          </div>

          {budget.status === 'exceeded' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                Budget exceeded by {formatUserCurrency(budget.spent - budget.amount)}
              </p>
            </div>
          )}

          {budget.status === 'warning' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You've used {budget.percentage.toFixed(1)}% of your budget
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}