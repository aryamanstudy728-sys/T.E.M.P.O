"""Sensitivity sweep: where does risk-based routing beat the baselines, and where not?

Each row changes ONE setting and reports mean breaches over several seeds.
"""
from tempo import baselines as bl
from tempo import generate as gen
from tempo import optimise as opt
from tempo import params

SEEDS = (42, 43, 44)
SETTINGS = [
    ("vehicles", [3, 4, 5, 6, 8]),
    ("ambient_c", [30, 36, 40, 42, 45]),
    ("kaccha_speed_mult", [1.0, 0.75, 0.5, 0.35]),
    ("cool_h", [2.0, 3.0, 4.0, 5.0]),
    ("ratkowsky_b", [0.02, 0.03, 0.04, 0.05]),
]


def _breaches(order, data, scen):
    return bl.evaluate(order, data, scen)["breaches"]


def _one_seed(name, value, seed, time_limit_s):
    """Breach counts for the four methods at one setting and seed (None = no plan)."""
    data = gen.generate(seed=seed)
    n = int(value) if name == "vehicles" else params.get("vehicles")
    scen = {}
    if name == "ambient_c":
        scen["ambient_c"] = float(value)
    elif name == "kaccha_speed_mult":
        scen["speed_mult_kaccha"] = float(value)
    elif name == "cool_h":
        scen["cool_h"] = float(value)
    full = {**bl.DEFAULT_SCENARIO, **scen}
    out = {
        "fixed": _breaches(bl.fixed_route(data, n), data, full),
        "nearest": _breaches(bl.nearest_neighbour(data, n), data, full),
    }
    for key, deadlines in (("distance_only", False), ("risk_based", True)):
        try:
            order = opt.risk_based(data, n, scen, time_limit_s, use_deadlines=deadlines)
            out[key] = _breaches(order, data, full)
        except RuntimeError:
            out[key] = None
    return out


def _mean(values):
    if any(v is None for v in values):
        return None
    return round(sum(values) / len(values), 1)


def sweep(settings=None, seeds=SEEDS, time_limit_s=3, progress=print):
    """Return a list of rows, one per setting value."""
    rows = []
    for name, values in (settings or SETTINGS):
        for value in values:
            saved = params.PARAMS["ratkowsky_b"]["value"]
            if name == "ratkowsky_b":
                params.PARAMS["ratkowsky_b"]["value"] = value
            try:
                per_seed = [_one_seed(name, value, s, time_limit_s) for s in seeds]
            finally:
                params.PARAMS["ratkowsky_b"]["value"] = saved
            row = {"parameter": name, "value": value}
            for key in ("fixed", "nearest", "distance_only", "risk_based"):
                row[key] = _mean([p[key] for p in per_seed])
            others = [row[k] for k in ("fixed", "nearest", "distance_only")]
            row["risk_based_wins"] = (
                row["risk_based"] is not None
                and all(o is not None for o in others)
                and row["risk_based"] < min(others)
            )
            rows.append(row)
            progress(f"{name}={value}: {row}")
    return rows
