import React from 'react';
import { ActivityLogEntry } from '../types';
import { Database, Trash2 } from 'lucide-react';

interface ActivityLogViewProps { logs: ActivityLogEntry[]; onAddLog: (log: ActivityLogEntry) => void; onDeleteLog: (id: string) => void; }

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs, onDeleteLog }) => <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
  <div className="pt-2"><h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7]">Activity data</h1><p className="text-sm text-[#9CA3AF] mt-1">Record your organization’s measured activities and verified emission factors.</p></div>
  {logs.length === 0 ? <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-8 text-center"><Database className="w-9 h-9 text-[#34D399] mx-auto" /><h2 className="mt-4 text-lg font-semibold">No activity data yet</h2><p className="mt-2 text-sm text-[#9CA3AF]">Demo factors and records were removed. Connect a data source or configure verified emission factors to start logging.</p></div> : <div className="space-y-2">{logs.map((entry) => <div key={entry.id} className="flex justify-between items-center rounded-xl bg-[#16181C] border border-[#26292F] p-4"><div><p className="font-medium">{entry.sourceType}</p><p className="text-xs text-[#9CA3AF] mt-1">{entry.loggedAt} · {entry.activityValue} {entry.unit}</p></div><div className="flex items-center gap-3"><span className="font-mono">{entry.calculatedEmissionsKg} kg CO₂e</span><button onClick={() => onDeleteLog(entry.id)} aria-label="Delete record"><Trash2 className="w-4 h-4 text-[#9CA3AF] hover:text-red-400" /></button></div></div>)}</div>}
</div>;
