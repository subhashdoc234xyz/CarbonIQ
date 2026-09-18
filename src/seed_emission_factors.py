"""
6.2 GitHub — Open India Emission Factors (seed into Supabase)
Run this once as src/seed_emission_factors.py after the schema is created.
Keep a local JSON copy as an offline fallback for demo day.
"""
import os
import sys
import pandas as pd

def seed_emission_factors():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment.")
        print("Using local bundled fallback: src/data/open_india_emission_factors.json")
        local_path = os.path.join(os.path.dirname(__file__), "data", "open_india_emission_factors.json")
        if os.path.exists(local_path):
            df = pd.read_json(local_path)
            factors = df["emission_factors"].to_dict(orient="records")
            print(f"Loaded {len(factors)} verified Open India emission factors from local JSON cache.")
        return

    try:
        from supabase import create_client
        supabase = create_client(supabase_url, supabase_key)
    except ImportError:
        print("supabase-py not installed. Run: pip install supabase")
        return

    url = "https://creator619-python.github.io/open-india-emission-factors/emission_factors_v1_2.json"
    print(f"Fetching factors from {url}...")
    try:
        response = pd.read_json(url)
        factors = response["emission_factors"].to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching remote JSON, trying local fallback: {e}")
        local_path = os.path.join(os.path.dirname(__file__), "data", "open_india_emission_factors.json")
        response = pd.read_json(local_path)
        factors = response["emission_factors"].to_dict(orient="records")

    print(f"Seeding {len(factors)} factors into Supabase table 'emission_factors'...")

    for f in factors:
        supabase.table("emission_factors").insert({
            "factor_name": f["factor_name"],
            "geography": f.get("geography"),
            "geography_type": f.get("geography_type"),
            "value": f["value"],
            "unit": f["unit"],
            "scope": f.get("scope"),
            "sector": f.get("sector"),
            "source_document": f.get("source_document"),
            "source_url": f.get("source_url"),
            "reference_year": f.get("reference_year"),
            "methodology": f.get("methodology"),
            "notes": f.get("notes"),
        }).execute()

    print("Successfully seeded all emission factors into Supabase.")

if __name__ == "__main__":
    seed_emission_factors()
