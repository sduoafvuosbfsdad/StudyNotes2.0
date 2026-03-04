import { useCallback, useEffect } from 'react';

export function useHashScroll() {
  const scrollToId = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior, block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToId(hash, 'auto');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [scrollToId]);

  return scrollToId;
}
