import { useQuery } from '@tanstack/react-query';
import { getUserFolders } from '@/lib/notes';

export default function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data, error } = await getUserFolders();
      if (error)
        throw new Error(
          error instanceof Error ? error.message : 'An error occurred while fetching folders.',
        );
      return data;
    },
  });
}
