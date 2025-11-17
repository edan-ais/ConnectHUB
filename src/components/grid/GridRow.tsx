import React from 'react';
import { Product } from '../../types/product';
import { SheetColumn } from '../../lib/grid/column-defs-master';
import { GridCell } from './GridCell';
import { rowClassName } from '../../lib/grid/row-class';
import { CheckSquare2, Square, Image as ImageIcon } from 'lucide-react';

interface GridRowProps {
  index: number;
  product: Product;
  columns: SheetColumn[];
  onChangeCell: (key: string, value: string) => void;
  onToggleValidated: () => void;
}

export const GridRow: React.FC<GridRowProps> = ({
  index,
  product,
  columns,
  onChangeCell,
  onToggleValidated,
}) => {
  return (
    <tr className={rowClassName(product)}>
      <td className="border border-slate-400 px-2 py-1 text-center text-[10px] text-slate-500">
        {index + 1}
      </td>
      <td className="border border-slate-400 px-2 py-1 text-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="inline-block h-8 w-8 rounded object-cover border border-slate-400 bg-white"
          />
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-dashed border-slate-400 text-slate-400 bg-slate-50">
            <ImageIcon size={14} />
          </span>
        )}
      </td>
      <td className="border border-slate-400 px-2 py-1 text-center">
        <button
          type="button"
          onClick={onToggleValidated}
          className="inline-flex items-center justify-center rounded border border-slate-500 bg-white hover:bg-emerald-50 transition-colors"
        >
          {product.validationStatus === 'validated' ? (
            <CheckSquare2 size={14} className="text-emerald-600" />
          ) : (
            <Square size={14} className="text-slate-500" />
          )}
        </button>
      </td>
      {columns.map((col) => (
        <GridCell
          key={col.key}
          product={product}
          column={col}
          onChange={(val) => onChangeCell(col.key, val)}
        />
      ))}
    </tr>
  );
};
