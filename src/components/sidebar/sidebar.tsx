'use client';

import React, { useCallback, useEffect } from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list';
import { useSidebarStore } from '@/store/sidebar';
import useCreating from '@/hooks/useCreating';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen, close } = useSidebarStore();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const noteCreation = useCreating();
  const folderCreation = useCreating();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key.toLowerCase() === 'k') ||
        (e.metaKey && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        noteCreation.start();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      noteCreation.cancel();
      folderCreation.cancel();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && isOpen) {
        close();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  return (
    <div
      className={`
        ${className}
        flex flex-col gap-5 h-full w-[80%]
        pt-25 px-10 bg-sidebar-background
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0 z-3' : '-translate-x-full md:translate-x-0'}
      `}
      ref={sidebarRef}
    >
      <Controls onAddNote={() => noteCreation.start} onAddFolder={folderCreation.start} />
      <NotesList noteCreation={noteCreation} folderCreation={folderCreation} />
    </div>
  );
}

export default Sidebar;
