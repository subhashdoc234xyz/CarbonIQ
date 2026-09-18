import React from 'react';
import { ActivityLogEntry, UserProfile } from '../types';
import { FileText } from 'lucide-react';

interface ReportsViewProps { logs: ActivityLogEntry[]; user: UserProfile | null; }
export const ReportsView: React.FC<ReportsViewProps> = ({ logs }) => <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
  <div className="pt-2"><h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7]">Reports & audit</h1><p className="text-sm text-[#9CA3AF] mt-1">Generate reporting only from the records in your workspace.</p></div>
  <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-8 text-center"><FileText className="w-10 h-10 mx-auto text-[#34D399]" /><h2 className="mt-4 text-lg font-semibold">No report data available</h2><p className="mt-2 max-w-md mx-auto text-sm text-[#9CA3AF]">{logs.length === 0 ? 'Add activity records and verified factors to prepare an audit-ready report.' : 'Report generation will use your activity records only.'}</p></div>
</div>;
