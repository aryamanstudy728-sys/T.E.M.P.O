"""Run the sweep (takes a few minutes) and save data/cache/sensitivity.json."""
import json
import pathlib

from tempo import sensitivity

out = pathlib.Path(__file__).resolve().parent.parent / "data" / "cache"
out.mkdir(parents=True, exist_ok=True)
rows = sensitivity.sweep()
payload = {"version": 1, "seeds": list(sensitivity.SEEDS), "rows": rows}
(out / "sensitivity.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
print("wrote", out / "sensitivity.json")
print()
print(f"{'setting':20}{'fixed':>7}{'nearest':>9}{'dist_only':>11}{'risk':>7}  risk wins?")
for r in rows:
    label = f"{r['parameter']}={r['value']}"
    print(f"{label:20}{str(r['fixed']):>7}{str(r['nearest']):>9}"
          f"{str(r['distance_only']):>11}{str(r['risk_based']):>7}  "
          f"{'yes' if r['risk_based_wins'] else 'NO BETTER THAN BASELINE'}")
