import { ChevronDown, ChevronRight, Notebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink, useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { getNoteHref, subjects } from '@/notes/registry';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean | ((current: boolean) => boolean)) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function getDefaultSectionState(): Record<string, boolean> {
  return subjects.reduce<Record<string, boolean>>((acc, subject) => {
    acc[subject.subjectSlug] = true;
    return acc;
  }, {});
}

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const { subject: activeSubject } = useParams();
  const [sections, setSections] = useLocalStorage<Record<string, boolean>>(
    'sidebar-sections',
    getDefaultSectionState()
  );

  const toggleSection = (subjectSlug: string) => {
    setSections((current) => ({
      ...current,
      [subjectSlug]: !(current[subjectSlug] ?? true)
    }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Notebook className="h-4 w-4 text-primary" />
          {!collapsed ? <span>StudyNotes</span> : null}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <nav className="space-y-4 px-2 py-4" aria-label="Notes navigation">
          {subjects.map((group) => {
            const isOpen = sections[group.subjectSlug] ?? true;
            const isActiveSubject = activeSubject === group.subjectSlug;
            const HeaderIcon = isOpen ? ChevronDown : ChevronRight;

            return (
              <section key={group.subjectSlug} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSection(group.subjectSlug)}
                  className={cn(
                    'flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                    isActiveSubject && 'text-foreground',
                    collapsed && 'justify-center px-1'
                  )}
                  aria-expanded={isOpen}
                >
                  {!collapsed ? (
                    <>
                      <HeaderIcon className="mr-2 h-3.5 w-3.5" />
                      <span>{group.subject}</span>
                    </>
                  ) : (
                    <span title={group.subject} className="text-xs font-semibold uppercase tracking-wide">
                      {group.subject.charAt(0)}
                    </span>
                  )}
                </button>

                {isOpen ? (
                  <ul className={cn('space-y-1', collapsed ? 'pl-0' : 'pl-6')}>
                    {group.topics.map((topic) => (
                      <li key={`${group.subjectSlug}/${topic.topicSlug}`}>
                        <NavLink
                          to={getNoteHref(topic)}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            cn(
                              'group flex items-center rounded-md border-l-2 border-transparent py-1.5 text-sm transition-colors',
                              collapsed ? 'justify-center px-1' : 'px-3',
                              isActive
                                ? 'border-primary bg-primary/10 font-medium text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )
                          }
                          title={topic.title}
                        >
                          {collapsed ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground group-[.active]:bg-primary/20">
                              {topic.order}
                            </span>
                          ) : (
                            <span className="truncate">{topic.title}</span>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function Sidebar({ collapsed, onCollapsedChange, mobileOpen, onMobileOpenChange }: SidebarProps) {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 84 : 280 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }}
        className="sticky top-0 hidden h-screen shrink-0 border-r border-border/70 bg-card/70 backdrop-blur-sm lg:block"
      >
        <SidebarContent collapsed={collapsed} />
      </motion.aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[86vw] max-w-sm p-0 lg:hidden">
          <SheetTitle className="sr-only">Notes navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse subjects and topics, then choose a note to open.
          </SheetDescription>
          <SidebarContent
            collapsed={false}
            onNavigate={() => {
              onMobileOpenChange(false);
              onCollapsedChange(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
