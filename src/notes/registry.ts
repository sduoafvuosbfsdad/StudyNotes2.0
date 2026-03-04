import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { NoteMeta, NoteModule } from './types';

export interface RegisteredNote extends NoteMeta {
  subjectSlug: string;
  topicSlug: string;
  path: string;
}

export interface SubjectGroup {
  subject: string;
  subjectSlug: string;
  topics: RegisteredNote[];
}

type Loader = () => Promise<NoteModule>;

const noteLoaders = import.meta.glob('./*/*.tsx') as Record<string, Loader>;
const noteMetas = import.meta.glob('./*/*.meta.ts', {
  eager: true,
  import: 'meta'
}) as Record<string, unknown>;

const REQUIRED_FIELDS: Array<keyof NoteMeta> = ['subject', 'title', 'slug', 'order', 'updatedAt'];

function validateMeta(meta: unknown, path: string): asserts meta is NoteMeta {
  if (!meta || typeof meta !== 'object') {
    throw new Error(`Invalid note meta in ${path}: expected object export named \`meta\`.`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in meta)) {
      throw new Error(`Invalid note meta in ${path}: missing \`${field}\`.`);
    }
  }

  const typedMeta = meta as Record<string, unknown>;

  if (typeof typedMeta.subject !== 'string') {
    throw new Error(`Invalid note meta in ${path}: \`subject\` must be string.`);
  }
  if (typeof typedMeta.title !== 'string') {
    throw new Error(`Invalid note meta in ${path}: \`title\` must be string.`);
  }
  if (typeof typedMeta.slug !== 'string') {
    throw new Error(`Invalid note meta in ${path}: \`slug\` must be string.`);
  }
  if (typeof typedMeta.order !== 'number' || Number.isNaN(typedMeta.order)) {
    throw new Error(`Invalid note meta in ${path}: \`order\` must be number.`);
  }
  if (typeof typedMeta.updatedAt !== 'string') {
    throw new Error(`Invalid note meta in ${path}: \`updatedAt\` must be string.`);
  }
}

function parseMetaPath(path: string): {
  subjectSlug: string;
  fallbackTopicSlug: string;
  notePath: string;
} {
  const match = path.match(/^\.\/([^/]+)\/([^/]+)\.meta\.ts$/);

  if (!match) {
    throw new Error(`Unexpected note path format: ${path}`);
  }

  return {
    subjectSlug: match[1],
    fallbackTopicSlug: match[2],
    notePath: `./${match[1]}/${match[2]}.tsx`
  };
}

const notes: RegisteredNote[] = Object.entries(noteMetas).map(([path, unknownMeta]) => {
  validateMeta(unknownMeta, path);

  const parsed = parseMetaPath(path);
  const loader = noteLoaders[parsed.notePath];
  if (!loader) {
    throw new Error(`Missing lazy loader for note module: ${parsed.notePath}`);
  }

  return {
    ...unknownMeta,
    subjectSlug: parsed.subjectSlug,
    topicSlug: unknownMeta.slug || parsed.fallbackTopicSlug,
    path: parsed.notePath
  };
});

const routeKeySet = new Set<string>();
const slugSet = new Set<string>();

for (const note of notes) {
  const routeKey = `${note.subjectSlug}/${note.topicSlug}`;
  if (routeKeySet.has(routeKey)) {
    throw new Error(`Duplicate route detected for note: ${routeKey}`);
  }

  routeKeySet.add(routeKey);

  if (slugSet.has(note.slug)) {
    throw new Error(`Duplicate slug detected: ${note.slug}`);
  }

  slugSet.add(note.slug);
}

const groupedSubjects = new Map<string, SubjectGroup>();

for (const note of notes) {
  const existing = groupedSubjects.get(note.subjectSlug);

  if (existing) {
    existing.topics.push(note);
  } else {
    groupedSubjects.set(note.subjectSlug, {
      subject: note.subject,
      subjectSlug: note.subjectSlug,
      topics: [note]
    });
  }
}

export const subjects: SubjectGroup[] = Array.from(groupedSubjects.values())
  .sort((a, b) => a.subject.localeCompare(b.subject))
  .map((group) => ({
    ...group,
    topics: group.topics.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  }));

const flatTopics = subjects.flatMap((group) => group.topics);

const noteByRoute = new Map<string, RegisteredNote>();
for (const topic of flatTopics) {
  noteByRoute.set(`${topic.subjectSlug}/${topic.topicSlug}`, topic);
}

export function getAllTopics(): RegisteredNote[] {
  return flatTopics;
}

export function getTopicBySlug(subjectSlug: string, topicSlug: string): RegisteredNote | undefined {
  return noteByRoute.get(`${subjectSlug}/${topicSlug}`);
}

const lazyComponentByRoute = new Map<string, LazyExoticComponent<ComponentType>>();

for (const topic of flatTopics) {
  const key = `${topic.subjectSlug}/${topic.topicSlug}`;
  const loader = noteLoaders[topic.path];

  lazyComponentByRoute.set(
    key,
    lazy(async () => {
      const module = await loader();
      return { default: module.default };
    })
  );
}

export function getTopicComponent(
  subjectSlug: string,
  topicSlug: string
): LazyExoticComponent<ComponentType> | undefined {
  return lazyComponentByRoute.get(`${subjectSlug}/${topicSlug}`);
}

export function getNoteHref(note: RegisteredNote): string {
  return `/${note.subjectSlug}/${note.topicSlug}`;
}

export const firstTopic = flatTopics[0];
