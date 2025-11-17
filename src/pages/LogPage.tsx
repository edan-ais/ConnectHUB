// src/pages/LogPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchLogs } from '@/lib/api/logs';

export function LogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchLogs();
      setLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="rounded-lg border-4 border-slate-700 bg-white p-4 shadow-md">
      <h2 className="mb-4 text-sm font-semibold">Action Log</h2>

      {loading ? (
        <div className="text-xs text-slate-500">Loading logs…</div>
      ) : (
        <div className="flex flex-col gap-2 text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded border border-slate-300 bg-slate-50 p-2"
            >
              <div className="font-medium">{log.action}</div>
              <div className="text-slate-500">{log.detail}</div>
              <div className="text-[10px] text-slate-400">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
