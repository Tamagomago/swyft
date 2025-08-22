import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getItems } from '@/lib/notes';
import { TableMap, Tables } from '@/types/types';

export default function useGetItems<T extends Tables>(
  table: T,
): UseQueryResult<TableMap[T][], Error> {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await getItems(table);
      if (error)
        throw new Error(error ? error.message : `An error occurred while fetching ${table}.`);
      return data ?? [];
    },
  });
}
