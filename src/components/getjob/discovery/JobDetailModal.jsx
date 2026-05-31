import React from "react";
import MatchScoreBadge from "./MatchScoreBadge";

export default function JobDetailModal({ job, onClose, onGenerateEmail }) {
  if (!job) return null;

  const bd = job.match_breakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-start justify-between rounded-t-3xl">
          <div className="flex-1 pr-4">
            <h2 className="font-bold text-lg leading-snug">{job.title}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors shrink-0">✕</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Match score */}
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Shoda profilu</span>
              <MatchScoreBadge score={job.match_score} />
            </div>
            <div className="space-y-2">
              {[
                { label: "Obor & dovednosti", pts: bd.field, max: 40 },
                { label: "Úroveň zkušeností", pts: bd.level, max: 25 },
                { label: "Lokalita", pts: bd.location, max: 20 },
                { label: "Čerstvost inzerátu", pts: bd.recency, max: 15 },
              ].map(({ label, pts = 0, max }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{pts}/{max}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full transition-all"
                      style={{ width: `${(pts / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {job.match_reasons?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.match_reasons.map((r, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">✓ {r}</span>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            {job.snippet && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Popis</p>
                <p className="text-foreground leading-relaxed">{job.snippet}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Zdroj</p>
                <p className="font-medium">{job.source}</p>
              </div>
              {job.posted_date && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Zveřejněno</p>
                  <p className="font-medium">{job.posted_date}</p>
                </div>
              )}
            </div>
            {job.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onGenerateEmail(job)}
              className="flex-1 py-3 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              ✉️ Generovat přihlášku
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-center hover:bg-muted transition-colors"
            >
              🔗 Otevřít inzerát
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}