import { ActivityLogEntry } from '../types';

/** Activity-based accounting: kg CO₂e = measured activity × selected factor. */
export function estimateActivityEmissions(quantity: number, factorKgCo2ePerUnit: number): number {
  if (!Number.isFinite(quantity) || !Number.isFinite(factorKgCo2ePerUnit) || quantity < 0 || factorKgCo2ePerUnit < 0) return 0;
  return Number((quantity * factorKgCo2ePerUnit).toFixed(3));
}

export function emissionsByScope(logs: ActivityLogEntry[]) {
  return logs.reduce<Record<ActivityLogEntry['scope'], number>>((totals, log) => {
    totals[log.scope] += log.calculatedEmissionsKg;
    return totals;
  }, { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 });
}
