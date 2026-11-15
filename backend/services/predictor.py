
import joblib
import pandas as pd

from pathlib import Path

# Load the trained model once
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "random_forest_model.pkl"

model = joblib.load(MODEL_PATH)

# Keep the exact feature order used during training
FEATURES = [
    "temp",
    "rain_1h",
    "snow_1h",
    "clouds_all",
    "hour",
    "day_of_week",
    "month"
]

# Training-data congestion thresholds
LOW_THRESHOLD = 2158
MODERATE_THRESHOLD = 4547


def predict_traffic(date, hour, temp_c, rain_1h, snow_1h, clouds_all):
    # Convert Celsius to Kelvin because the dataset stores temperature in Kelvin
    temp_kelvin = temp_c + 273.15

    # Convert date into the features used during training
    day_of_week = date.weekday()
    month = date.month

    input_data = pd.DataFrame([{
        "temp": temp_kelvin,
        "rain_1h": rain_1h,
        "snow_1h": snow_1h,
        "clouds_all": clouds_all,
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month
    }], columns=FEATURES)

    prediction = float(model.predict(input_data)[0])

    if prediction <= LOW_THRESHOLD:
        congestion = "Low"
    elif prediction <= MODERATE_THRESHOLD:
        congestion = "Moderate"
    else:
        congestion = "Heavy"

    return {
        "predicted_traffic": round(prediction),
        "congestion_level": congestion
    }
