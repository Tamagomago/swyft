import { useState } from 'react';
import { Tables, TableMap } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

type UpdateFn<K extends Tables> = (
  table: K,
  item: TableMap[K],
) => Promise<{ data: TableMap[K] | null; error: PostgrestError | null | Error }>;

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateItem<K extends Tables>(
    table: K,
    item: TableMap[K],
    updateFn: UpdateFn<K>,
    label: string,
  ) {
    setIsUpdating(true);
    try {
      const { error } = await updateFn(table, item);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: [table] });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error creating ${label}.`);
    } finally {
      setIsUpdating(false);
    }
  }

  return { handleUpdateItem, isUpdating, error };
}
