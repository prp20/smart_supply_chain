import streamlit as st
import joblib
from src.data_loader import load_data
from src.preprocessing import preprocess
import streamlit as st
from src.agent_graph import build_graph

st.set_page_config(
    page_title="AI Logistics Command Center",
    layout="wide"
)

st.title("🚚 AI Logistics Supply Chain Command Center")
st.caption("Delivery Optimization • AI Agents • Real-time Insights")
left, right = st.columns([2, 3])
with st.sidebar:
    st.header("⚙️ Controls")
    st.markdown("Use AI to analyze, optimize and explain logistics data.")

with left:
    st.subheader("🤖 AI Assistant")

    query = st.text_area(
        "Ask anything about deliveries, delays or routes:",
        height=120
    )

    run = st.button("Run AI Agents 🚀")

with right:
    st.subheader("🧠 Agent Output")

    if run and query:
        graph = build_graph()
        result = graph.invoke({
            "query": query
        })

        st.success("Agent completed successfully")
        st.markdown(result["response"])

st.markdown("---")
st.info("💡 Tip: Try asking 'Optimize routes for today' or 'Why are deliveries delayed?'")


