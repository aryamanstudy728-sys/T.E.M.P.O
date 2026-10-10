from tempo import generate as g, baselines as b

d = g.generate(42, 30)
for name, order in (("fixed", b.fixed_route(d)), ("nn", b.nearest_neighbour(d))):
    r = b.evaluate(order, d)
    print(name, "breaches:", r["breaches"], "total_h:", r["total_time_h"])
    print("  route hours:", [x["total_time_h"] for x in r["routes"]])
    print("  over 7h ceiling:", r["over_ceiling"])
