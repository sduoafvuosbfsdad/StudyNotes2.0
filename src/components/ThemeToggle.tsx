import { Laptop, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/components/language-context';
import { useTheme } from '@/components/ThemeProvider';

function getThemeIcon(theme: 'light' | 'dark' | 'system') {
  if (theme === 'light') {
    return Sun;
  }

  if (theme === 'dark') {
    return Moon;
  }

  return Laptop;
}

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const { t } = useLanguage();
  const Icon = getThemeIcon(theme);
  const themeLabel =
    theme === 'light' ? t('themeLight') : theme === 'dark' ? t('themeDark') : t('themeSystem');

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label={t('toggleTheme')}
            className="h-9 w-9"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t('theme')}: {themeLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
