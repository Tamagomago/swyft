'use client';
import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ children, isOpen, onClose }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 h-screen w-screen z-5 ${isOpen ? 'block' : 'hidden'}`}
    >
      <div
        className={'bg-background border-2 border-border p-5 text-foreground rounded-md'}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
