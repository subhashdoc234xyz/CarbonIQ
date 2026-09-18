"""
6.3 GitHub — PuLP (optimization engine)
Solves the Carbon Budget Allocation 0-1 Knapsack Linear Program.
"""
import os
import sys

def solve_budget_allocation(budget):
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
        raise ValueError("No reduction actions found. Add your organization’s projects before running optimization.")

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
    raise SystemExit("Provide a budget and organization-specific reduction actions through the application.")
