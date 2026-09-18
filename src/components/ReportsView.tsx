import React, { useState } from 'react';
import { ActivityLogEntry, UserProfile } from '../types';
import { fetchGroqAuditSummary } from '../services/groqService';
import {
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  User,
  Clock,
  Lock,
  Radio,
  Sparkles,
  BarChart3,
  Bot,
  AlertCircle,
} from 'lucide-react';

interface ReportsViewProps {
  logs: ActivityLogEntry[];
  user: UserProfile | null;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ logs, user }) => {
  const [fiscalYear, setFiscalYear] = useState('FY 2024–2025');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [groqAuditStatement, setGroqAuditStatement] = useState<string | null>(null);
  const [isLoadingGroq, setIsLoadingGroq] = useState<boolean>(false);
  const [groqError, setGroqError] = useState<string | null>(null);

  const handleGenerateGroqAudit = async () => {
    setIsLoadingGroq(true);
    setGroqError(null);
    try {
      const scope1Tons = Math.round(logs.filter((l) => l.scope === 'Scope 1').reduce((acc, l) => acc + l.calculatedEmissionsKg, 0) / 10) / 100;
      const scope2Tons = Math.round(logs.filter((l) => l.scope === 'Scope 2').reduce((acc, l) => acc + l.calculatedEmissionsKg, 0) / 10) / 100;
      const scope3Tons = Math.round(logs.filter((l) => l.scope === 'Scope 3').reduce((acc, l) => acc + l.calculatedEmissionsKg, 0) / 10) / 100;
      const totalTons = Math.round((scope1Tons + scope2Tons + scope3Tons) * 100) / 100;

      const res = await fetchGroqAuditSummary({
        facility: user?.facility || 'Primary Industrial Facility',
        scope1Tons,
        scope2Tons,
        scope3Tons,
        totalTons,
        logCount: logs.length,
      });

      if (res.success && res.statement) {
        setGroqAuditStatement(res.statement);
      } else {
        setGroqError(res.error || 'Failed to generate audit commentary via Groq.');
      }
    } catch (e: any) {
      setGroqError(e.message || 'Error communicating with Groq API.');
    } finally {
      setIsLoadingGroq(false);
    }
  };

  const triggerExport = (type: 'CSV' | 'PDF') => {
    if (type === 'CSV') {
      // Build real CSV content from current logs
      const headers = 'ID,Date,Source Type,Scope,Measured Quantity,Unit,Emissions (kg CO2e)\n';
      const rows = logs
        .map(
          (l) =>
            `"${l.id}","${l.loggedAt}","${l.sourceType}","${l.scope}",${l.activityValue},"${l.unit}",${l.calculatedEmissionsKg}`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CarbonIQ_${fiscalYear.replace(/\s+/g, '_')}_Emissions_Audit.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(`CarbonIQ_${fiscalYear.replace(/\s+/g, '_')}_Emissions_Audit.csv generated`);
    } else {
      // PDF print view simulation
      setToastMessage('CarbonIQ_PlantA_Verification_Report.pdf prepared for download');
      window.print();
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Header Section */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
              Audit & Compliance
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16181C] border border-[#26292F] text-xs text-[#34D399] font-medium font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GHG Audited</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] tracking-tight">
          Emissions & Reduction Report
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF]">
          Validated emissions inventory with quantified mitigation impact
        </p>

        {/* Fiscal Period Selector Strip */}
        <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#16181C] border border-[#26292F] relative shadow-sm mt-3">
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1F2228] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] hover:border-[#34D399]/40 transition-all font-mono"
            >
              <Calendar className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{fiscalYear}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-[#16181C] border border-[#26292F] rounded-lg shadow-2xl z-30 py-1 text-xs font-mono">
                {['FY 2024–2025', 'FY 2023–2024', 'Q3 Oct–Dec 2024'].map((fy) => (
                  <button
                    key={fy}
                    onClick={() => {
                      setFiscalYear(fy);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#1F2228] text-[#9CA3AF] hover:text-[#F5F6F7]"
                  >
                    {fy}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pr-3 text-xs text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-mono text-[#F5F6F7]">Closed Annual Cycle</span>
          </div>
        </div>
      </div>

      {/* Export Quick Action Triggers */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => triggerExport('CSV')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16181C] hover:bg-[#1F2228] border border-[#26292F] text-[#F5F6F7] text-xs sm:text-sm font-semibold transition-all active:scale-[0.99] cursor-pointer shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#9CA3AF]" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={() => triggerExport('PDF')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16181C] hover:bg-[#1F2228] border border-[#34D399]/40 text-[#34D399] text-xs sm:text-sm font-semibold transition-all active:scale-[0.99] cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4 text-[#34D399]" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Main Trend Comparison Card */}
      <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] font-mono">
              Comparative Trajectory
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#F5F6F7] mt-0.5">
              Net Mitigation Impact
            </h2>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#34D399]/15 text-[#34D399] text-xs font-mono font-bold border border-[#34D399]/30">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-26.25%</span>
            </div>
            <span className="text-[11px] text-[#9CA3AF] mt-1 font-mono">vs Initial Baseline</span>
          </div>
        </div>

        {/* Metric Summary Callouts */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0B0D10] border border-[#26292F]">
          <div className="flex flex-col">
            <span className="text-xs text-[#9CA3AF] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
              Baseline Projected
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#9CA3AF] font-mono mt-1">
              1,840 <span className="text-xs text-[#9CA3AF]/70 font-normal">tCO₂e</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#34D399] flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              Actual Post-Reduction
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#34D399] font-mono mt-1">
              1,357 <span className="text-xs text-[#34D399]/70 font-normal">tCO₂e</span>
            </div>
          </div>
        </div>

        {/* Comparison SVG Area Chart */}
        <div className="relative w-full h-48 flex flex-col justify-end pt-4">
          {/* Floating Delta Badge */}
          <div className="absolute top-2 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34D399] text-[#003825] shadow-lg z-10">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono tracking-tight">483 t CO₂e Averted</span>
          </div>

          <svg
            className="w-full h-36 overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 320 120"
          >
            <defs>
              <linearGradient id="deltaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines */}
            <line stroke="#26292F" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="15" y2="15" />
            <line stroke="#26292F" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="55" y2="55" />
            <line stroke="#26292F" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="320" y1="95" y2="95" />

            {/* Delta Fill Polygon */}
            <polygon
              fill="url(#deltaGradient)"
              points="0,32 55,28 115,22 175,18 240,15 320,12 320,82 240,74 175,64 115,58 55,48 0,38"
            />

            {/* Baseline Curve (Dashed) */}
            <path
              d="M 0,32 C 55,28 115,22 175,18 C 240,15 285,13 320,12"
              fill="none"
              stroke="#9CA3AF"
              strokeDasharray="4 3"
              strokeWidth="2"
            />

            {/* Actual Reduction Curve (Solid Emerald) */}
            <path
              d="M 0,38 C 55,48 115,58 175,64 C 240,74 285,78 320,82"
              fill="none"
              stroke="#34D399"
              strokeWidth="3"
            />

            {/* Pins */}
            <circle cx="0" cy="38" fill="#34D399" r="3" />
            <circle cx="115" cy="58" fill="#34D399" r="3" />
            <circle cx="240" cy="74" fill="#34D399" r="3" />
            <circle cx="320" cy="82" fill="#34D399" r="4.5" />
            <circle cx="320" cy="12" fill="#9CA3AF" r="3.5" />
          </svg>

          {/* Month Ticks */}
          <div className="flex justify-between w-full text-[11px] text-[#9CA3AF] pt-2 font-mono">
            <span>Q1 Apr</span>
            <span>Q2 Jul</span>
            <span>Q3 Oct</span>
            <span>Q4 Jan</span>
            <span>Mar Close</span>
          </div>
        </div>

        {/* Metric Chip */}
        <div className="flex items-center justify-between pt-2 border-t border-[#26292F]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#34D399]" />
            <span className="text-xs text-[#F5F6F7]">Efficiency Gains Recognized</span>
          </div>
          <span className="text-xs font-bold text-[#34D399] font-mono">₹41.8L Energy Offset</span>
        </div>
      </div>

      {/* Ranked Table: Top Emission Sources */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#34D399]" />
            <h2 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">Top Emission Sources</h2>
          </div>
          <span className="text-xs text-[#9CA3AF] font-mono">Ranked by Mass</span>
        </div>

        <div className="rounded-2xl bg-[#16181C] border border-[#26292F] overflow-hidden divide-y divide-[#26292F] shadow-md">
          {/* Source 1 */}
          <div className="p-4 hover:bg-[#1F2228] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#26292F] text-xs font-bold text-[#34D399] font-mono flex items-center justify-center">
                  01
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#F5F6F7]">Grid Electricity</div>
                  <span className="text-xs text-[#9CA3AF]">Scope 2 · CEA Grid Factor v19</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#F5F6F7] font-mono">
                  828,600 <span className="text-[11px] text-[#9CA3AF]">kg CO₂</span>
                </div>
                <span className="text-xs text-[#34D399] font-semibold font-mono">
                  58.0% of total
                </span>
              </div>
            </div>
            <div className="w-full bg-[#0B0D10] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#34D399] h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          {/* Source 2 */}
          <div className="p-4 hover:bg-[#1F2228] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#26292F] text-xs font-bold text-[#9CA3AF] font-mono flex items-center justify-center">
                  02
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#F5F6F7]">Reheating Furnace Gas</div>
                  <span className="text-xs text-[#9CA3AF]">Scope 1 · Piped Natural Gas (PNG)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#F5F6F7] font-mono">
                  342,840 <span className="text-[11px] text-[#9CA3AF]">kg CO₂</span>
                </div>
                <span className="text-xs text-[#34D399] font-semibold font-mono">
                  24.0% of total
                </span>
              </div>
            </div>
            <div className="w-full bg-[#0B0D10] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#34D399]/80 h-full rounded-full" style={{ width: '24%' }} />
            </div>
          </div>

          {/* Source 3 */}
          <div className="p-4 hover:bg-[#1F2228] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#26292F] text-xs font-bold text-[#9CA3AF] font-mono flex items-center justify-center">
                  03
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#F5F6F7]">Heavy Fuel Oil Boilers</div>
                  <span className="text-xs text-[#9CA3AF]">Scope 1 · Stationary Combustion</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#F5F6F7] font-mono">
                  171,420 <span className="text-[11px] text-[#9CA3AF]">kg CO₂</span>
                </div>
                <span className="text-xs text-[#9CA3AF] font-semibold font-mono">
                  12.0% of total
                </span>
              </div>
            </div>
            <div className="w-full bg-[#0B0D10] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#34D399]/50 h-full rounded-full" style={{ width: '12%' }} />
            </div>
          </div>

          {/* Source 4 */}
          <div className="p-4 hover:bg-[#1F2228] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#26292F] text-xs font-bold text-[#9CA3AF] font-mono flex items-center justify-center">
                  04
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#F5F6F7]">Fleet Freight Logistics</div>
                  <span className="text-xs text-[#9CA3AF]">Scope 1 · Diesel Inter-site Haulage</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#F5F6F7] font-mono">
                  85,710 <span className="text-[11px] text-[#9CA3AF]">kg CO₂</span>
                </div>
                <span className="text-xs text-[#9CA3AF] font-semibold font-mono">
                  6.0% of total
                </span>
              </div>
            </div>
            <div className="w-full bg-[#0B0D10] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#34D399]/30 h-full rounded-full" style={{ width: '6%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Operational Context / Facility Zero-Point Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#26292F] shadow-lg h-36 flex flex-col justify-end p-5">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgGZ5_vAvRbHp6kGWuGfto50t5I-HPCAOoXMtFlnoeQJ5lD1Mpdt7igEaj9uiMyc5PKFog_JnjqOkP4jc3rc9x0Z_2XaxgIbNLtfwn8wCXWJHWpBfy9MHZV5_lhXcKcGAg5Ape3ybibLERQULH13UIwE13_sumeLXgFIcYmpditRMx9GCA2A3mGlejEc34XOiyzYOXvNSG5-8QwcDHsnqyvemeD8D2OY5P80fTPxIOfuIjWOsA8Mor')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/80 to-transparent" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-[#34D399] uppercase tracking-wider font-mono">
              Facility Zero-Point
            </span>
            <div className="text-base sm:text-lg font-bold text-[#F5F6F7]">
              Plant A · Rolling Mills & Assembly
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16181C]/90 backdrop-blur-sm border border-[#26292F] text-xs font-mono text-[#F5F6F7]">
            <Radio className="w-3.5 h-3.5 text-[#34D399]" />
            <span>14 Monitors Online</span>
          </div>
        </div>
      </div>

      {/* Groq AI Auditor Statement (Llama 3.3 70B - Groq API Only) */}
      <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#F5F6F7]">
                  Groq AI ESG Compliance Statement
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                  Llama 3.3 70B
                </span>
              </div>
              <span className="text-xs text-[#9CA3AF]">
                Formal auditor assessment per GHG Protocol Corporate Standard & SEBI BRSR
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerateGroqAudit}
            disabled={isLoadingGroq}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F2228] hover:bg-[#26292F] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] transition-all cursor-pointer font-mono shrink-0 disabled:opacity-50"
          >
            {isLoadingGroq ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin" />
                <span>Auditing via Groq...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Generate Auditor Statement</span>
              </>
            )}
          </button>
        </div>

        {groqError && (
          <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#FCA5A5] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">{groqError}</span>
              <span className="text-[11px] text-[#9CA3AF] block font-mono">
                Provide <code className="text-[#F5F6F7]">GROQ_API_KEY</code> in environment variables or <code className="text-[#F5F6F7]">.env</code> file.
              </span>
            </div>
          </div>
        )}

        {groqAuditStatement ? (
          <div className="p-4 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs sm:text-sm text-[#F5F6F7] leading-relaxed whitespace-pre-line font-sans border-l-2 border-l-[#34D399]">
            {groqAuditStatement}
          </div>
        ) : (
          !groqError && (
            <p className="text-xs text-[#9CA3AF] italic">
              Click &quot;Generate Auditor Statement&quot; to synthesize GHG verification commentary and BRSR Core alignment across {logs.length} logged activity records using Groq Cloud.
            </p>
          )
        )}
      </div>

      {/* Report Metadata & Sign-off Card */}
      <div className="rounded-2xl bg-[#16181C] border border-[#26292F] p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-[#F5F6F7] text-sm font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>Compliance & Sign-off Meta</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs">
            <div className="flex items-center gap-2 text-[#9CA3AF]">
              <User className="w-3.5 h-3.5" />
              <span>Generated for</span>
            </div>
            <span className="text-[#F5F6F7] font-medium">{user?.fullName || 'Operations Lead (Plant A)'}</span>
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs">
            <div className="flex items-center gap-2 text-[#9CA3AF]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verification Method</span>
            </div>
            <span className="text-[#F5F6F7] font-medium">GHG Protocol Scope 1 & 2</span>
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs">
            <div className="flex items-center gap-2 text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>Timestamp</span>
            </div>
            <span className="text-[#34D399] font-mono font-medium">
              Oct 24, 2025 · 14:32 IST
            </span>
          </div>
        </div>

        {/* SHA-256 Stamp */}
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#34D399]" />
            <span>SHA-256 Validated</span>
          </div>
          <span className="font-mono text-[11px] text-[#9CA3AF]/70">#e4a8b...92fd</span>
        </div>
      </div>

      {/* Floating Interactive Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-xl bg-[#1F2228] border border-[#34D399] text-[#F5F6F7] shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <Download className="w-5 h-5 text-[#34D399] shrink-0" />
            <span className="text-xs font-medium truncate">{toastMessage}</span>
          </div>
          <span className="text-xs text-[#34D399] font-mono font-bold shrink-0">READY</span>
        </div>
      )}
    </div>
  );
};
