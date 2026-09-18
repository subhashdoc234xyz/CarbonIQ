import React, { useMemo, useState } from 'react';
import { ActivityLogEntry } from '../types';
import { Calculator, PlusCircle, Trash2 } from 'lucide-react';

interface ActivityLogViewProps { logs: ActivityLogEntry[]; onAddLog: (log: ActivityLogEntry) => void; onDeleteLog: (id: string) => void; }

const ACTIVITY_TYPES = [
  { value: 'electricity', label: 'Electricity consumption', unit: 'kWh', scope: 'Scope 2' as const },
  { value: 'diesel', label: 'Diesel fuel', unit: 'litres', scope: 'Scope 1' as const },
  { value: 'petrol', label: 'Petrol fuel', unit: 'litres', scope: 'Scope 1' as const },
  { value: 'natural-gas', label: 'Natural gas', unit: 'm³', scope: 'Scope 1' as const },
  { value: 'business-travel', label: 'Business travel', unit: 'km', scope: 'Scope 3' as const },
  { value: 'freight', label: 'Freight transport', unit: 'tonne-km', scope: 'Scope 3' as const },
  { value: 'custom', label: 'Custom activity', unit: 'units', scope: 'Scope 3' as const },
];

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs, onAddLog, onDeleteLog }) => {
  const [activityType, setActivityType] = useState('electricity');
  const [customName, setCustomName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [factor, setFactor] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saved, setSaved] = useState(false);
  const selected = useMemo(() => ACTIVITY_TYPES.find((item) => item.value === activityType)!, [activityType]);
  const emissions = (Number(quantity) || 0) * (Number(factor) || 0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!quantity || !factor || (activityType === 'custom' && !customName.trim())) return;
    onAddLog({
      id: `activity_${Date.now()}`,
      userId: 'workspace_user',
      sourceType: activityType === 'custom' ? customName.trim() : selected.label,
      activityValue: Number(quantity), unit: selected.unit, factorValue: Number(factor),
      calculatedEmissionsKg: Number(emissions.toFixed(3)), loggedAt: date,
      scope: selected.scope, icon: 'activity', notes: 'Entered in CarbonIQ workspace',
    });
    setQuantity(''); setFactor(''); setCustomName(''); setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
    <div className="pt-2"><h1 className="text-xl sm:text-2xl font-bold text-[#F5F6F7]">Activity data</h1><p className="text-sm text-[#9CA3AF] mt-1">Choose an activity, enter the measured number, and use your verified emission factor.</p></div>
    <form onSubmit={submit} className="rounded-2xl bg-[#16181C] border border-[#26292F] p-5 sm:p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Activity type"><select value={activityType} onChange={(e) => setActivityType(e.target.value)} className="input"><option value="electricity">Electricity consumption (kWh)</option><option value="diesel">Diesel fuel (litres)</option><option value="petrol">Petrol fuel (litres)</option><option value="natural-gas">Natural gas (m³)</option><option value="business-travel">Business travel (km)</option><option value="freight">Freight transport (tonne-km)</option><option value="custom">Custom activity</option></select></Field>
        <Field label="Reporting date"><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        {activityType === 'custom' && <Field label="Custom activity name"><input className="input" value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Refrigerant top-up" required /></Field>}
        <Field label={`Measured quantity (${selected.unit})`}><input className="input" type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={`Enter ${selected.unit}`} required /></Field>
        <Field label={`Emission factor (kg CO₂e / ${selected.unit})`}><input className="input" type="number" min="0" step="any" value={factor} onChange={(e) => setFactor(e.target.value)} placeholder="Enter verified factor" required /></Field>
      </div>
      <div className="rounded-xl bg-[#0B0D10] border border-[#26292F] p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><div><p className="text-xs text-[#9CA3AF]">Calculated emissions</p><p className="text-2xl font-bold font-mono text-[#34D399]">{emissions.toLocaleString(undefined, { maximumFractionDigits: 3 })} kg CO₂e</p></div><p className="max-w-sm text-xs text-[#9CA3AF]">CarbonIQ does not supply a factor here—enter the source-approved factor for your location and reporting method.</p></div>
      <button type="submit" className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#34D399] text-[#003825] text-sm font-semibold"><PlusCircle className="inline w-4 h-4 mr-1.5" />{saved ? 'Activity saved' : 'Add activity record'}</button>
    </form>
    <section><h2 className="text-base font-semibold mb-3">Your activity records ({logs.length})</h2>{logs.length === 0 ? <div className="rounded-xl border border-dashed border-[#3A3E46] p-5 text-sm text-[#9CA3AF]">No records yet. Complete the form above to add your first measured activity.</div> : <div className="space-y-2">{logs.map((entry) => <div key={entry.id} className="flex justify-between items-center rounded-xl bg-[#16181C] border border-[#26292F] p-4"><div><p className="font-medium">{entry.sourceType}</p><p className="text-xs text-[#9CA3AF] mt-1">{entry.activityValue} {entry.unit} × {entry.factorValue} kg CO₂e · {entry.loggedAt}</p></div><div className="flex items-center gap-3"><span className="font-mono">{entry.calculatedEmissionsKg} kg</span><button type="button" onClick={() => onDeleteLog(entry.id)} aria-label="Delete record"><Trash2 className="w-4 h-4 text-[#9CA3AF] hover:text-red-400" /></button></div></div>)}</div>}</section>
  </div>;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-xs text-[#9CA3AF] font-medium space-y-1.5"><span>{label}</span>{children}</label>;
