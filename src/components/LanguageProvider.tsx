import { useEffect, useMemo, type PropsWithChildren } from 'react';
import { LanguageContext, type LanguageContextValue } from '@/components/language-context';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_LOCALE, translateNote, translateUi, type Locale } from '@/i18n/translations';

export function LanguageProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useLocalStorage<Locale>('app-locale', DEFAULT_LOCALE);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === 'en' ? 'zh-CN' : 'en')),
      t: (key) => translateUi(locale, key),
      tNote: (note) => translateNote(note, locale)
    }),
    [locale, setLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
