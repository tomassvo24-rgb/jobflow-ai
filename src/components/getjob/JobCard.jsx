import React from "react";
import { IconCheck, IconWarning, IconExtLink, IconMail, IconFile, IconPin, IconClock, IconMoney, IconLightbulb } from "./Icons";

const MATCH_BADGE = {
  high: { icon: <IconCheck cls="w-3 h-3" />, label: "Silný", cls: "bg-accent text-accent-foreground" },
  mid:  { icon: null, label: "Dobrý", cls: "bg-amber-50 text-amber-600" },
  low:  { icon: <IconWarning cls="w-3 h-3" />, label: "Slabší", cls: "bg-red-50 text-red-500" },
};

export default function JobCard({ company: c, inTracker, onOpenGenerator, onAddToTracker, onRemoveCustom }) {
  const mb = MATCH_BADGE[c.match] || MATCH_BADGE.mid;

  return (
    <div className="bg-white border border-border rounded-xl p-4 mb-2.5 shadow-sm hover:shadow-md hover:border-border/80 transition-all">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${mb.cls}`}>
          {mb.icon} {mb.label}
        </span>
        {c.src === "custom" && <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-600">vlastní</span>}
      </div>
      <div className="font-poppins text-base font-bold text-foreground">{c.name}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{c.type}</div>
      <div className="text-sm font-semibold mt-1.5">{c.position}</div>
      {c.matchReason && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2 leading-relaxed px-3 py-2 bg-accent rounded-lg border-l-[3px] border-brand-teal/40">
          <IconLightbulb cls="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-teal" /> {c.matchReason}
        </div>
      )}
      <div className="flex flex-wrap gap-3 mt-2">
        {c.hours    && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono"><IconClock cls="w-3 h-3" /> {c.hours}</span>}
        {c.salary   && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono"><IconMoney cls="w-3 h-3" /> {c.salary}</span>}
        {c.location && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono"><IconPin cls="w-3 h-3" /> {c.location}</span>}
        {c.email    && <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono"><IconMail cls="w-3 h-3" /> {c.email}</span>}
      </div>
      {c.benefits?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {c.benefits.slice(0, 3).map(b => (
            <span key={b} className="text-[11px] bg-secondary border border-border px-2 py-0.5 rounded-full text-muted-foreground">{b}</span>
          ))}
        </div>
      )}
      <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-border">
        {c.url && (
          <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
            <IconExtLink cls="w-3 h-3" /> Web
          </a>
        )}
        <button onClick={() => onOpenGenerator(c, "mail")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue text-white text-xs font-medium hover:opacity-90 transition-opacity">
          <IconMail cls="w-3 h-3" /> Mail
        </button>
        <button onClick={() => onOpenGenerator(c, "letter")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground border border-brand-teal/30 text-xs font-medium hover:bg-accent/80 transition-colors">
          <IconFile cls="w-3 h-3" /> Dopis
        </button>
        {!inTracker ? (
          <button onClick={() => onAddToTracker(c)} className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">+ Tracker</button>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-accent-foreground border border-brand-teal/30 text-xs font-medium opacity-60">
            <IconCheck cls="w-3 h-3" /> Tracker
          </span>
        )}
        {c.src === "custom" && (
          <button onClick={() => onRemoveCustom(c.id)} className="px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors ml-auto">✕</button>
        )}
      </div>
    </div>
  );
}