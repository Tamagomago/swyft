import { createClient } from '@/utils/supabase/client';
import { TableMap, Tables } from '@/types/types';
import { PostgrestError } from '@supabase/supabase-js';

const supabase = createClient();
const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

// Temporary fix: pluralize table names
function pluralizeTable(table: string): string {
  return table + 's';
}

export async function createItem<T extends Tables>(
  table: T,
  item: Omit<TableMap[T], 'id' | 'user_id'>,
): Promise<{ data: TableMap[T] | null; error: PostgrestError | null | Error }> {
  if (!user || userError) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from(pluralizeTable(table))
    .insert({ ...item, user_id: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { data, error };
}

export async function getItems<T extends Tables>(
  table: T,
): Promise<{ data: TableMap[T][] | null; error: PostgrestError | null | Error }> {
  if (!user || userError) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from(pluralizeTable(table))
    .select('*')
    .eq('user_id', user.id)
    .order(table === 'note' ? 'title' : 'name', { ascending: true });
  if (error) throw new Error(error.message);
  return { data, error };
}

export async function deleteItem<T extends Tables>(
  table: T,
  id: string,
): Promise<{ error: PostgrestError | null | Error }> {
  if (!user || userError) throw new Error('User not authenticated');
  const { error } = await supabase
    .from(pluralizeTable(table))
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  return { error };
}

export async function updateItem<T extends Tables>(
  table: T,
  item: TableMap[T],
): Promise<{ data: TableMap[T] | null; error: PostgrestError | null | Error }> {
  if (!user || userError) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from(pluralizeTable(table))
    .update(item)
    .eq('id', item.id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  return { data, error };
}
