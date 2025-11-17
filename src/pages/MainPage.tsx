import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { SheetGrid } from '../components/grid/SheetGrid';
import { ValidationSummary } from '../components/grid/ValidationSummary';
import { mainColumns } from '../lib/grid/column-defs-main';
import { Card } from '../components/ui/Card';
import { Callout } from '../components/ui/Callout';
import { ListChecks } from 'lucide-react';

export const MainPage: React.FC = () => {
  const { products, updateField, toggleValidation } = useProducts();

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-1">
        <ValidationSummary products={products} />
        <span className="text-[11px] text-slate-500">
          Main: reduced view for validation & location setup before syncing to Square/QuickBooks/Booker.
        </span>
      </div>
      <Callout tone="info" icon={<ListChecks size={14} />}>
        Validate each product once its description, price, and locations look correct.
        Only validated products can be synced to Square/QuickBooks/Booker.
      </Callout>
      <Card className="p-3 mt-2">
        <SheetGrid
          products={products}
          columns={mainColumns}
          onChangeCell={updateField}
          onToggleValidated={toggleValidation}
        />
      </Card>
    </>
  );
};
