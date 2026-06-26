'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

/* ─── Context ─── */
interface DropdownContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}
const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error('DropdownMenu compound components must be used within <DropdownMenu>');
  return ctx;
}

/* ─── DropdownMenu Root ─── */
export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

/* ─── Trigger ─── */
export function DropdownMenuTrigger({
  children,
  className,
  asChild = false,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const { open, setOpen, triggerRef } = useDropdownContext();

  const handleClick = () => setOpen((prev) => !prev);

  if (asChild && React.isValidElement(children)) {
    return (
      <div ref={triggerRef}>
        {React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
          onClick: handleClick,
        })}
      </div>
    );
  }

  return (
    <div ref={triggerRef}>
      <button
        type="button"
        className={cn('inline-flex items-center', className)}
        onClick={handleClick}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {children}
      </button>
    </div>
  );
}

/* ─── Content ─── */
export function DropdownMenuContent({
  children,
  className,
  align = 'end',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end';
}) {
  const { open, setOpen } = useDropdownContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    // Delay to avoid immediate close from the trigger click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="menu"
      className={cn(
        'absolute top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── MenuItem ─── */
export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

/* ─── Separator ─── */
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-slate-200', className)} role="separator" />;
}
