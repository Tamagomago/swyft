'use client';

import React, { useEffect } from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list/notes-list';
import { useSidebarStore } from '@/store/sidebar';
import useCreating from '@/hooks/useCreating';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen, close } = useSidebarStore();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const noteCreation = useCreating();
  const folderCreation = useCreating();

  const queryClient = React.useMemo(() => new QueryClient(), []);

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
  }, [noteCreation]);

  useEffect(() => {
    if (!isOpen) {
      noteCreation.cancel();
      folderCreation.cancel();
    }
  }, [isOpen, noteCreation.cancel, folderCreation.cancel]);

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
    <QueryClientProvider client={queryClient}>
      <div
        className={`
          ${className}
          flex flex-col gap-5 h-full w-[80%] z-3 max-w-xs
          pt-10 px-10 bg-sidebar-background
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        ref={sidebarRef}
      >
        <Controls onAddNote={noteCreation.start} onAddFolder={folderCreation.start} />
        <NotesList noteCreation={noteCreation} folderCreation={folderCreation} />
      </div>
    </QueryClientProvider>
  );
}

export default Sidebar;
