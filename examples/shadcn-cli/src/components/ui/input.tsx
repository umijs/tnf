import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'tnf-tw-flex tnf-tw-h-10 tnf-tw-w-full tnf-tw-rounded-md tnf-tw-border tnf-tw-border-zinc-200 tnf-tw-bg-white tnf-tw-px-3 tnf-tw-py-2 tnf-tw-text-base tnf-tw-ring-offset-white file:tnf-tw-border-0 file:tnf-tw-bg-transparent file:tnf-tw-text-sm file:tnf-tw-font-medium file:tnf-tw-text-zinc-950 placeholder:tnf-tw-text-zinc-500 focus-visible:tnf-tw-outline-none focus-visible:tnf-tw-ring-2 focus-visible:tnf-tw-ring-zinc-950 focus-visible:tnf-tw-ring-offset-2 disabled:tnf-tw-cursor-not-allowed disabled:tnf-tw-opacity-50 md:tnf-tw-text-sm dark:tnf-tw-border-zinc-800 dark:tnf-tw-bg-zinc-950 dark:tnf-tw-ring-offset-zinc-950 dark:file:tnf-tw-text-zinc-50 dark:placeholder:tnf-tw-text-zinc-400 dark:focus-visible:tnf-tw-ring-zinc-300',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
