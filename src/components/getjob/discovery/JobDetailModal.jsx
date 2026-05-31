import React from "react";
import { IconMail, IconExtLink, IconClose, IconCheck } from "../Icons";

function ScoreBar({ label, pts = 0, max }) {
  const pct = Math.round((pts / max) * 100);
  const color = pct >= 75 ? "#059669" : pct >= 40 ? "#d97706" : "#9ca3af";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "#5b6577" }}>{label}</span>
        <span className="font-bold" style={{ color: "#0d1b2a" }}>{pts}/{max}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "#f0f4f8" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg,#2563eb,${color})` }}
        />
      </div>
    </div>
  );
}

export default function JobDetailModal({ job, onClose, onGenerateEmail }) {
  if (!job) return null;
  const bd = job.match_breakdown || {};
  const score = job.match_score || 0;
  const scoreColor = score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#6b7280";
  const scoreBg   = score >= 75 ? "#ecfdf5" : score >= 50 ? "#fffbeb" : "#f3f4f6";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" style={{ backdropFilter: "blur(6px)" }} />
      <div
        className="relative w-full md:max-w-xl md:rounded-3xl rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col"
        style={{ background: "white", boxShadow: "0 40px 80px -20px rgba(13,27,42,0.35)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-start justify-between gap-4 shrink-0"
          style={{ background: "linear-gradient(135deg,#0d1b2a,#1e3a5f)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="font-extrabold text-lg text-white leading-snug">{job.title}</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>{job.company} · {job.location}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1 rounded-full text-sm font-extrabold" style={{ background: scoreBg, color: scoreColor }}>
              {score}%
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.6)" }}
            >
              <IconClose cls="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="rounded-2xl p-5" style={{ background: "#f6f8fb", border: "1px solid #e8edf4" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Analýza shody</p>
            <div className="space-y-3">
              <ScoreBar label="Obor & dovednosti" pts={bd.field}    max={40} />
              <ScoreBar label="Úroveň zkušeností" pts={bd.level}   max={25} />
              <ScoreBar label="Lokalita"           pts={bd.location} max={20} />
              <ScoreBar label="Čerstvost"          pts={bd.recency}  max={15} />
            </div>
            {job.match_reasons?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {job.match_reasons.map((r, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <IconCheck cls="w-3 h-3" /> {r}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            {job.snippet && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9ca3af" }}>Popis</p>
                <p className="leading-relaxed" style={{ color: "#0d1b2a" }}>{job.snippet}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9ca3af" }}>Zdroj</p>
                <p className="font-semibold" style={{ color: "#0d1b2a" }}>{job.source}</p>
              </div>
              {job.posted_date && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9ca3af" }}>Zveřejněno</p>
                  <p className="font-semibold" style={{ color: "#0d1b2a" }}>{job.posted_date}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="px-6 py-4 flex gap-3 shrink-0" style={{ borderTop: "1px solid #e8edf4" }}>
          <button
            onClick={() => onGenerateEmail(job)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", boxShadow: "0 8px 24px -8px rgba(37,99,235,0.40)" }}
          >
            <IconMail cls="w-4 h-4" /> Generovat přihlášku
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-bold text-center transition-colors"
            style={{ borderColor: "#e3e8f0", color: "#0d1b2a" }}
          >
            <IconExtLink cls="w-4 h-4" /> Otevřít inzerát
          </a>
        </div>
      </div>
    </div>
  );
}