import { Link2 } from 'lucide-react';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { useTOC } from '@/components/notes/TOCContext';
import { cn } from '@/lib/utils';

interface SectionProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export function Section({ title, className, children }: SectionProps) {
  const { createId, registerEntry, unregisterEntry } = useTOC();
  const [id] = useState(() => createId(title));

  useEffect(() => {
    registerEntry({ id, title, level: 2 });
    return () => unregisterEntry(id);
  }, [id, registerEntry, title, unregisterEntry]);

  return (
    <section className={cn('space-y-4', className)} aria-labelledby={id}>
      <h2 id={id} className="group mt-12 flex items-center gap-2 text-2xl font-semibold text-foreground">
        {title}
        <a
          href={`#${id}`}
          className="rounded-sm opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Link to section ${title}`}
        >
          <Link2 className="h-4 w-4 text-muted-foreground" />
        </a>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
