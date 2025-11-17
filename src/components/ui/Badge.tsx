import React from 'react';
import { cn } from './cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'green' | 'yellow' | 'red';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, ...rest }) => {
  let base =
    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border font-medium';
  let color =
    'bg-slate-100 text-slate-700 border-slate-300';

  if (variant === 'green')
    color = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  if (variant === 'yellow')
    color = 'bg-amber-50 text-amber-700 border-amber-300';
  if (variant === 'red')
    color = 'bg-rose-50 text-rose-700 border-rose-300';

  return <span className={cn(base, color, className)} {...rest} />;
};
