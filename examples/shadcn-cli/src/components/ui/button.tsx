import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'tnf-tw-inline-flex tnf-tw-items-center tnf-tw-justify-center tnf-tw-gap-2 tnf-tw-whitespace-nowrap tnf-tw-rounded-md tnf-tw-text-sm tnf-tw-font-medium tnf-tw-ring-offset-white tnf-tw-transition-colors focus-visible:tnf-tw-outline-none focus-visible:tnf-tw-ring-2 focus-visible:tnf-tw-ring-zinc-950 focus-visible:tnf-tw-ring-offset-2 disabled:tnf-tw-pointer-events-none disabled:tnf-tw-opacity-50 [&_svg]:tnf-tw-pointer-events-none [&_svg]:tnf-tw-size-4 [&_svg]:tnf-tw-shrink-0 dark:tnf-tw-ring-offset-zinc-950 dark:focus-visible:tnf-tw-ring-zinc-300',
  {
    variants: {
      variant: {
        default:
          'tnf-tw-bg-zinc-900 tnf-tw-text-zinc-50 hover:tnf-tw-bg-zinc-900/90 dark:tnf-tw-bg-zinc-50 dark:tnf-tw-text-zinc-900 dark:hover:tnf-tw-bg-zinc-50/90',
        destructive:
          'tnf-tw-bg-red-500 tnf-tw-text-zinc-50 hover:tnf-tw-bg-red-500/90 dark:tnf-tw-bg-red-900 dark:tnf-tw-text-zinc-50 dark:hover:tnf-tw-bg-red-900/90',
        outline:
          'tnf-tw-border tnf-tw-border-zinc-200 tnf-tw-bg-white hover:tnf-tw-bg-zinc-100 hover:tnf-tw-text-zinc-900 dark:tnf-tw-border-zinc-800 dark:tnf-tw-bg-zinc-950 dark:hover:tnf-tw-bg-zinc-800 dark:hover:tnf-tw-text-zinc-50',
        secondary:
          'tnf-tw-bg-zinc-100 tnf-tw-text-zinc-900 hover:tnf-tw-bg-zinc-100/80 dark:tnf-tw-bg-zinc-800 dark:tnf-tw-text-zinc-50 dark:hover:tnf-tw-bg-zinc-800/80',
        ghost:
          'hover:tnf-tw-bg-zinc-100 hover:tnf-tw-text-zinc-900 dark:hover:tnf-tw-bg-zinc-800 dark:hover:tnf-tw-text-zinc-50',
        link: 'tnf-tw-text-zinc-900 tnf-tw-underline-offset-4 hover:tnf-tw-underline dark:tnf-tw-text-zinc-50',
      },
      size: {
        default: 'tnf-tw-h-10 tnf-tw-px-4 tnf-tw-py-2',
        sm: 'tnf-tw-h-9 tnf-tw-rounded-md tnf-tw-px-3',
        lg: 'tnf-tw-h-11 tnf-tw-rounded-md tnf-tw-px-8',
        icon: 'tnf-tw-h-10 tnf-tw-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
