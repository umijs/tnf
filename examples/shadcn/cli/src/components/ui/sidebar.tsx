import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              'tnf-tw-group/sidebar-wrapper tnf-tw-flex tnf-tw-min-h-svh tnf-tw-w-full has-[[data-variant=inset]]:tnf-tw-bg-sidebar',
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
  }
>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === 'none') {
      return (
        <div
          className={cn(
            'tnf-tw-flex tnf-tw-h-full tnf-tw-w-[--sidebar-width] tnf-tw-flex-col tnf-tw-bg-sidebar tnf-tw-text-sidebar-foreground',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="tnf-tw-w-[--sidebar-width] tnf-tw-bg-sidebar tnf-tw-p-0 tnf-tw-text-sidebar-foreground [&>button]:tnf-tw-hidden"
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="tnf-tw-flex tnf-tw-h-full tnf-tw-w-full tnf-tw-flex-col">
              {children}
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="tnf-tw-group tnf-tw-peer tnf-tw-hidden md:tnf-tw-block tnf-tw-text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            'tnf-tw-duration-200 tnf-tw-relative tnf-tw-h-svh tnf-tw-w-[--sidebar-width] tnf-tw-bg-transparent tnf-tw-transition-[width] tnf-tw-ease-linear',
            'group-data-[collapsible=offcanvas]:tnf-tw-w-0',
            'group-data-[side=right]:tnf-tw-rotate-180',
            variant === 'floating' || variant === 'inset'
              ? 'group-data-[collapsible=icon]:tnf-tw-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
              : 'group-data-[collapsible=icon]:tnf-tw-w-[--sidebar-width-icon]',
          )}
        />
        <div
          className={cn(
            'tnf-tw-duration-200 tnf-tw-fixed tnf-tw-inset-y-0 tnf-tw-z-10 tnf-tw-hidden tnf-tw-h-svh tnf-tw-w-[--sidebar-width] tnf-tw-transition-[left,right,width] tnf-tw-ease-linear md:tnf-tw-flex',
            side === 'left'
              ? 'tnf-tw-left-0 group-data-[collapsible=offcanvas]:tnf-tw-left-[calc(var(--sidebar-width)*-1)]'
              : 'tnf-tw-right-0 group-data-[collapsible=offcanvas]:tnf-tw-right-[calc(var(--sidebar-width)*-1)]',
            // Adjust the padding for floating and inset variants.
            variant === 'floating' || variant === 'inset'
              ? 'tnf-tw-p-2 group-data-[collapsible=icon]:tnf-tw-w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
              : 'group-data-[collapsible=icon]:tnf-tw-w-[--sidebar-width-icon] group-data-[side=left]:tnf-tw-border-r group-data-[side=right]:tnf-tw-border-l',
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="tnf-tw-flex tnf-tw-h-full tnf-tw-w-full tnf-tw-flex-col tnf-tw-bg-sidebar group-data-[variant=floating]:tnf-tw-rounded-lg group-data-[variant=floating]:tnf-tw-border group-data-[variant=floating]:tnf-tw-border-sidebar-border group-data-[variant=floating]:tnf-tw-shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn('tnf-tw-h-7 tnf-tw-w-7', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="tnf-tw-sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'tnf-tw-absolute tnf-tw-inset-y-0 tnf-tw-z-20 tnf-tw-hidden tnf-tw-w-4 tnf-tw--translate-x-1/2 tnf-tw-transition-all tnf-tw-ease-linear after:tnf-tw-absolute after:tnf-tw-inset-y-0 after:tnf-tw-left-1/2 after:tnf-tw-w-[2px] hover:after:tnf-tw-bg-sidebar-border group-data-[side=left]:tnf-tw--right-4 group-data-[side=right]:tnf-tw-left-0 sm:tnf-tw-flex',
        '[[data-side=left]_&]:tnf-tw-cursor-w-resize [[data-side=right]_&]:tnf-tw-cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:tnf-tw-cursor-e-resize [[data-side=right][data-state=collapsed]_&]:tnf-tw-cursor-w-resize',
        'group-data-[collapsible=offcanvas]:tnf-tw-translate-x-0 group-data-[collapsible=offcanvas]:after:tnf-tw-left-full group-data-[collapsible=offcanvas]:hover:tnf-tw-bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:tnf-tw--right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:tnf-tw--left-2',
        className,
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        'tnf-tw-relative tnf-tw-flex tnf-tw-min-h-svh tnf-tw-flex-1 tnf-tw-flex-col tnf-tw-bg-white dark:tnf-tw-bg-zinc-950',
        'peer-data-[variant=inset]:tnf-tw-min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:tnf-tw-m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:tnf-tw-ml-2 md:peer-data-[variant=inset]:tnf-tw-ml-0 md:peer-data-[variant=inset]:tnf-tw-rounded-xl md:peer-data-[variant=inset]:tnf-tw-shadow',
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        'tnf-tw-h-8 tnf-tw-w-full tnf-tw-bg-white tnf-tw-shadow-none focus-visible:tnf-tw-ring-2 focus-visible:tnf-tw-ring-sidebar-ring dark:tnf-tw-bg-zinc-950',
        className,
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        'tnf-tw-flex tnf-tw-flex-col tnf-tw-gap-2 tnf-tw-p-2',
        className,
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        'tnf-tw-flex tnf-tw-flex-col tnf-tw-gap-2 tnf-tw-p-2',
        className,
      )}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn(
        'tnf-tw-mx-2 tnf-tw-w-auto tnf-tw-bg-sidebar-border',
        className,
      )}
      {...props}
    />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        'tnf-tw-flex tnf-tw-min-h-0 tnf-tw-flex-1 tnf-tw-flex-col tnf-tw-gap-2 tnf-tw-overflow-auto group-data-[collapsible=icon]:tnf-tw-overflow-hidden',
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        'tnf-tw-relative tnf-tw-flex tnf-tw-w-full tnf-tw-min-w-0 tnf-tw-flex-col tnf-tw-p-2',
        className,
      )}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'tnf-tw-duration-200 tnf-tw-flex tnf-tw-h-8 tnf-tw-shrink-0 tnf-tw-items-center tnf-tw-rounded-md tnf-tw-px-2 tnf-tw-text-xs tnf-tw-font-medium tnf-tw-text-sidebar-foreground/70 tnf-tw-outline-none tnf-tw-ring-sidebar-ring tnf-tw-transition-[margin,opa] tnf-tw-ease-linear focus-visible:tnf-tw-ring-2 [&>svg]:tnf-tw-size-4 [&>svg]:tnf-tw-shrink-0',
        'group-data-[collapsible=icon]:tnf-tw--mt-8 group-data-[collapsible=icon]:tnf-tw-opacity-0',
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        'tnf-tw-absolute tnf-tw-right-3 tnf-tw-top-3.5 tnf-tw-flex tnf-tw-aspect-square tnf-tw-w-5 tnf-tw-items-center tnf-tw-justify-center tnf-tw-rounded-md tnf-tw-p-0 tnf-tw-text-sidebar-foreground tnf-tw-outline-none tnf-tw-ring-sidebar-ring tnf-tw-transition-transform hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground focus-visible:tnf-tw-ring-2 [&>svg]:tnf-tw-size-4 [&>svg]:tnf-tw-shrink-0',
        // Increases the hit area of the button on mobile.
        'after:tnf-tw-absolute after:tnf-tw--inset-2 after:md:tnf-tw-hidden',
        'group-data-[collapsible=icon]:tnf-tw-hidden',
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn('tnf-tw-w-full tnf-tw-text-sm', className)}
    {...props}
  />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn(
      'tnf-tw-flex tnf-tw-w-full tnf-tw-min-w-0 tnf-tw-flex-col tnf-tw-gap-1',
      className,
    )}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn('tnf-tw-group/menu-item tnf-tw-relative', className)}
    {...props}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'tnf-tw-peer/menu-button tnf-tw-flex tnf-tw-w-full tnf-tw-items-center tnf-tw-gap-2 tnf-tw-overflow-hidden tnf-tw-rounded-md tnf-tw-p-2 tnf-tw-text-left tnf-tw-text-sm tnf-tw-outline-none tnf-tw-ring-sidebar-ring tnf-tw-transition-[width,height,padding] hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground focus-visible:tnf-tw-ring-2 active:tnf-tw-bg-sidebar-accent active:tnf-tw-text-sidebar-accent-foreground disabled:tnf-tw-pointer-events-none disabled:tnf-tw-opacity-50 tnf-tw-group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:tnf-tw-pointer-events-none aria-disabled:tnf-tw-opacity-50 data-[active=true]:tnf-tw-bg-sidebar-accent data-[active=true]:tnf-tw-font-medium data-[active=true]:tnf-tw-text-sidebar-accent-foreground data-[state=open]:hover:tnf-tw-bg-sidebar-accent data-[state=open]:hover:tnf-tw-text-sidebar-accent-foreground group-data-[collapsible=icon]:tnf-tw-!size-8 group-data-[collapsible=icon]:tnf-tw-!p-2 [&>span:last-child]:tnf-tw-truncate [&>svg]:tnf-tw-size-4 [&>svg]:tnf-tw-shrink-0',
  {
    variants: {
      variant: {
        default:
          'hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground',
        outline:
          'tnf-tw-bg-white tnf-tw-shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground hover:tnf-tw-shadow-[0_0_0_1px_hsl(var(--sidebar-accent))] dark:tnf-tw-bg-zinc-950',
      },
      size: {
        default: 'tnf-tw-h-8 tnf-tw-text-sm',
        sm: 'tnf-tw-h-7 tnf-tw-text-xs',
        lg: 'tnf-tw-h-12 tnf-tw-text-sm group-data-[collapsible=icon]:tnf-tw-!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== 'collapsed' || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        'tnf-tw-absolute tnf-tw-right-1 tnf-tw-top-1.5 tnf-tw-flex tnf-tw-aspect-square tnf-tw-w-5 tnf-tw-items-center tnf-tw-justify-center tnf-tw-rounded-md tnf-tw-p-0 tnf-tw-text-sidebar-foreground tnf-tw-outline-none tnf-tw-ring-sidebar-ring tnf-tw-transition-transform hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground focus-visible:tnf-tw-ring-2 tnf-tw-peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:tnf-tw-size-4 [&>svg]:tnf-tw-shrink-0',
        // Increases the hit area of the button on mobile.
        'after:tnf-tw-absolute after:tnf-tw--inset-2 after:md:tnf-tw-hidden',
        'tnf-tw-peer-data-[size=sm]/menu-button:top-1',
        'tnf-tw-peer-data-[size=default]/menu-button:top-1.5',
        'tnf-tw-peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:tnf-tw-hidden',
        showOnHover &&
          'tnf-tw-group-focus-within/menu-item:opacity-100 tnf-tw-group-hover/menu-item:opacity-100 data-[state=open]:tnf-tw-opacity-100 tnf-tw-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:tnf-tw-opacity-0',
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      'tnf-tw-absolute tnf-tw-right-1 tnf-tw-flex tnf-tw-h-5 tnf-tw-min-w-5 tnf-tw-items-center tnf-tw-justify-center tnf-tw-rounded-md tnf-tw-px-1 tnf-tw-text-xs tnf-tw-font-medium tnf-tw-tabular-nums tnf-tw-text-sidebar-foreground tnf-tw-select-none tnf-tw-pointer-events-none',
      'tnf-tw-peer-hover/menu-button:text-sidebar-accent-foreground tnf-tw-peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'tnf-tw-peer-data-[size=sm]/menu-button:top-1',
      'tnf-tw-peer-data-[size=default]/menu-button:top-1.5',
      'tnf-tw-peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:tnf-tw-hidden',
      className,
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn(
        'tnf-tw-rounded-md tnf-tw-h-8 tnf-tw-flex tnf-tw-gap-2 tnf-tw-px-2 tnf-tw-items-center',
        className,
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="tnf-tw-size-4 tnf-tw-rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="tnf-tw-h-4 tnf-tw-flex-1 tnf-tw-max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'tnf-tw-mx-3.5 tnf-tw-flex tnf-tw-min-w-0 tnf-tw-translate-x-px tnf-tw-flex-col tnf-tw-gap-1 tnf-tw-border-l tnf-tw-border-sidebar-border tnf-tw-px-2.5 tnf-tw-py-0.5',
      'group-data-[collapsible=icon]:tnf-tw-hidden',
      className,
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'tnf-tw-flex tnf-tw-h-7 tnf-tw-min-w-0 tnf-tw--translate-x-px tnf-tw-items-center tnf-tw-gap-2 tnf-tw-overflow-hidden tnf-tw-rounded-md tnf-tw-px-2 tnf-tw-text-sidebar-foreground tnf-tw-outline-none tnf-tw-ring-sidebar-ring hover:tnf-tw-bg-sidebar-accent hover:tnf-tw-text-sidebar-accent-foreground focus-visible:tnf-tw-ring-2 active:tnf-tw-bg-sidebar-accent active:tnf-tw-text-sidebar-accent-foreground disabled:tnf-tw-pointer-events-none disabled:tnf-tw-opacity-50 aria-disabled:tnf-tw-pointer-events-none aria-disabled:tnf-tw-opacity-50 [&>span:last-child]:tnf-tw-truncate [&>svg]:tnf-tw-size-4 [&>svg]:tnf-tw-shrink-0 [&>svg]:tnf-tw-text-sidebar-accent-foreground',
        'data-[active=true]:tnf-tw-bg-sidebar-accent data-[active=true]:tnf-tw-text-sidebar-accent-foreground',
        size === 'sm' && 'tnf-tw-text-xs',
        size === 'md' && 'tnf-tw-text-sm',
        'group-data-[collapsible=icon]:tnf-tw-hidden',
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
