import React from "react";

const MATCH_BADGE = {
  high: { label: "✓ Silný", cls: "bg-green-light text-accent-foreground border border-primary/20" },
  mid: { label: "~ Dobrý", cls: "bg-gold-light text-gold border border-gold/30" },
  low: { label: "⚠ Slabší", cls: "bg-red-50 text-red-600 border border-red-200" },
};

export default function JobCard({ company: c, inTracker, onOpenGenerator, onAddToTracker, onRemoveCustom }) {
  const mb = MATCH_BADGE[c.match] || MATCH_BADGE.mid;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-2.5 shadow-sm hover:border-border/80 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-syne text-base font-bold">{c.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${mb.cls}`}>{mb.label}</span>
            {c.src === "custom" && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">vlastní</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{c.type}</p>
          <p className="text-sm font-semibold mt-1.5">{c.position}</p>
          {c.matchReason && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">💡 {c.matchReason}</p>}
          <div className="flex flex-wrap gap-3 mt-2">
            {c.hours && <span className="text-[11px] text-muted-foreground font-mono">⏱ {c.hours}</span>}
            {c.email && <span className="text-[11px] text-muted-foreground font-mono">📧 {c.email}</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-border">
        {c.url && (
          <a href={c.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
            🔗 Web
          </a>
        )}
        <button onClick={() => onOpenGenerator(c)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
          ✉️ Mail
        </button>
        {!inTracker ? (
          <button onClick={() => onAddToTracker(c)} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground border border-primary/20 text-xs font-medium hover:opacity-80 transition-opacity">
            + Tracker
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground border border-primary/20 text-xs font-medium opacity-50">✓ V trackeru</span>
        )}
        {c.src === "custom" && (
          <button onClick={() => onRemoveCustom(c.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors ml-auto">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}