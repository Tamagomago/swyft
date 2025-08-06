'use client';

import React from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list';
import { useSidebarStore } from '@/store/sidebar';

interface SidebarProps {
  className?: string;
}

function Sidebar({ className }: SidebarProps) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={`
        ${className}
        flex flex-col gap-5 h-full w-full
        pt-25 px-10 bg-sidebar-background
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <Controls />
      <NotesList />
    </div>
  );
}

export default Sidebar;
