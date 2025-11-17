import React from 'react';
import { Card } from '../components/ui/Card';
import { Callout } from '../components/ui/Callout';
import { BarChart3 } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <Card>
      <h2 className="text-sm font-semibold mb-2">Reporting</h2>
      <p className="text-xs text-slate-600 mb-3">
        This tab will surface integrated reporting from the Master sheet: sell-through,
        stockouts, low stock alerts, and location-level performance.
      </p>
      <Callout tone="info" icon={<BarChart3 size={14} />}>
        Hook this view into your inventory events table to visualize sales, reorders, and
        archiving behavior over time.
      </Callout>
      <div className="mt-4 text-xs text-slate-400">
        (Placeholder: plug in charts/tables once backend metrics endpoints are ready.)
      </div>
    </Card>
  );
};
