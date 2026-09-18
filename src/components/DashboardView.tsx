import React, { useState } from 'react';
import { ActivityLogEntry } from '../types';
import {
  Calendar,
  ChevronDown,
  Verified,
  TrendingDown,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  ReceiptText,
  Sparkles,
  Check,
  Zap,
  Flame,
  Truck,
  Building,
} from 'lucide-react';

interface DashboardViewProps {
  logs: ActivityLogEntry[];
  onNavigateToLogs: () => void;
  onNavigateToOptimizer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  logs,
  onNavigateToLogs,
  onNavigateToOptimizer,
}) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appliedRecommendation, setAppliedRecommendation] = useState(false);

  // Compute live totals from user's logs
  const totalLoggedKg = logs.reduce((acc, curr) => acc + curr.calculatedEmissionsKg, 0);
  const totalTons = (totalLoggedKg / 1000).toFixed(1);

  // 12-month trajectory mock data points (J to D)
  const trajectoryMonths = [
    { label: 'J', height: '100%', val: '165t' },
    { label: 'F', height: '94%', val: '158t' },
    { label: 'M', height: '91%', val: '152t' },
    { label: 'A', height: '87%', val: '146t' },
    { label: 'M', height: '84%', val: '141t' },
    { label: 'J', height: '82%', val: '138t' },
    { label: 'J', height: '79%', val: '133t' },
    { label: 'A', height: '77%', val: '130t' },
    { label: 'S', height: '74%', val: '125t' },
    { label: 'O', height: '72%', val: '122t' },
    { label: 'N', height: '70%', val: '120t' },
    { label: 'D', height: '68%', val: '119t', active: true },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-8 animate-fade-in">
      {/* Overview Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] tracking-tight">Overview</h1>
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            Facility Telemetry & Scope 1–3 Emissions Portfolio
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16181C] border border-[#26292F] text-xs font-medium text-[#F5F6F7] hover:border-[#34D399]/40 transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{timeRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-[#16181C] border border-[#26292F] rounded-lg shadow-xl z-20 py-1 text-xs">
                {['Last 30 Days', 'Q3 2025', 'YTD 2025', 'Fiscal 2024-25'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTimeRange(opt);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1F2228] text-[#9CA3AF] hover:text-[#F5F6F7]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181C] border border-[#26292F] text-[#9CA3AF] text-xs">
            <Verified className="w-3.5 h-3.5 text-[#34D399]" />
            <span>GHG Protocol Scope 1–3</span>
          </div>
        </div>
      </div>

      {/* Facility Telemetry Live Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16181C] border border-[#26292F] p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono">
              Facility Telemetry
            </span>
          </div>
          <span className="text-xs text-[#34D399] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            Syncing 42 sensors
          </span>
        </div>

        {/* Industrial Background Asset with Telemetry Overlays */}
        <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden flex items-center justify-center border border-[#26292F]/60">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtk7HG_8v5fIhJzyOEFSMWJpr3popTK5IupS5RlF1IQNMkESiUOeFIZkbuOlGIveMdXw27CGBulUu3cCxK0aw3Dq2ERkwLy5nFYy9rWAFeLKzsRdmFaTB7ZdBxoweXx5HMKaKhbeOKIfQxrDxZcBzFFrU9lSuhaZXRp8Wl_MCmbtTJhEq3iDdPajuVfQjuMX6eUrHRMfTjT6EAn37MvZqvMaBSHoYN8mc-RgRWszy1zD_x2vwjjoxH"
            alt="Steel Plant Facility Telemetry"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16181C] via-[#16181C]/60 to-[#16181C]" />

          <div className="relative z-10 w-full flex items-center justify-around px-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider">
                Grid Frequency
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#F5F6F7] font-mono mt-0.5">
                49.98 Hz
              </span>
            </div>

            <div className="w-px h-8 bg-[#26292F]" />

            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider">
                Furnace Temp
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#F5F6F7] font-mono mt-0.5">
                1,420°C
              </span>
            </div>

            <div className="w-px h-8 bg-[#26292F]" />

            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider">
                Stack Capture
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#34D399] font-mono mt-0.5">
                94.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 cards matching Stitch layout) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Emissions */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#16181C] border border-[#26292F] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Total Emissions</span>
            <span className="font-mono text-[10px] uppercase text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
              CO₂e
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] font-mono tracking-tight">
              1,428.5
            </div>
            <span className="text-xs text-[#9CA3AF]">tCO₂e</span>
          </div>
          <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] text-[11px] font-medium font-mono">
            <TrendingDown className="w-3 h-3" />
            <span>-12.4% vs mo</span>
          </div>
        </div>

        {/* Active Reduction Actions */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#16181C] border border-[#26292F] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Active Actions</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] font-mono tracking-tight">
              7
            </div>
            <span className="text-xs text-[#9CA3AF]">Programs</span>
          </div>
          <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#34D399]/10 text-[#34D399] text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span>On Track</span>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#16181C] border border-[#26292F] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Budget Left</span>
            <Wallet className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] font-mono tracking-tight">
              ₹1.85L
            </div>
            <span className="text-xs text-[#9CA3AF]">of ₹4.00L Cap</span>
          </div>
          <div className="w-full bg-[#26292F] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#34D399] h-1.5 rounded-full" style={{ width: '46%' }} />
          </div>
        </div>

        {/* Emission Intensity */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#16181C] border border-[#26292F] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Intensity</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F6F7] font-mono tracking-tight">
              0.64
            </div>
            <span className="text-xs text-[#9CA3AF]">tCO₂e / MWh</span>
          </div>
          <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] text-[11px] font-medium">
            <span>Near Cap Warning</span>
          </div>
        </div>
      </div>

      {/* Main Content: Emissions Trajectory (60%) & Source Breakdown (40%) */}
      <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-4 sm:p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F6F7]">Emissions Trajectory</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">12-Month Net CO₂ Reduction Cycle</p>
          </div>
          <span className="text-xs font-mono font-medium text-[#34D399] px-2.5 py-1 rounded-full bg-[#1F2228] border border-[#26292F]">
            165t → 119t
          </span>
        </div>

        {/* Interactive Chart Bars */}
        <div className="w-full h-44 flex flex-col justify-end pt-2">
          <div className="flex items-end justify-between gap-1.5 h-32 px-1">
            {trajectoryMonths.map((m, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    m.active
                      ? 'bg-[#34D399] shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'bg-[#26292F] group-hover:bg-[#34D399]/60'
                  }`}
                  style={{ height: m.height }}
                />
                <span
                  className={`text-[10px] font-mono ${
                    m.active ? 'text-[#34D399] font-bold' : 'text-[#9CA3AF]'
                  }`}
                >
                  {m.label}
                </span>

                {/* Hover value tooltip */}
                <div className="absolute -top-7 hidden group-hover:block bg-[#0c0e11] border border-[#26292F] px-1.5 py-0.5 rounded text-[10px] text-[#F5F6F7] font-mono whitespace-nowrap z-20 pointer-events-none">
                  {m.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Breakdown Grid */}
        <div className="pt-2 border-t border-[#26292F] space-y-2.5">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block">
            Source Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1F2228] border border-[#26292F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                <span className="text-xs text-[#F5F6F7]">Electricity</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#F5F6F7]">58%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1F2228] border border-[#26292F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffa668]" />
                <span className="text-xs text-[#F5F6F7]">Natural Gas</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#F5F6F7]">24%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1F2228] border border-[#26292F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c4c6ce]" />
                <span className="text-xs text-[#F5F6F7]">Heavy Fuel</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#F5F6F7]">12%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1F2228] border border-[#26292F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#85948b]" />
                <span className="text-xs text-[#F5F6F7]">Logistics</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#F5F6F7]">6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-[#34D399]" />
            <h2 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">Recent Activity Logs</h2>
          </div>
          <button
            onClick={onNavigateToLogs}
            className="text-xs text-[#34D399] hover:underline font-medium cursor-pointer"
          >
            View All ({logs.length})
          </button>
        </div>

        <div className="space-y-2">
          {logs.slice(0, 3).map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1F2228]/70 hover:bg-[#1F2228] border border-[#26292F] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#16181C] border border-[#26292F] flex items-center justify-center text-[#34D399] shrink-0">
                    {item.scope === 'Scope 2' ? (
                      <Zap className="w-4 h-4" />
                    ) : item.sourceType.toLowerCase().includes('freight') ? (
                      <Truck className="w-4 h-4" />
                    ) : item.sourceType.toLowerCase().includes('gas') ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[#F5F6F7] truncate">
                      {item.sourceType}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                      {item.loggedAt} · {item.activityValue.toLocaleString()} {item.unit}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className="text-xs sm:text-sm font-bold text-[#F5F6F7] font-mono">
                    {item.calculatedEmissionsKg.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-[#34D399] font-medium font-mono">
                    {item.scope}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendation Hero Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#16181C] via-[#1F2228] to-[#16181C] border border-[#34D399]/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#34D399]/15 text-[#34D399] shrink-0 border border-[#34D399]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-[#F5F6F7]">AI Recommendation</div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">
              Shift rolling mill cycle to 02:00 AM off-peak hours to reduce grid emission intensity by 18%.
            </div>
          </div>
        </div>

        <button
          onClick={() => setAppliedRecommendation(true)}
          disabled={appliedRecommendation}
          className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            appliedRecommendation
              ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
              : 'bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] shadow-sm'
          }`}
        >
          {appliedRecommendation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Applied to Schedule</span>
            </>
          ) : (
            <span>Apply Optimization</span>
          )}
        </button>
      </div>
    </div>
  );
};
