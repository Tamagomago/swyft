import { useState } from 'react';
import { Tables, TableMap } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useSidebarStore } from '@/store/sidebar';
import { createItem } from '@/lib/notes';

export function useCreateItem() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cancelCreate } = useSidebarStore();

  async function handleCreateItem<K extends Tables>(
    table: K,
    item: Omit<TableMap[K], 'id' | 'user_id'>,
  ) {
    const isEmpty =
      table === 'note' ? !('title' in item && item.title) : !('name' in item && item.name);

    if (isEmpty) {
      cancelCreate();
      return;
    }

    setIsCreating(true);

    try {
      const { data } = await createItem(table, item);
      if (data) {
        await queryClient.invalidateQueries({ queryKey: [table] });
      }
      cancelCreate();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error creating ${table}.`);
    } finally {
      setIsCreating(false);
    }
  }

  return { handleCreateItem, isCreating, error };
}
