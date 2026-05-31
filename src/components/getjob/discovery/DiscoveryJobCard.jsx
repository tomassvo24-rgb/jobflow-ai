import React from "react";
import MatchScoreBadge from "./MatchScoreBadge";

const SOURCE_COLORS = {
  "jobs.cz": "bg-blue-50 text-blue-600",
  "juristic.cz": "bg-purple-50 text-purple-600",
  "pracevpravu.cz": "bg-orange-50 text-orange-600",
  "rsj": "bg-red-50 text-red-600",
  "čnb": "bg-green-50 text-green-600",
};

export default function DiscoveryJobCard({ job, onOpen, onSave, onGenerateEmail }) {
  const srcColor = SOURCE_COLORS[job.source?.toLowerCase()] || "bg-muted text-muted-foreground";
  const initials = job.company?.slice(0, 2).toUpperCase() || "??";

  return (
    <div
      className="bg-white border border-border rounded-2xl p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
      onClick={() => onOpen(job)}
    >
      <div className="flex gap-3 items-start">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
          {initials}
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              {job.title}
            </h3>
            <MatchScoreBadge score={job.match_score} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              📍 {job.location || "Neuvedeno"}
            </span>
            {job.posted_date && (
              <span className="text-xs text-muted-foreground">· {job.posted_date}</span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${srcColor}`}>
              {job.source}
            </span>
          </div>

          {job.snippet && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {job.snippet}
            </p>
          )}

          {job.match_reasons?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.match_reasons.slice(0, 2).map((r, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full">
                  ✓ {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-border" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onGenerateEmail(job)}
          className="flex-1 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          ✉️ Generovat email
        </button>
        <button
          onClick={() => onSave(job)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            job.saved
              ? "bg-green-50 border-green-300 text-green-700"
              : "border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          {job.saved ? "✓ Uloženo" : "🔖 Uložit"}
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
        >
          🔗
        </a>
      </div>
    </div>
  );
}