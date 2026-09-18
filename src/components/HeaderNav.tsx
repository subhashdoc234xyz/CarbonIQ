import React from 'react';
import { ScreenView, UserProfile } from '../types';
import { CarbonIQLogo } from './CarbonIQLogo';
import { LogOut, User, ShieldCheck } from 'lucide-react';

interface HeaderNavProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onSignInClick: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  user,
  onSignOut,
  onSignInClick,
}) => {
  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'activity-log':
        return 'Activity Log';
      case 'budget-optimizer':
        return 'Budget Optimizer';
      case 'reports':
        return 'Reports & Audit';
      default:
        return '';
    }
  };

  const isPublicView = currentView === 'landing' || currentView === 'signin';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D10]/85 backdrop-blur-xl border-b border-[#26292F]">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-90"
          >
            <CarbonIQLogo size="sm" />
          </button>

          {!isPublicView && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#26292F]">
              <span className="text-sm font-medium text-[#9CA3AF]">/</span>
              <span className="text-sm font-medium text-[#F5F6F7]">{getPageTitle()}</span>
            </div>
          )}
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-3">
          {/* Groq Engine Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181C] border border-[#26292F] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span className="text-[#9CA3AF]">AI:</span>
            <span className="text-[#34D399] font-medium">Groq (Llama 3.3)</span>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181C] border border-[#26292F] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
            <span className="text-[#34D399] font-medium tracking-wide uppercase">
              {isPublicView ? 'v2.4 Live' : 'LIVE'}
            </span>
          </div>

          {/* User actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-[#16181C] border border-[#26292F]">
                <div className="w-6 h-6 rounded-full bg-[#34D399]/20 text-[#34D399] flex items-center justify-center font-semibold text-xs border border-[#34D399]/30">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-medium text-[#F5F6F7] leading-tight truncate max-w-[140px]">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-tight truncate max-w-[140px]">
                    {user.facility}
                  </span>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="p-2 rounded-lg bg-[#16181C] hover:bg-[#1F2228] border border-[#26292F] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInClick}
              className="px-3.5 py-1.5 rounded-lg border border-[#26292F] bg-[#16181C] hover:bg-[#1F2228] hover:border-[#34D399]/50 text-sm font-medium text-[#F5F6F7] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
