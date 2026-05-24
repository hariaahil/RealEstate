import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
};

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft',
  secondary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-soft',
  ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100',
  outline: 'border border-zinc-200 text-zinc-900 hover:bg-zinc-50',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-12 px-6',
  sm: 'h-10 px-4 text-sm',
  lg: 'h-14 px-8 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-60',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
