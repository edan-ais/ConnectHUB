import React from 'react';
import { useRecoilState } from 'recoil';
import { PageShell } from './components/layout/PageShell';
import { MasterPage } from './pages/MasterPage';
import { MainPage } from './pages/MainPage';
import { IntakePage } from './pages/IntakePage';
import { ReportsPage } from './pages/ReportsPage';
import { LogPage } from './pages/LogPage';
import { activeTabState } from './state/uiAtom';

export type SheetTabKey = 'master' | 'main' | 'intake' | 'reports' | 'log';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  let content: React.ReactNode = null;

  if (activeTab === 'master') content = <MasterPage />;
  if (activeTab === 'main') content = <MainPage />;
  if (activeTab === 'intake') content = <IntakePage />;
  if (activeTab === 'reports') content = <ReportsPage />;
  if (activeTab === 'log') content = <LogPage />;

  return (
    <PageShell activeTab={activeTab} onChangeTab={setActiveTab}>
      {content}
    </PageShell>
  );
};
