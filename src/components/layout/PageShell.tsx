import React from 'react';
import { Header } from './Header';
import { TabBar } from './TabBar';
import type { SheetTabKey } from '../../App';

interface PageShellProps {
  activeTab: SheetTabKey;
  onChangeTab: (tab: SheetTabKey) => void;
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  activeTab,
  onChangeTab,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-4 flex flex-col gap-3">
        {children}
      </main>
      <TabBar activeTab={activeTab} onChangeTab={onChangeTab} />
    </div>
  );
};
