import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { logsApi } from '../lib/api/logs';
import { ProductLogEntry } from '../types/product';
import { Callout } from '../components/ui/Callout';
import { ListTree, Loader2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils/format';

export const LogPage: React.FC = () => {
  const [logs, setLogs] = useState<ProductLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await logsApi.getLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load logs', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Card>
      <h2 className="text-sm font-semibold mb-2">Action Log</h2>
      <Callout tone="info" icon={<ListTree size={14} />}>
        Every import from Faire, every validation change, and every sync to Square, QuickBooks,
        or Booker should be written here for full oversight.
      </Callout>

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          Loading log entries…
        </div>
      )}

      <div className="mt-3 overflow-auto max-h-[60vh] border border-slate-300 rounded">
        <table className="min-w-full border-collapse text-[11px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-2 py-1 text-left">Time</th>
              <th className="border border-slate-300 px-2 py-1 text-left">Source</th>
              <th className="border border-slate-300 px-2 py-1 text-left">Action</th>
              <th className="border border-slate-300 px-2 py-1 text-left">Status</th>
              <th className="border border-slate-300 px-2 py-1 text-left">Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="bg-white hover:bg-slate-50">
                <td className="border border-slate-200 px-2 py-1">
                  {formatDateTime(log.timestamp)}
                </td>
                <td className="border border-slate-200 px-2 py-1">{log.source}</td>
                <td className="border border-slate-200 px-2 py-1">{log.action}</td>
                <td className="border border-slate-200 px-2 py-1 capitalize">
                  {log.status}
                </td>
                <td className="border border-slate-200 px-2 py-1 text-slate-600">
                  {log.detail || '—'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td
                  className="border border-slate-200 px-4 py-4 text-center text-slate-500"
                  colSpan={5}
                >
                  No log entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
