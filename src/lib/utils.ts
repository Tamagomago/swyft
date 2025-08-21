import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Folders, Notes } from '@/types/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isNotes(item: Notes | Folders): item is Notes {
  return 'title' in item;
}
