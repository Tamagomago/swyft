// src/components/sidebar/notes-list/note-item.tsx
import React from 'react';
import { MdNotes } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Notes } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebar';

interface NoteItemProps {
  note: Notes;
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onDelete: (note: Notes) => void;
  useEmptySpace?: boolean;
}

function NoteItem({
  note,
  index,
  hoveredId,
  setHoveredId,
  onDelete,
  useEmptySpace = true,
}: NoteItemProps) {
  const router = useRouter();
  const { selectedId, setSelectedId } = useSidebarStore();
  const handleNoteClick = (noteId: string) => {
    setSelectedId(noteId);
    router.push(`/home/${noteId}`);
  };

  return (
    <li
      tabIndex={index}
      key={note.id}
      onMouseEnter={() => setHoveredId(note.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={() => handleNoteClick(note.id)}
      className={`
        hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer 
        transition-all hover:font-bold hover:scale-102
        w-full flex justify-between items-center min-w-0
        ${selectedId === note.id ? 'bg-muted/20 font-bold' : ''}
      `}
    >
      <div
        className={`
          ${useEmptySpace ? 'grid grid-cols-[21px_1fr]' : 'flex pl-2'}
          items-center flex-1 min-w-0
        `}
      >
        <span className={`w-[21px] ${useEmptySpace ? 'invisible' : 'hidden'}`} />
        <div className="flex items-center min-w-0">
          <MdNotes size={17} className="mr-1.5 shrink-0" />
          <span className="truncate">{note.title}</span>
        </div>
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
