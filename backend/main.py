from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.predictor import predict_traffic
from services.analytics import get_historical_analytics

app = FastAPI(
    title="Smart Traffic Management API",
    description="Historical traffic prediction and analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    date: date
    hour: int = Field(ge=0, le=23)
    temp_c: float
    rain_1h: float = Field(ge=0)
    snow_1h: float = Field(ge=0)
    clouds_all: float = Field(ge=0, le=100)


@app.get("/")
def home():
    return {
        "message": "Smart Traffic Management API is running!"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(request: PredictionRequest):
    result = predict_traffic(
        date=request.date,
        hour=request.hour,
        temp_c=request.temp_c,
        rain_1h=request.rain_1h,
        snow_1h=request.snow_1h,
        clouds_all=request.clouds_all
    )

    return result


@app.get("/analytics")
def analytics():
    return get_historical_analytics()