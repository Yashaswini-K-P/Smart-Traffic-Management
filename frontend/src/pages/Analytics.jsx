
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CalendarDays,
  Gauge,
  Loader2,
} from "lucide-react";

import { getHistoricalAnalytics } from "../services/api";

const CONGESTION_COLORS = {
  Low: "#34d399",
  Moderate: "#fbbf24",
  Heavy: "#fb7185",
};

function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5 md:p-6">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-6 h-72">{children}</div>
    </section>
  );
}

function InsightCard({ icon: Icon, title, value, description, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5">
      <div className={`mb-4 inline-flex rounded-xl bg-slate-800/70 p-3 ${color}`}>
        <Icon size={21} />
      </div>
      <p className="text-sm text-slate-400">{title}</p>
      <h4 className="mt-2 text-2xl font-bold text-white">{value}</h4>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistoricalAnalytics()
      .then(setData)
      .catch(() => {
        setError(
          "Could not load analytics. Check whether the backend is running."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTraffic = (value) =>
    Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-[#101b2d] p-10 text-slate-400">
        <Loader2 size={20} className="animate-spin text-cyan-400" />
        Loading historical traffic data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-400">
        {error || "No analytics data available."}
      </div>
    );
  }

  const { summary, hourly, weekdays, monthly, congestion } = data;

  const peakHour = hourly.reduce((max, item) =>
    item.traffic_volume > max.traffic_volume ? item : max
  );

  const quietestHour = hourly.reduce((min, item) =>
    item.traffic_volume < min.traffic_volume ? item : min
  );

  const busiestDay = weekdays.reduce((max, item) =>
    item.traffic_volume > max.traffic_volume ? item : max
  );

  const quietestDay = weekdays.reduce((min, item) =>
    item.traffic_volume < min.traffic_volume ? item : min
  );

  const highestMonth = monthly.reduce((max, item) =>
    item.traffic_volume > max.traffic_volume ? item : max
  );

  const lowestMonth = monthly.reduce((min, item) =>
    item.traffic_volume < min.traffic_volume ? item : min
  );

  const congestionTotal = congestion.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const congestionData = congestion.map((item) => ({
    ...item,
    percentage: congestionTotal
      ? ((item.value / congestionTotal) * 100).toFixed(1)
      : "0.0",
  }));

  const stats = [
    {
      label: "Total Records",
      value: formatTraffic(summary.total_records),
      icon: BarChart3,
      color: "text-cyan-400",
    },
    {
      label: "Average Traffic",
      value: formatTraffic(summary.average_traffic),
      icon: Activity,
      color: "text-indigo-400",
    },
    {
      label: "Maximum Traffic",
      value: formatTraffic(summary.maximum_traffic),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Minimum Traffic",
      value: formatTraffic(summary.minimum_traffic),
      icon: Gauge,
      color: "text-amber-400",
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#0b1424",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "#fff",
  };

  const TrafficTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-slate-700 bg-[#0b1424] px-4 py-3 shadow-xl">
        <p className="mb-1 text-xs text-slate-400">{label}</p>
        <p className="font-semibold text-cyan-300">
          {formatTraffic(payload[0].value)} vehicles
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-cyan-400">
          DATA INSIGHTS
        </p>
        <h3 className="mt-2 text-2xl font-bold">
          Historical Traffic Analytics
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Explore traffic patterns, compare different time periods and
          understand congestion distribution using historical traffic data.
        </p>
      </div>

      {/* Summary cards */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Dataset Summary</h3>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <Icon size={20} className={stat.color} />
                </div>
                <p className="mt-4 text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Historical dataset
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Time and weekday insights */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          Traffic Pattern Insights
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightCard
            icon={Clock}
            title="Peak Traffic Hour"
            value={`${String(peakHour.hour).padStart(2, "0")}:00`}
            description={`${formatTraffic(peakHour.traffic_volume)} average vehicles`}
            color="text-rose-400"
          />

          <InsightCard
            icon={TrendingDown}
            title="Quietest Hour"
            value={`${String(quietestHour.hour).padStart(2, "0")}:00`}
            description={`${formatTraffic(quietestHour.traffic_volume)} average vehicles`}
            color="text-emerald-400"
          />

          <InsightCard
            icon={CalendarDays}
            title="Busiest Weekday"
            value={busiestDay.day}
            description={`${formatTraffic(busiestDay.traffic_volume)} average vehicles`}
            color="text-cyan-400"
          />

          <InsightCard
            icon={CalendarDays}
            title="Quietest Weekday"
            value={quietestDay.day}
            description={`${formatTraffic(quietestDay.traffic_volume)} average vehicles`}
            color="text-indigo-400"
          />
        </div>
      </section>

      {/* Hourly and weekday charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Traffic by Hour"
          description="Average number of vehicles recorded during each hour."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly}>
              <CartesianGrid
                stroke="#263449"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                stroke="#94a3b8"
                tickFormatter={(value) => `${value}:00`}
                tick={{ fontSize: 11 }}
                interval={2}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickFormatter={formatTraffic}
              />
              <Tooltip content={<TrafficTooltip />} />
              <Bar
                dataKey="traffic_volume"
                fill="#22d3ee"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Traffic by Weekday"
          description="Average traffic volume across different days."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdays}>
              <CartesianGrid
                stroke="#263449"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
                tickFormatter={formatTraffic}
              />
              <Tooltip content={<TrafficTooltip />} />
              <Bar
                dataKey="traffic_volume"
                fill="#818cf8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly trend */}
      <ChartCard
        title="Monthly Traffic Trend"
        description="Average traffic volume for each month across the historical dataset."
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly}>
            <CartesianGrid
              stroke="#263449"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month_name"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickFormatter={formatTraffic}
            />
            <Tooltip content={<TrafficTooltip />} />
            <Line
              type="monotone"
              dataKey="traffic_volume"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ fill: "#34d399", r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Monthly insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5">
          <p className="text-sm text-slate-400">Highest Average Month</p>
          <h4 className="mt-2 text-2xl font-bold text-emerald-400">
            {highestMonth.month_name}
          </h4>
          <p className="mt-2 text-sm text-slate-400">
            {formatTraffic(highestMonth.traffic_volume)} average vehicles.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5">
          <p className="text-sm text-slate-400">Lowest Average Month</p>
          <h4 className="mt-2 text-2xl font-bold text-cyan-400">
            {lowestMonth.month_name}
          </h4>
          <p className="mt-2 text-sm text-slate-400">
            {formatTraffic(lowestMonth.traffic_volume)} average vehicles.
          </p>
        </div>
      </div>

      {/* Congestion distribution */}
      <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5 md:p-6">
        <h3 className="font-semibold text-white">
          Congestion Distribution
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Historical records grouped by traffic congestion level.
        </p>

        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={congestionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  innerRadius={65}
                  paddingAngle={4}
                >
                  {congestionData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={CONGESTION_COLORS[item.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    `${formatTraffic(value)} records`,
                    "Count",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-5">
            {congestionData.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: CONGESTION_COLORS[item.name],
                      }}
                    />
                    <span className="text-sm text-slate-300">
                      {item.name} Congestion
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-white">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: CONGESTION_COLORS[item.name],
                    }}
                  />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {formatTraffic(item.value)} records
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automatically generated findings */}
      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-cyan-400" />
          <h3 className="font-semibold text-white">
            Key Historical Findings
          </h3>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
          <p>
            <span className="font-semibold text-cyan-300">
              Daily pattern:
            </span>{" "}
            Traffic reaches its highest average at {String(peakHour.hour).padStart(2, "0")}:00
            and its lowest average at {String(quietestHour.hour).padStart(2, "0")}:00.
          </p>

          <p>
            <span className="font-semibold text-cyan-300">
              Weekly pattern:
            </span>{" "}
            {busiestDay.day} has the highest average traffic, while{" "}
            {quietestDay.day} has the lowest.
          </p>

          <p>
            <span className="font-semibold text-cyan-300">
              Monthly pattern:
            </span>{" "}
            {highestMonth.month_name} records the highest monthly average,
            while {lowestMonth.month_name} records the lowest.
          </p>

          <p>
            <span className="font-semibold text-cyan-300">
              Congestion:
            </span>{" "}
            {congestionData.find((item) => item.name === "Heavy")?.percentage || 0}%
            of the historical records fall into the Heavy congestion category.
          </p>
        </div>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        All charts and insights are calculated from the historical Metro
        Interstate Traffic Volume dataset. They represent recorded patterns,
        not live traffic conditions.
      </p>
    </div>
  );
}

export default Analytics;
