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
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import { getNoteHref, type RegisteredNote } from '@/notes/registry';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function groupBySubject(notes: RegisteredNote[]): Map<string, RegisteredNote[]> {
  return notes.reduce((acc, note) => {
    const existing = acc.get(note.subject) ?? [];
    existing.push(note);
    acc.set(note.subject, existing);
    return acc;
  }, new Map<string, RegisteredNote[]>());
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const search = useSearchIndex();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const results = useMemo(() => search(debounced).slice(0, 20), [debounced, search]);
  const grouped = useMemo(() => groupBySubject(results), [results]);

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
      <DialogTitle className="sr-only">Search notes</DialogTitle>
      <DialogDescription className="sr-only">
        Type a note name, subject, or description and press Enter to navigate.
      </DialogDescription>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search by title, subject, or description..."
      />
      <CommandList>
        <CommandEmpty>No matching notes.</CommandEmpty>
        {Array.from(grouped.entries()).map(([subject, notes]) => (
          <CommandGroup heading={subject} key={subject}>
            {notes.map((note) => (
              <CommandItem
                key={`${note.subjectSlug}/${note.topicSlug}`}
                value={`${note.subject} ${note.title} ${note.description ?? ''}`}
                onSelect={() => {
                  navigate(getNoteHref(note));
                  onOpenChange(false);
                }}
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{note.title}</span>
                  {note.description ? (
                    <span className="truncate text-xs text-muted-foreground">{note.description}</span>
                  ) : null}
                </div>
                <CommandShortcut>{note.order}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
