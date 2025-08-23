import React, { useState } from 'react';
import { RiDeleteBin6Line, RiFolder2Line, RiArrowRightSLine, RiFileEditLine } from 'react-icons/ri';
import { Folders, Notes } from '@/types/types';
import NoteItem from '@/components/sidebar/notes-list/note-item';
import { useContextMenu } from '@/hooks/useContextMenu';
import ContextMenu from '@/components/ContextMenu';

interface NotesFolderProps {
  folder: Folders;
  notes: Notes[];
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onDelete: (item: Folders | Notes) => void;
}

function FolderItem({ folder, notes, index, onDelete, hoveredId, setHoveredId }: NotesFolderProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);
  const { openMenu, menu, closeMenu } = useContextMenu();
  const contextMenuItems = [
    { icon: RiDeleteBin6Line, name: 'Delete', action: () => onDelete(folder) },
    { icon: RiFileEditLine, name: 'Rename', action: () => {} },
  ];

  // touch event handler
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
    timerRef.current = setTimeout(() => {
      openMenu(e, folder);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      <li key={folder.id} tabIndex={index} className="flex flex-col w-full">
        {/* Folder Header */}
        <div
          onClick={toggleExpand}
          onMouseEnter={() => setHoveredId(folder.id)}
          onMouseLeave={() => setHoveredId(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`
            flex justify-between items-center
            hover:bg-muted/20 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer
            transition-all hover:font-bold hover:scale-102 truncate select-none
          `}
          onContextMenu={(e) => {
            openMenu(e, folder);
          }}
        >
          <div className="grid grid-cols-[21px_1fr] items-center flex-1">
            <button
              className="w-[21px] grid place-items-center"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
            >
              <RiArrowRightSLine
                size={17}
                className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
              />
            </button>
            <div className="flex items-center">
              <RiFolder2Line size={17} className="mr-1.5" />
              <span>{folder.name}</span>
            </div>
          </div>

          {/* Delete Button */}
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
        </div>

        {/* Folder Contents */}
        <div
          className={`
            ml-7 border-l border-border mt-1 pl-2 space-y-1 
            overflow-hidden transition-all duration-200 ease-in-out
            ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <ul>
            {notes.map((note, i) => (
              <NoteItem
                key={note.id}
                note={note}
                index={i}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onDelete={onDelete}
                useEmptySpace={false}
              />
            ))}
          </ul>
        </div>
      </li>
      {menu && <ContextMenu x={menu.x} y={menu.y} items={contextMenuItems} onClose={closeMenu} />}
    </>
  );
}

export default FolderItem;
