import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '@/components/ui/command';
import { useLanguage } from '@/components/language-context';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import { getNoteHref, type RegisteredNote } from '@/notes/registry';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function groupBySubject(notes: RegisteredNote[], tNote: (note: RegisteredNote) => { subject: string }) {
  return notes.reduce((acc, note) => {
    const subject = tNote(note).subject;
    const existing = acc.get(subject) ?? [];
    existing.push(note);
    acc.set(subject, existing);
    return acc;
  }, new Map<string, RegisteredNote[]>());
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { t, tNote } = useLanguage();
  const search = useSearchIndex();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const results = useMemo(() => search(debounced).slice(0, 20), [debounced, search]);
  const grouped = useMemo(() => groupBySubject(results, tNote), [results, tNote]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      const isCommandK = event.key.toLowerCase() === 'k';

      if (!isModifier || !isCommandK) {
        return;
      }

      event.preventDefault();
      onOpenChange(!open);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">{t('searchNotes')}</DialogTitle>
      <DialogDescription className="sr-only">{t('searchDialogDescription')}</DialogDescription>
      <CommandInput value={query} onValueChange={setQuery} placeholder={t('searchPlaceholder')} />
      <CommandList>
        <CommandEmpty>{t('noMatchingNotes')}</CommandEmpty>
        {Array.from(grouped.entries()).map(([subject, notes]) => (
          <CommandGroup heading={subject} key={subject}>
            {notes.map((note) => {
              const translated = tNote(note);

              return (
                <CommandItem
                  key={`${note.subjectSlug}/${note.topicSlug}`}
                  value={`${translated.subject} ${translated.title} ${translated.description ?? ''}`}
                  onSelect={() => {
                    navigate(getNoteHref(note));
                    onOpenChange(false);
                  }}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{translated.title}</span>
                    {translated.description ? (
                      <span className="truncate text-xs text-muted-foreground">{translated.description}</span>
                    ) : null}
                  </div>
                  <CommandShortcut>{note.order}</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
