# from langchain.tools import tool
# from langchain.agents import initialize_agent, AgentType
# from langchain.llms import OpenAI
# import pandas as pd

# @tool
# def delayed_shipments(df: pd.DataFrame) -> str:
#     delayed = df[df["is_delayed"] == 1]
#     return f"{len(delayed)} shipments are likely delayed."

# def create_agent(df):
#     llm = OpenAI(temperature=0)
#     tools = [delayed_shipments]

#     agent = initialize_agent(
#         tools=tools,
#         llm=llm,
#         agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#         verbose=True
#     )
#     return agent