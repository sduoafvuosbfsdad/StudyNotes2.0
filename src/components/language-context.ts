import { createContext, useContext } from 'react';
import type { Locale } from '@/i18n/translations';
import type { translateNote, translateUi } from '@/i18n/translations';
import type { RegisteredNote } from '@/notes/registry';

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: Parameters<typeof translateUi>[1]) => string;
  tNote: (note: RegisteredNote) => ReturnType<typeof translateNote>;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return context;
}
