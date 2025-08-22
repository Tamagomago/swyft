import { useState } from 'react';
import { Notes, Folders, Tables, TableMap } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import useCreating from '@/hooks/useCreating';

type CreateFn<K extends Tables> = (
  table: K,
  item: Omit<TableMap[K], 'id' | 'user_id'>,
) => Promise<{ data: TableMap[K] | null; error: PostgrestError | null | Error }>;

export function useCreateItem() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateItem<K extends Tables>(
    table: K,
    item: Omit<TableMap[K], 'id' | 'user_id'>,
    createFn: CreateFn<K>,
    creation: ReturnType<typeof useCreating>,
    label: string,
  ) {
    const isEmpty =
      table === 'notes' ? !('title' in item && item.title) : !('name' in item && item.name);

    if (isEmpty) {
      creation.cancel();
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await createFn(table, item);
      if (error) throw error;

      if (data) {
        await queryClient.invalidateQueries({ queryKey: [table] });
      }
      creation.created();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error creating ${label}.`);
    } finally {
      setIsCreating(false);
    }
  }

  return { handleCreateItem, isCreating, error };
}
