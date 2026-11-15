
import { useState } from "react";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { predictTraffic } from "../services/api";

const getLocalDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getNextWeekday = (targetDay) => {
  const date = new Date();
  const difference = (targetDay - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + difference);

  return getLocalDateFromDate(date);
};

const getLocalDateFromDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const groups = {
  time: {
    title: "Time of Day",
    description: "Compare traffic at different hours.",
    scenarios: [
      { name: "Early Morning", hour: 3 },
      { name: "Morning Rush", hour: 8 },
      { name: "Evening Rush", hour: 16 },
      { name: "Night", hour: 22 },
    ],
  },

  weather: {
    title: "Weather Conditions",
    description: "Compare predictions under different weather conditions.",
    scenarios: [
      { name: "Clear", temp_c: 20, rain_1h: 0, snow_1h: 0, clouds_all: 10 },
      { name: "Cloudy", temp_c: 20, rain_1h: 0, snow_1h: 0, clouds_all: 90 },
      { name: "Rainy", temp_c: 15, rain_1h: 5, snow_1h: 0, clouds_all: 90 },
      { name: "Snowy", temp_c: -5, rain_1h: 0, snow_1h: 2, clouds_all: 90 },
    ],
  },

  weekday: {
    title: "Day of the Week",
    description: "Compare traffic across weekdays and weekends.",
    scenarios: [
      { name: "Monday", date: () => getNextWeekday(1) },
      { name: "Friday", date: () => getNextWeekday(5) },
      { name: "Saturday", date: () => getNextWeekday(6) },
      { name: "Sunday", date: () => getNextWeekday(0) },
    ],
  },
};

function ScenarioComparison() {
  const [activeGroup, setActiveGroup] = useState("time");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runComparison = async () => {
    setLoading(true);
    setError("");
    setResults({});

    const group = groups[activeGroup];

    try {
      const predictions = await Promise.all(
        group.scenarios.map(async (scenario) => {
          const payload = {
            date: scenario.date ? scenario.date() : getLocalDate(1),
            hour: scenario.hour ?? 16,
            temp_c: scenario.temp_c ?? 10,
            rain_1h: scenario.rain_1h ?? 0,
            snow_1h: scenario.snow_1h ?? 0,
            clouds_all: scenario.clouds_all ?? 20,
          };

          const result = await predictTraffic(payload);

          return {
            scenario: scenario.name,
            traffic: result.predicted_traffic,
            congestion: result.congestion_level,
          };
        })
      );

      setResults((previous) => ({
        ...previous,
        [activeGroup]: predictions,
      }));
    } catch (err) {
      setError("Unable to compare scenarios. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const currentResults = results[activeGroup] || [];

  const congestionColor = {
    Low: "text-emerald-400",
    Moderate: "text-amber-400",
    Heavy: "text-rose-400",
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-[#101b2d] p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          <BarChart3 size={22} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">
            Prediction Scenario Comparison
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Compare model predictions across different conditions.
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(groups).map(([key, group]) => (
          <button
            key={key}
            onClick={() => {
              setActiveGroup(key);
              setError("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeGroup === key
                ? "bg-cyan-500 text-slate-950"
                : "border border-slate-700 text-slate-300 hover:border-cyan-400"
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      <p className="mb-5 text-sm text-slate-400">
        {groups[activeGroup].description}
      </p>

      <button
        onClick={runComparison}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Comparing...
          </>
        ) : (
          <>
            <RefreshCw size={18} />
            Run Comparison
          </>
        )}
      </button>

      {error && (
        <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400">
          {error}
        </p>
      )}

      {currentResults.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-4 font-semibold text-white">
            Comparison Results
          </h4>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {currentResults.map((item) => (
              <div
                key={item.scenario}
                className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"
              >
                <p className="text-sm text-slate-400">
                  {item.scenario}
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {item.traffic.toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Estimated vehicles
                </p>

                <p className={`mt-3 text-sm font-semibold ${congestionColor[item.congestion]}`}>
                  {item.congestion} Congestion
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="scenario" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#101b2d",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="traffic"
                  name="Predicted Traffic"
                  fill="#06b6d4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs leading-5 text-slate-500">
        All comparisons use your trained Random Forest model and
        historical traffic patterns. Results are estimates, not live
        traffic measurements.
      </p>
    </section>
  );
}

export default ScenarioComparison;
