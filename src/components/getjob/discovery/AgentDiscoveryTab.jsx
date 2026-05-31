import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DiscoveryJobCard from "./DiscoveryJobCard";
import FiltersPanel from "./FiltersPanel";
import JobDetailModal from "./JobDetailModal";

const LOADING_MESSAGES = [
  "Agent prohledává jobs.cz...",
  "Procházím juristic.cz...",
  "Kontroluji pracevpravu.cz...",
  "Prohledávám firemní kariérní stránky...",
  "Vyhodnocuji shodu s vaším profilem...",
  "Řadím výsledky...",
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

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsg(p => (p + 1) % LOADING_MESSAGES.length);
    }, 3500);
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

  const handleSave = (job) => {
    setJobs(prev => prev.map(j => j.url === job.url ? { ...j, saved: !j.saved } : j));
  };

  const handleGenerateEmail = (job) => {
    setSelectedJob(null);
    onOpenGenerator?.(job, "mail");
  };

  // Apply filters
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
      {/* Header */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg">🤖 Job Discovery Agent</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Prohledá 5+ zdrojů a vrátí pozice seřazené podle shody s vaším profilem.
            </p>
          </div>
          <button
            onClick={runDiscovery}
            disabled={loading}
            className="shrink-0 px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Probíhá hledání..." : "🔍 Najít pozice"}
          </button>
        </div>

        {/* Profile summary */}
        {profile.field && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">📋 {profile.field}</span>
            {profile.city && <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">📍 {profile.city}</span>}
            {profile.level && <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">🎓 {profile.level}</span>}
            {profile.ttype && <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full">⏱ {profile.ttype}</span>}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
          <div className="text-3xl mb-3 animate-pulse-slow">🤖</div>
          <p className="font-semibold text-brand-blue">{LOADING_MESSAGES[loadingMsg]}</p>
          <p className="text-xs text-muted-foreground mt-1">Toto může trvat 20–30 sekund</p>
          <div className="mt-4 flex justify-center gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          ⚠️ {error}
        </div>
      )}

      {/* Run meta */}
      {runMeta && !loading && (
        <div className="rounded-xl bg-muted border border-border px-4 py-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>✅ Zdroje: <strong className="text-foreground">{runMeta.sources_checked?.join(", ")}</strong></span>
          <span>📄 Nalezeno: <strong className="text-foreground">{runMeta.total_found}</strong></span>
          <span>🎯 Zobrazeno: <strong className="text-foreground">{runMeta.filtered_to}</strong></span>
          {runMeta.sources_failed?.length > 0 && (
            <span className="text-yellow-600">⚠️ Chyba: {runMeta.sources_failed.join(", ")}</span>
          )}
        </div>
      )}

      {/* Results */}
      {jobs.length > 0 && !loading && (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Filters — desktop sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <FiltersPanel filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filtered.length} z {jobs.length} pozic</p>
              <button
                onClick={() => setShowFilters(v => !v)}
                className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                🎛 Filtry
              </button>
            </div>
            {showFilters && (
              <div className="lg:hidden mb-4">
                <FiltersPanel filters={filters} onChange={setFilters} />
              </div>
            )}

            <div className="hidden lg:flex mb-3 items-center justify-between">
              <p className="text-sm text-muted-foreground">{filtered.length} z {jobs.length} pozic</p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Žádné výsledky neodpovídají filtrům. Zkuste resetovat filtry.
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((job, i) => (
                  <DiscoveryJobCard
                    key={job.url || i}
                    job={job}
                    onOpen={setSelectedJob}
                    onSave={handleSave}
                    onGenerateEmail={handleGenerateEmail}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 && !loading && !error && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-base mb-2">Agent čeká na spuštění</p>
          <p className="text-sm">Klikni na "Najít pozice" a agent prohledá dostupné zdroje.</p>
        </div>
      )}

      {/* Job Detail Modal */}
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