import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { TOCProvider } from '@/components/notes/TOCContext';
import { CommandPalette } from '@/components/search/CommandPalette';
import { MainContent } from '@/components/layout/MainContent';
import { Sidebar } from '@/components/layout/Sidebar';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { TOCRail } from '@/components/layout/TOCRail';
import { TopBar } from '@/components/layout/TopBar';
import { fadeIn } from '@/lib/animations';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useReducedMotionPreference } from '@/hooks/useReducedMotion';

export function Layout({ children }: PropsWithChildren) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotionPreference();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useLocalStorage<boolean>('sidebar-collapsed', false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setCollapsed((current) => !current);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [setCollapsed]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContent />

      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            collapsed={collapsed}
            onToggleSidebar={() => setCollapsed((current) => !current)}
            onOpenMobileSidebar={() => setMobileOpen(true)}
            onOpenSearch={() => setSearchOpen(true)}
          />

          <TOCProvider>
            <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-[1320px] items-start gap-8">
                <MainContent>
                  <TOCRail mode="mobile" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      variants={fadeIn(prefersReducedMotion)}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </MainContent>

                <TOCRail mode="desktop" />
              </div>
            </div>
          </TOCProvider>
        </div>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
