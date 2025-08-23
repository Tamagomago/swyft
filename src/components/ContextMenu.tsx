import React, { useEffect, useRef } from 'react';
import { IconType } from 'react-icons';
interface ContextMenuProps {
  x: number;
  y: number;
  items: {
    icon?: IconType;
    name: string;
    action: () => void;
  }[];
  onClose: () => void;
}
function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  return (
    <div
      className={
        'absolute shadow-lg rounded-md z-50 py-1.5 px-1 text-sm bg-sidebar-background border-2 border-border'
      }
      style={{ top: y, left: x }}
      onClick={onClose}
      ref={ref}
    >
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className={
              'px-3 py-2 hover:bg-muted/20 cursor-pointer flex items-center gap-2 text-muted rounded-sm transition-all duration-300 ease-in-out select-none'
            }
            onClick={item.action}
          >
            {item.icon && <item.icon size={15} />}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
