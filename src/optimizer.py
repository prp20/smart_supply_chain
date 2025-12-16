from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from src.logger import get_logger
logger = get_logger("ROUTE_OPTIMIZER")

def optimize_route(distance_matrix, location_names):
    logger.info("Starting route optimization")
    manager = pywrapcp.RoutingIndexManager(
        len(distance_matrix), 1, 0
    )
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        return distance_matrix[
            manager.IndexToNode(from_index)
        ][
            manager.IndexToNode(to_index)
        ]

    transit_callback = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback)

    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    solution = routing.SolveWithParameters(search_params)

    route = []
    index = routing.Start(0)
    total_distance = 0

    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        route.append(location_names[node])
        next_index = solution.Value(routing.NextVar(index))
        total_distance += routing.GetArcCostForVehicle(index, next_index, 0)
        index = next_index

    route.append(location_names[manager.IndexToNode(index)])
    logger.info(f"Route found: {route}")
    logger.info(f"Total distance: {total_distance}")
    return {
        "route": route,
        "total_distance_km": total_distance
    }
