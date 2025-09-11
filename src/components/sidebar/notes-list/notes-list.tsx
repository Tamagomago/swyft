'use client';
import React, { useState } from 'react';
import { CreateKind, Folders, Notes } from '@/types/types';
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
import { createItem, deleteItem, updateItem } from '@/lib/notes';
import { useUpdateItem } from '@/hooks/useUpdateItem';

interface NoteListProps {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
}

function NotesList({ noteCreation, folderCreation }: NoteListProps) {
  // Hooks
  const { handleCreateItem, isCreating, error: createError } = useCreateItem();
  const { handleDeleteItem, error: deleteError } = useDeleteItem();
  const { handleUpdateItem, isUpdating, error: updateError } = useUpdateItem();

  // Data
  const { data: notes, isLoading: notesLoading, error: notesError } = useGetItems('notes');
  const { data: folders, isLoading: foldersLoading, error: foldersError } = useGetItems('folders');

  // Filtered data
  const topLevelNotes = notes?.filter((n) => !n.folder_id) || [];
  const folderNotesMap =
    notes?.reduce<Record<string, Notes[]>>((acc, note) => {
      if (note.folder_id) {
        acc[note.folder_id] = acc[note.folder_id] || [];
        acc[note.folder_id].push(note);
      }
      return acc;
    }, {}) || {};

  // State
  const [deleteTarget, setDeleteTarget] = useState<Notes | Folders | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Context
  const creatingKind: CreateKind | null = noteCreation.isCreating
    ? 'note'
    : folderCreation.isCreating
      ? 'folder'
      : null;
  const globalError = deleteError || createError || notesError || foldersError || updateError;

  // Handlers
  const submitCreate = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    const creation = isNotes(item) ? noteCreation : folderCreation;
    return await handleCreateItem(type, item, createItem, creation, type);
  };

  const submitDelete = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    return await handleDeleteItem(type, item, deleteItem, type, () => setDeleteTarget(null));
  };

  const submitUpdate = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    return await handleUpdateItem(type, item, updateItem, type);
  };

  // Early exits
  if (notesLoading || foldersLoading) return <SkeletonList count={7} />;
  if (globalError) return <p className="text-muted">An error occurred.</p>;

  // Common props
  const commonProps = {
    hoveredId,
    setHoveredId,
    onDelete: setDeleteTarget,
    isUpdating,
  };

  return (
    <div className="font-medium text-sm text-muted w-full h-full overflow-y-auto overflow-x-visible">
      <ul className="flex flex-col gap-1">
        {/* Folders */}
        {folders?.map((folder, index) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            notes={folderNotesMap[folder.id] || []}
            index={index}
            onRename={(T: Notes | Folders) => submitUpdate(T)}
            {...commonProps}
          />
        ))}

        {/* Notes */}
        {topLevelNotes?.map((note, index) => (
          <NoteItem
            key={note.id}
            note={note}
            index={index}
            onRename={(N: Notes) => submitUpdate(N)}
            {...commonProps}
          />
        ))}

        {/* Create Note/Folder */}
        {creatingKind && (
          <ItemEntry
            disabled={isCreating}
            kind={creatingKind}
            onSubmit={submitCreate}
            onCancel={creatingKind === 'note' ? noteCreation.cancel : folderCreation.cancel}
          />
        )}

        {/* Empty state */}
        {!notes?.length && !folders?.length && !creatingKind && <p>No notes found.</p>}
      </ul>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={submitDelete}
        />
      )}
    </div>
  );
}

export default NotesList;
