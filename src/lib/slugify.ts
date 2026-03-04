function normalize(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugify(input: string): string {
  return normalize(input) || 'section';
}

export function createSlugFactory(): (input: string) => string {
  const counts = new Map<string, number>();

  return (input: string): string => {
    const base = slugify(input);
    const current = counts.get(base) ?? 0;
    counts.set(base, current + 1);

    if (current === 0) {
      return base;
    }

    return `${base}-${current + 1}`;
  };
}
