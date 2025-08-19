import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Folders, Notes } from '@/types/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFolder(item: Notes | Folders): item is Folders {
  return 'name' in item;
}

export function isNotes(item: Notes | Folders): item is Notes {
  return 'title' in item;
}
