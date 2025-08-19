'use client';
import React, { useState } from 'react';
import { Folders, Notes } from '@/types/supabase';
import { usePathname, useRouter } from 'next/navigation';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Modal from '@/components/ui/modal/modal';
import ModalTitle from '@/components/ui/modal/modal-title';
import ModalDescription from '../ui/modal/modal-description';
import Button from '@/components/ui/button';
import NoteInput from '@/components/sidebar/note-input';
import SkeletonList from '@/components/ui/skeleton-list';
import useCreating from '@/hooks/useCreating';
import useNotes from '@/hooks/useNotes';
import useFolders from '@/hooks/useFolders';
import { createFolder, createNote, deleteFolder, deleteNote } from '@/lib/notes';
import { useQueryClient } from '@tanstack/react-query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiFolder2Line } from 'react-icons/ri';
import { MdNotes } from 'react-icons/md';
import { isNotes } from '@/lib/utils';

type CreateKind = 'note' | 'folder';

interface NoteListProps {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
}

function NotesList({ noteCreation, folderCreation }: NoteListProps) {
  // Data
  const { data: notes, isLoading: notesLoading, error: notesError } = useNotes();
  const { data: folders, isLoading: foldersLoading, error: foldersError } = useFolders();

  // State
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Notes | Folders | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const handleNoteClick = (noteId: string) => {
    setSelectedId(noteId);
    router.push(`/home/${noteId}`);
  };

  const handleDeleteClick = (item: Folders | Notes) => {
    setDeleteTarget(item);
  };

  const creatingKind: CreateKind | null = noteCreation.isCreating
    ? 'note'
    : folderCreation.isCreating
      ? 'folder'
      : null;

  const submitCreate = async (item: Notes | Folders) => {
    const isNoteItem = isNotes(item);
    const entry = isNoteItem ? noteCreation : folderCreation;
    const titleOrName = isNoteItem ? item.title : item.name;
    if (!titleOrName) {
      entry.cancel();
      return;
    }
    setCreateLoading(true);
    try {
      if (isNoteItem) {
        const { data: note, error } = await createNote(item);
        if (error) throw error;
        if (note) await queryClient.invalidateQueries({ queryKey: ['notes'] });
      } else {
        const { data: folder, error } = await createFolder(item);
        if (error) throw error;
        if (folder) await queryClient.invalidateQueries({ queryKey: ['folders'] });
      }
      entry.created();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (notesLoading || foldersLoading) {
    return <SkeletonList count={7} />;
  }

  if (notesError || foldersError || error) {
    return (
      <p className="text-muted">
        {(notesError as Error)?.message ||
          (foldersError as Error)?.message ||
          error ||
          'An error occurred.'}
      </p>
    );
  }

  return (
    <div className="font-medium text-sm text-muted">
      <ul className="flex flex-col gap-1">
        {/* Folders */}
        {folders && folders.length > 0 && (
          <>
            {folders.map((folder, index) => (
              <li
                key={folder.id}
                tabIndex={index}
                onMouseEnter={() => setHoveredId(folder.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer
                  transition-all hover:font-bold hover:scale-102 truncate
                  flex justify-between items-center
                  ${selectedId === folder.id ? 'bg-muted/20 font-bold' : ''}
                `}
              >
                <div className="flex items-center">
                  <RiFolder2Line size={17} className={'mr-1.5'} />
                  <span>{folder.name}</span>
                </div>
                {hoveredId === folder.id && (
                  <RiDeleteBin6Line
                    size={15}
                    className="hover:text-error cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(folder);
                    }}
                  />
                )}
              </li>
            ))}
          </>
        )}

        {/* Notes */}
        {notes && notes.length > 0 && (
          <>
            {notes.map((note, index) => (
              <li
                tabIndex={index}
                key={note.id}
                onMouseEnter={() => setHoveredId(note.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleNoteClick(note.id)}
                className={`
                  hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer 
                  transition-all hover:font-bold hover:scale-102 truncate
                  flex justify-between items-center
                  ${selectedId === note.id ? 'bg-muted/20 font-bold' : ''}
                `}
              >
                <div className={'flex items-center'}>
                  <MdNotes size={17} className={'mr-1.5'} />
                  <span>{note.title}</span>
                </div>

                {hoveredId === note.id && (
                  <RiDeleteBin6Line
                    size={15}
                    className="hover:text-error cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(note);
                    }}
                  />
                )}
              </li>
            ))}
          </>
        )}

        {/* Create Note or Folder */}
        {(noteCreation.isCreating || folderCreation.isCreating) && (
          <li
            tabIndex={notes && notes.length > 0 ? notes.length : 0}
            className={`
              py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
              hover:bg-muted/10 hover:scale-102
              focus-within:ring-2 focus-within:ring-muted/50 focus-within:bg-muted/20 disabled:opacity-60
              flex justify-between items-center
              ${createLoading ? 'opacity-40 cursor-not-allowed' : ''}
             `}
          >
            <NoteInput
              disabled={createLoading}
              onSubmit={(input) =>
                creatingKind === 'note'
                  ? submitCreate({ title: input } as Notes)
                  : submitCreate({ name: input } as Folders)
              }
              onCancel={creatingKind === 'note' ? noteCreation.cancel : folderCreation.cancel}
            />
            <span>
              {createLoading && <AiOutlineLoading3Quarters size={13} className={'animate-spin'} />}
            </span>
          </li>
        )}

        {/* No notes */}
        {(!notes || notes.length === 0) &&
          (!folders || folders.length === 0) &&
          !noteCreation.isCreating &&
          !folderCreation.isCreating && <p>No notes found.</p>}
      </ul>

      {/* Delete modal */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)}>
          <ModalTitle>Delete Note</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete &quot;
            {deleteTarget && isNotes(deleteTarget) ? deleteTarget.title : deleteTarget.name}&quot;?
          </ModalDescription>
          <div className="flex justify-end gap-2">
            <Button
              className="bg-background border-1 hover:bg-muted/20 border-muted/50 py-1.5! flex gap-1 items-center text-foreground"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 hover:border-red-500 border-error py-1.5! flex gap-1 items-center text-white"
              onClick={async () => {
                if (isNotes(deleteTarget)) {
                  const { error } = await deleteNote(deleteTarget.id);
                  if (error) {
                    setError(error instanceof Error ? error.message : 'An error occurred.');
                    return;
                  }
                  await queryClient.invalidateQueries({ queryKey: ['notes'] });
                  if (pathname.endsWith(deleteTarget.id)) {
                    router.push('/home');
                  }
                } else {
                  const { error } = await deleteFolder(deleteTarget.id);
                  if (error) {
                    setError(error instanceof Error ? error.message : 'An error occurred.');
                    return;
                  }
                  await queryClient.invalidateQueries({ queryKey: ['folders'] });
                  // TODO - handle redirect to home page if the deleted folder contains the note currently being viewed
                }
                setDeleteTarget(null);
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
