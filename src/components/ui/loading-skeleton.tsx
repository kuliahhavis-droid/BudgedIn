import * as React from 'react';
import { cn } from '../../lib/utils';

/* ─── Base Skeleton ─── */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200', className)}
      {...props}
    />
  );
}

/* ─── Card Skeleton (mimics StatCard) ─── */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft',
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1 animate-pulse bg-slate-200" />
      <div className="flex items-start justify-between pl-1">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-11 w-11 rounded-2xl" />
      </div>
    </div>
  );
}

/* ─── Table Skeleton ─── */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft', className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-slate-100 px-6 py-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`hdr-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 border-b border-slate-50 px-6 py-4 last:border-b-0">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Chart Skeleton ─── */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft',
        className
      )}
    >
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="mt-6 flex items-end gap-3">
        {[40, 65, 50, 80, 55, 70, 45, 75, 60, 85, 50, 70].map((h, i) => (
          <Skeleton
            key={`bar-${i}`}
            className="flex-1 rounded-t-lg"
            style={{ height: `${h}%`, minHeight: `${h * 1.6}px` }}
          />
        ))}
      </div>
    </div>
  );
}
