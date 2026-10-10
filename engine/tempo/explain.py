"""Plain-language explanation built only from numbers the engine computed."""


def explain(result):
    """Return {"text": ..., "source": "template"}. (A Claude rewrite comes later.)"""
    m = result["methods"]
    worst = min(result["villages"], key=lambda v: v["buffer_h"])
    text = (
        f"On the {result['meta']['scenario']} scenario, the fixed route leaves "
        f"{m['fixed']['breaches']} villages past their cooling window and "
        f"nearest-neighbour leaves {m['nearest']['breaches']}; the risk-based order "
        f"leaves {m['risk_based']['breaches']}. The tightest village is "
        f"{worst['name']} with {worst['buffer_h']:.1f} h of buffer."
    )
    return {"text": text, "source": "template"}
