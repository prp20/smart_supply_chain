import pandas as pd

def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df

df = load_data("/home/prasad/dev_home/hackathon/data/dynamic_supply_chain_logistics_dataset.csv")
print(df.head())
print(df.info())
print(df.describe())
