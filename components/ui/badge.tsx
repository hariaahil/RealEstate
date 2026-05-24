import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'success' | 'outline';
};

const badgeStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-zinc-900 text-white',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  outline: 'border border-zinc-200 text-zinc-900 bg-white',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <div className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', badgeStyles[variant], className)} {...props} />;
}
