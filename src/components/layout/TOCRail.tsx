import { useMemo } from 'react';
import { Link2 } from 'lucide-react';
import { useHashScroll } from '@/hooks/useHashScroll';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useTOC } from '@/components/notes/TOCContext';
import { cn } from '@/lib/utils';

interface TOCRailProps {
  mode: 'desktop' | 'mobile';
}

function TOCList({ compact }: { compact: boolean }) {
  const { entries, activeId } = useTOC();
  const scrollToId = useHashScroll();

  if (!entries.length) {
    return <p className="text-sm text-muted-foreground">No headings yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;

        return (
          <li key={entry.id} className={cn(entry.level === 3 && 'pl-3')}>
            <button
              type="button"
              onClick={() => scrollToId(entry.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md border-l-2 px-2 py-1.5 text-left text-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              <Link2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{entry.title}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function TOCRail({ mode }: TOCRailProps) {
  const { entries, setActiveId } = useTOC();

  const ids = useMemo(() => entries.map((entry) => entry.id), [entries]);

  useScrollSpy({
    ids,
    onChange: setActiveId
  });

  if (mode === 'mobile') {
    if (!entries.length) {
      return null;
    }

    return (
      <details className="mb-6 rounded-xl border border-border bg-card/65 p-3 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
          On this page
        </summary>
        <div className="mt-2 border-t border-border pt-2">
          <nav aria-label="Table of contents">
            <TOCList compact />
          </nav>
        </div>
      </details>
    );
  }

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6.5rem)] w-64 shrink-0 self-start overflow-y-auto border-l border-border/70 pl-4 xl:block">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">On this page</h2>
        <nav aria-label="Table of contents">
          <TOCList compact={false} />
        </nav>
      </div>
    </aside>
  );
}
