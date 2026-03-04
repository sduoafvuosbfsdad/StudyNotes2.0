import { useCallback, useMemo } from 'react';
import { getAllTopics, type RegisteredNote } from '@/notes/registry';

interface IndexedNote {
  note: RegisteredNote;
  title: string;
  description: string;
  subject: string;
}

function scoreMatch(note: IndexedNote, query: string): number {
  let score = 0;

  if (note.title.startsWith(query)) {
    score += 6;
  }
  if (note.title.includes(query)) {
    score += 4;
  }
  if (note.description.includes(query)) {
    score += 2;
  }
  if (note.subject.includes(query)) {
    score += 1;
  }

  return score;
}

export function useSearchIndex() {
  const index = useMemo<IndexedNote[]>(
    () =>
      getAllTopics().map((note) => ({
        note,
        title: note.title.toLowerCase(),
        description: (note.description ?? '').toLowerCase(),
        subject: note.subject.toLowerCase()
      })),
    []
  );

  return useCallback(
    (rawQuery: string): RegisteredNote[] => {
      const query = rawQuery.toLowerCase().trim();
      if (!query) {
        return getAllTopics();
      }

      return index
        .map((entry) => ({ entry, score: scoreMatch(entry, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.entry.note.order - b.entry.note.order)
        .map(({ entry }) => entry.note);
    },
    [index]
  );
}
