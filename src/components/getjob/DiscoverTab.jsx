import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";
import Sidebar from "./Sidebar";

const BENEFITS = ["Home office", "Flexibilní pracovní doba", "5 týdnů dovolené", "Stravenky", "Firemní laptop", "Jazykové kurzy", "MultiSport karta"];

export default function DiscoverTab({ profile, discover, custom, tracker, onDiscoverSave, onCustomSave, onTrackerSave, onOpenGenerator }) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [matchFilter, setMatchFilter] = useState("all");
  const [locFilter, setLocFilter] = useState("all");
  const [salFilter, setSalFilter] = useState("all");
  const [durFilter, setDurFilter] = useState("all");
  const [benFilters, setBenFilters] = useState([]);
  const [customForm, setCustomForm] = useState({ name: "", position: "", url: "", email: "" });

  const all = useMemo(() => [...discover, ...custom], [discover, custom]);

  const filtered = useMemo(() => {
    return all.filter(c => {
      if (!(c.name + c.type + c.position).toLowerCase().includes(search.toLowerCase())) return false;
      if (matchFilter !== "all" && c.match !== matchFilter) return false;
      if (locFilter !== "all" && c.location && !c.location.includes(locFilter)) return false;
      if (durFilter !== "all" && c.hours && !c.hours.toLowerCase().includes(durFilter.toLowerCase())) return false;
      if (salFilter !== "all" && c.salary) {
        const s = c.salary.toLowerCase();
        if (salFilter === "dohodou" && !s.includes("dohod")) return false;
        if (salFilter === "20-30k" && !s.includes("20") && !s.includes("25")) return false;
        if (salFilter === "30-50k" && !["30","35","40","45"].some(x => s.includes(x))) return false;
        if (salFilter === "50k+" && !["50","60","70","80","90","100"].some(x => s.includes(x))) return false;
      }
      if (benFilters.length > 0) {
        const cb = (c.benefits || []).map(b => b.toLowerCase());
        if (!benFilters.some(b => cb.some(cb => cb.includes(b.toLowerCase())))) return false;
      }
      return true;
    });
  }, [all, search, matchFilter, locFilter, salFilter, durFilter, benFilters]);

  const runDiscover = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Job discovery AI. Suggest 12 relevant opportunities in ${profile.city || "Czech Republic"} for:
Field: ${profile.field || "any"}, Level: ${profile.level || "any"}, Skills: ${profile.skills || "not specified"}, Languages: ${profile.langs || "Czech"}, Looking for: ${profile.ttype || "internship"}, Industry: ${profile.tind || "any"}, Extra: ${profile.extra || "none"}
Return jobs array with realistic Czech market data.`,
        response_json_schema: {
          type: "object",
          properties: {
            jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" }, type: { type: "string" },
                  position: { type: "string" }, matchReason: { type: "string" },
                  url: { type: "string" }, email: { type: "string" },
                  hours: { type: "string" }, match: { type: "string" },
                  salary: { type: "string" }, location: { type: "string" },
                  benefits: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      });
      const jobs = (result.jobs || []).map((c, i) => ({ ...c, id: "ai_" + i + "_" + Date.now(), src: "ai", benefits: c.benefits || [] }));
      onDiscoverSave(jobs);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addCustom = () => {
    if (!customForm.name.trim() || !customForm.position.trim()) return;
    onCustomSave([...custom, {
      id: "c_" + Date.now(), name: customForm.name.trim(), type: "Vlastní",
      position: customForm.position.trim(), url: customForm.url.trim(),
      email: customForm.email.trim(), hours: "dle dohody", salary: "Dle dohody",
      location: "Praha", match: "mid", matchReason: "Přidáno ručně", benefits: [], src: "custom",
    }]);
    setCustomForm({ name: "", position: "", url: "", email: "" });
  };

  const removeCustom = (id) => onCustomSave(custom.filter(c => c.id !== id));
  const addToTracker = (company) => {
    if (tracker.find(t => t.cid === company.id)) return;
    onTrackerSave([...tracker, { id: Date.now(), cid: company.id, name: company.name, pos: company.position, status: "todo", sent: null, notes: "", email: company.email || "", url: company.url || "" }]);
  };

  const hasStarted = discover.length > 0;

  const toggleBen = (b) => setBenFilters(f => f.includes(b) ? f.filter(x => x !== b) : [...f, b]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div>
        {!hasStarted && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-8 mb-5 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#0D1B2A,#1a3050)" }}>
            <div className="text-4xl mb-3">🤖</div>
            <h2 className="font-poppins text-[22px] font-bold mb-1.5 text-white">AI Job Discovery</h2>
            <p className="text-sm text-blue-100 mb-5 leading-relaxed max-w-[420px]">Na základě tvého profilu AI navrhne relevantní firmy a pozice pro každý obor a lokaci.</p>
            <button onClick={runDiscover} className="px-6 py-3 rounded-full bg-brand-teal text-white font-bold text-sm hover:opacity-90 transition-opacity">✨ Najít pozice pro mě</button>
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 animate-bounce">🤖</div>
            <p className="font-semibold text-foreground mb-1">AI hledá pozice...</p>
            <p className="text-sm text-muted-foreground">Analyzuji profil a hledám příležitosti</p>
          </div>
        )}

        {hasStarted && !loading && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h2 className="font-poppins text-xl font-bold">Nalezené pozice</h2>
              <button onClick={runDiscover} className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">🔄 Obnovit</button>
            </div>

            {/* Filter bar */}
            <div className="bg-white border border-border rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex gap-2 flex-wrap mb-2">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Hledat firmu nebo pozici..."
                  className="flex-1 min-w-32 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
                <select value={matchFilter} onChange={e => setMatchFilter(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  <option value="all">Všechny shody</option>
                  <option value="high">✓ Silný match</option>
                  <option value="mid">~ Dobrý match</option>
                  <option value="low">⚠ Slabší match</option>
                </select>
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                <select value={locFilter} onChange={e => setLocFilter(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  <option value="all">📍 Vše</option>
                  <option value="Praha">Praha</option>
                  <option value="Brno">Brno</option>
                  <option value="Ostrava">Ostrava</option>
                  <option value="Remote">Remote</option>
                </select>
                <select value={salFilter} onChange={e => setSalFilter(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  <option value="all">💰 Jakýkoliv plat</option>
                  <option value="dohodou">Dle dohody</option>
                  <option value="20-30k">20 000–30 000 Kč</option>
                  <option value="30-50k">30 000–50 000 Kč</option>
                  <option value="50k+">50 000 Kč+</option>
                </select>
                <select value={durFilter} onChange={e => setDurFilter(e.target.value)}
                  className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  <option value="all">⏱ Jakákoliv doba</option>
                  <option value="Stáž">Stáž</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Fulltime">Fulltime</option>
                  <option value="Trainee">Trainee</option>
                </select>
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-teal uppercase tracking-wider mb-2 font-mono">🎁 Benefity</p>
                <div className="flex flex-wrap gap-1.5">
                  {BENEFITS.map(b => (
                    <button key={b} onClick={() => toggleBen(b)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${benFilters.includes(b) ? "bg-accent border-brand-teal text-accent-foreground font-semibold" : "bg-secondary border-border text-muted-foreground hover:border-brand-teal/60 hover:text-brand-teal"}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-brand-teal font-mono mb-3">{filtered.length} / {all.length} pozic</p>

            <AnimatePresence>
              {filtered.length === 0 ? (
                <div className="text-center py-14 text-muted-foreground">
                  <div className="text-3xl mb-3 opacity-40">🔍</div>
                  <p className="font-poppins font-bold text-foreground/60 mb-1">Žádné výsledky</p>
                  <p className="text-sm">Zkus upravit filtry</p>
                </div>
              ) : filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <JobCard company={c} inTracker={!!tracker.find(t => t.cid === c.id)} onOpenGenerator={onOpenGenerator} onAddToTracker={addToTracker} onRemoveCustom={removeCustom} />
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="mt-6">
              <p className="text-[11px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-3">Přidat vlastní firmu</p>
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input value={customForm.name} onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))} placeholder="Firma" className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
                  <input value={customForm.position} onChange={e => setCustomForm(f => ({ ...f, position: e.target.value }))} placeholder="Pozice" className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
                  <input value={customForm.url} onChange={e => setCustomForm(f => ({ ...f, url: e.target.value }))} placeholder="https://firma.cz" className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
                  <input value={customForm.email} onChange={e => setCustomForm(f => ({ ...f, email: e.target.value }))} placeholder="hr@firma.cz" className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
                </div>
                <button onClick={addCustom} className="px-4 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">+ Přidat firmu</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}