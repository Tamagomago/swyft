'use client';
import React, { useEffect, useRef, useState } from 'react';
import Input from '@/components/ui/input';

interface NoteInputProps {
  onSubmit: (title: string) => Promise<void> | void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function NoteInput({ onSubmit, onCancel, disabled }: NoteInputProps) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title.trim()) {
        await onSubmit(title.trim());
      } else {
        onCancel();
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = async () => {
    if (!title.trim()) {
      onCancel();
    } else {
      await onSubmit(title.trim());
    }
  };

  return (
    <Input
      ref={inputRef}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="bg-transparent outline-none! border-none! text-sm text-muted font-medium hover:font-bold placeholder:text-muted focus:ring-0! p-0! focus:border-none! focus:outline-none!"
    />
  );
}
