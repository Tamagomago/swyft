import { useState } from 'react';
import { Tables, TableMap } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { isNotes } from '@/lib/utils';
import { deleteItem } from '@/lib/notes';

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteItem<K extends Tables>(
    table: K,
    item: TableMap[K],
    onAfterDelete?: () => void,
  ) {
    try {
      await deleteItem(table, item.id);
      await queryClient.invalidateQueries({ queryKey: [table] });
      if (isNotes(item) && pathname.endsWith(item.id)) {
        router.push('/home');
      }
      if (onAfterDelete) onAfterDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error deleting ${table}.`);
    }
  }

  return { handleDeleteItem, error };
}
