import { create } from 'zustand';

type CreateKind = 'note' | 'folder' | null;

interface SidebarState {
  // sidebar window
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;

  // notes and folders
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  // creation state
  createKind: CreateKind;
  startCreate: (kind: Exclude<CreateKind, null>) => void;
  cancelCreate: () => void;
}
export const useSidebarStore = create<SidebarState>((set) => ({
  // sidebar window
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  // notes and folders
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),

  // creation state
  createKind: null,
  startCreate: (kind) => set({ createKind: kind }),
  cancelCreate: () => set({ createKind: null }),
}));
