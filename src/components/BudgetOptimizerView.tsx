import React, { useState, useMemo } from 'react';
import { OptimizationRun, ReductionAction } from '../types';
import { REDUCTION_ACTIONS, INITIAL_RUNS } from '../data/initialData';
import { solveCarbonBudgetAllocation, formatIndianCurrency } from '../utils/pulpSolver';
import { fetchGroqOptimizationInsights } from '../services/groqService';
import {
  Cpu,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Sparkles,
  History,
  ChevronRight,
  Sun,
  Flame,
  Wind,
  Lightbulb,
  Radio,
  Code2,
  Copy,
  Check,
  Binary,
  Bot,
  AlertCircle,
} from 'lucide-react';

interface BudgetOptimizerViewProps {
  onOptimizationComplete?: (run: OptimizationRun) => void;
}

export const BudgetOptimizerView: React.FC<BudgetOptimizerViewProps> = () => {
  const [budgetAmount, setBudgetAmount] = useState<number>(400000);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [runs, setRuns] = useState<OptimizationRun[]>(INITIAL_RUNS);
  const [showPulpCode, setShowPulpCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [groqInsights, setGroqInsights] = useState<string | null>(null);
  const [isLoadingGroq, setIsLoadingGroq] = useState<boolean>(false);
  const [groqError, setGroqError] = useState<string | null>(null);

  // Compute solver result dynamically
  const solution = useMemo(() => {
    return solveCarbonBudgetAllocation(REDUCTION_ACTIONS, budgetAmount);
  }, [budgetAmount]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetAmount(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const val = Number(raw) || 100000;
    setBudgetAmount(Math.min(Math.max(val, 50000), 1500000));
  };

  const handleRunOptimization = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      const newRun: OptimizationRun = {
        id: `run_${Date.now()}`,
        runNumber: runs.length > 0 ? runs[0].runNumber + 1 : 1,
        budgetAmount,
        totalCostUsed: solution.totalCost,
        totalCo2SavedTons: solution.totalCo2Saved,
        efficiencyPerTon: solution.efficiencyPerTon,
        selectedActionIds: solution.selectedIds,
        createdAt: 'Just now',
      };
      setRuns([newRun, ...runs]);
    }, 700);
  };

  const pulpPythonCode = `# 6.3 GitHub — PuLP (optimization engine)
from pulp import LpProblem, LpMaximize, LpVariable, lpSum
from supabase import create_client
import os

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])

actions = supabase.table("reduction_actions").select("*").execute().data
budget = ${budgetAmount}  # Dynamic budget parameter (₹${budgetAmount.toLocaleString('en-IN')})

# 0-1 Knapsack Integer Linear Program formulation
prob = LpProblem("Carbon_Budget_Allocation", LpMaximize)
x = {a["id"]: LpVariable(name=str(a["id"]), cat="Binary") for a in actions}

# Objective: Maximize total tons of CO2 abatement
prob += lpSum(x[a["id"]] * a["co2_saved_tons_per_year"] for a in actions)

# Constraint: Total CapEx expenditure cannot exceed budget
prob += lpSum(x[a["id"]] * a["cost"] for a in actions) <= budget

prob.solve()

selected = [a for a in actions if x[a["id"]].value() == 1]
print(f"Optimal solution found: {len(selected)} actions selected.")
print(f"Total CO2 saved: {sum(a['co2_saved_tons_per_year'] for a in selected)} tons/yr")

# Save run + selected actions to budget_optimizations tagged with current user id
# supabase.table("budget_optimizations").insert({...}).execute()`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pulpPythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRequestGroqInsights = async () => {
    setIsLoadingGroq(true);
    setGroqError(null);
    try {
      const selectedActions = REDUCTION_ACTIONS.filter((a) => solution.selectedIds.includes(a.id));
      const res = await fetchGroqOptimizationInsights({
        budget: budgetAmount,
        actions: selectedActions,
        totalCost: solution.totalCost,
        totalCo2Saved: solution.totalCo2Saved,
      });
      if (res.success && res.insights) {
        setGroqInsights(res.insights);
      } else {
        setGroqError(res.error || 'Could not fetch insights from Groq.');
      }
    } catch (e: any) {
      setGroqError(e.message || 'Error communicating with Groq API.');
    } finally {
      setIsLoadingGroq(false);
    }
  };

  const costPercentage =
    budgetAmount > 0 ? Math.min((solution.totalCost / budgetAmount) * 100, 100) : 0;

  const fundedCount = solution.selectedIds.length;
  const totalActionsCount = REDUCTION_ACTIONS.length;

  const getActionIcon = (action: ReductionAction) => {
    if (action.actionName.includes('Solar')) return <Sun className="w-5 h-5 text-[#34D399]" />;
    if (action.actionName.includes('Boiler') || action.actionName.includes('Heat'))
      return <Flame className="w-5 h-5 text-[#34D399]" />;
    if (action.actionName.includes('VFD') || action.actionName.includes('Drive'))
      return <Zap className="w-5 h-5 text-[#34D399]" />;
    if (action.actionName.includes('LED') || action.actionName.includes('Light'))
      return <Lightbulb className="w-5 h-5 text-[#9CA3AF]" />;
    if (action.actionName.includes('Air'))
      return <Wind className="w-5 h-5 text-[#34D399]" />;
    return <Cpu className="w-5 h-5 text-[#34D399]" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Micro Engine Status Pill */}
      <div className="flex items-center justify-between bg-[#16181C] border border-[#26292F] px-4 py-2.5 rounded-xl shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#34D399]" />
          <span className="text-xs font-semibold text-[#9CA3AF] font-mono">
            PuLP Simplex LP Solver (Binary 0-1 Knapsack)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPulpCode(!showPulpCode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F2228] hover:bg-[#26292F] text-[#9CA3AF] hover:text-[#F5F6F7] text-xs font-mono transition-all cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{showPulpCode ? 'Hide Python LP' : 'View PuLP Code'}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-wider">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* PuLP Python Code Drawer (Section 6.3) */}
      {showPulpCode && (
        <div className="bg-[#0c0e11] border border-[#26292F] rounded-2xl p-4 sm:p-5 font-mono text-xs shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#9CA3AF] border-b border-[#26292F] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#F5F6F7] font-semibold text-xs">
                src/pulp_optimizer.py
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
                  <span>Copy Python Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-[#F5F6F7] overflow-x-auto p-3 bg-[#16181C] rounded-lg leading-relaxed">
            {pulpPythonCode}
          </pre>
        </div>
      )}

      {/* Hero Optimizer Input Card */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block font-mono">
              CapEx Allocation (Constraint: Σ x[i] · cost[i] ≤ Budget)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] mt-1">
              Sustainability Budget (₹)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBudgetAmount(400000)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                budgetAmount === 400000
                  ? 'bg-[#34D399] text-[#003825]'
                  : 'bg-[#1F2228] border border-[#26292F] text-[#34D399] hover:bg-[#26292F]'
              }`}
            >
              ₹400,000 (Sec 6.3 Target)
            </button>
            <div className="px-2.5 py-1 rounded-lg bg-[#1F2228] border border-[#26292F] text-[#34D399] text-xs font-medium flex items-center gap-1.5 font-mono">
              <Sliders className="w-3.5 h-3.5" />
              <span>Bounded 0-1 LP</span>
            </div>
          </div>
        </div>

        {/* Value Display & Numeric Sync Input */}
        <div className="flex items-center justify-between bg-[#0B0D10] border border-[#26292F] px-4 py-3 rounded-xl">
          <span className="text-xl font-bold text-[#9CA3AF] font-mono">₹</span>
          <input
            type="text"
            value={budgetAmount.toLocaleString('en-IN')}
            onChange={handleInputChange}
            className="bg-transparent text-right text-2xl sm:text-3xl font-extrabold text-[#F5F6F7] font-mono focus:outline-none w-full"
          />
        </div>

        {/* Intuitive Micro Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="100000"
            max="1000000"
            step="25000"
            value={budgetAmount}
            onChange={handleSliderChange}
            className="w-full accent-[#34D399] bg-[#26292F] rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] font-mono">
            <button
              onClick={() => setBudgetAmount(100000)}
              className="hover:text-[#34D399] transition-colors cursor-pointer"
            >
              ₹1.0L Min
            </button>
            <button
              onClick={() => setBudgetAmount(400000)}
              className="text-[#34D399] font-bold hover:underline transition-colors cursor-pointer"
            >
              ₹4.0L (Spec 6.3)
            </button>
            <button
              onClick={() => setBudgetAmount(500000)}
              className="hover:text-[#34D399] transition-colors cursor-pointer"
            >
              ₹5.0L Baseline
            </button>
            <button
              onClick={() => setBudgetAmount(1000000)}
              className="hover:text-[#34D399] transition-colors cursor-pointer"
            >
              ₹10.0L Max
            </button>
          </div>
        </div>

        {/* Primary Trigger Action */}
        <button
          onClick={handleRunOptimization}
          disabled={isSolving}
          className="w-full py-4 px-6 rounded-xl bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] font-bold text-base shadow-[0_0_24px_rgba(52,211,153,0.35)] hover:shadow-[0_0_32px_rgba(52,211,153,0.5)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:opacity-75"
        >
          {isSolving ? (
            <span className="flex items-center gap-2 font-mono">
              <span className="w-3.5 h-3.5 border-2 border-[#003825] border-t-transparent rounded-full animate-spin" />
              Computing PuLP Simplex Matrix...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 fill-current" />
              <span>⚡ Solve with PuLP Linear Optimizer</span>
            </span>
          )}
        </button>
      </div>

      {/* Real-time Metrics Matrix (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Cost Used */}
        <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Total CapEx Committed</span>
            <span className="text-[10px] font-mono text-[#9CA3AF]">PuLP Constraint</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-[#F5F6F7] font-mono">
              {formatIndianCurrency(solution.totalCost)}
            </span>
            <span className="text-xs text-[#9CA3AF] block mt-0.5 font-mono">
              of {formatIndianCurrency(budgetAmount)} cap
            </span>
          </div>
          <div className="w-full bg-[#26292F] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#34D399] h-full rounded-full transition-all duration-300"
              style={{ width: `${costPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: CO2 Saved */}
        <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Objective Max: CO₂ Abated</span>
            <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-[#34D399] font-mono">
              {solution.totalCo2Saved}
            </span>
            <span className="text-xs text-[#9CA3AF] block mt-0.5">tons / yr</span>
          </div>
          <div className="flex items-center gap-1 text-[#34D399] text-xs font-mono font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Optimal Abatement Frontier</span>
          </div>
        </div>

        {/* Metric 3: Efficiency */}
        <div className="bg-[#16181C] border border-[#26292F] p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Abatement Cost</span>
            <Radio className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-[#F5F6F7] font-mono">
              ₹{solution.efficiencyPerTon}
            </span>
            <span className="text-xs text-[#9CA3AF] block mt-0.5">/ ton CO₂</span>
          </div>
          <span className="text-[11px] text-[#34D399] font-medium">Marginal Cost per tCO₂</span>
        </div>
      </div>

      {/* Groq AI Intelligence Card (Llama 3.3 70B - Groq API Only) */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#F5F6F7]">
                  Groq AI Mitigation Briefing
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                  Llama 3.3 70B
                </span>
              </div>
              <span className="text-xs text-[#9CA3AF]">
                Executive economic & abatement frontier analysis via Groq Cloud API
              </span>
            </div>
          </div>

          <button
            onClick={handleRequestGroqInsights}
            disabled={isLoadingGroq}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F2228] hover:bg-[#26292F] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] transition-all cursor-pointer font-mono shrink-0 disabled:opacity-50"
          >
            {isLoadingGroq ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin" />
                <span>Querying Groq...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Generate Groq Insights</span>
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
                Add <code className="text-[#F5F6F7]">GROQ_API_KEY</code> to your environment variables or <code className="text-[#F5F6F7]">.env</code> file.
              </span>
            </div>
          </div>
        )}

        {groqInsights ? (
          <div className="p-4 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs sm:text-sm text-[#F5F6F7] leading-relaxed whitespace-pre-line font-sans">
            {groqInsights}
          </div>
        ) : (
          !groqError && (
            <p className="text-xs text-[#9CA3AF] italic">
              Click &quot;Generate Groq Insights&quot; to synthesize marginal abatement curves and capital deployment sequencing using your active GROQ_API_KEY.
            </p>
          )
        )}
      </div>

      {/* Decision Variables Matrix & Action List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Binary className="w-4 h-4 text-[#34D399]" />
            Binary Decision Variables (x[a["id"]] ∈ &#123;0, 1&#125;)
          </span>
          <span className="text-xs text-[#34D399] font-medium font-mono">
            {fundedCount} of {totalActionsCount} Funded (x = 1)
          </span>
        </div>

        <div className="space-y-2.5">
          {REDUCTION_ACTIONS.map((action) => {
            const isSelected = solution.selectedIds.includes(action.id);
            return (
              <div
                key={action.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#16181C] border-[#34D399]/40 shadow-md'
                    : 'bg-[#16181C]/60 border-[#26292F] opacity-70'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1F2228] border border-[#26292F] flex items-center justify-center shrink-0">
                      {getActionIcon(action)}
                    </div>
                    <div>
                      <h3
                        className={`text-sm sm:text-base font-semibold leading-tight ${
                          isSelected ? 'text-[#F5F6F7]' : 'text-[#9CA3AF]'
                        }`}
                      >
                        {action.actionName}
                      </h3>
                      <span className="text-xs text-[#9CA3AF] block mt-0.5 font-mono">
                        ID: <code className="text-[#F5F6F7]">{action.id}</code> • {action.category}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399] font-mono text-xs font-bold border border-[#34D399]/40">
                        x = 1
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#34D399]/15 text-[#34D399] text-[11px] font-semibold shrink-0 flex items-center gap-1.5 font-mono border border-[#34D399]/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                        Selected by PuLP
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#26292F] text-[#9CA3AF] font-mono text-xs">
                        x = 0
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#26292F] text-[#9CA3AF] text-[11px] font-medium shrink-0 font-mono">
                        Unallocated
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between bg-[#0B0D10] border border-[#26292F] px-3.5 py-2 rounded-lg mt-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[#9CA3AF] text-[11px]">CapEx Cost (Cost Constraint)</span>
                    <span className="text-[#F5F6F7] font-semibold font-mono">
                      ₹{action.cost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-[#9CA3AF] text-[11px]">CO₂ Abatement Objective</span>
                    <span
                      className={`font-semibold font-mono ${
                        isSelected ? 'text-[#34D399]' : 'text-[#9CA3AF]'
                      }`}
                    >
                      +{action.co2SavedTonsPerYear} tCO₂/yr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Optimization Runs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider font-mono">
            Optimization Run History
          </span>
          <span className="text-xs text-[#34D399] font-medium">
            Saved to budget_optimizations
          </span>
        </div>

        <div className="bg-[#16181C] border border-[#26292F] rounded-2xl divide-y divide-[#26292F] overflow-hidden shadow-sm">
          {runs.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 hover:bg-[#1F2228] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F5F6F7] font-mono">
                    Run #{r.runNumber} • Tagged: usr_enterprise_001
                  </div>
                  <div className="text-xs text-[#9CA3AF] font-mono">
                    {formatIndianCurrency(r.budgetAmount)} budget · {r.totalCo2SavedTons}t saved · {r.selectedActionIds.length} actions
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span>{r.createdAt}</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
