
import { Activity } from "lucide-react";

function Header({ title, description }) {
  return (
    <header className="mb-10 flex items-center justify-between">
      <div>
        <p className="mb-2 text-sm text-slate-500">
          Smart Traffic Management / {title}
        </p>
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>

      <div className="hidden rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 sm:block">
        <Activity size={22} />
      </div>
    </header>
  );
}

export default Header;
