"""Parameters for T.E.M.P.O. with provenance."""

def get(name):
    """Return the value of a parameter."""
    return PARAMS[name]["value"]


PARAMS = {
    "route_ceiling_h": {
        "value": 7,
        "status": "sourced",
        "note": "one old cooperative case study",
    },
    "cool_target_c": {
        "value": 4,
        "status": "guessed",
        "note": "to verify against FSSAI/NDDB",
    },
    "cool_within_h": {
        "value": 2,
        "status": "guessed",
        "note": "to verify against FSSAI/NDDB",
    },
    "milk_temp_range_c": {
        "value": [28, 37],
        "status": "guessed",
        "note": "milk temperature range",
    },
    "ambient_range_c": {
        "value": [30, 45],
        "status": "guessed",
        "note": "ambient temperature range",
    },
    "speed_kmh_pakka": {
        "value": 40,
        "status": "guessed",
        "note": "road type speed",
    },
    "speed_kmh_kaccha": {
        "value": 20,
        "status": "guessed",
        "note": "road type speed",
    },
    "stop_min": {
        "value": 10,
        "status": "guessed",
        "note": "pickup stop time",
    },
    "quality_limit_cfu_ml": {
        "value": 100000,
        "status": "guessed",
        "note": "quality threshold",
    },
    "initial_cfu_ml": {
        "value": 1000,
        "status": "guessed",
        "note": "initial microbial load",
    },
    "tau_h_open_can": {
        "value": 1.5,
        "status": "guessed",
        "note": "time constant",
    },
    "tau_h_insulated_tank": {
        "value": 6,
        "status": "guessed",
        "note": "time constant",
    },
    "band_green_h": {
        "value": 2.5,
        "status": "guessed",
        "note": "time band",
    },
    "band_red_h": {
        "value": 0.5,
        "status": "guessed",
        "note": "time band",
    },
    "vehicles": {
        "value": 5,
        "status": "guessed",
        "note": "default fleet size",
    },
    "capacity_l": {
        "value": 2000,
        "status": "guessed",
        "note": "default vehicle capacity",
    },
    "chilled_hold_h_normal": {
        "value": 36,
        "status": "guessed",
        "note": "chilled hold",
    },
    "chilled_hold_h_cooler_failure": {
        "value": 3,
        "status": "guessed",
        "note": "cooler failure hold",
    },
    "ratkowsky_b": {
        "value": 0.03,
        "status": "guessed",
        "note": "growth model parameter",
    },
    "t_min_c": {
        "value": 2.0,
        "status": "guessed",
        "note": "growth model parameter",
    },
}
