import rawData from './open_india_emission_factors.json';

export interface OpenIndiaEmissionFactor {
  id: string;
  factor_name: string;
  geography: string;
  geography_type: string;
  value: number;
  unit: string;
  scope: string;
  sector: string;
  source_document: string;
  source_url: string;
  publication_year?: number;
  reference_year?: string;
  methodology?: string;
  notes?: string;
}

export interface OpenIndiaMetadata {
  version: string;
  created: string;
  license: string;
  description: string;
  sources: Record<string, {
    name: string;
    publisher?: string;
    url?: string;
    publication_date?: string;
    reference_year?: string;
    notes?: string;
  }>;
}

export const OPEN_INDIA_METADATA: OpenIndiaMetadata = rawData.metadata as OpenIndiaMetadata;
export const OPEN_INDIA_FACTORS: OpenIndiaEmissionFactor[] = rawData.emission_factors as OpenIndiaEmissionFactor[];

export const OPEN_INDIA_SECTORS = Array.from(
  new Set(OPEN_INDIA_FACTORS.map((f) => f.sector))
).sort();

export const OPEN_INDIA_SCOPES = Array.from(
  new Set(OPEN_INDIA_FACTORS.map((f) => f.scope))
).sort();

/**
 * Filter emission factors by text query, sector, and scope
 */
export function filterOpenIndiaFactors(
  query: string,
  sector: string,
  scope: string
): OpenIndiaEmissionFactor[] {
  return OPEN_INDIA_FACTORS.filter((f) => {
    const matchesQuery =
      !query ||
      f.factor_name.toLowerCase().includes(query.toLowerCase()) ||
      f.geography.toLowerCase().includes(query.toLowerCase()) ||
      (f.source_document && f.source_document.toLowerCase().includes(query.toLowerCase()));

    const matchesSector = !sector || sector === 'All' || f.sector === sector;
    const matchesScope = !scope || scope === 'All' || f.scope === scope;

    return matchesQuery && matchesSector && matchesScope;
  });
}
