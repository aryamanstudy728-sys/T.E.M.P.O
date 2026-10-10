"""Tests for tempo risk."""
from tempo import risk


def test_buffer_higher_for_cooler_milk():
    """Cooler milk should give larger buffer."""
    buf_warm = risk.buffer_h(36, 38, 1.5, 1.0)
    buf_cool = risk.buffer_h(30, 38, 1.5, 1.0)
    assert buf_warm < buf_cool


def test_buffer_decreases_with_transit():
    """Longer transit should decrease buffer."""
    buf_short = risk.buffer_h(33, 38, 1.5, 1.0)
    buf_long = risk.buffer_h(33, 38, 1.5, 3.0)
    assert buf_long < buf_short


def test_band_values():
    """Check band boundaries."""
    assert risk.band(3.0) == "green"
    assert risk.band(1.0) == "yellow"
    assert risk.band(0.1) == "red"


def test_hours_to_limit_max():
    """Cold conditions should not exceed max."""
    h = risk.hours_to_limit(25, 25, 1.5)
    assert h <= 48
