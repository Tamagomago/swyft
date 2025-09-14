import React, { useRef } from 'react';
import { useContextMenu } from '@/hooks/context-menu/useContextMenu';

export function useContextMenuWithLongPress<T>() {
  const { openMenu, menu, closeMenu } = useContextMenu<T>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent, item: T) => {
    timerRef.current = setTimeout(() => {
      openMenu(e, item);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return { openMenu, menu, closeMenu, handleTouchStart, handleTouchEnd };
}
