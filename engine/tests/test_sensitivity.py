from tempo import sensitivity


def test_small_sweep_returns_rows():
    rows = sensitivity.sweep(settings=[("vehicles", [5])], seeds=(42,),
                             time_limit_s=1, progress=lambda *_: None)
    assert len(rows) == 1
    assert {"fixed", "nearest", "distance_only", "risk_based", "risk_based_wins"} <= set(rows[0])
