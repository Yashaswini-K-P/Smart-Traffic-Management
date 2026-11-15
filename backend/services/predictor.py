
import joblib
import pandas as pd
import gdown

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "random_forest_model.pkl"

# Google Drive model file
GOOGLE_DRIVE_FILE_ID = "1TjV8PypIt-L01YiM22SFws5TeFXwDcSF"


def ensure_model_exists():
    """Download the ML model if it is not already available."""

    if MODEL_PATH.exists():
        print("ML model already exists. Loading locally...")
        return

    print("Downloading Random Forest model from Google Drive...")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    downloaded_file = gdown.download(
        id=GOOGLE_DRIVE_FILE_ID,
        output=str(MODEL_PATH),
        quiet=False
    )

    if not downloaded_file or not MODEL_PATH.exists():
        raise RuntimeError("Failed to download the Random Forest model.")

    print("Model downloaded successfully.")


# Download model if required, then load it
ensure_model_exists()
model = joblib.load(MODEL_PATH)

print("Random Forest model loaded successfully.")

FEATURES = [
    "temp",
    "rain_1h",
    "snow_1h",
    "clouds_all",
    "hour",
    "day_of_week",
    "month"
]

LOW_THRESHOLD = 2158
MODERATE_THRESHOLD = 4547


def predict_traffic(date, hour, temp_c, rain_1h, snow_1h, clouds_all):
    temp_kelvin = temp_c + 273.15
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
