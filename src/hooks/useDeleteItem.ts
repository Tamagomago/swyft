import { useState } from 'react';
import { Notes, Folders, Tables, TableMap } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { isNotes } from '@/lib/utils';

type DeleteFn<K extends Tables> = (
  table: K,
  id: string,
) => Promise<{ error: Error | PostgrestError | null }>;

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteItem<K extends Tables>(
    table: K,
    item: TableMap[K],
    deleteFn: DeleteFn<K>,
    label: string,
    onAfterDelete?: () => void,
  ) {
    try {
      const { error } = await deleteFn(table, item.id);
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: [table] });

      if (isNotes(item) && pathname.endsWith(item.id)) {
        router.push('/home');
      }

      if (onAfterDelete) onAfterDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error deleting ${label}.`);
    }
  }

  return { handleDeleteItem, error };
}
