import React from 'react';
import NoteInput from '@/components/sidebar/note-input';
import { CreateKind, Folders, Notes } from '@/types/types';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface CreateItemProps {
  kind: CreateKind;
  disabled: boolean;
  onSubmit: (input: Notes | Folders) => void;
  onCancel: () => void;
}

function CreateItem({ kind, disabled, onCancel, onSubmit }: CreateItemProps) {
  return (
    <li
      tabIndex={0}
      className={`
        py-1 px-1.5 rounded-md cursor-pointer transition-all truncate
        hover:bg-muted/10 hover:scale-102
        focus-within:ring-2 focus-within:ring-muted/50 focus-within:bg-muted/20 disabled:opacity-60
        flex justify-between items-center
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <NoteInput
        disabled={disabled}
        onSubmit={(input) =>
          kind === 'note'
            ? onSubmit({ title: input } as Notes)
            : onSubmit({ name: input } as Folders)
        }
        onCancel={onCancel}
      />
      <span>{disabled && <AiOutlineLoading3Quarters size={13} className={'animate-spin'} />}</span>
    </li>
  );
}

export default CreateItem;
