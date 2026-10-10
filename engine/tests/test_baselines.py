from tempo import baselines as bl
from tempo import generate as gen


def _data():
    return gen.generate(seed=42, n=30)


def test_every_village_visited_once():
    data = _data()
    for order in (bl.fixed_route(data), bl.nearest_neighbour(data)):
        ids = sorted(i for route in order for i in route)
        assert ids == sorted(v["id"] for v in data["villages"])


def test_evaluate_is_deterministic():
    data = _data()
    order = bl.nearest_neighbour(data)
    assert bl.evaluate(order, data) == bl.evaluate(order, data)


def test_every_village_gets_a_buffer():
    data = _data()
    result = bl.evaluate(bl.fixed_route(data), data)
    assert len(result["buffers"]) == 30
