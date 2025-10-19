'use client';

import { useState } from 'react';
import { Trash2, Download, Tag, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';

interface BulkOperationsProps {
  selectedTransactions: string[];
  onBulkDelete: (transactionIds: string[]) => Promise<void>;
  onBulkExport: (transactionIds: string[]) => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

export function BulkOperations({
  selectedTransactions,
  onBulkDelete,
  onBulkExport,
  onClearSelection,
  isVisible,
}: BulkOperationsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await onBulkDelete(selectedTransactions);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete transactions:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isVisible || selectedTransactions.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Badge variant="secondary">
                {selectedTransactions.length} selected
              </Badge>
              Bulk Operations
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkExport(selectedTransactions)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Delete Transactions</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedTransactions.length}</span>{' '}
              selected transaction{selectedTransactions.length > 1 ? 's' : ''}?
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently remove the transactions and their associated notes from your account.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Transactions'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}