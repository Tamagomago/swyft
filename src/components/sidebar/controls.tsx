import React from 'react';
import { RiStickyNoteAddLine } from 'react-icons/ri';
import { RiFolderAddLine } from 'react-icons/ri';

interface ControlsProps {
  onAddNote: () => void;
}

function Controls({ onAddNote }: ControlsProps) {
  return (
    <div className={'w-full flex justify-between items-center border-b-2 border-border pb-2'}>
      <h1 className={'text-muted font-bold lg:text-sm text-xs'}>NOTES</h1>
      <div className={'flex lg:gap-2 gap-1.5 px-2 items-center justify-center'}>
        <RiStickyNoteAddLine
          className={'text-muted hover:text-foreground'}
          size={17}
          onClick={onAddNote}
        />
        <RiFolderAddLine className={'text-muted hover:text-foreground'} size={17} />
      </div>
    </div>
  );
}

export default Controls;
