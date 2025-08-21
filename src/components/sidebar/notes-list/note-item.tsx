import React from 'react';
import { MdNotes } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Notes } from '@/types/types';

interface NoteItemProps {
  note: Notes;
  index: number;
  selectedId: string;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onClick: (id: string) => void;
  onDelete: (note: Notes) => void;
}

function NoteItem({
  note,
  index,
  selectedId,
  hoveredId,
  setHoveredId,
  onClick,
  onDelete,
}: NoteItemProps) {
  return (
    <li
      tabIndex={index}
      key={note.id}
      onMouseEnter={() => setHoveredId(note.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => onClick(note.id)}
      className={`
        hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer 
        transition-all hover:font-bold hover:scale-102 truncate
        flex justify-between items-center
        ${selectedId === note.id ? 'bg-muted/20 font-bold' : ''}
      `}
    >
      <div className={'flex items-center'}>
        <MdNotes size={17} className={'mr-1.5'} />
        <span>{note.title}</span>
      </div>

      {hoveredId === note.id && (
        <RiDeleteBin6Line
          size={15}
          className="hover:text-error cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
        />
      )}
    </li>
  );
}

export default NoteItem;
