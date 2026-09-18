"""
6.3 GitHub — PuLP (optimization engine)
Solves the Carbon Budget Allocation 0-1 Knapsack Linear Program.
"""
import os
import sys

def solve_budget_allocation(budget=400000):
    try:
        from pulp import LpProblem, LpMaximize, LpVariable, lpSum
    except ImportError:
        print("PuLP not installed. Run: pip install pulp")
        return []

    # Try fetching from Supabase if configured, otherwise fallback to standard industrial actions
    actions = []
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            supabase = create_client(supabase_url, supabase_key)
            actions = supabase.table("reduction_actions").select("*").execute().data
        except Exception as e:
            print(f"Failed to query Supabase: {e}")

    if not actions:
        # Benchmark industrial mitigation actions
        actions = [
            {"id": "act_1", "action_name": "Waste Heat Recovery on Reheating Furnace", "cost": 180000, "co2_saved_tons_per_year": 142.5},
            {"id": "act_2", "action_name": "VFD Drives on Primary Water Pumps", "cost": 65000, "co2_saved_tons_per_year": 48.0},
            {"id": "act_3", "action_name": "Solar Rooftop PV (120 kWp)", "cost": 320000, "co2_saved_tons_per_year": 215.0},
            {"id": "act_4", "action_name": "Facility High-Bay LED Retrofit", "cost": 25000, "co2_saved_tons_per_year": 18.5},
            {"id": "act_5", "action_name": "Oxygen Enrichment on Ladle Preheater", "cost": 110000, "co2_saved_tons_per_year": 76.0},
            {"id": "act_6", "action_name": "Pneumatic Air Leak Remediation", "cost": 15000, "co2_saved_tons_per_year": 12.0}
        ]

    prob = LpProblem("Carbon_Budget_Allocation", LpMaximize)
    x = {str(a["id"]): LpVariable(name=str(a["id"]), cat="Binary") for a in actions}

    # Objective: Maximize CO2 saved
    prob += lpSum(x[str(a["id"])] * a["co2_saved_tons_per_year"] for a in actions)
    # Constraint: Total cost <= budget
    prob += lpSum(x[str(a["id"])] * a["cost"] for a in actions) <= budget
    prob.solve()

    selected = [a for a in actions if x[str(a["id"])].value() == 1]
    total_cost = sum(a["cost"] for a in selected)
    total_co2 = sum(a["co2_saved_tons_per_year"] for a in selected)

    print(f"Optimization Finished. Status: {prob.status}")
    print(f"Selected {len(selected)} actions within budget INR {budget:,}:")
    for a in selected:
        print(f" - {a.get('action_name', a.get('id'))}: Cost INR {a['cost']:,} | Saved {a['co2_saved_tons_per_year']} tCO2/yr")
    print(f"Total CapEx: INR {total_cost:,} | Total Abatement: {total_co2:.2f} tCO2/yr")

    return selected

if __name__ == "__main__":
    solve_budget_allocation(400000)
