import pandas as pd

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Convert dates
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["delivery_date"] = pd.to_datetime(df["delivery_date"])

    # Feature engineering
    df["delivery_days"] = (df["delivery_date"] - df["order_date"]).dt.days
    df["order_day"] = df["order_date"].dt.dayofweek

    # Target (example)
    df["is_delayed"] = (df["delivery_days"] > df["expected_days"]).astype(int)

    # Handle missing values
    df = df.dropna()

    return df
