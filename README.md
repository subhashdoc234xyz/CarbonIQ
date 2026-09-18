# CarbonIQ

CarbonIQ is an empty carbon-accounting workspace with two independent engines:

1. **Emission estimation** — calculates `kg CO₂e = activity quantity × verified emission factor`, retaining the source factor and scope with every user-entered record.
2. **Budget optimization** — solves an exact 0–1 constrained portfolio problem: maximize annual CO₂e reduction while keeping selected project costs within the user-entered ₹ budget.

No activity records, facilities, reduction projects, budgets, optimization results, or benchmark rows are seeded into the workspace. The Steel Industry Energy Consumption archive in `data/` is retained as a benchmark/validation asset, not as organization data.

## Data methodology

- Steel Industry Energy Consumption (Kaggle): benchmark fields include `Usage_kWh`, reactive power, power factor, load type, and measured `CO2(tCO2)`.
- CO₂ Emissions by Sector (Kaggle): sector taxonomy for electricity, transport, manufacturing, and industry.
- Supply Chain Greenhouse Gas Emission (Kaggle): Scope 3 logistics and supply-chain categorization.
- Open India Emission Factors and the IPCC EFDB: factor selection and methodology references.

The app links every factor suggestion to its source and leaves it editable. Users must verify geography, year, fuel specification, and units before saving an estimate.

## Run locally

1. Install dependencies with `npm install`.
2. Optionally set `GROQ_API_KEY` for AI-assisted analysis.
3. Run `npm run dev`.

Add and connect only your organization’s verified data before using analytics or reporting.
