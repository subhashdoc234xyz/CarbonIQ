import React from 'react';
import { ScreenView, UserProfile } from '../types';
import { CarbonIQLogo } from './CarbonIQLogo';
import {
  LayoutDashboard,
  ClipboardList,
  Cpu,
  FileBarChart,
  LogOut,
  ShieldCheck,
  Building2,
  Database,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  user: UserProfile | null;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  onSignOut,
}) => {
  const navItems: { id: ScreenView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity-log', label: 'Activity Log', icon: ClipboardList },
    { id: 'budget-optimizer', label: 'Budget Optimizer', icon: Cpu, badge: 'PuLP' },
    { id: 'steel-ml', label: 'Steel ML Predictor', icon: Sparkles, badge: 'Kaggle' },
    { id: 'open-india-factors', label: 'Open India Factors', icon: Database, badge: 'v1.2' },
    { id: 'reports', label: 'Reports & Audit', icon: FileBarChart },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0c0e11] border-r border-[#26292F] p-4 justify-between z-30 select-none">
      {/* Top Wordmark & Version */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <CarbonIQLogo size="md" />
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16181C] text-[#34D399] border border-[#26292F] font-mono">
            v2.4
          </span>
        </div>

        {/* Facility Context Badge */}
        {user && (
          <div className="px-3 py-2 rounded-lg bg-[#16181C] border border-[#26292F] flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#34D399] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider text-[#9CA3AF] font-medium">Facility</div>
              <div className="text-xs font-semibold text-[#F5F6F7] truncate">{user.facility}</div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
          </div>
        )}

        {/* Navigation items */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]/70">
            Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#16181C] text-[#34D399] border border-[#34D399]/30 shadow-sm font-semibold'
                    : 'text-[#9CA3AF] hover:text-[#F5F6F7] hover:bg-[#16181C]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#9CA3AF]'}`} />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1F2228] text-[#9CA3AF] border border-[#26292F]">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#34D399]" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Sign Out */}
      <div className="pt-4 border-t border-[#26292F] space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] px-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>GHG Protocol Scope 1–3</span>
        </div>

        {user ? (
          <div className="p-2.5 rounded-xl bg-[#16181C] border border-[#26292F] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#34D399]/20 border border-[#34D399]/40 flex items-center justify-center text-[#34D399] font-bold text-xs shrink-0">
                SO
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#F5F6F7] truncate">{user.fullName}</div>
                <div className="text-[10px] text-[#9CA3AF] truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#1F2228] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('signin')}
            className="w-full py-2 px-3 rounded-lg bg-[#34D399] hover:bg-[#2fc48d] text-[#003825] font-semibold text-xs text-center transition-colors"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </aside>
  );
};
