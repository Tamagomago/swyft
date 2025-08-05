import { createClient } from '@/utils/supabase/client';
import { Notes } from '../../types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export async function getUserNotes(): Promise<{
  data: Notes[] | null;
  error: PostgrestError | null | string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id);

  return { data, error };
}
