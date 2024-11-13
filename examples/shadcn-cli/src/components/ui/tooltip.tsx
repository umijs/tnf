import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'tnf-tw-z-50 tnf-tw-overflow-hidden tnf-tw-rounded-md tnf-tw-border tnf-tw-border-zinc-200 tnf-tw-bg-white tnf-tw-px-3 tnf-tw-py-1.5 tnf-tw-text-sm tnf-tw-text-zinc-950 tnf-tw-shadow-md tnf-tw-animate-in tnf-tw-fade-in-0 tnf-tw-zoom-in-95 data-[state=closed]:tnf-tw-animate-out data-[state=closed]:tnf-tw-fade-out-0 data-[state=closed]:tnf-tw-zoom-out-95 data-[side=bottom]:tnf-tw-slide-in-from-top-2 data-[side=left]:tnf-tw-slide-in-from-right-2 data-[side=right]:tnf-tw-slide-in-from-left-2 data-[side=top]:tnf-tw-slide-in-from-bottom-2 dark:tnf-tw-border-zinc-800 dark:tnf-tw-bg-zinc-950 dark:tnf-tw-text-zinc-50',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
