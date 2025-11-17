// src/components/SheetTabs.tsx
import React from 'react';
import { FileSpreadsheet, ListChecks, PlusSquare, BarChart3, ListTree } from 'lucide-react';

type SheetTabKey = 'master' | 'main' | 'intake' | 'reports' | 'log';

interface SheetTabsProps {
  active: SheetTabKey;
  onChange: (tab: SheetTabKey) => void;
}

const tabConfig: { key: SheetTabKey; label: string; icon: React.ReactNode; colorClass: string }[] = [
  { key: 'master',  label: 'Master',  icon: <FileSpreadsheet size={16} />, colorClass: 'bg-blue-500' },
  { key: 'main',    label: 'Main',    icon: <ListChecks size={16} />,      colorClass: 'bg-emerald-500' },
  { key: 'intake',  label: 'Intake',  icon: <PlusSquare size={16} />,      colorClass: 'bg-purple-500' },
  { key: 'reports', label: 'Reports', icon: <BarChart3 size={16} />,       colorClass: 'bg-orange-500' },
  { key: 'log',     label: 'Log',     icon: <ListTree size={16} />,        colorClass: 'bg-slate-500' },
];

export const SheetTabs: React.FC<SheetTabsProps> = ({ active, onChange }) => {
  return (
    <div className="w-full border-t border-slate-300 bg-slate-50 px-3 py-2 flex gap-2">
      {tabConfig.map(tab => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={[
              'flex items-center gap-1 rounded-t px-3 py-1 text-xs font-medium border-2',
              'transition-all duration-150',
              isActive
                ? `${tab.colorClass} text-white border-slate-700 shadow-sm`
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            ].join(' ')}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
