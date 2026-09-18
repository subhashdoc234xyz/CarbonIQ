import { ReductionAction } from '../types';

export interface SolverResult {
  selectedIds: string[];
  totalCost: number;
  totalCo2Saved: number;
  efficiencyPerTon: number; // cost per ton saved
  budgetRemaining: number;
}

/**
 * Solves the exact binary knapsack problem corresponding to PuLP LpProblem
 * Maximize sum(co2Saved) subject to sum(cost) <= budget
 */
export function solveCarbonBudgetAllocation(
  actions: ReductionAction[],
  budget: number
): SolverResult {
  const n = actions.length;
  if (n === 0 || budget <= 0) {
    return {
      selectedIds: [],
      totalCost: 0,
      totalCo2Saved: 0,
      efficiencyPerTon: 0,
      budgetRemaining: budget,
    };
  }

  // Use branch & bound or subset optimization (n is small ~6-20 actions)
  let bestValue = -1;
  let bestCost = 0;
  let bestSubset: string[] = [];

  const totalCombinations = 1 << n;
  for (let mask = 0; mask < totalCombinations; mask++) {
    let currentCost = 0;
    let currentValue = 0;
    const currentIds: string[] = [];

    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        currentCost += actions[i].cost;
        currentValue += actions[i].co2SavedTonsPerYear;
        currentIds.push(actions[i].id);
      }
    }

    if (currentCost <= budget) {
      if (currentValue > bestValue || (currentValue === bestValue && currentCost < bestCost)) {
        bestValue = currentValue;
        bestCost = currentCost;
        bestSubset = currentIds;
      }
    }
  }

  const efficiency = bestValue > 0 ? Math.round(bestCost / bestValue) : 0;

  return {
    selectedIds: bestSubset,
    totalCost: bestCost,
    totalCo2Saved: parseFloat(bestValue.toFixed(1)),
    efficiencyPerTon: efficiency,
    budgetRemaining: budget - bestCost,
  };
}

export function formatIndianCurrency(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)}Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}
