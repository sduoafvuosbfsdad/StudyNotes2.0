import { Menu, Search } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SidebarToggle } from '@/components/layout/SidebarToggle';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';
import { getTopicBySlug } from '@/notes/registry';

interface TopBarProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export function TopBar({ collapsed, onToggleSidebar, onOpenMobileSidebar, onOpenSearch }: TopBarProps) {
  const { subject = '', topic = '' } = useParams();
  const { t, tNote } = useLanguage();

  const current = useMemo(() => {
    return getTopicBySlug(subject, topic);
  }, [subject, topic]);

  const translatedCurrent = current ? tNote(current) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4 lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          onClick={onOpenMobileSidebar}
          aria-label={t('openNotesNavigation')}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <SidebarToggle collapsed={collapsed} onToggle={onToggleSidebar} />

        <div className="min-w-0 flex-1 text-sm text-muted-foreground">
          {translatedCurrent ? (
            <p className="truncate">
              <span>{translatedCurrent.subject}</span>
              <span className="mx-1">/</span>
              <span className="text-foreground">{translatedCurrent.title}</span>
            </p>
          ) : (
            <p className="truncate">{t('appName')}</p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 rounded-lg border-dashed px-3 text-xs"
          onClick={onOpenSearch}
          aria-label={t('searchNotes')}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('search')}</span>
          <kbd className="hidden rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground sm:inline">
            Ctrl+K
          </kbd>
        </Button>

        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
