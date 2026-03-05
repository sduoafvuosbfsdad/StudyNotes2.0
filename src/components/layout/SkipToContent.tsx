import { useLanguage } from '@/components/language-context';

export function SkipToContent() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only z-[100] rounded-md bg-card px-3 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:shadow-md"
    >
      {t('skipToContent')}
    </a>
  );
}
