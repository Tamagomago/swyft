'use client';
import { useSidebarStore } from '@/store/sidebar';
import Button from '@/components/ui/button';
import { RiStickyNoteAddLine } from 'react-icons/ri';
import React from 'react';

function WelcomePanel() {
  const { startCreate } = useSidebarStore();
  return (
    <div className={'text-foreground  flex flex-col gap-4'}>
      <div className={'flex flex-col gap-1 text-muted'}>
        <h1 className={'text-foreground text-4xl font-bold'}>Swyft</h1>
        <p className={'font-extralight '}>lightning fast note taking app</p>
      </div>

      <h1 className={'text-muted font-light text-sm'}>Select a note from the sidebar or...</h1>
      <div className={'flex gap-2'}>
        <Button
          onClick={() => startCreate('note')}
          className={
            'border-border flex gap-2 group items-center hover:bg-transparent w-fit hover:border-foreground hover:translate-y-[-2px] transition-all duration-300 ease-in-out border-2 '
          }
        >
          <RiStickyNoteAddLine className={'text-muted group-hover:text-foreground'} size={20} />
          <span className={'text-sm text-muted group-hover:text-foreground'}>
            Create a new note
          </span>
        </Button>
        <span className="flex items-center px-2 py-0.5 text-xs font-mono my-2 text-foreground rounded">
          Ctrl + K
        </span>
      </div>
      <h1 className={'text-muted font-extralight text-xs'}>
        Learn the shortcuts by clicking{' '}
        <span className=" inline-block underline transform hover:translate-y-[-2px] transition-all duration-300 ease-in-out">
          here
        </span>
        .
      </h1>
    </div>
  );
}

export default WelcomePanel;
