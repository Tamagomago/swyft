'use client';
import React, { useState } from 'react';
import { CreateKind, Folders, Notes } from '@/types/types';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/components/ui/skeleton-list';
import useCreating from '@/hooks/useCreating';
import useGetNotes from '@/hooks/useGetNotes';
import useGetFolders from '@/hooks/useGetFolders';
import { createFolder, createNote, deleteFolder, deleteNote } from '@/lib/notes';
import { isNotes } from '@/lib/utils';
import NoteItem from '@/components/sidebar/notes-list/note-item';
import FolderItem from '@/components/sidebar/notes-list/folder-item';
import CreateItem from '@/components/sidebar/notes-list/create-item';
import DeleteModal from '@/components/sidebar/notes-list/delete-modal';
import { useItemCreate } from '@/hooks/useCreateItem';
import { useItemDelete } from '@/hooks/useDeleteItem';

interface NoteListProps {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
}

function NotesList({ noteCreation, folderCreation }: NoteListProps) {
  // Hooks
  const { createItem, isCreating, error: createError } = useItemCreate();
  const { deleteItem, error: deleteError } = useItemDelete();

  // Data
  const { data: notes, isLoading: notesLoading, error: notesError } = useGetNotes();
  const { data: folders, isLoading: foldersLoading, error: foldersError } = useGetFolders();

  // State
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Notes | Folders | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Router
  const router = useRouter();

  // Handlers
  const handleNoteClick = (noteId: string) => {
    setSelectedId(noteId);
    router.push(`/home/${noteId}`);
  };
  const handleDeleteClick = (item: Folders | Notes) => {
    setDeleteTarget(item);
  };

  // Context
  const creatingKind: CreateKind | null = noteCreation.isCreating
    ? 'note'
    : folderCreation.isCreating
      ? 'folder'
      : null;

  const globalError = deleteError || createError || notesError || foldersError;

  const submitCreate = async (item: Notes | Folders) => {
    if (isNotes(item)) {
      return createItem(item, createNote, 'notes', noteCreation, 'note');
    }
    return createItem(item, createFolder, 'folders', folderCreation, 'folder');
  };

  const confirmDelete = async (item: Notes | Folders) => {
    if (isNotes(item)) {
      return deleteItem(item, deleteNote, 'notes', 'note', () => setDeleteTarget(null));
    }
    return deleteItem(item, deleteFolder, 'folders', 'folder', () => setDeleteTarget(null));
  };

  if (notesLoading || foldersLoading) {
    return <SkeletonList count={7} />;
  }

  if (globalError) {
    return <p className="text-muted">An error occurred.</p>;
  }

  return (
    <div className="font-medium text-sm text-muted">
      <ul className="flex flex-col gap-1">
        {/* Folders */}
        {folders &&
          folders.length > 0 &&
          folders.map((folder, index) => (
            <FolderItem
              folder={folder}
              index={index}
              selectedId={selectedId}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onDelete={handleDeleteClick}
            />
          ))}

        {/* Notes */}
        {notes &&
          notes.length > 0 &&
          notes.map((note, index) => (
            <NoteItem
              key={note.id}
              index={index}
              note={note}
              selectedId={selectedId}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onClick={handleNoteClick}
              onDelete={handleDeleteClick}
            />
          ))}

        {/* Create Note or Folder */}
        {(noteCreation.isCreating || folderCreation.isCreating) && (
          <CreateItem
            disabled={isCreating}
            kind={creatingKind!}
            onSubmit={submitCreate}
            onCancel={creatingKind === 'note' ? noteCreation.cancel : folderCreation.cancel}
          />
        )}

        {/* No notes */}
        {(!notes || notes.length === 0) &&
          (!folders || folders.length === 0) &&
          !noteCreation.isCreating &&
          !folderCreation.isCreating && <p>No notes found.</p>}
      </ul>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default NotesList;
