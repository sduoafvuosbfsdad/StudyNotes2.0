import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/language-context';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-prose flex-col items-start justify-center gap-4 py-12">
      <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">{t('notFoundTitle')}</h1>
      <p className="max-w-md text-muted-foreground">{t('notFoundDescription')}</p>
      <Button asChild variant="outline">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToNotes')}
        </Link>
      </Button>
    </div>
  );
}
