import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const { t } = useLanguage();

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('toggleSidebar')}
            onClick={onToggle}
            className="hidden h-9 w-9 lg:inline-flex"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{t('toggleSidebarShortcut')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
