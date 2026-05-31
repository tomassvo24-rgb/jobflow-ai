import React from "react";

const SOURCES = ["jobs.cz", "juristic.cz", "pracevpravu.cz", "RSJ", "ČNB"];

export default function FiltersPanel({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  const toggleSource = (src) => {
    const curr = filters.sources || [];
    const next = curr.includes(src) ? curr.filter(s => s !== src) : [...curr, src];
    set("sources", next);
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-4 space-y-5">
      <h3 className="text-sm font-bold">Filtry</h3>

      {/* Score slider */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Min. shoda: <span className="text-foreground">{filters.minScore || 0}%</span>
        </label>
        <input
          type="range" min={0} max={100} step={5}
          value={filters.minScore || 0}
          onChange={e => set("minScore", Number(e.target.value))}
          className="w-full mt-2 accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Sources */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Zdroje</label>
        <div className="space-y-1.5">
          {SOURCES.map(src => (
            <label key={src} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!filters.sources || filters.sources.length === 0 || filters.sources.includes(src.toLowerCase())}
                onChange={() => toggleSource(src.toLowerCase())}
                className="accent-blue-600"
              />
              <span className="text-sm">{src}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Lokalita</label>
        <select
          value={filters.location || ""}
          onChange={e => set("location", e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Všechny</option>
          <option value="Praha">Praha</option>
          <option value="Brno">Brno</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Stáří inzerátu</label>
        <select
          value={filters.maxAge || ""}
          onChange={e => set("maxAge", e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Vše</option>
          <option value="1">Dnes</option>
          <option value="7">Tento týden</option>
          <option value="30">Tento měsíc</option>
        </select>
      </div>

      <button
        onClick={() => onChange({ minScore: 0, sources: [], location: "", maxAge: "" })}
        className="w-full py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted transition-colors"
      >
        Resetovat filtry
      </button>
    </div>
  );
}