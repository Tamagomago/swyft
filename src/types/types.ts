export interface Notes {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  folder_id?: string | null;
}

export interface Folders {
  id: string;
  user_id: string;
  name: string;
  createdAt: Date;
}
export type CreateKind = 'note' | 'folder';