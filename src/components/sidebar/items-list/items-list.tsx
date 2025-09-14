'use client';
import React, { useState } from 'react';
import { CreateKind, Folders, Notes } from '@/types/types';
import SkeletonList from '@/components/ui/skeleton-list';
import useCreating from '@/hooks/useCreating';

import NoteItem from '@/components/sidebar/items-list/items/note-item';
import FolderItem from '@/components/sidebar/items-list/items/folder-item';
import ItemEntry from '@/components/sidebar/items-list/input/item-entry';
import DeleteModal from '@/components/sidebar/items-list/delete-modal';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { MdNotes } from 'react-icons/md';
import { useNotesAndFolders } from '@/hooks/items-list/useNotesAndFolders';
import { useItemMutations } from '@/hooks/items-list/useItemMutations';
import { useDnd } from '@/hooks/items-list/useDnd';

interface NoteListProps {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
}

function ItemsList({ noteCreation, folderCreation }: NoteListProps) {
  const {
    submitCreate,
    submitDelete,
    submitUpdate,
    isCreating,
    isUpdating,
    error: mutationError,
  } = useItemMutations({
    noteCreation,
    folderCreation,
    onDeleteFinished: () => {
      setDeleteTarget(null);
    },
  });

  const {
    notes,
    folders,
    rootNotes,
    notesInFolders,
    loading,
    error: fetchError,
  } = useNotesAndFolders();

  const { activeNote, mouseSensor, handleDragStart, handleDragEnd } = useDnd(submitUpdate);

  const globalError = mutationError || fetchError;

  // State
  const [deleteTarget, setDeleteTarget] = useState<Notes | Folders | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Context
  const creatingKind: CreateKind | null = noteCreation.isCreating
    ? 'note'
    : folderCreation.isCreating
      ? 'folder'
      : null;

  // Common props
  const commonProps = {
    hoveredId,
    setHoveredId,
    onDelete: setDeleteTarget,
    isUpdating,
  };

  // Early exits
  if (loading) return <SkeletonList count={7} />;
  if (globalError) return <p className="text-muted">An error occurred.</p>;

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor]} onDragStart={handleDragStart}>
      <div className="font-medium text-sm text-muted w-full h-full overflow-x-visible">
        <ul className="flex flex-col gap-1">
          {/* Folders */}
          {folders?.map((folder, index) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              notes={notesInFolders[folder.id] || []}
              index={index}
              onRename={(T: Notes | Folders) => submitUpdate(T)}
              {...commonProps}
            />
          ))}

          {/* Notes */}
          {rootNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onRename={(N: Notes) => submitUpdate(N)}
              {...commonProps}
            />
          ))}

          {/* Drag Overlay */}
          <DragOverlay>
            {activeNote ? (
              <div className="flex items-center gap-2 px-2 py-1 rounded-md text-foreground">
                <MdNotes size={17} />
                <span className="truncate text-foreground">{activeNote.title}</span>
              </div>
            ) : null}
          </DragOverlay>

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
    </DndContext>
  );
}

export default ItemsList;
