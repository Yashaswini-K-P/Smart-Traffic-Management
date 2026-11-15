
import {
  Activity,
  LayoutDashboard,
  Gauge,
  BarChart3,
  TrendingUp,
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  const items = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "prediction", label: "Traffic Prediction", icon: Gauge },
    { id: "analytics", label: "Historical Analytics", icon: BarChart3 },
    { id: "performance", label: "Model Performance", icon: TrendingUp },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-[#0b1424] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="mb-8 flex items-center gap-3 md:mb-12">
        <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400">
          <Activity size={25} />
        </div>
        <div>
          <h1 className="font-bold tracking-wide">TrafficIQ</h1>
          <p className="text-xs text-slate-500">Smart Traffic System</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </p>

      <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm md:gap-3 md:px-4 ${
                activePage === item.id
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:mt-auto md:block">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium">Backend connected</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Historical traffic prediction system.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
