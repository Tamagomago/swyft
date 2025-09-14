import { Notes, Folders, CreateKind } from '@/types/types';
import { isNotes } from '@/lib/utils';
import { createItem, deleteItem, updateItem } from '@/lib/notes';
import { useCreateItem } from '@/hooks/mutators/useCreateItem';
import { useDeleteItem } from '@/hooks/mutators/useDeleteItem';
import { useUpdateItem } from '@/hooks/mutators/useUpdateItem';
import useCreating from '@/hooks/useCreating';

interface UseItemMutationsOptions {
  noteCreation: ReturnType<typeof useCreating>;
  folderCreation: ReturnType<typeof useCreating>;
  onDeleteFinished?: () => void; // Optional callback
}

export function useItemMutations({
  noteCreation,
  folderCreation,
  onDeleteFinished,
}: UseItemMutationsOptions) {
  // Mutations
  const { handleCreateItem, isCreating, error: createError } = useCreateItem();
  const { handleDeleteItem, error: deleteError } = useDeleteItem();
  const { handleUpdateItem, isUpdating, error: updateError } = useUpdateItem();

  // Handlers
  const submitCreate = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    const creation = isNotes(item) ? noteCreation : folderCreation;
    return await handleCreateItem(type, item, createItem, creation, type);
  };

  const submitDelete = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    return await handleDeleteItem(type, item, deleteItem, type, onDeleteFinished);
  };

  const submitUpdate = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'notes' : 'folders';
    return await handleUpdateItem(type, item, updateItem, type);
  };

  const globalError = createError || deleteError || updateError;

  return {
    submitCreate,
    submitDelete,
    submitUpdate,
    isCreating,
    isUpdating,
    error: globalError,
  };
}
