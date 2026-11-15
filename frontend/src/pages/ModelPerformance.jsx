
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import {
  Award,
  BrainCircuit,
  Target,
  TrendingDown,
  TrendingUp,
  Info,
  CheckCircle2,
} from "lucide-react";

const models = [
  { name: "Decision Tree", r2: 91.07, mae: 327.20, rmse: 587.87 },
  { name: "Random Forest", r2: 92.08, mae: 312.61, rmse: 553.74 },
];

const features = [
  { feature: "Hour", importance: 82.93 },
  { feature: "Day of Week", importance: 11.02 },
  { feature: "Temperature", importance: 3.80 },
  { feature: "Month", importance: 1.09 },
  { feature: "Cloud Coverage", importance: 0.82 },
  { feature: "Rainfall", importance: 0.32 },
  { feature: "Snowfall", importance: 0.02 },
];

function ChartCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-5 md:p-6">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-6 h-72">{children}</div>
    </section>
  );
}

function MetricExplanation({ title, meaning, better, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#101b2d] p-5">
      <div className="flex items-center gap-2">
        <Icon size={19} className="text-cyan-400" />
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{meaning}</p>
      <p className="mt-3 text-xs font-medium text-emerald-400">
        {better}
      </p>
    </div>
  );
}

function ModelPerformance() {
  const selectedModel = models[1];
  const decisionTree = models[0];

  const r2Improvement = (
    selectedModel.r2 - decisionTree.r2
  ).toFixed(2);

  const maeReduction = (
    ((decisionTree.mae - selectedModel.mae) / decisionTree.mae) * 100
  ).toFixed(2);

  const rmseReduction = (
    ((decisionTree.rmse - selectedModel.rmse) / decisionTree.rmse) * 100
  ).toFixed(2);

  const chartTooltipStyle = {
    backgroundColor: "#0b1424",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "#fff",
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-cyan-400">
          MACHINE LEARNING EVALUATION
        </p>
        <h3 className="mt-2 text-2xl font-bold">
          Model Performance
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Compare trained regression models, evaluate prediction errors
          and understand which features influence traffic volume predictions.
        </p>
      </div>

      {/* Selected model */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 p-6">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Award size={20} />
              <span className="text-xs font-semibold tracking-wider">
                SELECTED PREDICTION MODEL
              </span>
            </div>
            <h3 className="mt-3 text-3xl font-bold text-white">
              Random Forest
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Selected because it achieved a higher R² score and lower
              prediction errors than Decision Tree.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-xs text-emerald-300">R² Score</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {selectedModel.r2}%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {r2Improvement} percentage points higher
            </p>
          </div>
        </div>
      </section>

      {/* Model comparison cards */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          Model Comparison
        </h3>

        <div className="grid gap-4 lg:grid-cols-2">
          {models.map((model) => {
            const isSelected = model.name === "Random Forest";

            return (
              <div
                key={model.name}
                className={`rounded-2xl border bg-[#101b2d] p-6 ${
                  isSelected
                    ? "border-emerald-400/30"
                    : "border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-white">
                    {model.name}
                  </h4>

                  {isSelected && (
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Selected
                    </span>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">R² Score</p>
                    <p className="mt-2 text-xl font-bold text-cyan-400">
                      {model.r2}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">MAE</p>
                    <p className="mt-2 text-xl font-bold text-white">
                      {model.mae.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">RMSE</p>
                    <p className="mt-2 text-xl font-bold text-white">
                      {model.rmse.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-4">
                  <p className="text-xs text-slate-500">
                    {isSelected
                      ? "Best overall performance among the evaluated models."
                      : "Used as the baseline model for comparison."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* R2 comparison */}
      <ChartCard
        title="R² Score Comparison"
        description="Higher R² indicates that the model explains more variation in traffic volume."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={models}>
            <CartesianGrid
              stroke="#263449"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[85, 95]}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => [`${value}%`, "R² Score"]}
            />
            <Bar
              dataKey="r2"
              name="R² Score"
              radius={[5, 5, 0, 0]}
            >
              {models.map((model) => (
                <Cell
                  key={model.name}
                  fill={
                    model.name === "Random Forest"
                      ? "#34d399"
                      : "#818cf8"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Error comparisons */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Mean Absolute Error (MAE)"
          description="Average absolute difference between actual and predicted traffic volume. Lower is better."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={models}>
              <CartesianGrid
                stroke="#263449"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [value.toFixed(2), "MAE"]}
              />
              <Bar dataKey="mae" name="MAE" radius={[5, 5, 0, 0]}>
                {models.map((model) => (
                  <Cell
                    key={model.name}
                    fill={
                      model.name === "Random Forest"
                        ? "#34d399"
                        : "#818cf8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Root Mean Squared Error (RMSE)"
          description="Penalizes larger prediction errors more heavily. Lower is better."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={models}>
              <CartesianGrid
                stroke="#263449"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [value.toFixed(2), "RMSE"]}
              />
              <Bar dataKey="rmse" name="RMSE" radius={[5, 5, 0, 0]}>
                {models.map((model) => (
                  <Cell
                    key={model.name}
                    fill={
                      model.name === "Random Forest"
                        ? "#34d399"
                        : "#818cf8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Improvement summary */}
      <section className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
        <h3 className="font-semibold text-white">
          Random Forest Improvement
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <TrendingUp size={20} className="text-emerald-400" />
            <p className="mt-3 text-xs text-slate-500">
              R² score improvement
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              +{r2Improvement}
            </p>
            <p className="text-xs text-slate-500">
              Percentage points
            </p>
          </div>

          <div>
            <TrendingDown size={20} className="text-emerald-400" />
            <p className="mt-3 text-xs text-slate-500">
              MAE reduction
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {maeReduction}%
            </p>
            <p className="text-xs text-slate-500">
              Compared with Decision Tree
            </p>
          </div>

          <div>
            <TrendingDown size={20} className="text-emerald-400" />
            <p className="mt-3 text-xs text-slate-500">
              RMSE reduction
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {rmseReduction}%
            </p>
            <p className="text-xs text-slate-500">
              Compared with Decision Tree
            </p>
          </div>
        </div>
      </section>

      {/* Feature importance */}
      <ChartCard
        title="Random Forest Feature Importance"
        description="Relative importance assigned to each input feature by the trained Random Forest model."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={features}
            layout="vertical"
            margin={{ left: 25, right: 25 }}
          >
            <CartesianGrid
              stroke="#263449"
              strokeDasharray="3 3"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="feature"
              width={115}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => [`${value}%`, "Importance"]}
            />
            <Bar
              dataKey="importance"
              name="Importance"
              fill="#22d3ee"
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Feature importance explanation */}
      <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
        <div className="flex items-center gap-2">
          <Info size={20} className="text-cyan-400" />
          <h3 className="font-semibold text-cyan-300">
            Understanding Feature Importance
          </h3>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Hour contributes approximately 82.93% of the Random Forest
          model's total feature importance. This indicates that the time
          of day is the most influential feature across the trained model.
        </p>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Day of the week contributes approximately 11.02%, while weather
          features such as temperature, rainfall, snowfall and cloud
          coverage have smaller importance values in this model.
        </p>

        <p className="mt-3 text-xs leading-6 text-slate-500">
          Feature importance is a global model statistic. It does not mean
          that changing the hour directly changes an individual prediction
          by 82.93%.
        </p>
      </section>

      {/* Metric explanations */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">
          Understanding Evaluation Metrics
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricExplanation
            title="R² Score"
            icon={Target}
            meaning="Measures how much variation in the target traffic volume is explained by the model."
            better="Higher value is better."
          />

          <MetricExplanation
            title="MAE"
            icon={TrendingDown}
            meaning="Measures the average absolute difference between predicted and actual traffic volume."
            better="Lower value is better."
          />

          <MetricExplanation
            title="RMSE"
            icon={BrainCircuit}
            meaning="Measures prediction error while giving larger errors more weight."
            better="Lower value is better."
          />
        </div>
      </section>

      {/* Final selection */}
      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={21} className="text-emerald-400" />
          <h3 className="font-semibold text-emerald-300">
            Final Model Selection: Random Forest
          </h3>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Random Forest achieved an R² score of 92.08%, compared with
          91.07% for Decision Tree. It also reduced MAE from 327.20 to
          312.61 and RMSE from 587.87 to 553.74.
        </p>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          Since it performed better across all three evaluation metrics,
          Random Forest was selected as the final model used by the
          TrafficIQ prediction system.
        </p>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Evaluation results are based on the trained models and their
        recorded evaluation metrics. Feature importance represents
        the Random Forest model's learned feature contributions.
      </p>
    </div>
  );
}

export default ModelPerformance;
