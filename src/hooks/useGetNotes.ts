import { getUserNotes } from '@/lib/notes';
import { useQuery } from '@tanstack/react-query';

export default function useGetNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await getUserNotes();
      if (error)
        throw new Error(
          error instanceof Error ? error.message : 'An error occurred while fetching notes.',
        );
      return data;
    },
  });
}
