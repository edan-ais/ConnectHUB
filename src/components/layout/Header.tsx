import React from 'react';
import { Loader2, Cloud } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import {
  productsLoadingState,
  productsSavingState,
} from '../../state/productAtom';
import { useLastSaved } from '../../hooks/useLastSaved';
import { formatLastSaved } from '../../lib/utils/format';

export const Header: React.FC = () => {
  const loading = useRecoilValue(productsLoadingState);
  const saving = useRecoilValue(productsSavingState);
  const { lastSavedAt } = useLastSaved();

  return (
    <header className="border-b-4 border-slate-700 bg-slate-900 text-slate-50 px-6 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold tracking-tight">ConnectHUB Inventory Grid</h1>
        <p className="text-xs text-slate-300">
          Faire ➜ ConnectHUB (Source of Truth) ➜ Square · QuickBooks · Booker
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-xs text-slate-200">
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Cloud size={14} className="text-emerald-400" />
          )}
          <span className="font-semibold">Last saved:</span>
          <span>{formatLastSaved(lastSavedAt || undefined)}</span>
        </div>

        {loading && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
            <Loader2 size={12} className="animate-spin" />
            Syncing products…
          </span>
        )}
      </div>
    </header>
  );
};
