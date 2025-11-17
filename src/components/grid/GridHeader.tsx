import React from 'react';
import { SheetColumn } from '../../lib/grid/column-defs-master';

interface GridHeaderProps {
  columns: SheetColumn[];
}

export const GridHeader: React.FC<GridHeaderProps> = ({ columns }) => {
  return (
    <thead className="bg-slate-800 text-slate-100 sticky top-0 z-10">
      <tr>
        <th className="border border-slate-600 px-2 py-1 w-8 text-center text-[10px]">
          #
        </th>
        <th className="border border-slate-600 px-2 py-1 w-10 text-center text-[10px]">
          Img
        </th>
        <th className="border border-slate-600 px-2 py-1 w-10 text-center text-[10px]">
          OK
        </th>
        {columns.map((col) => (
          <th
            key={col.key}
            className="border border-slate-600 px-2 py-1 font-semibold text-left text-[11px]"
            style={{ minWidth: col.width || '120px' }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
