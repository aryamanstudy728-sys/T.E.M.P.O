"""Risk and spoilage modelling."""
import math

from tempo import params


def milk_temp(t_h, t0, t_env, tau):
    """Compute milk temperature after t_h hours."""
    return t_env + (t0 - t_env) * math.exp(-t_h / tau)


def growth_rate(temp_c):
    """Compute growth rate in 1/hour (ln scale)."""
    t_min_c = params.get("t_min_c")
    if temp_c <= t_min_c:
        return 0.0
    ratkowsky_b = params.get("ratkowsky_b")
    return (ratkowsky_b * (temp_c - t_min_c)) ** 2


def hours_to_limit(t0, t_env, tau, max_h=48.0):
    """Hours until microbial count reaches quality limit."""
    quality_limit_cfu_ml = params.get("quality_limit_cfu_ml")
    initial_cfu_ml = params.get("initial_cfu_ml")
    limit_ratio = quality_limit_cfu_ml / initial_cfu_ml
    ln_limit = math.log(limit_ratio)
    total_ln_growth = 0.0
    step = 0.05
    t_h = 0.0
    while t_h <= max_h + 1e-12:
        temp_c = milk_temp(t_h, t0, t_env, tau)
        rate = growth_rate(temp_c)
        total_ln_growth += rate * step
        if total_ln_growth >= ln_limit - 1e-12:
            return t_h
        t_h += step
    return max_h


def buffer_h(milk_t0, t_env, tau, transit_h, cool_h=None):
    """Buffer time before reaching quality limit."""
    if cool_h is None:
        cool_h = params.get("cool_within_h")
    h_limit = hours_to_limit(milk_t0, t_env, tau, max_h=48.0)
    return h_limit - transit_h - cool_h


def band(buffer):
    """Return risk band."""
    band_green_h = params.get("band_green_h")
    band_red_h = params.get("band_red_h")
    if buffer > band_green_h:
        return "green"
    if buffer < band_red_h:
        return "red"
    return "yellow"
