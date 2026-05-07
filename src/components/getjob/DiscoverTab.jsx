import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";

export default function DiscoverTab({ profile, discover, custom, tracker, onDiscoverSave, onCustomSave, onTrackerSave, onOpenGenerator }) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [matchFilter, setMatchFilter] = useState("all");
  const [customForm, setCustomForm] = useState({ name: "", position: "", url: "", email: "" });

  const all = useMemo(() => [...discover, ...custom], [discover, custom]);

  const filtered = useMemo(() => {
    return all.filter(c => {
      const q = (c.name + c.type + c.position).toLowerCase().includes(search.toLowerCase());
      const m = matchFilter === "all" || c.match === matchFilter;
      return q && m;
    });
  }, [all, search, matchFilter]);

  const runDiscover = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a job discovery AI. Suggest exactly 12 relevant job opportunities for this profile in ${profile.city || "Czech Republic"}.

Profile:
- Field: ${profile.field}
- Level: ${profile.level}
- Skills: ${profile.skills || "not specified"}
- Languages: ${profile.langs || "Czech"}
- Looking for: ${profile.ttype}
- Industry preference: ${profile.tind}
- Extra: ${profile.extra || "none"}

Return ONLY a valid JSON array (no markdown, no code fences):
[{"name":"Company","type":"Type","position":"Specific Role","matchReason":"One sentence why in Czech","url":"career URL or empty","email":"hr email or empty","hours":"e.g. Part-time 20h/t, Stáž 3 měs.","match":"high or mid or low"}]

Be specific and realistic for Czech/Slovak market. Mix well-known and mid-size companies.`,
        response_json_schema: {
          type: "object",
          properties: {
            jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  position: { type: "string" },
                  matchReason: { type: "string" },
                  url: { type: "string" },
                  email: { type: "string" },
                  hours: { type: "string" },
                  match: { type: "string" },
                },
              },
            },
          },
        },
      });

      const jobs = (result.jobs || []).map((c, i) => ({ ...c, id: "ai_" + i + "_" + Date.now(), src: "ai" }));
      onDiscoverSave(jobs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const addCustom = () => {
    if (!customForm.name.trim() || !customForm.position.trim()) return;
    const newItem = {
      id: "c_" + Date.now(),
      name: customForm.name.trim(),
      type: "Vlastní",
      position: customForm.position.trim(),
      url: customForm.url.trim(),
      email: customForm.email.trim(),
      hours: "dle dohody",
      match: "mid",
      matchReason: "Přidáno ručně",
      src: "custom",
    };
    onCustomSave([...custom, newItem]);
    setCustomForm({ name: "", position: "", url: "", email: "" });
  };

  const removeCustom = (id) => {
    onCustomSave(custom.filter(c => c.id !== id));
  };

  const addToTracker = (company) => {
    if (tracker.find(t => t.cid === company.id)) return;
    onTrackerSave([...tracker, {
      id: Date.now(),
      cid: company.id,
      name: company.name,
      pos: company.position,
      status: "todo",
      sent: null,
      notes: "",
      email: company.email || "",
      url: company.url || "",
    }]);
  };

  const hasStarted = discover.length > 0;

  return (
    <div>
      {/* CTA or results header */}
      {!hasStarted && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center mb-5"
        >
          <div className="text-4xl mb-3">🤖</div>
          <h2 className="font-syne text-xl font-bold text-accent-foreground mb-2">AI Job Discovery</h2>
          <p className="text-sm text-muted-foreground mb-5">Na základě tvého profilu AI navrhne relevantní firmy a pozice — pro každý obor a lokaci.</p>
          <button onClick={runDiscover} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            ✨ Najít pozice pro mě
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 animate-pulse-slow">🤖</div>
          <p className="font-semibold text-foreground mb-1">AI hledá pozice...</p>
          <p className="text-sm text-muted-foreground">Analyzuji profil a hledám relevantní příležitosti</p>
        </div>
      )}

      {hasStarted && !loading && (
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="font-syne text-xl font-bold">Nalezené pozice</h2>
            <button onClick={runDiscover} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground border border-primary/20 text-sm font-medium hover:opacity-80 transition-opacity">🔄 Obnovit</button>
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Hledat..."
              className="flex-1 min-w-32 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <select
              value={matchFilter}
              onChange={e => setMatchFilter(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">Všechny shody</option>
              <option value="high">✓ Silný match</option>
              <option value="mid">~ Dobrý match</option>
              <option value="low">⚠ Slabší match</option>
            </select>
          </div>

          <p className="text-xs text-muted-foreground font-mono mb-3">{filtered.length} / {all.length} pozic</p>

          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-3xl mb-3 opacity-50">😕</div>
                <p className="font-syne font-bold text-foreground/60 mb-1">Žádné výsledky</p>
                <p className="text-sm">Zkus obnovit nebo upravit filtr</p>
              </div>
            ) : (
              filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <JobCard
                    company={c}
                    inTracker={!!tracker.find(t => t.cid === c.id)}
                    onOpenGenerator={onOpenGenerator}
                    onAddToTracker={addToTracker}
                    onRemoveCustom={removeCustom}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Add custom */}
      {hasStarted && !loading && (
        <div className="mt-6">
          <p className="text-xs font-syne font-bold uppercase tracking-wider text-muted-foreground mb-3">➕ Přidat vlastní firmu</p>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Firma není v seznamu? Přidej ji ručně:</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={customForm.name} onChange={e => setCustomForm(f => ({ ...f, name: e.target.value }))} placeholder="Název firmy" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              <input value={customForm.position} onChange={e => setCustomForm(f => ({ ...f, position: e.target.value }))} placeholder="Pozice" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              <input value={customForm.url} onChange={e => setCustomForm(f => ({ ...f, url: e.target.value }))} placeholder="https://firma.cz/kariera" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              <input value={customForm.email} onChange={e => setCustomForm(f => ({ ...f, email: e.target.value }))} placeholder="hr@firma.cz" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <button onClick={addCustom} className="px-4 py-2 rounded-lg bg-secondary border border-border text-secondary-foreground text-sm font-medium hover:bg-border transition-colors">+ Přidat</button>
          </div>
        </div>
      )}
    </div>
  );
}