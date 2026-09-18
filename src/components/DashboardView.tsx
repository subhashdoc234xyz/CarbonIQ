import React from 'react';
import { ActivityLogEntry, ReductionAction } from '../types';
import { ClipboardList, PlusCircle } from 'lucide-react';

interface DashboardViewProps { logs: ActivityLogEntry[]; actions: ReductionAction[]; onNavigateToLogs: () => void; onNavigateToOptimizer: () => void; }

export const DashboardView: React.FC<DashboardViewProps> = ({ logs, actions, onNavigateToLogs, onNavigateToOptimizer }) => {
  const totalKg = logs.reduce((sum, log) => sum + log.calculatedEmissionsKg, 0);
  return <div className="w-full max-w-5xl mx-auto space-y-6 pb-8 animate-fade-in">
    <div className="pt-2"><h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7]">Overview</h1><p className="text-sm text-[#9CA3AF] mt-1">Your emissions data will appear here after you add activity records.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><Metric label="Total emissions" value={`${(totalKg / 1000).toFixed(2)} tCO₂e`} /><Metric label="Activity records" value={String(logs.length)} /><Metric label="Reduction projects" value={String(actions.length)} /></div>
    <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-6 sm:p-10 text-center"><ClipboardList className="w-9 h-9 mx-auto text-[#34D399]" /><h2 className="mt-4 text-lg font-semibold text-[#F5F6F7]">Your workspace is ready</h2><p className="mt-2 max-w-md mx-auto text-sm text-[#9CA3AF]">No sample emissions, facility telemetry, recommendations, or historical trends are shown. Add your own verified data to begin analysis.</p><div className="mt-6 flex flex-col sm:flex-row justify-center gap-3"><button onClick={onNavigateToLogs} className="px-4 py-2 rounded-lg bg-[#34D399] text-[#003825] text-sm font-semibold"><PlusCircle className="inline w-4 h-4 mr-1.5" />Add activity data</button><button onClick={onNavigateToOptimizer} className="px-4 py-2 rounded-lg border border-[#26292F] text-[#F5F6F7] text-sm font-semibold">Set up reduction projects</button></div></div>
  </div>;
};

const Metric = ({ label, value }: { label: string; value: string }) => <div className="rounded-xl bg-[#16181C] border border-[#26292F] p-4"><p className="text-xs text-[#9CA3AF]">{label}</p><p className="mt-2 text-2xl font-bold text-[#F5F6F7] font-mono">{value}</p></div>;
