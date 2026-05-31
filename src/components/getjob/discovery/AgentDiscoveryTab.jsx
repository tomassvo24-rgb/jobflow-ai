import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DiscoveryJobCard from "./DiscoveryJobCard";
import FiltersPanel from "./FiltersPanel";
import JobDetailModal from "./JobDetailModal";
import {
  IconAgent, IconSearch, IconBriefcase, IconPin, IconGrad,
  IconWarning, IconCheck, IconTarget, IconGlobe, IconLoader,
  IconSliders
} from "../Icons";

const LOADING_MESSAGES = [
  "Agent prohledává jobs.cz…",
  "Procházím startupjobs.cz…",
  "Kontroluji jenprace.cz a volnamista.cz…",
  "Prohledávám fajnbrigady.cz…",
  "Koukám na LinkedIn…",
  "Vyhodnocuji shodu s vaším profilem…",
  "Řadím výsledky…",
];

export default function AgentDiscoveryTab({ profile, onOpenGenerator }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState(null);
  const [runMeta, setRunMeta] = useState(null);
  const [filters, setFilters] = useState({ minScore: 0, sources: [], location: "", maxAge: "" });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSave = (job) => setJobs(prev => prev.map(j => j.url === job.url ? { ...j, saved: !j.saved } : j));
  const handleGenerateEmail = (job) => { setSelectedJob(null); onOpenGenerator?.(job, "mail"); };

  const filtered = jobs.filter(job => {
    if (job.match_score < (filters.minScore || 0)) return false;
    if (filters.sources?.length > 0 && !filters.sources.includes(job.source?.toLowerCase())) return false;
    if (filters.location && !job.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.maxAge) {
      const posted = job.posted_date ? new Date(job.posted_date) : null;
      if (posted) {
        const diffDays = (Date.now() - posted) / (1000 * 60 * 60 * 24);
        if (diffDays > Number(filters.maxAge)) return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-5">

      {/* ── Hero card ── */}
      <div
        className="rounded-3xl p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0d1b2a 0%,#1e3a5f 100%)",
          boxShadow: "0 20px 60px -20px rgba(37,99,235,0.25)",
        }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "#2563eb" }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-15" style={{ background: "#14b8a6" }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3"
              style={{ background: "rgba(37,99,235,0.25)", color: "#93c5fd" }}
            >
              <IconAgent cls="w-3.5 h-3.5" /> AI Discovery Agent
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              Najdi pozice šité na míru
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Agent prohledá 8 zdrojů a seřadí výsledky podle shody s tvým profilem.
            </p>

            {profile.field && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.85)" }}>
                  <IconBriefcase cls="w-3 h-3" /> {profile.field}
                </span>
                {profile.city && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.85)" }}>
                    <IconPin cls="w-3 h-3" /> {profile.city}
                  </span>
                )}
                {profile.level && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.85)" }}>
                    <IconGrad cls="w-3 h-3" /> {profile.level}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={runDiscovery}
            disabled={loading}
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading ? "rgba(255,255,255,0.15)" : "linear-gradient(90deg,#2563eb,#14b8a6)",
              boxShadow: loading ? "none" : "0 8px 32px -8px rgba(37,99,235,0.50)",
            }}
          >
            {loading ? <IconLoader cls="w-4 h-4" /> : <IconSearch cls="w-4 h-4" />}
            {loading ? "Hledám…" : "Najít pozice"}
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div
          className="rounded-2xl border p-7 text-center"
          style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
        >
          <div className="flex justify-center mb-3">
            <IconLoader cls="w-10 h-10 text-blue-500" />
          </div>
          <p className="font-bold" style={{ color: "#2563eb" }}>{LOADING_MESSAGES[loadingMsg]}</p>
          <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Toto může trvat 20–40 sekund</p>
          <div className="mt-4 flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: "#2563eb", animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="rounded-2xl border p-4 text-sm flex items-center gap-2" style={{ background: "#fff1f2", borderColor: "#fecdd3", color: "#be123c" }}>
          <IconWarning cls="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Run meta ── */}
      {runMeta && !loading && (
        <div
          className="rounded-xl px-5 py-3 flex flex-wrap gap-4 text-xs"
          style={{ background: "white", border: "1px solid #e8edf4" }}
        >
          <span className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
            <IconCheck cls="w-3.5 h-3.5 text-green-500" /> Zdroje: <strong style={{ color: "#0d1b2a" }}>{runMeta.sources_checked?.join(", ")}</strong>
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
            <IconGlobe cls="w-3.5 h-3.5" /> Nalezeno: <strong style={{ color: "#0d1b2a" }}>{runMeta.total_found}</strong>
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
            <IconTarget cls="w-3.5 h-3.5" /> Zobrazeno: <strong style={{ color: "#0d1b2a" }}>{runMeta.filtered_to}</strong>
          </span>
          {runMeta.sources_failed?.length > 0 && (
            <span className="flex items-center gap-1.5" style={{ color: "#d97706" }}>
              <IconWarning cls="w-3.5 h-3.5" /> Chyba: {runMeta.sources_failed.join(", ")}
            </span>
          )}
        </div>
      )}

      {/* ── Results ── */}
      {jobs.length > 0 && !loading && (
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="hidden lg:block w-60 shrink-0">
            <FiltersPanel filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-3 flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>{filtered.length} z {jobs.length} pozic</p>
              <button
                onClick={() => setShowFilters(v => !v)}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border font-semibold transition-colors"
                style={{ borderColor: "#e3e8f0", color: "#5b6577" }}
              >
                <IconSliders cls="w-3.5 h-3.5" /> Filtry
              </button>
            </div>
            {showFilters && <div className="lg:hidden mb-4"><FiltersPanel filters={filters} onChange={setFilters} /></div>}
            <div className="hidden lg:flex mb-3 items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>{filtered.length} z {jobs.length} pozic</p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14" style={{ color: "#9ca3af" }}>
                <div className="flex justify-center mb-3"><IconSearch cls="w-10 h-10" /></div>
                <p className="font-semibold text-sm">Žádné výsledky neodpovídají filtrům.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((job, i) => (
                  <DiscoveryJobCard key={job.url || i} job={job} onOpen={setSelectedJob} onSave={handleSave} onGenerateEmail={handleGenerateEmail} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {jobs.length === 0 && !loading && !error && (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg,#eff6ff,#e0f2fe)" }}
          >
            <IconSearch cls="w-8 h-8 text-blue-400" />
          </div>
          <p className="font-extrabold text-xl" style={{ color: "#0d1b2a" }}>Agent čeká na spuštění</p>
          <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>Klikni na "Najít pozice" a agent prohledá 8 zdrojů za tebe.</p>
        </div>
      )}

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onGenerateEmail={handleGenerateEmail} />
      )}
    </div>
  );
}