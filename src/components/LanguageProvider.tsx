import { useEffect, useMemo, type PropsWithChildren } from 'react';
import { LanguageContext, type LanguageContextValue } from '@/components/language-context';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DEFAULT_LOCALE,
  normalizeLocale,
  translateNote,
  translateUi,
  type Locale
} from '@/i18n/translations';

export function LanguageProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useLocalStorage<Locale>('app-locale', DEFAULT_LOCALE);
  const safeLocale = normalizeLocale(locale);

  useEffect(() => {
    if (locale !== safeLocale) {
      setLocale(DEFAULT_LOCALE);
    }
  }, [locale, safeLocale, setLocale]);

  useEffect(() => {
    document.documentElement.lang = safeLocale;
  }, [safeLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale: safeLocale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === 'en' ? 'zh-CN' : 'en')),
      t: (key) => translateUi(safeLocale, key),
      tNote: (note) => translateNote(note, safeLocale)
    }),
    [safeLocale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
