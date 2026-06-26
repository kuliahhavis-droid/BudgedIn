'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/* ─── AvatarRoot (wraps AvatarImage + AvatarFallback) ─── */
export function Avatar({
  src,
  fallback,
  size = 'md',
  className,
  children,
}: {
  src?: string | null;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}) {
  const sizeMap = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };

  // If used as compound component (with children), render children inside wrapper
  if (children) {
    return (
      <div className={cn('relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-primary/10 font-semibold text-primary shadow-sm', sizeMap[size], className)}>
        {children}
      </div>
    );
  }

  // If used as standalone with src/fallback props
  return (
    <AvatarRoot size={size} className={className}>
      {src ? <AvatarImage src={src} alt={fallback ?? ''} /> : null}
      <AvatarFallback name={fallback ?? ''} />
    </AvatarRoot>
  );
}

/* ─── Internal root wrapper ─── */
function AvatarRoot({ size = 'md', className, children }: { size?: 'sm' | 'md' | 'lg'; className?: string; children: React.ReactNode }) {
  const sizeMap = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };
  return (
    <div className={cn('relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-primary/10 font-semibold text-primary shadow-sm', sizeMap[size], className)}>
      {children}
    </div>
  );
}

/* ─── AvatarImage ─── */
export function AvatarImage({
  src,
  alt = '',
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [error, setError] = React.useState(false);
  if (!src || error) return null;

  // Auto-correct private Supabase Storage URLs to public URLs
  let imageUrl = src;
  if (imageUrl.includes('/storage/v1/object/') && !imageUrl.includes('/storage/v1/object/public/')) {
    imageUrl = imageUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      onError={() => setError(true)}
    />
  );
}

/* ─── AvatarFallback ─── */
export function AvatarFallback({
  name,
  children,
  className,
}: {
  name?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const initials = name
    ? name.trim().split(/\s+/).map((s) => (s[0] ?? '').toUpperCase()).join('').slice(0, 2)
    : '';
  return (
    <span className={cn('select-none text-current', className)}>
      {children ?? initials}
    </span>
  );
}
