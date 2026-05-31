import React from "react";

const SOURCES = ["jobs.cz", "startupjobs.cz", "jenprace.cz", "volnamista.cz", "fajnbrigady.cz", "juristic.cz", "pracevpravu.cz", "linkedin"];

export default function FiltersPanel({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  const toggleSource = (src) => {
    const curr = filters.sources || [];
    const next = curr.includes(src) ? curr.filter(s => s !== src) : [...curr, src];
    set("sources", next);
  };

  return (
    <div
      className="rounded-2xl p-5 space-y-5"
      style={{ background: "white", border: "1px solid #e8edf4", boxShadow: "0 2px 12px 0 rgba(13,27,42,0.04)" }}
    >
      <h3 className="font-bold text-sm" style={{ color: "#0d1b2a" }}>Filtry</h3>

      {/* Score slider */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9ca3af" }}>
          Min. shoda: <span style={{ color: "#2563eb" }}>{filters.minScore || 0}%</span>
        </label>
        <input
          type="range" min={0} max={100} step={5}
          value={filters.minScore || 0}
          onChange={e => set("minScore", Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: "#9ca3af" }}>
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Sources */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>Zdroje</label>
        <div className="space-y-2">
          {SOURCES.map(src => (
            <label key={src} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!filters.sources || filters.sources.length === 0 || filters.sources.includes(src.toLowerCase())}
                onChange={() => toggleSource(src.toLowerCase())}
                className="accent-blue-600 w-3.5 h-3.5 rounded"
              />
              <span className="text-sm" style={{ color: "#5b6577" }}>{src}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9ca3af" }}>Lokalita</label>
        <select
          value={filters.location || ""}
          onChange={e => set("location", e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
          style={{ border: "1px solid #e3e8f0", color: "#0d1b2a", background: "#f6f8fb" }}
        >
          <option value="">Všechny</option>
          <option value="Praha">Praha</option>
          <option value="Brno">Brno</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9ca3af" }}>Stáří inzerátu</label>
        <select
          value={filters.maxAge || ""}
          onChange={e => set("maxAge", e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
          style={{ border: "1px solid #e3e8f0", color: "#0d1b2a", background: "#f6f8fb" }}
        >
          <option value="">Vše</option>
          <option value="1">Dnes</option>
          <option value="7">Tento týden</option>
          <option value="30">Tento měsíc</option>
        </select>
      </div>

      <button
        onClick={() => onChange({ minScore: 0, sources: [], location: "", maxAge: "" })}
        className="w-full py-2 rounded-xl text-xs font-semibold transition-colors"
        style={{ border: "1px solid #e3e8f0", color: "#9ca3af", background: "transparent" }}
      >
        Resetovat filtry
      </button>
    </div>
  );
}