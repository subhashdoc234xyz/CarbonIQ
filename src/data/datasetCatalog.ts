export interface DatasetSource {
  name: string;
  purpose: string;
  url: string;
  localAsset?: string;
  fields?: string[];
}

// Sources document the methodology; none is used to seed a user's workspace.
export const DATASET_CATALOG: DatasetSource[] = [
  {
    name: 'Steel Industry Energy Consumption',
    purpose: 'Benchmark and validate electricity/plant-load emission estimates.',
    url: 'https://www.kaggle.com/datasets/csafrit2/steel-industry-energy-consumption',
    localAsset: 'data/steel-industry-energy-consumption.zip',
    fields: ['Usage_kWh', 'CO2(tCO2)', 'reactive power', 'power factor', 'load type'],
  },
  {
    name: 'CO₂ Emissions by Sector, 1990–2022',
    purpose: 'Classify reported emissions by electricity, transport, manufacturing, and industry.',
    url: 'https://www.kaggle.com/datasets/datamavenx/co2-emissions-by-sector/data',
  },
  {
    name: 'Supply Chain Greenhouse Gas Emission',
    purpose: 'Support Scope 3 logistics and supply-chain activity categories.',
    url: 'https://www.kaggle.com/datasets/sahirmaharajj/supply-chain-greenhouse-gas-emission',
  },
  {
    name: 'Open India Emission Factors',
    purpose: 'India-specific activity factors for electricity and fuels.',
    url: 'https://github.com/Creator619-Python/open-india-emission-factors',
  },
  {
    name: 'IPCC Emission Factor Database',
    purpose: 'Global methodology reference and factor verification.',
    url: 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
  },
];
