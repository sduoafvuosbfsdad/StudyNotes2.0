import type { PropsWithChildren } from 'react';

export function MainContent({ children }: PropsWithChildren) {
  return (
    <main id="main-content" className="min-w-0 flex-1 px-0 py-0 lg:px-2" tabIndex={-1}>
      <div className="mx-auto max-w-3xl px-0 py-0 sm:px-1">{children}</div>
    </main>
  );
}
