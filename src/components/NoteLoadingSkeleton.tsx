import { Skeleton } from '@/components/ui/skeleton';

export function NoteLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-prose space-y-8 px-6 py-10 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-11 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[84%]" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[88%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
