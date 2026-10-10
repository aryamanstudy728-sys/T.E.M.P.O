"""Scenario runner: builds the full result in the shape the web app expects."""
from tempo import baselines as bl
from tempo import explain, generate as gen, optimise as opt, params, risk

VERSION = 1
SCENARIOS = {
    "normal": {},
    "heatwave": {"ambient_c": 42.0},                                    # guessed
    "slow_roads": {"speed_mult_pakka": 0.8, "speed_mult_kaccha": 0.5},  # guessed
    "cooler_failure": {"cool_h": 3.5},  # guessed: cooling takes 1.5 h longer than normal
}


def _from_upload(villages):
    """Turn an uploaded village list into engine data. Raises ValueError if bad."""
    if not isinstance(villages, list) or len(villages) < 2:
        raise ValueError("villages must be a list of at least 2 villages")
    centre = dict(gen.CENTRE)
    out, seen = [], set()
    for i, v in enumerate(villages, start=1):
        try:
            item = {
                "id": str(v["id"]), "name": str(v.get("name", v["id"])),
                "lat": float(v["lat"]), "lon": float(v["lon"]),
                "volume_l": float(v["volume_l"]), "milk_temp_c": float(v["milk_temp_c"]),
                "road_to_centre": "pakka",  # not in the upload format: assumed paved
            }
        except (KeyError, TypeError, ValueError):
            raise ValueError(
                f"village #{i} needs id, lat, lon, volume_l and milk_temp_c as numbers")
        if item["id"] in seen:
            raise ValueError(f"duplicate village id {item['id']}")
        if not 0 < item["volume_l"] < 100000 or not 0 < item["milk_temp_c"] < 60:
            raise ValueError(f"village {item['id']}: volume_l or milk_temp_c out of range")
        seen.add(item["id"])
        out.append(item)
    return {"centre": centre, "villages": out}


def _method(order, data, scen):
    """Score one visiting order in the contract's field names."""
    r = bl.evaluate(order, data, scen)
    by_id = {v["id"]: v for v in data["villages"]}
    return {
        "routes": [{"vehicle_id": x["vehicle"], "stops": x["stops"],
                    "time_h": x["total_time_h"]} for x in r["routes"]],
        "buffers": r["buffers"],
        "breaching_ids": r["breached_ids"],
        "breaches": r["breaches"],
        "time_h": r["total_time_h"],
        "over_ceiling": r["over_ceiling"],
        "volume_at_risk_l": sum(by_id[i]["volume_l"] for i in r["breached_ids"]),
    }


def run(scenario="normal", seed=42, ambient_c=None, vehicles=None, villages=None,
        time_limit_s=10):
    """Run all three methods for one scenario and return the full result dict."""
    if scenario not in SCENARIOS:
        raise ValueError(f"unknown scenario '{scenario}'; use one of {sorted(SCENARIOS)}")
    scen = dict(bl.DEFAULT_SCENARIO)
    scen.update(SCENARIOS[scenario])
    if ambient_c is not None:
        scen["ambient_c"] = float(ambient_c)
    n = int(vehicles) if vehicles else params.get("vehicles")
    data = gen.generate(seed=seed) if villages is None else _from_upload(villages)

    methods = {
        "fixed": _method(bl.fixed_route(data, n), data, scen),
        "nearest": _method(bl.nearest_neighbour(data, n), data, scen),
        "risk_based": _method(opt.risk_based(data, n, scen, time_limit_s), data, scen),
    }
    buffers = methods["risk_based"]["buffers"]
    out_villages, alerts = [], []
    for v in data["villages"]:
        b = round(buffers[v["id"]], 2)
        band = risk.band(b)
        out_villages.append({**v, "buffer_h": b, "band": band})
        if band != "green":
            alerts.append({
                "kind": "low_buffer",
                "severity": "critical" if band == "red" else "warning",
                "message": f"{v['name']} has {b:.1f} h of buffer under the risk-based plan.",
                "village_id": v["id"],
            })
    best = min(methods, key=lambda k: (methods[k]["breaches"], methods[k]["time_h"]))
    result = {
        "version": VERSION,
        "meta": {"seed": seed, "scenario": scenario, "ambient_c": scen["ambient_c"],
                 "vehicles": n, "n_villages": len(out_villages)},
        "centre": data["centre"],
        "villages": out_villages,
        "methods": methods,
        "best_method": best,
        "alerts": alerts,
    }
    result["explanation"] = explain.explain(result)
    return result
