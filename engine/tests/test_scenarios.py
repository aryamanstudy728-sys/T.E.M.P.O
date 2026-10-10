import pytest

from tempo import scenarios


@pytest.mark.parametrize("name", sorted(scenarios.SCENARIOS))
def test_every_scenario_runs(name):
    r = scenarios.run(name, time_limit_s=2)
    assert set(r["methods"]) == {"fixed", "nearest", "risk_based"}
    assert len(r["villages"]) == 30
    assert r["best_method"] in r["methods"]
    assert r["explanation"]["source"] == "template"


def test_unknown_scenario_is_a_clear_error():
    with pytest.raises(ValueError):
        scenarios.run("nonsense")


def test_bad_upload_is_a_clear_error():
    with pytest.raises(ValueError):
        scenarios.run("normal", villages=[{"id": "A"}, {"id": "B"}])
