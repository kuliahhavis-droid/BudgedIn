'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-soft backdrop-blur-sm transition-all duration-300 hover:shadow-glow',
        className
      )}
    >
      {/* Gradient left border accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-secondary" />

      <div className="p-6 pl-7">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>

            {trend && (
              <div className="mt-3 flex items-center gap-1.5">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
