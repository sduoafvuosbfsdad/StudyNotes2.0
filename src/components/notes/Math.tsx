import { memo, useMemo } from 'react';
import { renderKatex } from '@/lib/katex-render';
import { cn } from '@/lib/utils';

interface MathProps {
  children: string;
  block?: boolean;
  className?: string;
}

function MathComponent({ children, block = false, className }: MathProps) {
  const html = useMemo(() => renderKatex(children, { block }), [block, children]);

  if (block) {
    return (
      <div
        className={cn('my-4 overflow-x-auto rounded-lg border border-border bg-muted/30 px-3 py-2', className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const Math = memo(MathComponent);
