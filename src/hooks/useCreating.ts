import { useCallback, useState } from 'react';

export default function useCreating() {
  const [isCreating, setIsCreating] = useState(false);
  const start = useCallback(() => setIsCreating(true), []);
  const cancel = useCallback(() => setIsCreating(false), []);
  const created = useCallback(() => setIsCreating(false), []);
  return { isCreating, start, cancel, created };
}
