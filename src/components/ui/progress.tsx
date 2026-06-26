import { cn } from '../../lib/utils';

export function Progress({ 
  value, 
  className, 
  indicatorClassName 
}: { 
  value: number; 
  className?: string; 
  indicatorClassName?: string; 
}) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div 
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all', 
          indicatorClassName
        )} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }} 
      />
    </div>
  );
}
