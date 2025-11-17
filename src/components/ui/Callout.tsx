import React from 'react';
import { cn } from './cn';

interface CalloutProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ tone = 'info', icon, children }) => {
  const toneClasses: Record<string, string> = {
    info: 'bg-sky-50 border-sky-300 text-sky-800',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    danger: 'bg-rose-50 border-rose-300 text-rose-800',
  };

  return (
    <div className={cn('flex items-start gap-2 rounded-md border px-3 py-2 text-xs', toneClasses[tone])}>
      {icon && <div className="mt-[1px]">{icon}</div>}
      <div>{children}</div>
    </div>
  );
};
