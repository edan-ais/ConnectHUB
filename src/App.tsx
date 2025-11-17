// src/App.tsx
import React, { useState } from 'react';
import { TabBar } from '@/components/layout/TabBar';
import { MasterPage } from '@/pages/MasterPage';
import { MainPage } from '@/pages/MainPage';
import { IntakePage } from '@/pages/IntakePage';
import { ReportsPage } from '@/pages/ReportsPage';
import { LogPage } from '@/pages/LogPage';

export default function App() {
  const [tab, setTab] = useState<'master' | 'main' | 'intake' | 'reports' | 'log'>('main');

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <TabBar active={tab} onChange={setTab} />

      <div className="flex-1 px-6 py-4">
        {tab === 'main' && <MainPage />}
        {tab === 'master' && <MasterPage />}
        {tab === 'intake' && <IntakePage />}
        {tab === 'reports' && <ReportsPage />}
        {tab === 'log' && <LogPage />}
      </div>
    </div>
  );
}
