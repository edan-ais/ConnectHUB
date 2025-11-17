import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { SheetGrid } from '../components/grid/SheetGrid';
import { ValidationSummary } from '../components/grid/ValidationSummary';
import { masterColumns } from '../lib/grid/column-defs-master';
import { Card } from '../components/ui/Card';

export const MasterPage: React.FC = () => {
  const { products, updateField, toggleValidation } = useProducts();

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-1">
        <ValidationSummary products={products} />
        <span className="text-[11px] text-slate-500">
          Master: all fields, including raw Faire data and manual adjustments.
        </span>
      </div>
      <Card className="p-3">
        <SheetGrid
          products={products}
          columns={masterColumns}
          onChangeCell={updateField}
          onToggleValidated={toggleValidation}
        />
      </Card>
    </>
  );
};
