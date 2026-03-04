import { Laptop, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const Icon = getThemeIcon(theme);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Theme: {theme}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
