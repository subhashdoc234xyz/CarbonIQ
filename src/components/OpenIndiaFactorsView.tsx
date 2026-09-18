import React, { useState } from 'react';
import {
  OPEN_INDIA_FACTORS,
  OPEN_INDIA_METADATA,
  OPEN_INDIA_SECTORS,
  OPEN_INDIA_SCOPES,
  OpenIndiaEmissionFactor,
  filterOpenIndiaFactors,
} from '../data/openIndiaFactors';
import {
  Database,
  Search,
  Filter,
  ExternalLink,
  Code2,
  Check,
  Copy,
  Layers,
  ArrowRight,
  BookOpen,
  Info,
  Building,
} from 'lucide-react';

interface OpenIndiaFactorsViewProps {
  onSelectFactorForLog?: (factor: OpenIndiaEmissionFactor) => void;
}

export const OpenIndiaFactorsView: React.FC<OpenIndiaFactorsViewProps> = ({
  onSelectFactorForLog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedScope, setSelectedScope] = useState('All');
  const [showSeedCode, setShowSeedCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<OpenIndiaEmissionFactor | null>(null);

  const filteredFactors = filterOpenIndiaFactors(searchQuery, selectedSector, selectedScope);

  const seedScriptCode = `# 6.2 GitHub — Open India Emission Factors (seed into Supabase)
import pandas as pd
from supabase import create_client
import os

supabase = create_client(
    os.environ["SUPABASE_URL"], 
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

url = "https://creator619-python.github.io/open-india-emission-factors/emission_factors_v1_2.json"
response = pd.read_json(url)
factors = response["emission_factors"].to_dict(orient="records")

print(f"Seeding {len(factors)} verified Open India emission factors into Supabase...")

for f in factors:
    supabase.table("emission_factors").insert({
        "factor_name": f["factor_name"],
        "geography": f.get("geography"),
        "geography_type": f.get("geography_type"),
        "value": f["value"],
        "unit": f["unit"],
        "scope": f.get("scope"),
        "sector": f.get("sector"),
        "source_document": f.get("source_document"),
        "source_url": f.get("source_url"),
        "reference_year": f.get("reference_year"),
        "methodology": f.get("methodology"),
        "notes": f.get("notes"),
    }).execute()

print("Successfully seeded all emission factors into Supabase.")`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(seedScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] font-mono text-[11px] font-bold">
              GitHub: creator619-python/open-india-emission-factors
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1F2228] border border-[#26292F] text-[#9CA3AF] text-[11px] font-mono">
              Version {OPEN_INDIA_METADATA.version || '1.2'} • {OPEN_INDIA_FACTORS.length} Factors
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] tracking-tight">
            Open India Emission Factors Database
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Verified emission factors from Central Electricity Authority (CEA V21.0), PPAC, IPCC 2006, and Smart Freight Centre India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSeedCode(!showSeedCode)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F2228] hover:bg-[#26292F] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] transition-all cursor-pointer font-mono"
          >
            <Code2 className="w-4 h-4 text-[#34D399]" />
            <span>{showSeedCode ? 'Hide Seeder Script' : 'Supabase Seeder Script'}</span>
          </button>
        </div>
      </div>

      {/* Supabase Seeder Code Modal (Section 6.2) */}
      {showSeedCode && (
        <div className="bg-[#0c0e11] border border-[#26292F] rounded-2xl p-4 sm:p-5 font-mono text-xs shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#9CA3AF] border-b border-[#26292F] pb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#34D399]" />
              <span className="text-[#F5F6F7] font-semibold text-xs">
                src/seed_emission_factors.py
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2228] hover:bg-[#26292F] text-[#9CA3AF] hover:text-[#F5F6F7] text-[11px] transition-all cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[#34D399]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-[#F5F6F7] overflow-x-auto p-3 bg-[#16181C] rounded-lg leading-relaxed">
            {seedScriptCode}
          </pre>
          <div className="text-[11px] text-[#9CA3AF] flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-[#34D399]" />
            <span>
              A local JSON copy (<code className="text-[#F5F6F7]">open_india_emission_factors.json</code>) is bundled locally as offline fallback for demo day.
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search factors (e.g., CEA, diesel, coal, aluminium, grid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs sm:text-sm text-[#F5F6F7] placeholder-[#6B7280] focus:outline-none focus:border-[#34D399]"
            />
          </div>

          {/* Sector Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs sm:text-sm text-[#F5F6F7] focus:outline-none focus:border-[#34D399]"
            >
              <option value="All">All Sectors ({OPEN_INDIA_SECTORS.length})</option>
              {OPEN_INDIA_SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Scope Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs sm:text-sm text-[#F5F6F7] focus:outline-none focus:border-[#34D399]"
            >
              <option value="All">All Scopes</option>
              {OPEN_INDIA_SCOPES.map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1">
          <span>
            Showing <strong className="text-[#F5F6F7]">{filteredFactors.length}</strong> of{' '}
            {OPEN_INDIA_FACTORS.length} verified emission factors
          </span>
          {(searchQuery || selectedSector !== 'All' || selectedScope !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('All');
                setSelectedScope('All');
              }}
              className="text-[#34D399] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Factors Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFactors.slice(0, 36).map((factor) => {
          const isSelected = selectedFactor?.id === factor.id;
          return (
            <div
              key={factor.id}
              onClick={() => setSelectedFactor(factor)}
              className={`bg-[#16181C] border rounded-2xl p-4 shadow-md flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#34D399] shadow-lg shadow-[#34D399]/10'
                  : 'border-[#26292F] hover:border-[#34D399]/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1F2228] text-[#34D399] border border-[#26292F]">
                    {factor.scope || 'Scope 2'}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono truncate max-w-[140px]">
                    {factor.geography || 'India'}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-[#F5F6F7] line-clamp-2 leading-snug">
                  {factor.factor_name}
                </h3>

                <div className="pt-2 flex items-baseline gap-1.5 font-mono">
                  <span className="text-xl font-extrabold text-[#34D399]">
                    {factor.value}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{factor.unit}</span>
                </div>

                <div className="text-[11px] text-[#9CA3AF] line-clamp-1">
                  Sector: <span className="text-[#F5F6F7]">{factor.sector}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#26292F] flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280] truncate max-w-[150px]">
                  {factor.source_document || 'CEA / IPCC'}
                </span>

                {onSelectFactorForLog && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFactorForLog(factor);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#34D399] hover:text-[#2ec58e] transition-colors cursor-pointer"
                  >
                    <span>Use in Log</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Factor Detailed Drawer / Inspector Modal */}
      {selectedFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#16181C] border border-[#34D399]/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30">
                  {selectedFactor.scope} • {selectedFactor.sector}
                </span>
                <h3 className="text-base font-bold text-[#F5F6F7] mt-1.5">
                  {selectedFactor.factor_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFactor(null)}
                className="text-[#9CA3AF] hover:text-[#F5F6F7] text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0B0D10] border border-[#26292F] p-4 rounded-xl space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9CA3AF]">Emission Factor Value:</span>
                <span className="text-lg font-extrabold text-[#34D399]">
                  {selectedFactor.value} {selectedFactor.unit}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9CA3AF]">Geography / Region:</span>
                <span className="text-[#F5F6F7]">{selectedFactor.geography} ({selectedFactor.geography_type})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9CA3AF]">Reference Period:</span>
                <span className="text-[#F5F6F7]">{selectedFactor.reference_year || 'FY 2024-25'}</span>
              </div>
            </div>

            {selectedFactor.methodology && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block">
                  Methodology & Standard
                </span>
                <p className="text-xs text-[#9CA3AF] leading-relaxed bg-[#1F2228] p-3 rounded-xl border border-[#26292F]">
                  {selectedFactor.methodology}
                </p>
              </div>
            )}

            {selectedFactor.notes && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block">
                  Regulatory Notes (BRSR Core / BEE CCTS)
                </span>
                <p className="text-xs text-[#9CA3AF] leading-relaxed bg-[#1F2228] p-3 rounded-xl border border-[#26292F]">
                  {selectedFactor.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              {selectedFactor.source_url ? (
                <a
                  href={selectedFactor.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#34D399] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Source: {selectedFactor.source_document}</span>
                </a>
              ) : (
                <span className="text-xs text-[#9CA3AF]">{selectedFactor.source_document}</span>
              )}

              {onSelectFactorForLog && (
                <button
                  onClick={() => {
                    onSelectFactorForLog(selectedFactor);
                    setSelectedFactor(null);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] font-bold text-xs transition-all cursor-pointer"
                >
                  Select & Log
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
