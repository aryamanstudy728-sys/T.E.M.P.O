"""Route evaluation plus the two baselines (fixed route, nearest neighbour)."""
import math

from tempo import generate as gen
from tempo import params, risk

DEFAULT_SCENARIO = {
    "ambient_c": 36.0,
    "speed_mult_pakka": 1.0,
    "speed_mult_kaccha": 1.0,
    "cool_h": None,  # hours to cool at the centre; None = params cool_within_h
}


def _leg_hours(a, b, road, scen):
    """Hours to drive from a to b on the given road type."""
    mult = scen["speed_mult_kaccha"] if road == "kaccha" else scen["speed_mult_pakka"]
    return gen.travel_minutes(a, b, road, mult) / 60.0


def _route_times(stops, centre, scen):
    """For one vehicle: (time each village's milk is loaded, time back at centre)."""
    stop_h = params.get("stop_min") / 60.0
    t, prev, loaded = 0.0, centre, []
    for v in stops:
        t += _leg_hours(prev, v, v["road_to_centre"], scen)
        t += stop_h
        loaded.append(t)
        prev = v
    if stops:
        t += _leg_hours(prev, centre, stops[-1]["road_to_centre"], scen)
    return loaded, t


def evaluate(order_per_vehicle, data, scenario=None):
    """Score a visiting order. order_per_vehicle is a list of lists of village ids."""
    scen = dict(DEFAULT_SCENARIO)
    scen.update(scenario or {})
    by_id = {v["id"]: v for v in data["villages"]}
    tau = params.get("tau_h_open_can")
    routes, buffers = [], {}
    for k, ids in enumerate(order_per_vehicle, start=1):
        stops = [by_id[i] for i in ids]
        loaded, end = _route_times(stops, data["centre"], scen)
        for v, t_load in zip(stops, loaded):
            transit_h = end - t_load
            b = risk.buffer_h(v["milk_temp_c"], scen["ambient_c"], tau, transit_h, scen["cool_h"])
            buffers[v["id"]] = round(b, 3)
        routes.append({"vehicle": k, "stops": list(ids), "total_time_h": round(end, 3)})
    breached = sorted(i for i, b in buffers.items() if b < 0)
    ceiling = params.get("route_ceiling_h")
    return {
        "routes": routes,
        "buffers": buffers,
        "breaches": len(breached),
        "breached_ids": breached,
        "total_time_h": round(sum(r["total_time_h"] for r in routes), 3),
        "over_ceiling": [r["vehicle"] for r in routes if r["total_time_h"] > ceiling],
    }


def fixed_route(data, n_vehicles=None):
    """Baseline A: villages in id order, split into equal chunks."""
    n = n_vehicles or params.get("vehicles")
    ids = sorted(v["id"] for v in data["villages"])
    size = math.ceil(len(ids) / n)
    return [ids[k * size:(k + 1) * size] for k in range(n)]


def nearest_neighbour(data, n_vehicles=None):
    """Baseline B: vehicles take turns picking the closest unvisited village."""
    n = n_vehicles or params.get("vehicles")
    pos = [data["centre"]] * n
    routes = [[] for _ in range(n)]
    left = {v["id"]: v for v in data["villages"]}
    k = 0
    while left:
        here = pos[k]
        best = min(
            left.values(),
            key=lambda v: (gen.travel_minutes(here, v, v["road_to_centre"]), v["id"]),
        )
        routes[k].append(best["id"])
        pos[k] = best
        del left[best["id"]]
        k = (k + 1) % n
    return routes
