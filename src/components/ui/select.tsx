'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Context ─── */
interface SelectContextValue {
  value: string;
  onChange: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error('Select compound components must be used within <Select>');
  return ctx;
}

/* ─── Select Root ─── */
export function Select({
  value,
  onValueChange,
  defaultValue = '',
  children,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const onChange = (val: string) => {
    if (!controlled) setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: current, onChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

/* ─── Trigger ─── */
export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useSelectContext();
  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={open}
      className={cn(
        'flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => setOpen((o) => !o)}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

/* ─── Value ─── */
export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelectContext();
  return <span className={cn(!value && 'text-slate-400')}>{value || placeholder}</span>;
}

/* ─── Content ─── */
export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useSelectContext();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 top-full z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in-0 zoom-in-95',
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Item ─── */
export function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: selected, onChange } = useSelectContext();
  const isSelected = selected === value;
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cn(
        'flex w-full cursor-pointer items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors',
        isSelected && 'bg-primary/10 text-primary font-medium',
        className
      )}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
}

/* ─── Group & Label (for completeness) ─── */
export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-4 py-1.5 text-xs font-medium text-slate-500', className)}>{children}</div>;
}

/* ─── Separator ─── */
export function SelectSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-slate-200', className)} />;
}
