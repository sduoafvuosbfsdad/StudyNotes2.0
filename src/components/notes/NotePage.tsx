import type { PropsWithChildren } from 'react';
import type { RegisteredNote } from '@/notes/registry';

interface NotePageProps extends PropsWithChildren {
  note: RegisteredNote;
}

export function NotePage({ note, children }: NotePageProps) {
  return (
    <article className="prose prose-zinc dark:prose-invert mx-auto max-w-prose space-y-8">
      <header className="not-prose space-y-3 border-b border-border pb-6">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">{note.subject}</p>
        <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
        {note.description ? <p className="text-base text-muted-foreground">{note.description}</p> : null}
        <p className="text-sm text-muted-foreground">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
      </header>
      {children}
    </article>
  );
}
