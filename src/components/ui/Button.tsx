import React from 'react';
import { cn } from './cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-700';

  const variants: Record<string, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    outline:
      'border border-slate-400 bg-white text-slate-700 hover:bg-slate-100',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  );
};
