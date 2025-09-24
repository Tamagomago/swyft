import { useState } from 'react';
import { Notes } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { DragEndEvent, DragStartEvent, MouseSensor, useSensor } from '@dnd-kit/core';

export function useDnd(submitUpdate: (item: Notes) => Promise<void>) {
  const queryClient = useQueryClient();
  const [activeNote, setActiveNote] = useState<Notes | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.note) {
      setActiveNote(event.active.data.current.note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const prevNotes = queryClient.getQueryData<Notes[]>(['note']);

    if (!active?.id || !prevNotes) return;

    const noteId = active.id as string;
    const folderId = over?.id ? (over.id as string) : null;

    const noteToUpdate = active.data.current?.note;
    if (!noteToUpdate) return;
    if (noteToUpdate.folder_id === folderId) return;

    const updatedNote = { ...noteToUpdate, folder_id: folderId };

    // Optimistic update
    queryClient.setQueryData<Notes[]>(
      ['note'],
      (old) => old?.map((n) => (n.id === noteId ? updatedNote : n)) ?? [],
    );

    submitUpdate(updatedNote).catch(() => {
      // Rollback if the update fails
      queryClient.setQueryData(['note'], prevNotes);
    });

    setActiveNote(null);
  };

  return {
    activeNote,
    mouseSensor,
    handleDragStart,
    handleDragEnd,
  };
}
