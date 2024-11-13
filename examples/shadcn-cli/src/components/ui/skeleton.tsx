import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'tnf-tw-animate-pulse tnf-tw-rounded-md tnf-tw-bg-zinc-100 dark:tnf-tw-bg-zinc-800',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
