'use client';
import React, { useEffect, useState } from 'react';
import { Notes } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { createNote, deleteNote, getUserNotes } from '@/lib/notes';
import SkeletonList from '@/components/ui/skeleton-list';
import { useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Modal from '@/components/ui/modal/modal';
import ModalTitle from '@/components/ui/modal/modal-title';
import ModalDescription from '../ui/modal/modal-description';
import Button from '@/components/ui/button';

interface NoteListProps {
  isCreating: boolean;
  handleCancelCreate: () => void;
  handleCreated: () => void;
}

function NotesList({ isCreating, handleCancelCreate, handleCreated }: NoteListProps) {
  const [notes, setNotes] = useState<Notes[] | null>(null);
  const [error, setError] = useState<string | PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [tempNoteTitle, setTempNoteTitle] = useState<string>('');
  const [createLoading, setCreateLoading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<Notes | null>(null);

  const router = useRouter();

  // Fetch user notes when the component mounts
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getUserNotes();
        setNotes(data);
        if (error) throw error;
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : 'An error occurred while fetching notes.',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isCreating) {
      setTempNoteTitle('');
      inputRef.current?.focus();
    }
  }, [isCreating]);

  const submitCreate = async () => {
    const title = tempNoteTitle.trim();
    if (!title) {
      handleCancelCreate();
      return;
    }
    setCreateLoading(true);
    try {
      const { data, error } = await createNote({ title } as Notes);
      if (error) throw error;
      if (data) {
        setNotes((prev) => (prev ? [data, ...prev] : [data]));
        setSelectedNote(data.id);
        router.push(`/home/${data.id}`);
      }
      handleCreated();
    } catch (error: unknown) {
      console.log(error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating notes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await submitCreate();
    } else if (e.key === 'Escape') {
      handleCreated();
    }
  };

  return (
    <div className={'font-medium text-sm text-muted'}>
      {isLoading ? (
        <SkeletonList count={7} />
      ) : error ? (
        <p className={'text-muted'}>{error as string}</p>
      ) : notes && notes.length > 0 ? (
        <ul className={'flex flex-col gap-1'}>
          {notes.map((note) => (
            <li
              onMouseEnter={() => setHoveredNoteId(note.id)}
              onMouseLeave={() => setHoveredNoteId(null)}
              key={note.id}
              className={`
                hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer 
                transition-all hover:font-bold hover:scale-102 truncate
                flex justify-between items-center
                ${selectedNote === note.id ? 'bg-muted/20 font-bold' : ''}
                `}
              onClick={() => {
                setSelectedNote(note.id);
                router.push(`/home/${note.id}`);
              }}
            >
              <span>{note.title}</span>
              {hoveredNoteId === note.id && (
                <RiDeleteBin6Line
                  size={15}
                  className={'hover:text-error cursor-pointer'}
                  onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                    setNoteToDelete(note);
                  }}
                />
              )}
            </li>
          ))}
          {isCreating && (
            <li
              className="
                py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
                hover:bg-muted/20 hover:scale-102
                focus-within:ring-2 focus-within:ring-muted focus-within:bg-muted/20 disabled:opacity-60
              "
            >
              <input
                type="text"
                className="
                  w-full block bg-transparent outline-none
                  text-sm placeholder:text-muted
                "
                ref={inputRef}
                value={tempNoteTitle}
                onChange={(e) => setTempNoteTitle(e.target.value)}
                disabled={createLoading}
                onKeyDown={handleKeyDown}
                onBlur={async () => {
                  if (!tempNoteTitle.trim()) handleCancelCreate();
                  else await submitCreate();
                }}
              />
            </li>
          )}
        </ul>
      ) : (
        <>
          <ul>
            {isCreating ? (
              <li
                className="
                py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
                hover:bg-muted/20 hover:scale-102
                focus-within:ring-2 focus-within:ring-muted focus-within:bg-muted/20 disabled:opacity-60
              "
              >
                <input
                  type="text"
                  className="
                  w-full block bg-transparent outline-none
                  text-sm placeholder:text-muted
                "
                  ref={inputRef}
                  value={tempNoteTitle}
                  onChange={(e) => setTempNoteTitle(e.target.value)}
                  disabled={createLoading}
                  onKeyDown={handleKeyDown}
                  onBlur={async () => {
                    if (!tempNoteTitle.trim()) handleCancelCreate();
                    else await submitCreate();
                  }}
                />
              </li>
            ) : (
              <p>No notes found.</p>
            )}
          </ul>
        </>
      )}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <ModalTitle>Delete Note</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete "{noteToDelete?.title}"?
          </ModalDescription>
          <div className={'flex justify-end gap-2'}>
            <Button
              className={
                'bg-background border-1 hover:bg-muted/20 border-muted/50 py-1.5! flex gap-1 items-center text-foreground'
              }
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className={
                'bg-red-500 hover:bg-red-600 hover:border-red-500 border-error py-1.5! flex gap-1 items-center text-white'
              }
              onClick={async () => {
                const { error: delErr } = await deleteNote(noteToDelete!.id);
                if (delErr) {
                  setError(delErr);
                  return;
                }
                const { data, error: noteErr } = await getUserNotes();
                if (noteErr) {
                  setError(noteErr);
                  return;
                }
                if (data) {
                  setNotes(data);
                  setShowDeleteModal(false);
                }
              }}
            >
              <RiDeleteBin6Line />
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default NotesList;
