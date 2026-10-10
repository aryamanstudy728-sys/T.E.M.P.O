from tempo import generate as g, baselines as b, optimise as o

SCENARIOS = {
    "normal": {},
    "heatwave": {"ambient_c": 42.0},
    "slow_roads": {"speed_mult_pakka": 0.8, "speed_mult_kaccha": 0.5},
}

d = g.generate(42, 30)
for sname, scen in SCENARIOS.items():
    print(sname)
    orders = {
        "fixed": b.fixed_route(d),
        "nn": b.nearest_neighbour(d),
        "distance_only": o.risk_based(d, scenario=scen, time_limit_s=8, use_deadlines=False),
        "risk": o.risk_based(d, scenario=scen, time_limit_s=8),
    }
    for name, order in orders.items():
        r = b.evaluate(order, d, scen)
        print("  ", name, "breaches:", r["breaches"], "total_h:", r["total_time_h"],
              "over ceiling:", r["over_ceiling"])
