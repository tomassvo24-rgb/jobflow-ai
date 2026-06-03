import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import DiscoveryJobCard from "./discovery/DiscoveryJobCard";
import JobDetailModal from "./discovery/JobDetailModal";
import {
  IconAgent, IconSearch, IconSparkle, IconRefresh, IconLoader,
  IconCheck, IconGlobe, IconTarget, IconWarning
} from "./Icons";

const BENEFITS = ["Home office", "Flexibilní pracovní doba", "5 týdnů dovolené", "Stravenky", "Firemní laptop", "Jazykové kurzy", "MultiSport karta"];

const LOADING_MESSAGES = [
  "Agent prohledává jobs.cz…",
  "Procházím startupjobs.cz…",
  "Kontroluji jenprace.cz a volnamista.cz…",
  "Prohledávám fajnbrigady.cz…",
  "Koukám na LinkedIn…",
  "Vyhodnocuji shodu s vaším profilem…",
  "Řadím výsledky…",
];

export default function DiscoverTab({ profile, tracker, onTrackerSave, onOpenGenerator }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState(null);
  const [runMeta, setRunMeta] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [locFilter, setLocFilter] = useState("");
  const [salFilter, setSalFilter] = useState("");
  const [durFilter, setDurFilter] = useState("");
  const [benFilters, setBenFilters] = useState([]);
  const toggleBen = (b) => setBenFilters(f => f.includes(b) ? f.filter(x => x !== b) : [...f, b]);

  // Load pre-scraped jobs from DB on mount
  // No initial load — wait for city selection
  useEffect(() => { setInitialLoading(false); }, []);

  // Load Apify jobs when city is selected
  useEffect(() => {
    if (!locFilter) {
      setJobs([]);
      setRunMeta(null);
      return;
    }
    const loadApifyJobs = async () => {
      setInitialLoading(true);
      try {
        const res = await base44.entities.JobListing.filter({ source: "Apify" }, "-created_date", 100);
        const scored = (res || []).map(job => ({
          ...job,
          match_score: job.match_score || 0,
          match_reasons: job.match_reasons || [],
        }));
        setJobs(scored);
        setRunMeta({ total_found: scored.length, filtered_to: scored.length });
      } catch (e) {
        // silently fail
      } finally {
        setInitialLoading(false);
      }
    };
    loadApifyJobs();
  }, [locFilter]);

  // Rotating loading message
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setLoadingMsg(p => (p + 1) % LOADING_MESSAGES.length), 3200);
    return () => clearInterval(interval);
  }, [loading]);

  const runDiscovery = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);
    setRunMeta(null);
    setLoadingMsg(0);
    try {
      const res = await base44.functions.invoke("discoverJobs", { profile });
      const data = res.data;
      if (data.error) throw new Error(data.error);
      setJobs(data.jobs || []);
      setRunMeta(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (job) =>
    setJobs(prev => prev.map(j => j.url === job.url ? { ...j, saved: !j.saved } : j));

  const handleGenerateEmail = (job) => {
    setSelectedJob(null);
    // Convert scraped job to the format GeneratorTab expects
    onOpenGenerator?.({
      id: job.url,
      name: job.company,
      position: job.title,
      email: "",
      url: job.url,
      match: job.match_score >= 75 ? "high" : job.match_score >= 50 ? "mid" : "low",
      matchReason: job.match_reasons?.join(", ") || "",
      type: job.source,
      hours: "",
      src: "scraped",
    }, "mail");
  };

  const filtered = useMemo(() => jobs.filter(job => {
    if (search && !(job.title + job.company + (job.location || "")).toLowerCase().includes(search.toLowerCase())) return false;
    if (job.match_score < minScore) return false;
    if (locFilter && !job.location?.toLowerCase().includes(locFilter.toLowerCase())) return false;
    if (salFilter) {
      const s = (job.salary || "").toLowerCase();
      if (salFilter === "dohodou" && !s.includes("dohod")) return false;
      if (salFilter === "20-30k" && !s.includes("20") && !s.includes("25")) return false;
      if (salFilter === "30-50k" && !["30","35","40","45"].some(x => s.includes(x))) return false;
      if (salFilter === "50k+" && !["50","60","70","80","90","100"].some(x => s.includes(x))) return false;
    }
    if (durFilter && job.hours && !job.hours.toLowerCase().includes(durFilter.toLowerCase())) return false;
    if (benFilters.length > 0) {
      const jb = (job.tags || []).map(b => b.toLowerCase());
      if (!benFilters.some(b => jb.some(jt => jt.includes(b.toLowerCase())))) return false;
    }
    return true;
  }), [jobs, search, minScore, locFilter, salFilter, durFilter, benFilters]);

  const hasJobs = jobs.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div>
        {/* ── Initial loading ── */}
        {initialLoading && (
          <div className="flex items-center justify-center py-12 gap-3" style={{ color: "#6b7280" }}>
            <IconLoader cls="w-5 h-5" />
            <span className="text-sm">Načítám pozice z databáze…</span>
          </div>
        )}

        {!initialLoading && (
          <>
        {/* ── AI Agent banner ── */}
        <div
          className="rounded-3xl p-6 relative overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg,#0d1b2a 0%,#1e3a5f 100%)",
            boxShadow: "0 20px 60px -20px rgba(37,99,235,0.25)",
          }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "#2563eb" }} />
          <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full blur-3xl opacity-15" style={{ background: "#14b8a6" }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-2"
                style={{ background: "rgba(37,99,235,0.25)", color: "#93c5fd" }}>
                <IconAgent cls="w-3.5 h-3.5" /> AI Discovery Agent
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight">Najdi pozice šité na míru</h2>
              <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
                Agent prohledá jobs.cz, LinkedIn, startupjobs a další — seřadí výsledky podle shody s tvým profilem.
              </p>
              {profile.field && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}>{profile.field}</span>
                  {profile.city && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}>{profile.city}</span>}
                  {profile.level && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}>{profile.level}</span>}
                </div>
              )}
            </div>
            <button
              onClick={runDiscovery}
              disabled={loading}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? "rgba(255,255,255,0.15)" : "linear-gradient(90deg,#2563eb,#14b8a6)",
                boxShadow: loading ? "none" : "0 8px 32px -8px rgba(37,99,235,0.50)",
              }}
            >
              {loading ? <IconLoader cls="w-4 h-4" /> : <IconSparkle cls="w-4 h-4" />}
              {loading ? "Hledám…" : hasJobs ? "Obnovit výsledky" : "Najít pozice"}
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="rounded-2xl border p-7 text-center mb-4"
            style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
            <div className="flex justify-center mb-3"><IconLoader cls="w-10 h-10 text-blue-500" /></div>
            <p className="font-bold" style={{ color: "#2563eb" }}>{LOADING_MESSAGES[loadingMsg]}</p>
            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Toto může trvat 20–40 sekund</p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: "#2563eb", animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="rounded-2xl border p-4 text-sm flex items-center gap-2 mb-4"
            style={{ background: "#fff1f2", borderColor: "#fecdd3", color: "#be123c" }}>
            <IconWarning cls="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* ── Run meta ── */}
        {runMeta && !loading && (
          <div className="rounded-xl px-4 py-2.5 flex flex-wrap gap-4 text-xs mb-4"
            style={{ background: "white", border: "1px solid #e8edf4" }}>
            <span className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
              <IconCheck cls="w-3.5 h-3.5 text-green-500" />
              Nalezeno: <strong style={{ color: "#0d1b2a" }}>{runMeta.total_found}</strong> pozic
            </span>
          </div>
        )}

        {/* ── Search + Filters — always visible ── */}
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9ca3af" }}>
                <IconSearch cls="w-3.5 h-3.5" />
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Hledat pozici nebo firmu…"
                className="w-full pl-8 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
                style={{ borderColor: "#e3e8f0", background: "white" }}
              />
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex gap-2 flex-wrap">
              <select value={locFilter} onChange={e => setLocFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                <option value="">Lokalita – vše</option>
                <option value="Praha">Praha</option>
                <option value="Brno">Brno</option>
                <option value="Ostrava">Ostrava</option>
                <option value="Remote">Remote</option>
              </select>
              <select value={salFilter} onChange={e => setSalFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                <option value="">Jakýkoliv plat</option>
                <option value="dohodou">Dle dohody</option>
                <option value="20-30k">20 000–30 000 Kč</option>
                <option value="30-50k">30 000–50 000 Kč</option>
                <option value="50k+">50 000 Kč+</option>
              </select>
              <select value={durFilter} onChange={e => setDurFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                <option value="">Jakýkoliv úvazek</option>
                <option value="Stáž">Stáž</option>
                <option value="Part-time">Part-time</option>
                <option value="Fulltime">Fulltime</option>
                <option value="Trainee">Trainee</option>
              </select>
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-1.5">
                Min. shoda: <span className="text-foreground">{minScore}%</span>
              </p>
              <input type="range" min={0} max={100} step={5} value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full accent-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-2">Benefity</p>
              <div className="flex flex-wrap gap-1.5">
                {BENEFITS.map(b => (
                  <button key={b} onClick={() => toggleBen(b)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${benFilters.includes(b) ? "bg-accent border-brand-teal text-accent-foreground font-semibold" : "bg-secondary border-border text-muted-foreground hover:border-brand-teal/60"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            {(locFilter || salFilter || durFilter || minScore > 0 || benFilters.length > 0) && (
              <button
                onClick={() => { setLocFilter(""); setSalFilter(""); setDurFilter(""); setMinScore(0); setBenFilters([]); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Resetovat filtry
              </button>
            )}
          </div>
        </div>

        {/* ── Job list ── */}
        {hasJobs && !loading && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: "#6b7280" }}>
                {filtered.length} z {jobs.length} pozic
              </p>
              <button
                onClick={runDiscovery}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors"
                style={{ borderColor: "#e3e8f0", color: "#6b7280" }}
              >
                <IconRefresh cls="w-3.5 h-3.5" /> Obnovit
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14" style={{ color: "#9ca3af" }}>
                <div className="flex justify-center mb-3"><IconSearch cls="w-10 h-10" /></div>
                <p className="font-semibold text-sm">Žádné výsledky neodpovídají filtrům.</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="grid gap-3">
                  {filtered.map((job, i) => (
                    <motion.div key={job.url || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                      <DiscoveryJobCard
                        job={job}
                        onOpen={setSelectedJob}
                        onSave={handleSave}
                        onGenerateEmail={handleGenerateEmail}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        )}

        {/* ── Empty state — no city selected ── */}
        {!hasJobs && !loading && !error && !locFilter && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}>
              <IconSearch cls="w-8 h-8 text-blue-400" />
            </div>
            <p className="font-extrabold text-xl" style={{ color: "#0d1b2a" }}>Zvolte město</p>
            <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
              Vyberte město z filtru výše a zobrazí se dostupné pozice.
            </p>
          </div>
        )}

        {/* ── Empty state — city selected but no results ── */}
        {!hasJobs && !loading && !error && locFilter && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}>
              <IconSearch cls="w-8 h-8 text-blue-400" />
            </div>
            <p className="font-extrabold text-xl" style={{ color: "#0d1b2a" }}>Žádné pozice pro {locFilter}</p>
            <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
              Zkuste jiné město nebo spusťte nové vyhledávání.
            </p>
          </div>
        )}
          </>
        )}
      </div>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Detail modal ── */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onGenerateEmail={handleGenerateEmail}
        />
      )}
    </div>
  );
}