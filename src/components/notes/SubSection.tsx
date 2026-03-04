import { Link2 } from 'lucide-react';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { useTOC } from '@/components/notes/TOCContext';
import { cn } from '@/lib/utils';

interface SubSectionProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export function SubSection({ title, className, children }: SubSectionProps) {
  const { createId, registerEntry, unregisterEntry } = useTOC();
  const [id] = useState(() => createId(title));

  useEffect(() => {
    registerEntry({ id, title, level: 3 });
    return () => unregisterEntry(id);
  }, [id, registerEntry, title, unregisterEntry]);

  return (
    <section className={cn('space-y-3', className)} aria-labelledby={id}>
      <h3 id={id} className="group mt-8 flex items-center gap-2 text-xl font-medium text-foreground">
        {title}
        <a
          href={`#${id}`}
          className="rounded-sm opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Link to subsection ${title}`}
        >
          <Link2 className="h-4 w-4 text-muted-foreground" />
        </a>
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
