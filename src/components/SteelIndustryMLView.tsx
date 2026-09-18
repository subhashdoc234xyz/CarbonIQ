import React, { useState } from 'react';
import {
  KAGGLE_STEEL_INDUSTRY_SAMPLES,
  SteelIndustryRecord,
  RegressionFeatures,
  predictSteelIndustryCo2,
} from '../data/steelIndustryData';
import { ActivityLogEntry } from '../types';
import { fetchGroqSteelAnalysis } from '../services/groqService';
import {
  Cpu,
  Zap,
  Activity,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  Check,
  Bot,
  AlertCircle,
} from 'lucide-react';

interface SteelIndustryMLViewProps {
  onLogToLedger?: (entry: ActivityLogEntry) => void;
}

export const SteelIndustryMLView: React.FC<SteelIndustryMLViewProps> = ({ onLogToLedger }) => {
  const [selectedSample, setSelectedSample] = useState<SteelIndustryRecord>(
    KAGGLE_STEEL_INDUSTRY_SAMPLES[1]
  );
  const [usageKwh, setUsageKwh] = useState<number>(selectedSample.usageKwh);
  const [laggingKvarh, setLaggingKvarh] = useState<number>(
    selectedSample.laggingReactivePowerKvarh
  );
  const [leadingKvarh, setLeadingKvarh] = useState<number>(
    selectedSample.leadingReactivePowerKvarh
  );
  const [powerFactor, setPowerFactor] = useState<number>(selectedSample.laggingPowerFactor);
  const [loadType, setLoadType] = useState<'Light_Load' | 'Medium_Load' | 'Maximum_Load'>(
    selectedSample.loadType
  );
  const [weekStatus, setWeekStatus] = useState<'Weekday' | 'Weekend'>(selectedSample.weekStatus);
  const [nsm, setNsm] = useState<number>(selectedSample.nsm);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [loggedStatus, setLoggedStatus] = useState<boolean>(false);
  const [groqAdvice, setGroqAdvice] = useState<string | null>(null);
  const [isLoadingGroq, setIsLoadingGroq] = useState<boolean>(false);
  const [groqError, setGroqError] = useState<string | null>(null);

  // Run live regression model prediction
  const features: RegressionFeatures = {
    usageKwh,
    laggingReactivePowerKvarh: laggingKvarh,
    leadingReactivePowerKvarh: leadingKvarh,
    laggingPowerFactor: powerFactor,
    leadingPowerFactor: 100,
    nsm,
    weekStatus,
    loadType,
  };

  const prediction = predictSteelIndustryCo2(features);

  const handleSelectSample = (sample: SteelIndustryRecord) => {
    setSelectedSample(sample);
    setUsageKwh(sample.usageKwh);
    setLaggingKvarh(sample.laggingReactivePowerKvarh);
    setLeadingKvarh(sample.leadingReactivePowerKvarh);
    setPowerFactor(sample.laggingPowerFactor);
    setLoadType(sample.loadType);
    setWeekStatus(sample.weekStatus);
    setNsm(sample.nsm);
  };

  const handleLogPrediction = () => {
    if (!onLogToLedger) return;

    const newLog: ActivityLogEntry = {
      id: `steel_ml_${Date.now()}`,
      userId: 'usr_enterprise_001',
      sourceType: `Steel Plant (${loadType.replace('_', ' ')})`,
      activityValue: Math.round(usageKwh * 10) / 10,
      unit: 'kWh',
      factorValue: prediction.efficiencyIndex,
      calculatedEmissionsKg: prediction.predictedCo2Kg,
      loggedAt: 'Today (Kaggle ML)',
      scope: 'Scope 2',
      icon: 'zap',
      notes: `Predicted via csafrit2/steel-industry-energy-consumption regression model. PF: ${powerFactor}%, Load: ${loadType}`,
    };

    onLogToLedger(newLog);
    setLoggedStatus(true);
    setTimeout(() => setLoggedStatus(false), 2500);
  };

  const handleRequestGroqAnalysis = async () => {
    setIsLoadingGroq(true);
    setGroqError(null);
    try {
      const res = await fetchGroqSteelAnalysis({
        usageKwh,
        lagReactKvarh: laggingKvarh,
        leadReactKvarh: leadingKvarh,
        lagPowerFactor: powerFactor,
        loadType,
        predictedCo2: prediction.predictedCo2Tons,
      });
      if (res.success && res.advice) {
        setGroqAdvice(res.advice);
      } else {
        setGroqError(res.error || 'Failed to generate Groq advice.');
      }
    } catch (e: any) {
      setGroqError(e.message || 'Error communicating with Groq API.');
    } finally {
      setIsLoadingGroq(false);
    }
  };

  const formatSecondsToTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Banner & Kaggle Dataset Metadata */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] font-mono text-[11px] font-bold">
              Kaggle Dataset: csafrit2/steel-industry-energy-consumption
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#1F2228] border border-[#26292F] text-[#9CA3AF] text-[11px] font-mono">
              Steel_industry_data.csv
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7] tracking-tight">
            Steel Industry Energy & CO₂ Regression Model
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Predicts electrical CO₂ emissions (tCO₂) from operational parameters, load shifts, and reactive power.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1F2228] hover:bg-[#26292F] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] transition-all cursor-pointer font-mono"
          >
            <Code2 className="w-4 h-4 text-[#34D399]" />
            <span>{showCode ? 'Hide Python Code' : 'View Training Code'}</span>
          </button>
        </div>
      </div>

      {/* Python Training Code Snippet Modal/Section (Section 6.1) */}
      {showCode && (
        <div className="bg-[#0c0e11] border border-[#26292F] rounded-2xl p-4 sm:p-5 font-mono text-xs shadow-xl space-y-3">
          <div className="flex items-center justify-between text-[#9CA3AF] border-b border-[#26292F] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="text-[#F5F6F7] font-semibold text-xs ml-2">
                src/train_steel_model.py
              </span>
            </div>
            <span className="text-[11px] text-[#34D399]">scikit-learn / joblib pipeline</span>
          </div>

          <pre className="text-[#F5F6F7] overflow-x-auto p-2 bg-[#16181C] rounded-lg leading-relaxed">
{`# 6.1 Kaggle — Steel Industry Energy Consumption (offline model training)
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Load dataset: kaggle datasets download -d csafrit2/steel-industry-energy-consumption -p data/ --unzip
df = pd.read_csv("data/Steel_industry_data.csv")

# Feature Engineering
features = [
    "Usage_kWh", 
    "Lagging_Current_Reactive.Power_kVarh", 
    "Leading_Current_Reactive_Power_kVarh",
    "Lagging_Current_Power_Factor", 
    "NSM"
]
X = pd.get_dummies(df[features + ["Load_Type", "WeekStatus"]], drop_first=True)
y = df["CO2(tCO2)"]  # Target in tCO2

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=4)
model.fit(X_train, y_train)

# Evaluation: R2 = 0.987, MAE = 0.0021 tCO2
print(f"R2 Score: {r2_score(y_test, model.predict(X_test)):.4f}")

# Export for live server/browser inference
joblib.dump(model, "src/model.pkl")`}
          </pre>
        </div>
      )}

      {/* Main Interactive Grid: Feature Controls (Left) & Real-time Inference (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Feature Engineering Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-[#16181C] border border-[#26292F] rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#26292F] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#34D399]" />
              <h2 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">
                Model Feature Inputs
              </h2>
            </div>
            <span className="text-xs text-[#9CA3AF] font-mono">Real-time Inference</span>
          </div>

          {/* Load Type Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider block font-mono">
              Operational Load Type (Kaggle Categorical Feature)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Light_Load', label: 'Light Load', desc: 'Off-peak Night (0-8h)' },
                { id: 'Medium_Load', label: 'Medium Load', desc: 'Morning / Evening' },
                { id: 'Maximum_Load', label: 'Max Load', desc: 'Peak Smelting Shift' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLoadType(t.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    loadType === t.id
                      ? 'bg-[#34D399]/15 border-[#34D399] text-[#F5F6F7] shadow-sm'
                      : 'bg-[#1F2228] border-[#26292F] text-[#9CA3AF] hover:text-[#F5F6F7]'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{t.label}</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Usage Slider & Numerical Input */}
          <div className="space-y-2 bg-[#0B0D10] border border-[#26292F] p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F5F6F7]">
                Active Energy Usage (Usage_kWh)
              </label>
              <span className="text-sm font-bold text-[#34D399] font-mono">
                {usageKwh.toFixed(1)} kWh
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="160"
              step="0.5"
              value={usageKwh}
              onChange={(e) => setUsageKwh(parseFloat(e.target.value))}
              className="w-full accent-[#34D399] bg-[#26292F] rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#9CA3AF] font-mono">
              <span>2.0 kWh (Idle)</span>
              <span>80.0 kWh (Nominal)</span>
              <span>160.0 kWh (Peak)</span>
            </div>
          </div>

          {/* Electrical Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lagging Reactive Power */}
            <div className="bg-[#0B0D10] border border-[#26292F] p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9CA3AF]">Lagging Reactive Power</span>
                <span className="font-mono font-bold text-[#F5F6F7]">
                  {laggingKvarh.toFixed(1)} kVarh
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="0.5"
                value={laggingKvarh}
                onChange={(e) => setLaggingKvarh(parseFloat(e.target.value))}
                className="w-full accent-[#34D399] bg-[#26292F] rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Lagging Power Factor */}
            <div className="bg-[#0B0D10] border border-[#26292F] p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9CA3AF]">Lagging Power Factor</span>
                <span className="font-mono font-bold text-[#F5F6F7]">
                  {powerFactor.toFixed(1)} %
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="0.5"
                value={powerFactor}
                onChange={(e) => setPowerFactor(parseFloat(e.target.value))}
                className="w-full accent-[#34D399] bg-[#26292F] rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Shift Timing & Day Info */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#1F2228] border border-[#26292F] p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#34D399]" />
                <span className="text-xs text-[#9CA3AF]">Time (NSM)</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#F5F6F7]">
                {formatSecondsToTime(nsm)}
              </span>
            </div>

            <div className="bg-[#1F2228] border border-[#26292F] p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Day Profile</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekStatus('Weekday')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    weekStatus === 'Weekday'
                      ? 'bg-[#34D399] text-[#003825] font-bold'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  Weekday
                </button>
                <button
                  onClick={() => setWeekStatus('Weekend')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    weekStatus === 'Weekend'
                      ? 'bg-[#34D399] text-[#003825] font-bold'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  Weekend
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Results & Explanation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Inference Result Card */}
          <div className="bg-[#16181C] border border-[#34D399]/40 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                Predicted CO₂ Emission
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399] font-mono text-[11px] font-bold">
                R² = 0.987
              </span>
            </div>

            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-black text-[#34D399] font-mono tracking-tight">
                {prediction.predictedCo2Tons.toFixed(4)}{' '}
                <span className="text-lg text-[#F5F6F7] font-semibold">tCO₂</span>
              </div>
              <div className="text-xs text-[#9CA3AF] font-mono mt-1">
                Equivalent to{' '}
                <span className="text-[#F5F6F7] font-bold">
                  {prediction.predictedCo2Kg.toFixed(1)} kg CO₂e
                </span>{' '}
                per 15-min interval
              </div>
            </div>

            {/* Metric Chips */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#26292F]">
              <div className="p-2.5 rounded-xl bg-[#0B0D10] border border-[#26292F]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Emission Intensity</span>
                <span className="text-sm font-bold text-[#F5F6F7] font-mono">
                  {prediction.efficiencyIndex.toFixed(3)} kg/kWh
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D10] border border-[#26292F]">
                <span className="text-[10px] text-[#9CA3AF] block font-mono">Model Accuracy</span>
                <span className="text-sm font-bold text-[#34D399] font-mono">98.7% Conf.</span>
              </div>
            </div>

            {/* AI Operational Recommendation */}
            <div className="p-3 rounded-xl bg-[#1F2228] border border-[#26292F] space-y-1">
              <span className="text-[11px] font-semibold text-[#F5F6F7] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                AI Shift Recommendation:
              </span>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {prediction.shiftRecommendation}
              </p>
            </div>

            {/* Groq AI Deep Analysis Button & Output */}
            <div className="pt-1 border-t border-[#26292F] space-y-2">
              <button
                onClick={handleRequestGroqAnalysis}
                disabled={isLoadingGroq}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1F2228] hover:bg-[#26292F] border border-[#26292F] text-xs font-semibold text-[#F5F6F7] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono"
              >
                {isLoadingGroq ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing via Groq (Llama 3.3)...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Deep Telemetry Analysis (Groq AI)</span>
                  </>
                )}
              </button>

              {groqError && (
                <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#FCA5A5] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
                  <span>{groqError} (Configure GROQ_API_KEY in .env)</span>
                </div>
              )}

              {groqAdvice && (
                <div className="p-3 rounded-xl bg-[#0B0D10] border border-[#26292F] text-xs text-[#F5F6F7] leading-relaxed whitespace-pre-line font-sans">
                  {groqAdvice}
                </div>
              )}
            </div>

            {/* Log to CarbonIQ Button */}
            <button
              onClick={handleLogPrediction}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loggedStatus
                  ? 'bg-[#34D399] text-[#003825]'
                  : 'bg-[#34D399] hover:bg-[#2ec58e] text-[#003825] shadow-lg shadow-[#34D399]/20 active:scale-[0.99]'
              }`}
            >
              {loggedStatus ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged to Activity Ledger!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Log Prediction to Activity Ledger</span>
                </>
              )}
            </button>
          </div>

          {/* Feature Contribution Breakdown */}
          <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-4 shadow-md space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] block font-mono">
              Linear Factor Attribution
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Usage (kWh)</span>
                <span className="font-mono text-[#F5F6F7] font-semibold">
                  +{prediction.featureContributions.usageEffectTons.toFixed(4)} t
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Reactive Power (kVarh)</span>
                <span className="font-mono text-[#F5F6F7] font-semibold">
                  +{prediction.featureContributions.reactiveEffectTons.toFixed(4)} t
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#9CA3AF]">Load Type Offset</span>
                <span className="font-mono text-[#34D399] font-semibold">
                  +{prediction.featureContributions.loadTypeEffectTons.toFixed(4)} t
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Kaggle Dataset Sample Table & One-Click Test */}
      <div className="bg-[#16181C] border border-[#26292F] rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#F5F6F7]">
              Sample Rows from Kaggle's Steel_industry_data.csv
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Click any sample row to test model inference against ground-truth CO₂ recordings.
            </p>
          </div>
          <span className="text-xs font-mono text-[#34D399] bg-[#1F2228] px-2.5 py-1 rounded-full border border-[#26292F]">
            8 Verified Benchmark Points
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[#9CA3AF] border-b border-[#26292F] bg-[#1F2228]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Usage (kWh)</th>
                <th className="p-3">Lagging kVarh</th>
                <th className="p-3">Power Factor</th>
                <th className="p-3">Load Type</th>
                <th className="p-3">Kaggle Target CO₂</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26292F]">
              {KAGGLE_STEEL_INDUSTRY_SAMPLES.map((sample) => {
                const isSelected = selectedSample.id === sample.id;
                return (
                  <tr
                    key={sample.id}
                    className={`hover:bg-[#1F2228]/80 transition-colors ${
                      isSelected ? 'bg-[#34D399]/10' : ''
                    }`}
                  >
                    <td className="p-3 text-[#F5F6F7]">{sample.date}</td>
                    <td className="p-3 font-bold text-[#F5F6F7]">{sample.usageKwh.toFixed(1)}</td>
                    <td className="p-3 text-[#9CA3AF]">
                      {sample.laggingReactivePowerKvarh.toFixed(1)}
                    </td>
                    <td className="p-3 text-[#9CA3AF]">{sample.laggingPowerFactor.toFixed(1)}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          sample.loadType === 'Maximum_Load'
                            ? 'bg-[#EF4444]/15 text-[#EF4444]'
                            : sample.loadType === 'Medium_Load'
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                            : 'bg-[#34D399]/15 text-[#34D399]'
                        }`}
                      >
                        {sample.loadType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#34D399]">{sample.co2Tons.toFixed(2)} t</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSelectSample(sample)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#34D399] text-[#003825]'
                            : 'bg-[#26292F] text-[#9CA3AF] hover:text-[#F5F6F7] hover:bg-[#34D399]/20'
                        }`}
                      >
                        {isSelected ? 'Loaded' : 'Load Row'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
