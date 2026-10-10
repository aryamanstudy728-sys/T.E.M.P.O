"""Tests for tempo generate."""
from tempo import generate as gen
from tempo import params


def test_generate_deterministic():
    """Generate twice with same seed returns identical dicts."""
    data1 = gen.generate(seed=42, n=30)
    data2 = gen.generate(seed=42, n=30)
    assert data1 == data2


def test_generate_count():
    """Generate returns 30 villages."""
    data = gen.generate(seed=42, n=30)
    assert len(data["villages"]) == 30


def test_values_in_range():
    """Check volume and temperature ranges."""
    data = gen.generate(seed=42, n=30)
    t_low, t_high = params.get("milk_temp_range_c")
    for v in data["villages"]:
        assert 80 <= v["volume_l"] <= 600
        assert t_low <= v["milk_temp_c"] <= t_high


def test_travel_minutes_road_differences():
    """Kaccha should be slower than pakka."""
    a = {"lat": 22.56, "lon": 72.95}
    b = {"lat": 22.38, "lon": 73.15}
    pakka = gen.travel_minutes(a, b, road="pakka")
    kaccha = gen.travel_minutes(a, b, road="kaccha")
    assert kaccha > pakka
