<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d7b1b479-f216-4498-ae1f-b8156228f185

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Carbon data integration

The app includes an offline cache of 116 Open India emission factors in
`src/data/open_india_emission_factors.json`, benchmark rows and a browser-side
steel-emissions estimate in `src/data/steelIndustryData.ts`, and a binary
budget optimizer in `src/utils/pulpSolver.ts`.

The direct `esbuild` dependency is aligned with Vite 8, so `npm install` does
not require `--force` or `--legacy-peer-deps`.

For the optional reproducible Python workflow, install
`pip install -r requirements-data.txt`, then:

```powershell
kaggle datasets download -d csafrit2/steel-industry-energy-consumption -p data --unzip
python src/train_steel_model.py
python src/pulp_optimizer.py
```

`python src/seed_emission_factors.py` reads the bundled cache when Supabase
credentials are absent and fetches the public source when they are present.
