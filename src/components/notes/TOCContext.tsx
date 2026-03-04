import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from 'react';
import { useLocation } from 'react-router-dom';
import { createSlugFactory } from '@/lib/slugify';

export type TOCEntry = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type TOCContextValue = {
  entries: TOCEntry[];
  registerEntry: (entry: TOCEntry) => void;
  unregisterEntry: (id: string) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  createId: (title: string) => string;
};

const TOCContext = createContext<TOCContextValue | null>(null);

export function TOCProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const [entries, setEntries] = useState<TOCEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const slugFactoryRef = useRef(createSlugFactory());

  useEffect(() => {
    slugFactoryRef.current = createSlugFactory();
    setEntries([]);
    setActiveId(null);
  }, [pathname]);

  const createId = useCallback((title: string) => slugFactoryRef.current(title), []);

  const registerEntry = useCallback((entry: TOCEntry) => {
    setEntries((current) => {
      if (current.some((candidate) => candidate.id === entry.id)) {
        return current;
      }

      return [...current, entry];
    });
  }, []);

  const unregisterEntry = useCallback((id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const value = useMemo<TOCContextValue>(
    () => ({
      entries,
      registerEntry,
      unregisterEntry,
      activeId,
      setActiveId,
      createId
    }),
    [activeId, createId, entries, registerEntry, unregisterEntry]
  );

  return <TOCContext.Provider value={value}>{children}</TOCContext.Provider>;
}

export function useTOC() {
  const context = useContext(TOCContext);

  if (!context) {
    throw new Error('useTOC must be used within a TOCProvider.');
  }

  return context;
}
