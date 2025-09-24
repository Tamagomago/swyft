import { useState } from 'react';
import { Tables, TableMap } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { updateItem } from '@/lib/notes';

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateItem<K extends Tables>(table: K, item: TableMap[K]) {
    setIsUpdating(true);
    try {
      await updateItem(table, item);
      await queryClient.invalidateQueries({ queryKey: [table] });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error creating ${table}.`);
    } finally {
      setIsUpdating(false);
    }
  }

  return { handleUpdateItem, isUpdating, error };
}
