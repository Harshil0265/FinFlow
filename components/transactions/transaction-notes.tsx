'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Edit3, Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionNotesProps {
  notes?: string;
  onSave: (notes: string) => Promise<void>;
  isLoading?: boolean;
  readOnly?: boolean;
}

export function TransactionNotes({ notes, onSave, isLoading, readOnly }: TransactionNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editedNotes.trim() === (notes || '').trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editedNotes.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedNotes(notes || '');
    setIsEditing(false);
  };

  const hasNotes = notes && notes.trim().length > 0;

  if (!hasNotes && !isEditing && readOnly) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes
          </CardTitle>
          {!readOnly && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 px-2"
            >
              {hasNotes ? <Edit3 className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {hasNotes ? 'Edit' : 'Add Note'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Add your notes, reminders, or additional context..."
                className="w-full px-3 py-2 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                maxLength={1000}
                autoFocus
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {editedNotes.length}/1000 characters
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="h-8"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-8"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : hasNotes ? (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="bg-muted/50 rounded-md p-3 border-l-4 border-primary/20">
                <p className="text-sm whitespace-pre-wrap">{notes}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <StickyNote className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notes added yet</p>
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Note
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}