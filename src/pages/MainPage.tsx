// src/pages/MainPage.tsx
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { SheetGrid } from '@/components/grid/SheetGrid';
import { ValidationSummary } from '@/components/grid/ValidationSummary';
import { updateProductField, toggleValidation } from '@/lib/api/products';
import { mainColumns } from '@/lib/grid/column-defs-main';

export function MainPage() {
  const { products, loading } = useProducts();

  const handleEdit = async (id: string, key: string, value: any) => {
    await updateProductField(id, key, value);
  };

  const handleToggle = async (id: string) => {
    const record = products.find((p) => p.id === id);
    const next =
      record?.validation_status === 'validated' ? 'pending' : 'validated';
    await toggleValidation(id, next);
  };

  return (
    <div className="flex flex-col gap-4">
      <ValidationSummary products={products} />

      <SheetGrid
        loading={loading}
        products={products}
        columns={mainColumns}
        onChangeCell={handleEdit}
        onToggleValidated={handleToggle}
        mode="main"
      />
    </div>
  );
}
