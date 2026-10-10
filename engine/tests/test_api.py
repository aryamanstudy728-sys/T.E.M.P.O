from fastapi.testclient import TestClient

from tempo.api import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_sample_is_uploadable():
    villages = client.get("/api/sample").json()["villages"]
    assert len(villages) == 30
    r = client.post("/api/simulate", json={"scenario": "normal", "villages": villages})
    assert r.status_code == 200
    assert len(r.json()["villages"]) == 30


def test_assumptions_have_band_keys():
    names = {i["name"] for i in client.get("/api/assumptions").json()["items"]}
    assert {"band_green_h", "band_red_h"} <= names


def test_simulate_shape():
    r = client.post("/api/simulate", json={"scenario": "heatwave", "vehicles": 5})
    assert r.status_code == 200
    body = r.json()
    assert set(body["methods"]) == {"fixed", "nearest", "risk_based"}
    assert body["meta"]["scenario"] == "heatwave"


def test_bad_scenario_gives_plain_detail():
    r = client.post("/api/simulate", json={"scenario": "nonsense"})
    assert r.status_code == 422 and isinstance(r.json()["detail"], str)


def test_bad_upload_gives_plain_detail():
    r = client.post("/api/simulate", json={"villages": [{"id": "A"}, {"id": "B"}]})
    assert r.status_code == 422 and isinstance(r.json()["detail"], str)


def test_wrong_type_gives_plain_detail():
    r = client.post("/api/simulate", json={"vehicles": "many"})
    assert r.status_code == 422 and isinstance(r.json()["detail"], str)


def test_sensitivity_is_rows_or_clear_message():
    r = client.get("/api/sensitivity")
    assert r.status_code in (200, 503)
    if r.status_code == 200:
        assert len(r.json()["rows"]) > 0
    else:
        assert isinstance(r.json()["detail"], str)
