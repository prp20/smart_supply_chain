from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from typing import TypedDict
from src.optimizer import optimize_route
from dotenv import load_dotenv
import requests
from src.logger import get_logger
logger = get_logger("AGENT_GRAPH")
load_dotenv()


llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0
)

class AgentState(TypedDict):
    query: str
    intent: str
    data: str
    response: str

def planner_agent(state: AgentState):
    logger.info(f"User query: {state['query']}")
    prompt = f"""
    Classify the user intent into one of:
    - analytics
    - optimization
    - explanation

    Query: {state['query']}
    """

    intent = llm.invoke(prompt).content.lower()

    if "optimize" in intent:
        state["intent"] = "optimization"
    elif "why" in intent or "explain" in intent:
        state["intent"] = "explanation"
    else:
        state["intent"] = "analytics"

    return state

def analytics_agent(state):
    vehicle = requests.get("http://vehicle-api:8001/vehicle/status").json()
    weather = requests.get("http://weather-api:8002/weather/current").json()
    traffic = requests.get("http://traffic-api:8003/traffic/status").json()

    state["response"] = f"""
        🚚 Vehicle ETA: {vehicle['eta_minutes']} mins
        🌡 Temperature: {weather['temperature_c']}°C
        🚦 Traffic: {traffic['congestion_level']}

        AI Insight: Expect moderate delay risk due to traffic & weather.
        """
    return state

def optimization_agent(state):
    distance_matrix = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0],
    ]

    locations = ["Warehouse", "Hub A", "Hub B", "Customer"]

    result = optimize_route(distance_matrix, locations)

    state["response"] = (
        f"🚚 Optimized Route:\n"
        f"{' → '.join(result['route'])}\n\n"
        f"📏 Total Distance: {result['total_distance_km']} km"
    )
    return state

def explanation_agent(state: AgentState):
    explanation = llm.invoke(
        f"Explain in simple terms: {state['query']}"
    ).content

    state["response"] = explanation
    return state

def route(state: AgentState):
    if state["intent"] == "optimization":
        return "optimization"
    elif state["intent"] == "explanation":
        return "explanation"
    else:
        return "analytics"
    
def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("planner", planner_agent)
    graph.add_node("analytics", analytics_agent)
    graph.add_node("optimization", optimization_agent)
    graph.add_node("explanation", explanation_agent)

    graph.set_entry_point("planner")

    graph.add_conditional_edges(
        "planner",
        route,
        {
            "analytics": "analytics",
            "optimization": "optimization",
            "explanation": "explanation"
        }
    )

    graph.add_edge("analytics", END)
    graph.add_edge("optimization", END)
    graph.add_edge("explanation", END)

    return graph.compile()



