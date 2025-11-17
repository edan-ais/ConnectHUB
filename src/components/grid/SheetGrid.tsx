import React from 'react';
import { Product } from '../../types/product';
import { SheetColumn } from '../../lib/grid/column-defs-master';
import { GridHeader } from './GridHeader';
import { GridRow } from './GridRow';

interface SheetGridProps {
  products: Product[];
  columns: SheetColumn[];
  onChangeCell: (productId: string, key: string, value: string) => void;
  onToggleValidated: (productId: string) => void;
}

export const SheetGrid: React.FC<SheetGridProps> = ({
  products,
  columns,
  onChangeCell,
  onToggleValidated,
}) => {
  return (
    <div className="border-4 border-slate-700 rounded-lg overflow-hidden shadow-md bg-slate-100">
      <div className="overflow-auto max-h-[70vh]">
        <table className="min-w-full border-collapse text-xs">
          <GridHeader columns={columns} />
          <tbody>
            {products.map((p, idx) => (
              <GridRow
                key={p.id}
                index={idx}
                product={p}
                columns={columns}
                onChangeCell={(key, value) => onChangeCell(p.id, key, value)}
                onToggleValidated={() => onToggleValidated(p.id)}
              />
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  className="border border-slate-400 px-4 py-6 text-center text-slate-500 bg-slate-50"
                  colSpan={columns.length + 3}
                >
                  No products yet. Import from Faire or add via Intake.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
