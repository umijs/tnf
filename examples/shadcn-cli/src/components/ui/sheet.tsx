'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { type VariantProps, cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'tnf-tw-fixed tnf-tw-inset-0 tnf-tw-z-50 tnf-tw-bg-black/80 tnf-tw- data-[state=open]:tnf-tw-animate-in data-[state=closed]:tnf-tw-animate-out data-[state=closed]:tnf-tw-fade-out-0 data-[state=open]:tnf-tw-fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'tnf-tw-fixed tnf-tw-z-50 tnf-tw-gap-4 tnf-tw-bg-white tnf-tw-p-6 tnf-tw-shadow-lg tnf-tw-transition tnf-tw-ease-in-out data-[state=open]:tnf-tw-animate-in data-[state=closed]:tnf-tw-animate-out data-[state=closed]:tnf-tw-duration-300 data-[state=open]:tnf-tw-duration-500 dark:tnf-tw-bg-zinc-950',
  {
    variants: {
      side: {
        top: 'tnf-tw-inset-x-0 tnf-tw-top-0 tnf-tw-border-b data-[state=closed]:tnf-tw-slide-out-to-top data-[state=open]:tnf-tw-slide-in-from-top',
        bottom:
          'tnf-tw-inset-x-0 tnf-tw-bottom-0 tnf-tw-border-t data-[state=closed]:tnf-tw-slide-out-to-bottom data-[state=open]:tnf-tw-slide-in-from-bottom',
        left: 'tnf-tw-inset-y-0 tnf-tw-left-0 tnf-tw-h-full tnf-tw-w-3/4 tnf-tw-border-r data-[state=closed]:tnf-tw-slide-out-to-left data-[state=open]:tnf-tw-slide-in-from-left sm:tnf-tw-max-w-sm',
        right:
          'tnf-tw-inset-y-0 tnf-tw-right-0 tnf-tw-h-full tnf-tw-w-3/4 tnf-tw- tnf-tw-border-l data-[state=closed]:tnf-tw-slide-out-to-right data-[state=open]:tnf-tw-slide-in-from-right sm:tnf-tw-max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="tnf-tw-absolute tnf-tw-right-4 tnf-tw-top-4 tnf-tw-rounded-sm tnf-tw-opacity-70 tnf-tw-ring-offset-white tnf-tw-transition-opacity hover:tnf-tw-opacity-100 focus:tnf-tw-outline-none focus:tnf-tw-ring-2 focus:tnf-tw-ring-zinc-950 focus:tnf-tw-ring-offset-2 disabled:tnf-tw-pointer-events-none data-[state=open]:tnf-tw-bg-zinc-100 dark:tnf-tw-ring-offset-zinc-950 dark:focus:tnf-tw-ring-zinc-300 dark:data-[state=open]:tnf-tw-bg-zinc-800">
        <X className="tnf-tw-h-4 tnf-tw-w-4" />
        <span className="tnf-tw-sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'tnf-tw-flex tnf-tw-flex-col tnf-tw-space-y-2 tnf-tw-text-center sm:tnf-tw-text-left',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'tnf-tw-flex tnf-tw-flex-col-reverse sm:tnf-tw-flex-row sm:tnf-tw-justify-end sm:tnf-tw-space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'tnf-tw-text-lg tnf-tw-font-semibold tnf-tw-text-zinc-950 dark:tnf-tw-text-zinc-50',
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      'tnf-tw-text-sm tnf-tw-text-zinc-500 dark:tnf-tw-text-zinc-400',
      className,
    )}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
