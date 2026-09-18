import { ActivityLogEntry, EmissionFactor, OptimizationRun, ReductionAction, UserProfile } from '../types';

// CarbonIQ intentionally ships without organization, activity, factor, or project data.
export const DEFAULT_USER: UserProfile = {
  id: 'workspace_user',
  fullName: 'Workspace user',
  email: '',
  avatarUrl: '',
  facility: 'Your facility',
  role: 'Member',
};

export const GUEST_USER: UserProfile = DEFAULT_USER;
export const EMISSION_FACTORS: EmissionFactor[] = [];
export const INITIAL_LOGS: ActivityLogEntry[] = [];
export const REDUCTION_ACTIONS: ReductionAction[] = [];
export const INITIAL_RUNS: OptimizationRun[] = [];
