// src/components/SheetGrid.tsx
import React, { useCallback } from 'react';
import { Product } from '../types';
import { CheckSquare2, Square, Image as ImageIcon } from 'lucide-react';

export interface SheetColumn {
  key: string;
  label: string;
  width?: string;
  editable?: boolean;
}

interface SheetGridProps {
  products: Product[];
  columns: SheetColumn[];
  mode: 'master' | 'main';
  onChangeCell: (productId: string, key: string, value: string) => void;
  onToggleValidated: (productId: string) => void;
}

export const SheetGrid: React.FC<SheetGridProps> = ({
  products,
  columns,
  mode,
  onChangeCell,
  onToggleValidated,
}) => {
  const getRowClass = useCallback((p: Product) => {
    if (p.validationStatus === 'validated') return 'bg-emerald-50';
    if (p.validationStatus === 'incomplete') return 'bg-rose-50';
    return 'bg-amber-50';
  }, []);

  return (
    <div className="border-4 border-slate-700 rounded-lg overflow-hidden shadow-md bg-slate-100">
      <div className="overflow-auto max-h-[70vh]">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-slate-800 text-slate-100 sticky top-0 z-10">
            <tr>
              <th className="border border-slate-600 px-2 py-1 w-8 text-center">#</th>
              <th className="border border-slate-600 px-2 py-1 w-8 text-center">Img</th>
              <th className="border border-slate-600 px-2 py-1 w-8 text-center">OK</th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="border border-slate-600 px-2 py-1 font-semibold text-left"
                  style={{ minWidth: col.width || '120px' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => {
              const rowClass = getRowClass(p);
              return (
                <tr key={p.id} className={`${rowClass} hover:bg-slate-200`}>
                  <td className="border border-slate-400 px-2 py-1 text-center text-[10px] text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-400 px-2 py-1 text-center">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
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
                      onClick={() => onToggleValidated(p.id)}
                      className="inline-flex items-center justify-center rounded border border-slate-500 bg-white hover:bg-emerald-50 transition-colors"
                    >
                      {p.validationStatus === 'validated' ? (
                        <CheckSquare2 size={14} className="text-emerald-600" />
                      ) : (
                        <Square size={14} className="text-slate-500" />
                      )}
                    </button>
                  </td>

                  {columns.map(col => {
                    const value: any = (p as any)[col.key];
                    const isMissingRequired =
                      col.key === 'description' &&
                      (!value || value.trim().length === 0);

                    if (!col.editable) {
                      return (
                        <td
                          key={col.key}
                          className={`border border-slate-400 px-2 py-1 ${
                            isMissingRequired ? 'bg-rose-100' : 'bg-white'
                          }`}
                        >
                          {typeof value === 'number' ? value : value ?? ''}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        className={`border border-slate-400 px-0 py-0 ${
                          isMissingRequired ? 'bg-rose-100' : 'bg-white'
                        }`}
                      >
                        <input
                          className="w-full h-full px-2 py-1 text-xs bg-transparent outline-none focus:bg-emerald-50"
                          value={value ?? ''}
                          onChange={(e) =>
                            onChangeCell(p.id, col.key, e.target.value)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="border border-slate-400 px-4 py-6 text-center text-slate-500 bg-slate-50"
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
