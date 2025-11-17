import React from 'react';
import { SheetColumn } from '../../lib/grid/column-defs-master';
import { Product } from '../../types/product';

interface GridCellProps {
  product: Product;
  column: SheetColumn;
  onChange: (value: string) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ product, column, onChange }) => {
  const value: any = (product as any)[column.key];
  const isMissingRequired =
    column.key === 'description' &&
    (!value || (typeof value === 'string' && value.trim().length === 0));

  if (!column.editable) {
    return (
      <td
        className={`border border-slate-400 px-2 py-1 text-[11px] ${
          isMissingRequired ? 'bg-rose-100' : 'bg-white'
        }`}
      >
        {typeof value === 'number' ? value : value ?? ''}
      </td>
    );
  }

  return (
    <td
      className={`border border-slate-400 px-0 py-0 ${
        isMissingRequired ? 'bg-rose-100' : 'bg-white'
      }`}
    >
      <input
        className="w-full h-full px-2 py-1 text-[11px] bg-transparent outline-none focus:bg-emerald-50"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  );
};
