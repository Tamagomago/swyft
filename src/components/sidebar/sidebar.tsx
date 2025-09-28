'use client';

import React, { useEffect } from 'react';
import Controls from '@/components/sidebar/controls';
import ItemsList from '@/components/sidebar/items-list/items-list';
import { useSidebarStore } from '@/store/sidebar';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen, close, startCreate, cancelCreate } = useSidebarStore();
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  const queryClient = React.useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key.toLowerCase() === 'k') ||
        (e.metaKey && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        startCreate('note');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cancelCreate();
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
    <QueryClientProvider client={queryClient}>
      <div
        className={`
          ${className}
          flex flex-col gap-5 h-full w-[80%] max-w-[350px] z-3 md:w-[40%] lg:w-full lg:max-w-full
          pt-10 px-10 bg-sidebar-background
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        ref={sidebarRef}
      >
        <Controls onAddNote={() => startCreate('note')} onAddFolder={() => startCreate('folder')} />
        <ItemsList />
      </div>
    </QueryClientProvider>
  );
}

export default Sidebar;
