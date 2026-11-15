import pandas as pd
from pathlib import Path

# Dataset is stored in the project's root dataset folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATASET_PATH = BASE_DIR / "dataset" / "Metro_Interstate_Traffic_Volume.csv"

LOW_THRESHOLD = 2158
MODERATE_THRESHOLD = 4547


def load_traffic_data():
    df = pd.read_csv(DATASET_PATH)

    df["date_time"] = pd.to_datetime(
        df["date_time"], errors="coerce"
    )

    df = df.dropna(subset=["date_time", "traffic_volume"])

    df["hour"] = df["date_time"].dt.hour
    df["day_name"] = df["date_time"].dt.day_name()
    df["month"] = df["date_time"].dt.month

    return df

# Load once when the backend starts
traffic_data = load_traffic_data()


def get_historical_analytics():
    df = traffic_data

    # Average traffic for each hour
    hourly = (
        df.groupby("hour")["traffic_volume"]
        .mean()
        .round(0)
        .reset_index()
        .to_dict(orient="records")
    )

    # Average traffic for each weekday
    weekday_order = [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
    ]

    weekday_data = (
        df.groupby("day_name")["traffic_volume"]
        .mean()
        .reindex(weekday_order)
        .round(0)
        .reset_index()
    )

    weekday_data.columns = ["day", "traffic_volume"]
    weekdays = weekday_data.to_dict(orient="records")

    # Average traffic for each month
    monthly_data = (
        df.groupby("month")["traffic_volume"]
        .mean()
        .round(0)
        .reset_index()
    )

    month_names = {
        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
        5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
        9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
    }

    monthly_data["month_name"] = monthly_data["month"].map(month_names)
    monthly_data = monthly_data.rename(
        columns={"traffic_volume": "traffic_volume"}
    )

    monthly = monthly_data[
        ["month_name", "traffic_volume"]
    ].to_dict(orient="records")

    # Count records in each congestion category
    low_count = int(
        (df["traffic_volume"] <= LOW_THRESHOLD).sum()
    )

    moderate_count = int(
        (
            (df["traffic_volume"] > LOW_THRESHOLD) &
            (df["traffic_volume"] <= MODERATE_THRESHOLD)
        ).sum()
    )

    heavy_count = int(
        (df["traffic_volume"] > MODERATE_THRESHOLD).sum()
    )

    congestion = [
        {"name": "Low", "value": low_count},
        {"name": "Moderate", "value": moderate_count},
        {"name": "Heavy", "value": heavy_count},
    ]

    summary = {
        "total_records": int(len(df)),
        "average_traffic": round(float(df["traffic_volume"].mean())),
        "maximum_traffic": int(df["traffic_volume"].max()),
        "minimum_traffic": int(df["traffic_volume"].min()),
    }

    return {
        "summary": summary,
        "hourly": hourly,
        "weekdays": weekdays,
        "monthly": monthly,
        "congestion": congestion,
    }
