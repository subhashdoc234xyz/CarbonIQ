import React from 'react';
import { ScreenView } from '../types';
import {
  LayoutDashboard,
  ReceiptText,
  Cpu,
  FileBarChart,
} from 'lucide-react';

interface BottomNavProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs: { id: ScreenView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'activity-log', label: 'Log', icon: ReceiptText },
    { id: 'budget-optimizer', label: 'Optimizer', icon: Cpu },
    { id: 'reports', label: 'Audit', icon: FileBarChart },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0e11]/90 backdrop-blur-xl border-t border-[#26292F] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 transition-colors relative ${
                isActive ? 'text-[#34D399]' : 'text-[#9CA3AF] hover:text-[#F5F6F7]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-[#34D399] rounded-full shadow-[0_0_8px_#34D399]" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
