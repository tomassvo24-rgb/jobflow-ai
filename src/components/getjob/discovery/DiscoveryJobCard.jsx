import React from "react";

const SOURCE_STYLE = {
  "jobs.cz":        { bg: "#eff6ff", color: "#2563eb" },
  "juristic.cz":    { bg: "#f5f3ff", color: "#7c3aed" },
  "pracevpravu.cz": { bg: "#fff7ed", color: "#ea580c" },
  "startupjobs.cz": { bg: "#ecfdf5", color: "#059669" },
  "jenprace.cz":    { bg: "#fef9c3", color: "#ca8a04" },
  "volnamista.cz":  { bg: "#fff1f2", color: "#e11d48" },
  "fajnbrigady.cz": { bg: "#f0fdf4", color: "#16a34a" },
  "linkedin":       { bg: "#eff6ff", color: "#0077b5" },
};

function ScorePill({ score }) {
  const color = score >= 75 ? "#059669" : score >= 50 ? "#d97706" : "#6b7280";
  const bg    = score >= 75 ? "#ecfdf5" : score >= 50 ? "#fffbeb" : "#f3f4f6";
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shrink-0"
      style={{ background: bg, color }}
    >
      {score}%
    </span>
  );
}

export default function DiscoveryJobCard({ job, onOpen, onSave, onGenerateEmail }) {
  const src = SOURCE_STYLE[job.source?.toLowerCase()] || { bg: "#f3f4f6", color: "#6b7280" };
  const initials = (job.company || "??").slice(0, 2).toUpperCase();

  return (
    <div
      className="group cursor-pointer rounded-2xl border bg-white transition-all duration-200"
      style={{ borderColor: "#e8edf4", boxShadow: "0 2px 12px 0 rgba(13,27,42,0.04)" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px 0 rgba(37,99,235,0.10)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px 0 rgba(13,27,42,0.04)"; e.currentTarget.style.borderColor = "#e8edf4"; }}
      onClick={() => onOpen(job)}
    >
      <div className="p-5">
        <div className="flex gap-4 items-start">
          {/* Company avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: src.bg, color: src.color }}
          >
            {initials}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3
                className="font-bold text-[15px] leading-snug line-clamp-2 transition-colors"
                style={{ color: "#0d1b2a" }}
              >
                {job.title}
              </h3>
              <ScorePill score={job.match_score} />
            </div>

            <p className="text-sm mt-0.5 font-medium" style={{ color: "#5b6577" }}>{job.company}</p>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
              <span className="text-xs flex items-center gap-1" style={{ color: "#9ca3af" }}>
                📍 {job.location || "Neuvedeno"}
              </span>
              {job.posted_date && (
                <span className="text-xs" style={{ color: "#9ca3af" }}>· {job.posted_date}</span>
              )}
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: src.bg, color: src.color }}
              >
                {job.source}
              </span>
            </div>

            {job.snippet && (
              <p className="text-xs mt-2.5 line-clamp-2 leading-relaxed" style={{ color: "#6b7280" }}>
                {job.snippet}
              </p>
            )}

            {job.match_reasons?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {job.match_reasons.slice(0, 2).map((r, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "#ecfdf5", color: "#059669" }}
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div
        className="flex gap-2 px-5 pb-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => onGenerateEmail(job)}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)" }}
        >
          ✉️ Generovat email
        </button>
        <button
          onClick={() => onSave(job)}
          className="px-3 py-2 rounded-xl border text-xs font-semibold transition-colors"
          style={job.saved
            ? { background: "#ecfdf5", borderColor: "#6ee7b7", color: "#059669" }
            : { background: "transparent", borderColor: "#e3e8f0", color: "#6b7280" }
          }
        >
          {job.saved ? "✓ Uloženo" : "🔖 Uložit"}
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl border text-xs font-semibold transition-colors"
          style={{ borderColor: "#e3e8f0", color: "#6b7280" }}
        >
          ↗
        </a>
      </div>
    </div>
  );
}