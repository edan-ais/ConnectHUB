// src/AppShell.tsx
import React, { useEffect, useState } from 'react';
import { SheetTabs } from './components/SheetTabs';
import { ValidationSummary } from './components/ValidationSummary';
import { LastSavedIndicator } from './components/LastSavedIndicator';
import { SheetGrid, SheetColumn } from './components/SheetGrid';
import { Product } from './types';
import { Loader2 } from 'lucide-react';

type SheetTabKey = 'master' | 'main' | 'intake' | 'reports' | 'log';

const masterColumns: SheetColumn[] = [
  { key: 'sku', label: 'SKU', editable: true, width: '120px' },
  { key: 'name', label: 'Name', editable: true, width: '220px' },
  { key: 'description', label: 'Description', editable: true, width: '260px' },
  { key: 'vendor', label: 'Vendor', editable: true },
  { key: 'category', label: 'Category', editable: true },
  { key: 'newInventory', label: 'New Inv', editable: true, width: '80px' },
  { key: 'onHandInventory', label: 'On Hand', editable: true, width: '80px' },
];

const mainColumns: SheetColumn[] = [
  { key: 'sku', label: 'SKU', editable: false, width: '120px' },
  { key: 'name', label: 'Name', editable: true, width: '220px' },
  { key: 'description', label: 'Description', editable: true, width: '260px' },
  { key: 'category', label: 'Category', editable: true, width: '140px' },
  { key: 'onHandInventory', label: 'On Hand', editable: true, width: '80px' },
  { key: 'newInventory', label: 'On Order', editable: true, width: '80px' },
];

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SheetTabKey>('main');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // TODO: replace with real API call (Supabase / Netlify function)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChangeCell = async (productId: string, key: string, value: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, [key]: key === 'newInventory' || key === 'onHandInventory' ? Number(value) || 0 : value }
          : p
      )
    );

    setSaving(true);
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      setLastSavedAt(new Date());
    } catch (err) {
      console.error('Save failed', err);
      // You can add callout / toast here
    } finally {
      setSaving(false);
    }
  };

  const handleToggleValidated = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const nextStatus =
      product.validationStatus === 'validated' ? 'pending' : 'validated';

    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, validationStatus: nextStatus } : p
      )
    );

    setSaving(true);
    try {
      await fetch(`/api/products/${productId}/validation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validationStatus: nextStatus }),
      });
      setLastSavedAt(new Date());
    } catch (err) {
      console.error('Failed to update validation', err);
    } finally {
      setSaving(false);
    }
  };

  const currentColumns = activeTab === 'master' ? masterColumns : mainColumns;

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-slate-700 bg-slate-900 text-slate-50 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">ConnectHUB Inventory Grid</h1>
          <p className="text-xs text-slate-300">
            Faire ➜ ConnectHUB (Source of Truth) ➜ Square · QuickBooks · Booker
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <LastSavedIndicator lastSavedAt={lastSavedAt} isSaving={saving} />
          {loading && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
              <Loader2 size={12} className="animate-spin" />
              Syncing products&hellip;
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-4 flex flex-col gap-3">
        {(activeTab === 'master' || activeTab === 'main') && (
          <>
            <div className="flex items-center justify-between gap-3">
              <ValidationSummary products={products} />
              {/* Quick filters could live here (e.g. "Needs description", "Salty Tails only") */}
            </div>

            <SheetGrid
              products={products}
              columns={currentColumns}
              mode={activeTab}
              onChangeCell={handleChangeCell}
              onToggleValidated={handleToggleValidated}
            />
          </>
        )}

        {activeTab === 'intake' && (
          <section className="border-4 border-slate-700 rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-sm font-semibold mb-2">Manual Intake</h2>
            <p className="text-xs text-slate-600 mb-4">
              Use this form for any products or adjustments that don’t originate from Faire.
              On submit, entries are added/updated in the Master sheet.
            </p>
            {/* TODO: build full intake form (React Hook Form, validation, etc.) */}
            <div className="text-xs text-slate-400">
              (Form UI to be implemented next.)
            </div>
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="border-4 border-slate-700 rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-sm font-semibold mb-2">Reporting</h2>
            <p className="text-xs text-slate-600 mb-2">
              Snapshot of sales, low stock alerts, and reorder behaviors based on the grid.
            </p>
            <div className="text-xs text-slate-400">
              (Charts & tables to be added here – e.g., top vendors, stockouts, location-level inventory.)
            </div>
          </section>
        )}

        {activeTab === 'log' && (
          <section className="border-4 border-slate-700 rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-sm font-semibold mb-2">Action Log</h2>
            <p className="text-xs text-slate-600 mb-2">
              Every import, validation change, and sync to Square/QuickBooks/Booker
              will appear here for full oversight.
            </p>
            <div className="text-xs text-slate-400">
              (Log table UI + filters will plug into /api/logs.)
            </div>
          </section>
        )}
      </main>

      {/* Tabs */}
      <SheetTabs active={activeTab} onChange={setActiveTab} />
    </div>
  );
};
