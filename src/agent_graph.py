from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from typing import TypedDict
from dotenv import load_dotenv
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

def analytics_agent(state: AgentState):
    # Example response
    state["response"] = (
        "📊 Based on historical data, 18% of shipments are likely to be delayed."
    )
    return state

def optimization_agent(state: AgentState):
    state["response"] = (
        "🚚 Optimized route: Warehouse → Hub A → Hub C → Customer"
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



