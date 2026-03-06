import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/components/language-context';

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            aria-label={t('toggleLanguage')}
            className="h-9 gap-2 px-2"
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs font-medium">{locale === 'en' ? '中' : 'EN'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t('language')}: {locale === 'en' ? t('languageEnglish') : t('languageChinese')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
