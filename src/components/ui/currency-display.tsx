import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showSign?: boolean;
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function CurrencyDisplay({ amount, className, showSign = false }: CurrencyDisplayProps) {
  const formatted = formatter.format(Math.abs(amount));
  const sign = amount >= 0 ? '+' : '-';

  const colorClass = showSign
    ? amount >= 0
      ? 'text-emerald-600'
      : 'text-red-600'
    : '';

  return (
    <span className={cn('tabular-nums', colorClass, className)}>
      {showSign && sign}
      {showSign && amount < 0 ? formatted : formatter.format(amount)}
    </span>
  );
}
