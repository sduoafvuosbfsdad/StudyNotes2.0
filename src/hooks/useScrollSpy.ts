import { useEffect } from 'react';

interface UseScrollSpyOptions {
  ids: string[];
  onChange: (id: string | null) => void;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useScrollSpy({
  ids,
  onChange,
  rootMargin = '-20% 0px -65% 0px',
  threshold = [0.1, 0.5, 0.9]
}: UseScrollSpyOptions) {
  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === 'undefined') {
      onChange(null);
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) {
      onChange(null);
      return;
    }

    let activeId: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) {
          return;
        }

        const nextId = visible[0].target.id;
        if (nextId !== activeId) {
          activeId = nextId;
          onChange(nextId);
        }
      },
      {
        root: null,
        rootMargin,
        threshold
      }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [ids, onChange, rootMargin, threshold]);
}
