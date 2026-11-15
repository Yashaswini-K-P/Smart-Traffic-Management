
function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#101b2d] p-6">
      {Icon && <Icon className="mb-4 text-cyan-400" size={23} />}
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-xl font-semibold">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default StatCard;
