from tempo import baselines as bl
from tempo import generate as gen
from tempo import optimise as opt


def _data():
    return gen.generate(seed=42, n=30)


def test_every_village_visited_once():
    data = _data()
    order = opt.risk_based(data, time_limit_s=3)
    ids = sorted(i for route in order for i in route)
    assert ids == sorted(v["id"] for v in data["villages"])


def test_no_route_over_ceiling():
    data = _data()
    result = bl.evaluate(opt.risk_based(data, time_limit_s=3), data)
    assert result["over_ceiling"] == []


def test_not_worse_than_fixed_on_normal_day():
    data = _data()
    fixed = bl.evaluate(bl.fixed_route(data), data)
    risk = bl.evaluate(opt.risk_based(data, time_limit_s=3), data)
    assert risk["breaches"] <= fixed["breaches"], (risk["breaches"], fixed["breaches"])
