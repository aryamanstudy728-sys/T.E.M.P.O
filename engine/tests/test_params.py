"""Tests for tempo params."""
from tempo import params


def test_all_entries_have_valid_status():
    """Check that every entry has status sourced or guessed."""
    valid = {"sourced", "guessed"}
    for key, item in params.PARAMS.items():
        assert "status" in item, f"missing status for {key}"
        assert item["status"] in valid, f"invalid status for {key}"
        assert "note" in item, f"missing note for {key}"
        assert isinstance(item["note"], str), f"note must be string for {key}"


def test_get_returns_value():
    """Check get returns the value."""
    for key in params.PARAMS:
        assert params.get(key) == params.PARAMS[key]["value"]
