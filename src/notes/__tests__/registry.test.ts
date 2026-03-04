import { describe, expect, it } from 'vitest';
import { getAllTopics, subjects } from '@/notes/registry';

describe('note registry', () => {
  it('contains required note metadata fields', () => {
    for (const note of getAllTopics()) {
      expect(note.subject).toBeTypeOf('string');
      expect(note.title).toBeTypeOf('string');
      expect(note.slug).toBeTypeOf('string');
      expect(note.order).toBeTypeOf('number');
      expect(note.updatedAt).toBeTypeOf('string');
    }
  });

  it('has unique slugs', () => {
    const slugs = getAllTopics().map((note) => note.slug);
    const unique = new Set(slugs);

    expect(unique.size).toBe(slugs.length);
  });

  it('sorts subjects alphabetically', () => {
    const names = subjects.map((subject) => subject.subject);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sorted);
  });

  it('sorts topics by order then title', () => {
    for (const subject of subjects) {
      const topics = subject.topics;
      const sorted = [...topics].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
      expect(topics).toEqual(sorted);
    }
  });
});
