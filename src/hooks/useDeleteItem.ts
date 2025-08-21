import { useState } from 'react';
import { Notes, Folders } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { isNotes } from '@/lib/utils';

type DeleteFn = (id: string) => Promise<{ error: string | PostgrestError | null }>;

export function useItemDelete() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  async function deleteItem<T extends Notes | Folders>(
    item: T,
    deleteFn: DeleteFn,
    queryKey: 'notes' | 'folders',
    label: string,
    onAfterDelete?: () => void,
  ) {
    try {
      const { error } = await deleteFn(item.id);
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (isNotes(item) && pathname.endsWith(item.id)) {
        router.push('/home');
      }

      if (onAfterDelete) onAfterDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error deleting ${label}.`);
    }
  }

  return { deleteItem, error };
}
