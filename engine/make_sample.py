"""Write the contract/*.sample.json files from real engine output."""
import json
import pathlib
import shutil

from fastapi.testclient import TestClient

from tempo import scenarios
from tempo.api import SENSITIVITY_FILE, app

root = pathlib.Path(__file__).resolve().parent.parent
out = root / "contract"
out.mkdir(exist_ok=True)


def save(name, data):
    (out / name).write_text(json.dumps(data, indent=2), encoding="utf-8")
    print("wrote", out / name)


save("simulate.sample.json", scenarios.run("normal", seed=42))
client = TestClient(app)
save("health.sample.json", client.get("/api/health").json())
save("sample.sample.json", client.get("/api/sample").json())
save("assumptions.sample.json", client.get("/api/assumptions").json())
if SENSITIVITY_FILE.exists():
    shutil.copy(SENSITIVITY_FILE, out / "sensitivity.sample.json")
    print("wrote", out / "sensitivity.sample.json")
else:
    print("No sensitivity results yet. Run: py run_sensitivity.py, then this again.")

print()
for name in sorted(scenarios.SCENARIOS):
    r = scenarios.run(name, seed=42, time_limit_s=8)
    print(name, {k: v["breaches"] for k, v in r["methods"].items()}, "best:", r["best_method"])
