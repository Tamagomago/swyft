'use client';
import React, { useEffect, useState } from 'react';
import { Notes } from '../../../types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { getUserNotes } from '@/lib/notes';
import SkeletonList from '@/components/ui/skeleton-list';
import { useRouter } from 'next/navigation';

function NotesList() {
  const [data, setData] = useState<Notes[] | null>(null);
  const [error, setError] = useState<string | PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<string>('');
  const router = useRouter();

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
    <div className={'font-medium text-sm text-muted'}>
      {isLoading ? (
        <SkeletonList count={7} />
      ) : error ? (
        <p className={'text-muted'}>{error as string}</p>
      ) : data && data.length > 0 ? (
        <ul>
          {data.map((note) => (
            <li
              key={note.id}
              className={`
                hover:bg-muted/20 py-1 px-1.5 rounded-md cursor-pointer 
                transition-all hover:font-bold hover:scale-102 truncate
                ${selectedNote === note.id ? 'bg-muted/20 font-bold' : ''}
                `}
              onClick={() => {
                setSelectedNote(note.id);
                router.push(`/home/${note.id}`);
              }}
            >
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
