import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export const BudgetOptimizerView: React.FC = () => <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
  <div className="pt-2"><h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7]">Budget optimizer</h1><p className="text-sm text-[#9CA3AF] mt-1">Prioritize your own reduction projects against a defined budget.</p></div>
  <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-8 text-center"><SlidersHorizontal className="w-10 h-10 mx-auto text-[#34D399]" /><h2 className="mt-4 text-lg font-semibold">No reduction projects configured</h2><p className="mt-2 max-w-md mx-auto text-sm text-[#9CA3AF]">The sample project costs, savings, optimization results, and recommendations have been removed. Add verified projects from your data source before running an optimization.</p></div>
</div>;
