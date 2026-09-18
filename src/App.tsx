/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenView, UserProfile, ActivityLogEntry } from './types';
import { DEFAULT_USER, INITIAL_LOGS } from './data/initialData';
import { HeaderNav } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { SignInModal } from './components/SignInModal';
import { DashboardView } from './components/DashboardView';
import { ActivityLogView } from './components/ActivityLogView';
import { BudgetOptimizerView } from './components/BudgetOptimizerView';
import { ReportsView } from './components/ReportsView';
import { SteelIndustryMLView } from './components/SteelIndustryMLView';
import { OpenIndiaFactorsView } from './components/OpenIndiaFactorsView';
import { OpenIndiaEmissionFactor } from './data/openIndiaFactors';
import { Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ActivityLogEntry[]>(INITIAL_LOGS);

  const handleSignInSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleAddLog = (newEntry: ActivityLogEntry) => {
    setLogs((prev) => [newEntry, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSelectFactorForLog = (factor: OpenIndiaEmissionFactor) => {
    // Automatically create a sample log with this verified factor
    const sampleQty = factor.unit.includes('kWh') ? 1000 : factor.unit.includes('L') ? 500 : 10;
    const calcEmissions = Math.round(sampleQty * factor.value * 100) / 100;

    const newEntry: ActivityLogEntry = {
      id: `act_open_india_${Date.now()}`,
      userId: user ? user.id : 'usr_enterprise_001',
      sourceType: factor.factor_name.length > 30 ? factor.factor_name.slice(0, 30) + '...' : factor.factor_name,
      activityValue: sampleQty,
      unit: factor.unit.split('/')[1] || factor.unit,
      factorValue: factor.value,
      calculatedEmissionsKg: calcEmissions,
      loggedAt: 'Today',
      scope: (factor.scope.includes('Scope 1') ? 'Scope 1' : factor.scope.includes('Scope 3') ? 'Scope 3' : 'Scope 2') as any,
      icon: factor.sector.toLowerCase().includes('electricity') ? 'zap' : 'flame',
      notes: `Factor source: ${factor.source_document}. Reference: ${factor.reference_year || 'FY 2024-25'}`,
    };

    setLogs((prev) => [newEntry, ...prev]);
    setCurrentView('activity-log');
  };

  // Screen Quick Switcher Tabs (For easy inspection of all specified prompt modules)
  const screensList: { id: ScreenView; label: string; tag: string }[] = [
    { id: 'landing', label: 'Screen 0: Landing', tag: 'Public' },
    { id: 'signin', label: 'Screen 0.5: Sign In', tag: 'Auth' },
    { id: 'dashboard', label: 'Screen 1: Dashboard', tag: 'Overview' },
    { id: 'activity-log', label: 'Screen 2: Activity Log', tag: 'Data Entry' },
    { id: 'budget-optimizer', label: 'Screen 3: Optimizer', tag: 'PuLP LP' },
    { id: 'steel-ml', label: '6.1 Kaggle Steel ML', tag: 'csafrit2' },
    { id: 'open-india-factors', label: '6.2 Open India Factors', tag: '116 CEA' },
    { id: 'reports', label: 'Screen 4: Reports', tag: 'Audit' },
  ];

  const isPublicScreen = currentView === 'landing' || currentView === 'signin';

  return (
    <div className="min-h-screen bg-[#0B0D10] text-[#F5F6F7] flex flex-col font-sans antialiased selection:bg-[#34D399]/30 selection:text-[#5af0b3]">
      {/* Top Preview Switcher Bar (Quick Navigation Bar across all specified screens) */}
      <div className="w-full bg-[#0c0e11] border-b border-[#26292F] px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto z-50">
        <div className="flex items-center gap-2 text-[#9CA3AF] shrink-0 mr-3">
          <Layers className="w-3.5 h-3.5 text-[#34D399]" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-[#F5F6F7]">
            CarbonIQ Screens
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {screensList.map((s) => {
            const isActive = currentView === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id !== 'landing' && s.id !== 'signin' && !user) {
                    setUser(DEFAULT_USER);
                  }
                  setCurrentView(s.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#34D399] text-[#003825] font-semibold shadow-sm'
                    : 'bg-[#16181C] text-[#9CA3AF] hover:text-[#F5F6F7] hover:bg-[#1F2228] border border-[#26292F]'
                }`}
              >
                <span>{s.label}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-[#003825]/20 text-[#003825]' : 'bg-[#26292F] text-[#9CA3AF]'
                  }`}
                >
                  {s.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen 0: Public Landing Page */}
      {currentView === 'landing' ? (
        <LandingPage
          onGetStarted={() => {
            setCurrentView('signin');
          }}
          onSignIn={() => {
            setCurrentView('signin');
          }}
        />
      ) : currentView === 'signin' ? (
        /* Screen 0.5: Google OAuth Sign In Card */
        <SignInModal
          onSuccess={handleSignInSuccess}
          onBack={() => setCurrentView('landing')}
        />
      ) : (
        /* Authenticated Workspace Frame */
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          {/* Desktop Fixed Left Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            user={user || DEFAULT_USER}
            onSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0B0D10]">
            {/* Header Navigation */}
            <HeaderNav
              currentView={currentView}
              onNavigate={setCurrentView}
              user={user || DEFAULT_USER}
              onSignOut={handleSignOut}
              onSignInClick={() => setCurrentView('signin')}
            />

            {/* Screen Content Views */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
              {currentView === 'dashboard' && (
                <DashboardView
                  logs={logs}
                  onNavigateToLogs={() => setCurrentView('activity-log')}
                  onNavigateToOptimizer={() => setCurrentView('budget-optimizer')}
                />
              )}

              {currentView === 'activity-log' && (
                <ActivityLogView
                  logs={logs}
                  onAddLog={handleAddLog}
                  onDeleteLog={handleDeleteLog}
                />
              )}

              {currentView === 'budget-optimizer' && <BudgetOptimizerView />}

              {currentView === 'steel-ml' && (
                <SteelIndustryMLView onLogToLedger={handleAddLog} />
              )}

              {currentView === 'open-india-factors' && (
                <OpenIndiaFactorsView onSelectFactorForLog={handleSelectFactorForLog} />
              )}

              {currentView === 'reports' && (
                <ReportsView logs={logs} user={user || DEFAULT_USER} />
              )}
            </main>

            {/* Mobile Fixed Bottom Navigation */}
            <BottomNav currentView={currentView} onNavigate={setCurrentView} />
          </div>
        </div>
      )}
    </div>
  );
}
