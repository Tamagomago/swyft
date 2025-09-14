import { Notes } from '@/types/types';
import useGetItems from '@/hooks/useGetItems';

export function useNotesAndFolders() {
  const { data: notes, isLoading: notesLoading, error: notesError } = useGetItems('notes');

  const { data: folders, isLoading: foldersLoading, error: foldersError } = useGetItems('folders');

  const rootNotes = notes?.filter((n) => !n.folder_id) || [];

  const notesInFolders =
    notes?.reduce<Record<string, Notes[]>>((acc, note) => {
      if (note.folder_id) {
        acc[note.folder_id] = acc[note.folder_id] || [];
        acc[note.folder_id].push(note);
      }
      return acc;
    }, {}) || {};

  const loading = notesLoading || foldersLoading;
  const error = notesError || foldersError;

  return {
    notes: notes || [],
    folders: folders || [],
    rootNotes,
    notesInFolders,
    loading,
    error,
  };
}
