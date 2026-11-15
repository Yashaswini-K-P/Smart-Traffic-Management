
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Thermometer,
  CloudRain,
  Snowflake,
  Cloud,
  Gauge,
  Loader2,
} from "lucide-react";

import { predictTraffic } from "../services/api";
import ScenarioComparison from "../components/ScenarioComparison";

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Prediction() {
  const [formData, setFormData] = useState({
    date: getLocalDate(),
    hour: "8",
    temp_c: "25",
    rain_1h: "0",
    snow_1h: "0",
    clouds_all: "40",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await predictTraffic({
        date: formData.date,
        hour: Number(formData.hour),
        temp_c: Number(formData.temp_c),
        rain_1h: Number(formData.rain_1h),
        snow_1h: Number(formData.snow_1h),
        clouds_all: Number(formData.clouds_all),
      });

      setResult(data);
    } catch (err) {
      setError("Unable to generate prediction. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "date",
      label: "Select Date",
      type: "date",
      icon: CalendarDays,
    },
    {
      name: "hour",
      label: "Hour (0–23)",
      type: "number",
      icon: Clock,
      min: 0,
      max: 23,
    },
    {
      name: "temp_c",
      label: "Temperature (°C)",
      type: "number",
      icon: Thermometer,
    },
    {
      name: "rain_1h",
      label: "Rain (mm)",
      type: "number",
      icon: CloudRain,
      min: 0,
    },
    {
      name: "snow_1h",
      label: "Snow (mm)",
      type: "number",
      icon: Snowflake,
      min: 0,
    },
    {
      name: "clouds_all",
      label: "Cloud Coverage (%)",
      type: "number",
      icon: Cloud,
      min: 0,
      max: 100,
    },
  ];

  const congestionColor = {
    Low: "text-emerald-400",
    Moderate: "text-amber-400",
    Heavy: "text-rose-400",
  };

  return (
    <div className="space-y-6">
      {/* Individual Traffic Prediction */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6 md:p-8">
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-cyan-400">
              <Gauge size={20} />
              <span className="text-sm font-medium">TRAFFIC FORECAST</span>
            </div>

            <h3 className="text-xl font-semibold">
              Predict Traffic Volume
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Enter date, time and weather conditions to estimate traffic
              volume using the Random Forest model.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm text-slate-400">
                      {field.label}
                    </label>

                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900/70 px-3 focus-within:border-cyan-400">
                      <Icon
                        size={17}
                        className="shrink-0 text-slate-500"
                      />

                      <input
                        className="w-full min-w-0 cursor-pointer bg-transparent px-3 py-3 text-sm text-white outline-none"
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onClick={(e) => {
                          if (field.type === "date") {
                            e.currentTarget.showPicker?.();
                          }
                        }}
                        style={{ colorScheme: "dark" }}
                        min={field.min}
                        max={field.max}
                        required
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Gauge size={18} />
                  Predict Traffic
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
              {error}
            </p>
          )}
        </section>

        {/* Individual Prediction Result */}
        <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6 md:p-8">
          <h3 className="text-lg font-semibold">Prediction Result</h3>

          <p className="mt-2 text-sm text-slate-400">
            Your estimated traffic volume will appear here.
          </p>

          {result ? (
            <div className="mt-8">
              <p className="text-sm text-slate-400">
                Predicted Traffic Volume
              </p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {Number(result.predicted_traffic).toLocaleString("en-IN")}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Estimated vehicles
              </p>

              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">
                  Congestion Level
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    congestionColor[result.congestion_level] || "text-white"
                  }`}
                >
                  {result.congestion_level}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-center">
              <Gauge size={38} className="text-slate-600" />

              <p className="mt-4 text-sm text-slate-400">
                No prediction generated yet
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Fill in the details and click Predict Traffic.
              </p>
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-amber-400">
            Predictions are based on historical traffic patterns and
            supplied weather conditions, not live traffic data.
          </p>
        </section>
      </div>

      {/* Scenario Comparison */}
      <ScenarioComparison />
    </div>
  );
}

export default Prediction;
