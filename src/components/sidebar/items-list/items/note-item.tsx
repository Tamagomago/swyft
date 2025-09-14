import React from 'react';
import { MdNotes } from 'react-icons/md';
import { RiDeleteBin6Line, RiFileEditLine } from 'react-icons/ri';
import { Folders, Notes } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebar';
import ContextMenu from '@/components/sidebar/context-menu';
import ItemEntry from '@/components/sidebar/items-list/input/item-entry';
import { isNotes } from '@/lib/utils';
import { useContextMenuWithLongPress } from '@/hooks/context-menu/useContextMenuWithLongPress';
import { useRenaming } from '@/hooks/useRenaming';
import { useDraggable } from '@dnd-kit/core';
import { clsx } from 'clsx';

interface NoteItemProps {
  note: Notes;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onDelete: (note: Notes) => void;
  onRename: (item: Notes) => Promise<void>;
  isUpdating: boolean;
  useEmptySpace?: boolean;
}

function NoteItem({
  note,
  hoveredId,
  setHoveredId,
  onDelete,
  useEmptySpace = true,
  onRename,
  isUpdating,
}: NoteItemProps) {
  const router = useRouter();
  const { selectedId, setSelectedId } = useSidebarStore();
  const { isRenaming, startRenaming, stopRenaming } = useRenaming();

  const { openMenu, menu, closeMenu, handleTouchStart, handleTouchEnd } =
    useContextMenuWithLongPress<Notes | Folders>();

  const handleNoteClick = (noteId: string) => {
    setSelectedId(noteId);
    router.push(`/home/${noteId}`);
  };

  const contextMenuItems = [
    { icon: RiDeleteBin6Line, name: 'Delete', action: () => onDelete(note) },
    { icon: RiFileEditLine, name: 'Rename', action: () => startRenaming() },
  ];

  // dnd utils
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: note.id,
    data: { note },
  });
  const style = {
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? '0.95' : '1',
    transition: isDragging ? 'none' : 'all ease-in-out 300ms',
  };

  if (isRenaming) {
    return (
      <ItemEntry
        kind="note"
        disabled={isUpdating}
        onSubmit={async (input) => {
          if (isNotes(input)) {
            await onRename?.({ ...note, title: input.title });
            stopRenaming();
          }
        }}
        onCancel={() => stopRenaming()}
      />
    );
  }

  return (
    <>
      <li
        key={note.id}
        ref={setNodeRef}
        style={style}
        {...attributes}
        onMouseEnter={() => !isDragging && setHoveredId(note.id)}
        onMouseLeave={() => !isDragging && setHoveredId(null)}
        onTouchStart={!isDragging ? (e) => handleTouchStart(e, note) : undefined}
        onTouchEnd={!isDragging ? handleTouchEnd : undefined}
        onClick={!isDragging ? () => handleNoteClick(note.id) : undefined}
        className={clsx(
          'py-1 pl-1.5 pr-2.5 rounded-md cursor-pointer select-none w-full flex justify-between items-center min-w-0',
          selectedId === note.id && 'bg-muted/20 font-bold',
          'hover:bg-muted/20 hover:font-bold hover:scale-102',
        )}
        onContextMenu={(e) => {
          if (isDragging) return;
          openMenu(e, note);
        }}
      >
        <div
          {...listeners}
          className={`${useEmptySpace ? 'grid grid-cols-[21px_1fr]' : 'flex pl-2'} items-center flex-1 min-w-0`}
        >
          <span className={`w-[21px] ${useEmptySpace ? 'invisible' : 'hidden'}`} />
          <div className="flex items-center min-w-0">
            <MdNotes size={17} className="mr-1.5 shrink-0" />
            <span className="truncate">{note.title}</span>
          </div>
        </div>

        {hoveredId === note.id && !isDragging && (
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
      {menu && !isDragging && (
        <ContextMenu x={menu.x} y={menu.y} items={contextMenuItems} onClose={closeMenu} />
      )}
    </>
  );
}

export default React.memo(NoteItem);
