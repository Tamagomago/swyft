'use client';

import React, { useCallback, useEffect } from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list';
import { useSidebarStore } from '@/store/sidebar';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen, close } = useSidebarStore();
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = React.useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) setIsCreating(false);
  }, [isOpen]);

  const handleStartCreate = useCallback(() => {
    setIsCreating(true);
  }, [setIsCreating]);

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
  }, [setIsCreating]);

  const handleCreated = useCallback(() => {
    setIsCreating(false);
  }, [setIsCreating]);

  useEffect(() => {
    console.log('from sidebar', isOpen);
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
      <Controls onAddNote={() => handleStartCreate()} />
      <NotesList
        isCreating={isCreating}
        handleCancelCreate={handleCancelCreate}
        handleCreated={handleCreated}
      />
    </div>
  );
}

export default Sidebar;
