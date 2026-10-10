"""Risk-based routing with OR-Tools.

Trick: we solve each route BACKWARDS (centre -> last village -> ... -> first
village -> centre). In that direction the clock at a village equals the hours
its milk spends on the vehicle, so "buffer >= 0" becomes a simple deadline.
The result is reversed back into the real visiting order.
"""
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

from tempo import baselines as bl
from tempo import params, risk

SECONDS = 3600
PENALTY = 100  # cost per second a village is past its deadline (travel costs 1)


def _deadlines_s(villages, ambient_c, cool_h=None):
    """Latest hours-on-vehicle (in seconds) before each village's buffer is < 0."""
    tau = params.get("tau_h_open_can")
    if cool_h is None:
        cool_h = params.get("cool_within_h")
    out = []
    for v in villages:
        h = risk.hours_to_limit(v["milk_temp_c"], ambient_c, tau) - cool_h
        out.append(max(0, int(h * SECONDS)))
    return out


def _matrix_s(data, scen):
    """Driving seconds for each backwards arc a -> b (see module note)."""
    nodes = [data["centre"]] + data["villages"]
    n = len(nodes)
    m = [[0] * n for _ in range(n)]
    for a in range(n):
        for b in range(n):
            if a == b:
                continue
            road_owner = nodes[b] if a == 0 else nodes[a]
            hours = bl._leg_hours(nodes[a], nodes[b], road_owner["road_to_centre"], scen)
            m[a][b] = int(round(hours * SECONDS))
    return m


def risk_based(data, n_vehicles=None, scenario=None, time_limit_s=10, use_deadlines=True):
    """Return visiting orders (list of village-id lists) that protect risky milk.

    use_deadlines=False gives a distance-only optimiser (the fair baseline).
    """
    scen = dict(bl.DEFAULT_SCENARIO)
    scen.update(scenario or {})
    n_veh = n_vehicles or params.get("vehicles")
    villages = data["villages"]
    matrix = _matrix_s(data, scen)
    stop_s = int(params.get("stop_min") * 60)
    ceiling_s = int(params.get("route_ceiling_h") * SECONDS)
    deadlines = _deadlines_s(villages, scen["ambient_c"], scen["cool_h"])

    manager = pywrapcp.RoutingIndexManager(len(matrix), n_veh, 0)
    routing = pywrapcp.RoutingModel(manager)

    def time_cb(i, j):
        a, b = manager.IndexToNode(i), manager.IndexToNode(j)
        return matrix[a][b] + (stop_s if a != 0 else 0)

    cb = routing.RegisterTransitCallback(time_cb)
    routing.SetArcCostEvaluatorOfAllVehicles(cb)
    routing.AddDimension(cb, 0, ceiling_s, True, "time")
    dim = routing.GetDimensionOrDie("time")
    if use_deadlines:
        for k, deadline in enumerate(deadlines, start=1):
            dim.SetCumulVarSoftUpperBound(manager.NodeToIndex(k), deadline, PENALTY)

    sp = pywrapcp.DefaultRoutingSearchParameters()
    sp.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    sp.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    sp.time_limit.seconds = time_limit_s
    solution = routing.SolveWithParameters(sp)
    if solution is None:
        raise RuntimeError("No routing found within the 7 h ceiling. Try more vehicles.")

    orders = []
    for veh in range(n_veh):
        idx, seq = routing.Start(veh), []
        while not routing.IsEnd(idx):
            node = manager.IndexToNode(idx)
            if node != 0:
                seq.append(villages[node - 1]["id"])
            idx = solution.Value(routing.NextVar(idx))
        orders.append(list(reversed(seq)))
    return orders
