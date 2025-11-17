import React from 'react';
import { cn } from './cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'border-4 border-slate-700 rounded-lg bg-white shadow-md p-4',
        className
      )}
    >
      {children}
    </div>
  );
};
