// src/components/LastSavedIndicator.tsx
import React from 'react';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

interface LastSavedIndicatorProps {
  lastSavedAt?: Date | null;
  isSaving: boolean;
  isOnline?: boolean;
}

export const LastSavedIndicator: React.FC<LastSavedIndicatorProps> = ({
  lastSavedAt,
  isSaving,
  isOnline = true,
}) => {
  let label = 'Not saved yet';
  if (lastSavedAt) {
    const diffMs = Date.now() - lastSavedAt.getTime();
    const diffMin = Math.round(diffMs / 60000);
    label = diffMin === 0 ? 'Just now' : `${diffMin} min ago`;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      {isSaving ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isOnline ? (
        <Cloud size={14} className="text-emerald-500" />
      ) : (
        <CloudOff size={14} className="text-rose-500" />
      )}
      <span className="font-medium">Last saved:</span>
      <span>{label}</span>
    </div>
  );
};
