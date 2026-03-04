import type { ComponentType } from 'react';

export interface NoteMeta {
  subject: string;
  title: string;
  slug: string;
  order: number;
  updatedAt: string;
  description?: string;
}

export interface NoteModule {
  default: ComponentType;
  meta: NoteMeta;
}
