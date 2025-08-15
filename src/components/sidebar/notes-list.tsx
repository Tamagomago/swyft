'use client';
import React, { useEffect, useState } from 'react';
import { Notes } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { createNote, deleteNote, getUserNotes } from '@/lib/notes';
import SkeletonList from '@/components/ui/skeleton-list';
import { usePathname, useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Modal from '@/components/ui/modal/modal';
import ModalTitle from '@/components/ui/modal/modal-title';
import ModalDescription from '../ui/modal/modal-description';
import Button from '@/components/ui/button';
import NoteInput from '@/components/sidebar/note-input';

interface NoteListProps {
  isCreating: boolean;
  handleCancelCreate: () => void;
  handleCreated: () => void;
}

function NotesList({ isCreating, handleCancelCreate, handleCreated }: NoteListProps) {
  // Data
  const [notes, setNotes] = useState<Notes[] | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<Notes | null>(null);

  // UI
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  // Form
  const [tempNoteTitle, setTempNoteTitle] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Error
  const [error, setError] = useState<string | PostgrestError | null>(null);

  // Router
  const router = useRouter();
  const pathname = usePathname();

  // Handlers
  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    router.push(`/home/${noteId}`);
  };
  const handleDeleteClick = (note: Notes) => {
    setDeleteTargetId(note);
  };

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
      const { data: note, error } = await createNote({ title } as Notes);
      if (error) throw error;
      if (note) {
        setNotes((prev) => (prev ? [note, ...prev] : [note]));
        handleNoteClick(note.id);
      }
      handleCreated();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred while creating notes.');
    } finally {
      setCreateLoading(false);
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
          {notes.map((note, index) => (
            <li
              tabIndex={index}
              onMouseEnter={() => setHoveredNoteId(note.id)}
              onMouseLeave={() => setHoveredNoteId(null)}
              key={note.id}
              className={`
                hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer 
                transition-all hover:font-bold hover:scale-102 truncate
                flex justify-between items-center
                ${selectedNoteId === note.id ? 'bg-muted/20 font-bold' : ''}
                `}
              onClick={() => {
                handleNoteClick(note.id);
              }}
            >
              <span>{note.title}</span>
              {hoveredNoteId === note.id && (
                <RiDeleteBin6Line
                  size={15}
                  className={'hover:text-error cursor-pointer'}
                  onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                    e.stopPropagation();
                    handleDeleteClick(note);
                  }}
                />
              )}
            </li>
          ))}
          {isCreating && (
            <li
              tabIndex={notes.length}
              className="
                py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
                hover:bg-muted/10 hover:scale-102
                focus-within:ring-2 focus-within:ring-muted/50 focus-within:bg-muted/20 disabled:opacity-60
              "
            >
              <NoteInput
                disabled={createLoading}
                onSubmit={submitCreate}
                onCancel={handleCancelCreate}
              />
            </li>
          )}
        </ul>
      ) : (
        <>
          <ul>
            {isCreating ? (
              <li
                tabIndex={0}
                className="
                py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
                hover:bg-muted/20 hover:scale-102
                focus-within:ring-2 focus-within:ring-muted focus-within:bg-muted/20 disabled:opacity-60
              "
              >
                <NoteInput
                  disabled={createLoading}
                  onSubmit={submitCreate}
                  onCancel={handleCancelCreate}
                />
              </li>
            ) : (
              <p>No notes found.</p>
            )}
          </ul>
        </>
      )}
      {deleteTargetId && (
        <Modal isOpen onClose={() => setDeleteTargetId(null)}>
          <ModalTitle>Delete Note</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete "{deleteTargetId?.title}"?
          </ModalDescription>
          <div className={'flex justify-end gap-2'}>
            <Button
              className={
                'bg-background border-1 hover:bg-muted/20 border-muted/50 py-1.5! flex gap-1 items-center text-foreground'
              }
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </Button>
            <Button
              className={
                'bg-red-500 hover:bg-red-600 hover:border-red-500 border-error py-1.5! flex gap-1 items-center text-white'
              }
              onClick={async () => {
                const { error } = await deleteNote(deleteTargetId!.id);
                if (error) {
                  setError(error);
                  return;
                }
                setNotes((prev) => prev?.filter((n) => n.id !== deleteTargetId!.id) ?? null);
                setDeleteTargetId(null);
                if (pathname.endsWith(deleteTargetId!.id)) {
                  router.push('/home');
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
