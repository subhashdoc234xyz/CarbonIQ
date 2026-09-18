import React, { useState } from 'react';
import { ActivityLogEntry, EmissionFactor } from '../types';
import { EMISSION_FACTORS } from '../data/initialData';
import {
  Calendar,
  Lock,
  PlusCircle,
  History,
  Trash2,
  Edit2,
  CheckCircle2,
  Zap,
  Truck,
  Flame,
  Building,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLogEntry[];
  onAddLog: (log: ActivityLogEntry) => void;
  onDeleteLog: (id: string) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [selectedFactorId, setSelectedFactorId] = useState(EMISSION_FACTORS[0].id);
  const [quantityStr, setQuantityStr] = useState('24,500');
  const [dateStr, setDateStr] = useState('Oct 24, 2025');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const selectedFactor: EmissionFactor =
    EMISSION_FACTORS.find((f) => f.id === selectedFactorId) || EMISSION_FACTORS[0];

  // Parse clean numeric quantity
  const numericQuantity = parseFloat(quantityStr.replace(/,/g, '')) || 0;
  const calculatedCo2 = Math.round(numericQuantity * selectedFactor.value);
  const treesEquivalent = Math.round(calculatedCo2 / 22);
  const progressPercent = Math.min(Math.max((calculatedCo2 / 30000) * 100, 15), 100);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('');

    if (parts[0]) {
      const formattedInt = parseInt(parts[0], 10).toLocaleString('en-US');
      setQuantityStr(parts.length > 1 ? `${formattedInt}.${parts[1]}` : formattedInt);
    } else {
      setQuantityStr(raw);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericQuantity <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newEntry: ActivityLogEntry = {
        id: `log_${Date.now()}`,
        userId: 'usr_enterprise_001',
        sourceType: selectedFactor.shortName,
        activityValue: numericQuantity,
        unit: selectedFactor.unit,
        factorValue: selectedFactor.value,
        calculatedEmissionsKg: calculatedCo2,
        loggedAt: dateStr || 'Today',
        scope: selectedFactor.scope,
        icon: selectedFactor.icon,
      };

      onAddLog(newEntry);
      setIsSubmitting(false);
      setSubmittedStatus(true);

      setTimeout(() => {
        setSubmittedStatus(false);
      }, 2000);
    }, 450);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399] font-mono">
              Telemetry Node • Active
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181C] border border-[#26292F] text-xs">
            <Zap className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="text-[#F5F6F7] font-medium">GHG Protocol Compliant</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] tracking-tight mt-2">
          Log Activity Data
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
          Calculate CO₂ impact instantly using verified emission factors.
        </p>
      </div>

      {/* Primary Interactive Input Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#16181C] border border-[#26292F] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5"
      >
        {/* Top Meta Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-[#1F2228] border border-[#26292F] px-3 py-1 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            <span className="text-[#34D399] font-medium font-mono">
              {selectedFactor.scope} ({selectedFactor.scope === 'Scope 2' ? 'Indirect Emissions' : 'Direct'})
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#9CA3AF] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{selectedFactor.sourceCert}</span>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Source & Emission Factor Dropdown */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <label htmlFor="source-factor" className="font-medium">
                Source & Emission Factor
              </label>
              <span className="text-[#34D399] hover:underline cursor-pointer">Browse Factors</span>
            </div>

            <div className="relative">
              <select
                id="source-factor"
                value={selectedFactorId}
                onChange={(e) => setSelectedFactorId(e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-[#1F2228] border border-[#26292F] text-[#F5F6F7] text-xs sm:text-sm rounded-xl focus:outline-none focus:border-[#34D399]/50 transition-colors"
              >
                {EMISSION_FACTORS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.factorName} ({f.value} kg/{f.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Measured Quantity + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 flex flex-col gap-1.5">
              <label htmlFor="measured-quantity" className="text-xs text-[#9CA3AF] font-medium">
                Measured Quantity
              </label>
              <input
                id="measured-quantity"
                type="text"
                value={quantityStr}
                onChange={handleQuantityChange}
                placeholder="0"
                className="w-full h-11 px-3 bg-[#1F2228] border border-[#26292F] text-[#F5F6F7] text-base font-bold font-mono rounded-xl focus:outline-none focus:border-[#34D399]/50 transition-colors"
              />
            </div>

            <div className="sm:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs text-[#9CA3AF] font-medium">Unit</label>
              <div className="h-11 px-3 bg-[#1F2228] border border-[#26292F] rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-[#34D399] font-mono">
                  {selectedFactor.unit}
                </span>
                <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>
            </div>
          </div>

          {/* Reporting Timestamp */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reporting-date" className="text-xs text-[#9CA3AF] font-medium">
              Reporting Timestamp
            </label>
            <div className="relative flex items-center">
              <input
                id="reporting-date"
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full h-11 pl-9 pr-3 bg-[#1F2228] border border-[#26292F] text-[#F5F6F7] text-xs sm:text-sm rounded-xl focus:outline-none focus:border-[#34D399]/50"
              />
              <Calendar className="w-4 h-4 text-[#9CA3AF] absolute left-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Live Preview Dynamic Card */}
        <div className="bg-[#0B0D10] border border-[#26292F] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              Instant Telemetry Delta
            </span>
            <span className="text-[11px] font-mono font-medium text-[#34D399]">
              99.8% Precision
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#34D399] font-mono tracking-tight">
                {calculatedCo2.toLocaleString()} kg CO₂e
              </div>
              <div className="text-xs text-[#9CA3AF] font-mono mt-0.5">
                {numericQuantity.toLocaleString()} {selectedFactor.unit} × {selectedFactor.value} kg/{selectedFactor.unit}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] text-[#9CA3AF]">Equivalent Offset</div>
              <div className="text-sm font-semibold text-[#F5F6F7]">
                ~{treesEquivalent.toLocaleString()} Trees/Yr
              </div>
            </div>
          </div>

          {/* Progress Spark Bar */}
          <div className="w-full bg-[#1F2228] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#34D399] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || numericQuantity <= 0}
          className={`w-full h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
            submittedStatus
              ? 'bg-[#34D399] text-[#003825]'
              : 'bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] active:scale-[0.99] shadow-[0_0_18px_rgba(52,211,153,0.3)]'
          }`}
        >
          {isSubmitting ? (
            <span>Recording to Ledger...</span>
          ) : submittedStatus ? (
            <>
              <Check className="w-4 h-4" />
              <span>Logged & Timestamped!</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Log Activity Entry</span>
            </>
          )}
        </button>
      </form>

      {/* History Ledger Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#9CA3AF]" />
            <h2 className="text-base font-semibold text-[#F5F6F7]">Your Logged History</h2>
          </div>
          <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#16181C] border border-[#26292F] px-2.5 py-0.5 rounded-full">
            {logs.length} Records Scoped
          </span>
        </div>

        {/* History Stream */}
        <div className="space-y-2">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#16181C] hover:bg-[#1F2228] border border-[#26292F] transition-all rounded-xl p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#0B0D10] border border-[#26292F] flex items-center justify-center text-[#34D399] shrink-0">
                  {entry.scope === 'Scope 2' ? (
                    <Zap className="w-5 h-5" />
                  ) : entry.sourceType.toLowerCase().includes('freight') ? (
                    <Truck className="w-5 h-5" />
                  ) : entry.sourceType.toLowerCase().includes('gas') ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <Building className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-[#F5F6F7] truncate">
                      {entry.sourceType}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#26292F] text-[#34D399] font-mono shrink-0">
                      {entry.scope}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#9CA3AF] text-[11px] mt-0.5">
                    <span>{entry.loggedAt}</span>
                    <span>•</span>
                    <span className="font-mono">
                      {entry.activityValue.toLocaleString()} {entry.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold text-[#F5F6F7] font-mono">
                    {entry.calculatedEmissionsKg.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#9CA3AF]">kg CO₂e</div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => onDeleteLog(entry.id)}
                    className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#26292F] transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Footer Badge */}
        <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1 px-1">
          <span>Displaying latest {logs.length} of {logs.length} records</span>
          <span className="text-[#34D399] font-medium">Audit Ledger Verified</span>
        </div>
      </div>
    </div>
  );
};
