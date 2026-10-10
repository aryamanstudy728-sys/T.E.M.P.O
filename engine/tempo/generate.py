"""Generate a simulated village network around one chilling centre (seed 42)."""
import math

import numpy as np

from tempo import params

CENTRE = {"id": "C01", "name": "Anand Chilling Centre", "lat": 22.56, "lon": 72.95}
RADIUS_KM = 15.0      # guessed: how far villages are scattered from the centre
KACCHA_SHARE = 0.35   # guessed: share of villages on unpaved roads
ROAD_FACTOR = 1.3     # guessed: road length vs straight line
EARTH_KM = 6371.0


def haversine_km(a, b):
    """Straight-line distance in km between two {lat, lon} dicts."""
    p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
    dp = p2 - p1
    dl = math.radians(b["lon"] - a["lon"])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * EARTH_KM * math.asin(math.sqrt(h))


def generate(seed=42, n=30):
    """Return {"centre": ..., "villages": [...]} with a fixed seed."""
    rng = np.random.RandomState(seed)
    lo, hi = params.get("milk_temp_range_c")
    villages = []
    for i in range(1, n + 1):
        r = RADIUS_KM * math.sqrt(rng.uniform())
        theta = rng.uniform(0, 2 * math.pi)
        dlat = r * math.cos(theta) / 111.0
        dlon = r * math.sin(theta) / (111.0 * math.cos(math.radians(CENTRE["lat"])))
        villages.append({
            "id": f"V{i:02d}",
            "name": f"Village {i:02d}",
            "lat": round(CENTRE["lat"] + dlat, 5),
            "lon": round(CENTRE["lon"] + dlon, 5),
            "volume_l": int(round(rng.uniform(80, 600))),
            "milk_temp_c": round(float(rng.uniform(lo, hi)), 1),
            "road_to_centre": "kaccha" if rng.uniform() < KACCHA_SHARE else "pakka",
        })
    return {"centre": dict(CENTRE), "villages": villages}


def travel_minutes(a, b, road="pakka", speed_mult=1.0):
    """Minutes to drive between two points on the given road type."""
    key = "speed_kmh_kaccha" if road == "kaccha" else "speed_kmh_pakka"
    speed = params.get(key) * speed_mult
    return haversine_km(a, b) * ROAD_FACTOR / speed * 60.0
