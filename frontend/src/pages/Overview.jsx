
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  CalendarDays,
  Gauge,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import StatCard from "../components/StatCard";
import { getHistoricalAnalytics } from "../services/api";

const CHART_COLORS = ["#22d3ee", "#818cf8", "#34d399"];

function Overview() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistoricalAnalytics()
      .then(setAnalytics)
      .catch(() => setError("Unable to load dashboard statistics."));
  }, []);

  const formatNumber = (value) =>
    Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const peakHour = analytics
    ? analytics.hourly.reduce((max, item) =>
        item.traffic_volume > max.traffic_volume ? item : max
      )
    : null;

  const busiestDay = analytics
    ? analytics.weekdays.reduce((max, item) =>
        item.traffic_volume > max.traffic_volume ? item : max
      )
    : null;

  const congestionTotal = analytics
    ? analytics.congestion.reduce((sum, item) => sum + item.value, 0)
    : 0;

  const congestionData = analytics
    ? analytics.congestion.map((item) => ({
        ...item,
        percentage: congestionTotal
          ? ((item.value / congestionTotal) * 100).toFixed(1)
          : 0,
      }))
    : [];

  const congestionColors = {
    Low: "#34d399",
    Moderate: "#fbbf24",
    Heavy: "#fb7185",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-slate-700 bg-[#0b1424] px-4 py-3 shadow-xl">
        <p className="mb-1 text-xs text-slate-400">{label}</p>
        <p className="font-semibold text-cyan-300">
          {formatNumber(payload[0].value)} vehicles
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 p-7 md:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium tracking-wider text-cyan-400">
            SMART TRAFFIC MANAGEMENT
          </p>

          <h3 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Understand Traffic.
            <span className="block text-cyan-400">
              Predict Better.
            </span>
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Analyze historical traffic patterns, explore congestion
            trends and predict traffic volume using machine learning
            and weather conditions.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300">
            <Activity size={15} />
            Historical Data Driven ML System
          </div>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full border border-cyan-400/10" />
        <div className="pointer-events-none absolute -right-2 top-0 h-48 w-48 rounded-full border border-cyan-400/10" />
      </section>

      {/* Loading and error states */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {!analytics && !error && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-[#101b2d] p-10 text-sm text-slate-400">
          <Loader2 size={20} className="animate-spin text-cyan-400" />
          Loading historical traffic analytics...
        </div>
      )}

      {analytics && (
        <>
          {/* Dataset statistics */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Dataset Overview</h3>
              <p className="mt-1 text-xs text-slate-500">
                Statistics calculated from 48,204 historical traffic records.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Records"
                value={formatNumber(analytics.summary.total_records)}
                description="Historical traffic observations"
                icon={BarChart3}
              />

              <StatCard
                title="Average Traffic"
                value={formatNumber(analytics.summary.average_traffic)}
                description="Average vehicles per record"
                icon={Activity}
              />

              <StatCard
                title="Maximum Traffic"
                value={formatNumber(analytics.summary.maximum_traffic)}
                description="Highest recorded traffic volume"
                icon={TrendingUp}
              />

              <StatCard
                title="Minimum Traffic"
                value={formatNumber(analytics.summary.minimum_traffic)}
                description="Lowest recorded traffic volume"
                icon={Gauge}
              />
            </div>
          </section>

          {/* Historical insights */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Historical Traffic Insights
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">
                      Peak Traffic Hour
                    </p>
                    <h4 className="mt-1 text-2xl font-bold text-white">
                      {String(peakHour.hour).padStart(2, "0")}:00
                    </h4>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Average traffic:{" "}
                  <span className="font-semibold text-cyan-300">
                    {formatNumber(peakHour.traffic_volume)}
                  </span>{" "}
                  vehicles.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-400/10 p-3 text-indigo-400">
                    <CalendarDays size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">
                      Busiest Weekday
                    </p>
                    <h4 className="mt-1 text-2xl font-bold text-white">
                      {busiestDay.day}
                    </h4>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Average traffic:{" "}
                  <span className="font-semibold text-indigo-300">
                    {formatNumber(busiestDay.traffic_volume)}
                  </span>{" "}
                  vehicles.
                </p>
              </div>
            </div>
          </section>

          {/* Hourly traffic chart */}
          <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">
                Hourly Traffic Pattern
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Average traffic volume across different hours of the day.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.hourly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#263449"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    interval={2}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="traffic_volume"
                    name="Traffic"
                    fill="#22d3ee"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Weekday and congestion charts */}
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
              <h3 className="text-lg font-semibold">
                Weekday Traffic Comparison
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Average traffic volume for each day of the week.
              </p>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.weekdays}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#263449"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="traffic_volume"
                      fill="#818cf8"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
              <h3 className="text-lg font-semibold">
                Congestion Distribution
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Distribution of records across congestion categories.
              </p>

              <div className="relative mt-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={congestionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={4}
                    >
                      {congestionData.map((item) => (
                        <Cell
                          key={item.name}
                          fill={congestionColors[item.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${formatNumber(value)} records`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "#0b1424",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {formatNumber(congestionTotal)}
                  </span>
                  <span className="text-xs text-slate-500">Records</span>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {congestionData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: congestionColors[item.name],
                        }}
                      />
                      <span className="text-slate-300">{item.name}</span>
                    </div>

                    <span className="font-medium text-white">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* Project modules */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          System Modules
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Traffic Prediction",
              description:
                "Estimate traffic volume using a trained Random Forest model.",
              icon: Gauge,
              color: "text-cyan-400",
            },
            {
              title: "Historical Analytics",
              description:
                "Explore hourly, weekday, monthly and congestion patterns.",
              icon: BarChart3,
              color: "text-indigo-400",
            },
            {
              title: "Model Evaluation",
              description:
                "Compare machine learning models and understand feature importance.",
              icon: TrendingUp,
              color: "text-emerald-400",
            },
          ].map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.title}
                className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5"
              >
                <Icon size={24} className={module.color} />
                <h4 className="mt-4 font-semibold text-white">
                  {module.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {module.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        TrafficIQ uses historical Metro Interstate traffic data.
        Predictions are estimates and do not represent live road conditions.
      </p>
    </div>
  );
}

export default Overview;
