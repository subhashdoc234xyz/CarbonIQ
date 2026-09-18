export type ScreenView = 
  | 'landing' 
  | 'signin' 
  | 'dashboard' 
  | 'activity-log' 
  | 'budget-optimizer' 
  | 'reports'
  | 'steel-ml'
  | 'open-india-factors';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  facility: string;
  role: string;
}

export interface EmissionFactor {
  id: string;
  factorName: string;
  shortName: string;
  value: number;
  unit: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  sourceCert: string;
  icon: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  sourceType: string;
  activityValue: number;
  unit: string;
  factorValue: number;
  calculatedEmissionsKg: number;
  loggedAt: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  icon: string;
  notes?: string;
}

export interface ReductionAction {
  id: string;
  actionName: string;
  description: string;
  category: string;
  cost: number;
  co2SavedTonsPerYear: number;
  icon: string;
}

export interface OptimizationRun {
  id: string;
  runNumber: number;
  budgetAmount: number;
  totalCostUsed: number;
  totalCo2SavedTons: number;
  efficiencyPerTon: number;
  selectedActionIds: string[];
  createdAt: string;
}
