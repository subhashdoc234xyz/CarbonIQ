export interface DefaultEmissionFactor {
  value: string;
  label: string;
  unit: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  defaultFactor?: number;
  sourceName?: string;
  sourceUrl?: string;
  note?: string;
}

// Defaults are provided for quick estimates and remain editable in the Activity Log.
// Electricity uses India's latest CEA national grid result; the remaining factors use
// the official 2026 UK DESNZ activity-based conversion-factor dataset.
export const DEFAULT_EMISSION_FACTORS: DefaultEmissionFactor[] = [
  {
    value: 'electricity', label: 'Electricity consumption', unit: 'kWh', scope: 'Scope 2', defaultFactor: 0.678033,
    sourceName: 'India CEA CO₂ Baseline Database v22.0 (2025–26 weighted grid rate)',
    sourceUrl: 'https://cea.nic.in/cdm-co2-baseline-database/?lang=en',
    note: 'India national grid rate, including renewables and captive generation.',
  },
  {
    value: 'diesel', label: 'Diesel fuel', unit: 'litres', scope: 'Scope 1', defaultFactor: 2.58354,
    sourceName: 'UK DESNZ GHG Conversion Factors 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
    note: 'Average biofuel-blend road diesel; replace with a local factor when available.',
  },
  {
    value: 'petrol', label: 'Petrol fuel', unit: 'litres', scope: 'Scope 1', defaultFactor: 2.075,
    sourceName: 'UK DESNZ GHG Conversion Factors 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
    note: 'Average biofuel-blend petrol; replace with a local factor when available.',
  },
  {
    value: 'natural-gas', label: 'Natural gas', unit: 'm³', scope: 'Scope 1', defaultFactor: 2.026,
    sourceName: 'UK DESNZ GHG Conversion Factors 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
    note: 'Converted from the 2026 gross-calorific-value factor; gas composition can vary by supplier.',
  },
  {
    value: 'business-travel', label: 'Business travel — average car', unit: 'km', scope: 'Scope 3', defaultFactor: 0.25993,
    sourceName: 'UK DESNZ GHG Conversion Factors 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
    note: 'Average petrol car business travel; select a vehicle-specific factor where known.',
  },
  {
    value: 'freight', label: 'Freight transport — road HGV', unit: 'tonne-km', scope: 'Scope 3', defaultFactor: 0.10356,
    sourceName: 'UK DESNZ GHG Conversion Factors 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026',
    note: 'All non-refrigerated HGV types; use carrier or route data when available.',
  },
  { value: 'custom', label: 'Custom activity', unit: 'units', scope: 'Scope 3' },
];
