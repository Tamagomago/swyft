import React, { useState } from 'react';
export function useContextMenu<T>() {
  const [menu, setMenu] = useState<{ x: number; y: number; item: T } | null>(null);
  const openMenu = (e: React.MouseEvent | React.TouchEvent, item: T) => {
    e.preventDefault();

    let x = 0,
      y = 0;

    if ('clientX' in e) {
      x = e.clientX;
      y = e.clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    setMenu({ x, y, item });
  };

  const closeMenu = () => {
    setMenu(null);
  };
  return { menu, openMenu, closeMenu };
}
