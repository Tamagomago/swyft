import React from 'react';
import Controls from '@/components/sidebar/controls';
import NotesList from '@/components/sidebar/notes-list';

function Sidebar() {
  return (
    <div className={'flex flex-col gap-5 pt-25 px-10 h-full w-full bg-muted/20'}>
      <Controls />
      <NotesList />
    </div>
  );
}

export default Sidebar;
