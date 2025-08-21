import React from 'react';
import { RiDeleteBin6Line, RiFolder2Line } from 'react-icons/ri';
import { Folders } from '@/types/types';

interface NotesFolderProps {
  folder: Folders;
  index: number;
  selectedId: string;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onDelete: (folder: Folders) => void;
}

function FolderItem({
  folder,
  index,
  onDelete,
  hoveredId,
  setHoveredId,
  selectedId,
}: NotesFolderProps) {
  return (
    <li
      key={folder.id}
      tabIndex={index}
      onMouseEnter={() => setHoveredId(folder.id)}
      onMouseLeave={() => setHoveredId(null)}
      className={`
        hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer
        transition-all hover:font-bold hover:scale-102 truncate
        flex justify-between items-center
        ${selectedId === folder.id ? 'bg-muted/20 font-bold' : ''}
      `}
    >
      <div className="flex items-center">
        <RiFolder2Line size={17} className={'mr-1.5'} />
        <span>{folder.name}</span>
      </div>
      {hoveredId === folder.id && (
        <RiDeleteBin6Line
          size={15}
          className="hover:text-error cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder);
          }}
        />
      )}
    </li>
  );
}

export default FolderItem;
