import { useState } from 'react';
import { Notes, Folders } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import useCreating from '@/hooks/useCreating';
import { isNotes } from '@/lib/utils';

type CreateFn<T> = (item: T) => Promise<{ data: T | null; error: string | PostgrestError | null }>;

export function useItemCreate() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createItem<T extends Notes | Folders>(
    item: T,
    createFn: CreateFn<T>,
    queryKey: 'notes' | 'folders',
    creation: ReturnType<typeof useCreating>,
    label: string,
  ) {
    if (!(isNotes(item) ? item.title : item.name)) {
      creation.cancel();
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await createFn(item);
      if (error) throw error;

      if (data) {
        await queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      creation.created();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error creating ${label}.`);
    } finally {
      setIsCreating(false);
    }
  }

  return { createItem, isCreating, error };
}
