import { createClient } from '@/utils/supabase/client';
import { Notes } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

export async function getUserNotes(): Promise<{
  data: Notes[] | null;
  error: PostgrestError | null | string;
}> {
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id);

  return { data, error };
}

export async function createNote({
  title,
  content = '',
}: Notes): Promise<{ data: Notes; error: PostgrestError | string | null }> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ title, content, user_id: user?.id })
    .select()
    .single();
  return { data, error };
}

export async function deleteNote(id: string): Promise<{ error: PostgrestError | string | null }> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  return { error };
}
