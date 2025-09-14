'use client';
import React from 'react';
import Modal from '@/components/ui/modal/modal';
import ModalTitle from '@/components/ui/modal/modal-title';
import ModalDescription from '@/components/ui/modal/modal-description';
import Button from '@/components/ui/button';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Notes, Folders } from '@/types/types';
import { isNotes } from '@/lib/utils';

interface DeleteModalProps {
  target: Notes | Folders | null;
  onCancel: () => void;
  onConfirm: (target: Notes | Folders) => Promise<void>;
}

export default function DeleteModal({ target, onCancel, onConfirm }: DeleteModalProps) {
  if (!target) return null;

  return (
    <Modal isOpen onClose={onCancel}>
      <ModalTitle>Delete {isNotes(target) ? 'Note' : 'Folder'}</ModalTitle>
      <ModalDescription>
        Are you sure you want to delete &quot;
        {isNotes(target) ? target.title : target.name}
        &quot;?
      </ModalDescription>

      <div className="flex justify-end gap-2">
        <Button
          className="bg-background border-1 hover:bg-muted/20 border-muted/50 py-1.5! flex gap-1 items-center text-foreground"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          className="bg-red-500 hover:bg-red-600 hover:border-red-500 border-error py-1.5! flex gap-1 items-center text-white"
          onClick={() => onConfirm(target)}
        >
          <RiDeleteBin6Line />
          Delete
        </Button>
      </div>
    </Modal>
  );
}
