import { Notes, Folders, CreateKind } from '@/types/types';
import { isNotes } from '@/lib/utils';
import { useCreateItem } from '@/hooks/mutators/useCreateItem';
import { useDeleteItem } from '@/hooks/mutators/useDeleteItem';
import { useUpdateItem } from '@/hooks/mutators/useUpdateItem';

export function useItemMutations() {
  // Mutations
  const { handleCreateItem, isCreating, error: createError } = useCreateItem();
  const { handleDeleteItem, error: deleteError } = useDeleteItem();
  const { handleUpdateItem, isUpdating, error: updateError } = useUpdateItem();

  // Handlers
  const submitCreate = async (item: Notes | Folders, createKind: Exclude<CreateKind, null>) => {
    return await handleCreateItem(createKind, item);
  };

  const submitDelete = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'note' : 'folder';
    return await handleDeleteItem(type, item);
  };

  const submitUpdate = async (item: Notes | Folders) => {
    const type = isNotes(item) ? 'note' : 'folder';
    return await handleUpdateItem(type, item);
  };

  const globalError = createError || deleteError || updateError;
  const loading = isCreating || isUpdating;

  return {
    submitCreate,
    submitDelete,
    submitUpdate,
    loading,
    error: globalError,
  };
}
