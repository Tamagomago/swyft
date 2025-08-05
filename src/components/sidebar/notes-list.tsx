'use client';
import React, { useEffect, useState } from 'react';
import { Notes } from '../../../types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { getUserNotes } from '@/lib/notes';

function NotesList() {
  const [data, setData] = useState<Notes[] | null>(null);
  const [error, setError] = useState<string | PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getUserNotes();
        if (error) throw error;
        setData(data);
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : 'An error occurred while fetching notes.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [data]);
  return (
    <div className={'text-foreground'}>
      {isLoading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p className={'text-error'}>{error as string}</p>
      ) : data && data.length > 0 ? (
        <ul>
          {data.map((note) => (
            <li key={note.id} className={'mb-2'}>
              {note.title}: {note.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

export default NotesList;
