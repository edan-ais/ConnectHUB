import React from 'react';
import {
  FileSpreadsheet,
  ListChecks,
  PlusSquare,
  BarChart3,
  ListTree,
} from 'lucide-react';
import type { SheetTabKey } from '../../App';

interface TabBarProps {
  activeTab: SheetTabKey;
  onChangeTab: (tab: SheetTabKey) => void;
}

const tabs: { key: SheetTabKey; label: string; colorClass: string; icon: React.ReactNode }[] = [
  { key: 'master', label: 'Master', colorClass: 'bg-blue-500', icon: <FileSpreadsheet size={16} /> },
  { key: 'main', label: 'Main', colorClass: 'bg-emerald-500', icon: <ListChecks size={16} /> },
  { key: 'intake', label: 'Intake', colorClass: 'bg-purple-500', icon: <PlusSquare size={16} /> },
  { key: 'reports', label: 'Reports', colorClass: 'bg-orange-500', icon: <BarChart3 size={16} /> },
  { key: 'log', label: 'Log', colorClass: 'bg-slate-500', icon: <ListTree size={16} /> },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="w-full border-t border-slate-300 bg-slate-50 px-3 py-2 flex gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={[
              'flex items-center gap-1 rounded-t px-3 py-1 text-xs font-medium border-2',
              'transition-all duration-150',
              isActive
                ? `${tab.colorClass} text-white border-slate-700 shadow-sm`
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100',
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
