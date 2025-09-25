import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line, RiFolder2Line, RiArrowRightSLine, RiFileEditLine } from 'react-icons/ri';
import { Folders, Notes } from '@/types/types';
import NoteItem from '@/components/sidebar/items-list/items/note-item';
import ContextMenu from '@/components/sidebar/context-menu';
import ItemEntry from '@/components/sidebar/items-list/input/item-entry';
import { isNotes } from '@/lib/utils';
import { useRenaming } from '@/hooks/useRenaming';
import { useContextMenuWithLongPress } from '@/hooks/context-menu/useContextMenuWithLongPress';
import { useDroppable } from '@dnd-kit/core';
import { clsx } from 'clsx';

interface FolderItemProps {
  folder: Folders;
  notes: Notes[];
  index: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onDelete: (item: Folders | Notes) => void;
  onRename: (T: Notes | Folders) => Promise<void>;
  isUpdating: boolean;
}

function FolderItem({
  folder,
  notes,
  index,
  onDelete,
  hoveredId,
  setHoveredId,
  onRename,
  isUpdating,
}: FolderItemProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded((prev) => !prev);
  const { openMenu, menu, closeMenu, handleTouchStart, handleTouchEnd } =
    useContextMenuWithLongPress<Notes | Folders>();
  const { isRenaming, startRenaming, stopRenaming } = useRenaming();
  const contextMenuItems = [
    { icon: RiDeleteBin6Line, name: 'Delete', action: () => onDelete(folder) },
    {
      icon: RiFileEditLine,
      name: 'Rename',
      action: () => {
        startRenaming();
        setExpanded(false);
      },
    },
  ];

  // Droppable
  const { isOver, setNodeRef } = useDroppable({ id: folder.id });

  useEffect(() => {
    if (isOver) {
      setExpanded(true);
    }
  }, [isOver]);

  if (isRenaming) {
    return (
      <ItemEntry
        kind={'folder'}
        disabled={isUpdating}
        onSubmit={async (input) => {
          if (!isNotes(input)) {
            await onRename?.({ ...folder, name: input.name });
            stopRenaming();
          }
        }}
        onCancel={() => stopRenaming()}
      />
    );
  }

  return (
    <>
      <li key={folder.id} tabIndex={index} className="flex flex-col w-full" ref={setNodeRef}>
        {/* Folder Header */}
        <div
          onClick={() => {
            toggleExpand();
          }}
          onMouseEnter={() => setHoveredId(folder.id)}
          onMouseLeave={() => setHoveredId(null)}
          onTouchStart={(e) => handleTouchStart(e, folder)}
          onTouchEnd={handleTouchEnd}
          className={clsx(
            'flex justify-between items-center',
            'hover:bg-muted/5 py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer',
            'transition-all hover:font-bold hover:scale-102 truncate select-none',
            isOver && 'bg-muted/20 font-bold',
          )}
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
            {notes.sort().map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onDelete={onDelete}
                useEmptySpace={false}
                onRename={onRename}
                isUpdating={isUpdating}
              />
            ))}
          </ul>
        </div>
      </li>
      {menu && <ContextMenu x={menu.x} y={menu.y} items={contextMenuItems} onClose={closeMenu} />}
    </>
  );
}

export default React.memo(FolderItem);
