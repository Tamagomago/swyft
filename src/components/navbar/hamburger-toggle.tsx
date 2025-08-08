'use client';

import { RiSideBarLine } from 'react-icons/ri';
import React from 'react';
import Button from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebar';

interface HamburgerToggleProps {
  className?: string;
}

function HamburgerToggle({ className }: HamburgerToggleProps) {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <Button
      className={`${className} bg-transparent hover:bg-transparent border-none ring-0 focus:!outline-none focus:!ring-0 aspect-square`}
      onClick={toggle}
    >
      <span className={'text-foreground relative flex items-center justify-center aspect-square'}>
        <RiSideBarLine
          className={`absolute aspect-square transition-transform duration-300 ${isOpen ? 'scale-0 rotate-180  hidden' : 'scale-100 rotate-0'} `}
          size={20}
        />
      </span>
    </Button>
  );
}

export default HamburgerToggle;
