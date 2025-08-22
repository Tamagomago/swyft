'use client';
import React, { useState } from 'react';
import { CreateKind, Folders, Notes } from '@/types/types';
import { useRouter } from 'next/navigation';
import SkeletonList from '@/components/ui/skeleton-list';
import useCreating from '@/hooks/useCreating';
import useGetItems from '@/hooks/useGetItems';
import { isNotes } from '@/lib/utils';
import NoteItem from '@/components/sidebar/notes-list/note-item';
import FolderItem from '@/components/sidebar/notes-list/folder-item';
import ItemEntry from '@/components/sidebar/notes-list/item-entry';
import DeleteModal from '@/components/sidebar/notes-list/delete-modal';
import { useCreateItem } from '@/hooks/useCreateItem';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import { createItem, deleteItem } from '@/lib/notes';

interface NoteListProps {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
}

function NotesList({ noteCreation, folderCreation }: NoteListProps) {
  // Hooks
  const { handleCreateItem, isCreating, error: createError } = useCreateItem();
  const { handleDeleteItem, error: deleteError } = useDeleteItem();

  // Data
  const { data: notes, isLoading: notesLoading, error: notesError } = useGetItems('notes');
  const { data: folders, isLoading: foldersLoading, error: foldersError } = useGetItems('folders');

  // Filtered Data
  const topLevelNotes = notes?.filter((note) => !note.folder_id) || [];
  const folderNotes = notes?.filter((note) => note.folder_id) || [];

  // State
  const [deleteTarget, setDeleteTarget] = useState<Notes | Folders | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Router
  const router = useRouter();

  // Handlers
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
      return handleCreateItem('notes', item, createItem, noteCreation, 'notes');
    }
    return handleCreateItem('folders', item, createItem, folderCreation, 'folders');
  };

  const confirmDelete = async (item: Notes | Folders) => {
    if (isNotes(item)) {
      return handleDeleteItem('notes', item, deleteItem, 'notes', () => setDeleteTarget(null));
    }
    return handleDeleteItem('folders', item, deleteItem, 'folders', () => setDeleteTarget(null));
  };

  if (notesLoading || foldersLoading) {
    return <SkeletonList count={7} />;
  }

  if (globalError) {
    return <p className="text-muted">An error occurred.</p>;
  }

  return (
    <div className="font-medium text-sm text-muted w-full h-full overflow-y-auto">
      <ul className="flex flex-col gap-1">
        {/* Folders */}
        {folders &&
          folders.length > 0 &&
          folders.map((folder, index) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={folderNotes.filter((note) => note.folder_id === folder.id)}
              index={index}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onDelete={handleDeleteClick}
            />
          ))}

        {/* Notes */}
        {topLevelNotes &&
          topLevelNotes.length > 0 &&
          topLevelNotes.map((note, index) => (
            <NoteItem
              key={note.id}
              index={index}
              note={note}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              onDelete={handleDeleteClick}
            />
          ))}

        {/* Create Note or Folder */}
        {(noteCreation.isCreating || folderCreation.isCreating) && (
          <ItemEntry
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
