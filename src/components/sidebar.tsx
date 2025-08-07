'use client';

import React, { useEffect } from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list';
import { useSidebarStore } from '@/store/sidebar';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen, close } = useSidebarStore();
  let sidebarRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('from sidebar', isOpen);
    let handler = (e: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && isOpen) {
        close();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);
  return (
    <div
      className={`
        ${className}
        flex flex-col gap-5 h-full w-[80%]
        pt-25 px-10 bg-sidebar-background
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      ref={sidebarRef}
    >
      <Controls />
      <NotesList />
    </div>
  );
}

export default Sidebar;
