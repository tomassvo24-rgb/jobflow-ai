import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChart, IconCalendar, IconMail, IconExtLink } from "./Icons";

const STATUSES = [
  { v: "todo",      l: "Nezasláno", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  { v: "sent",      l: "Zasláno",   cls: "bg-accent text-accent-foreground border-brand-teal/30" },
  { v: "reply",     l: "Odpověď",   cls: "bg-amber-50 text-amber-600 border-amber-200" },
  { v: "interview", l: "Pohovor",   cls: "bg-purple-50 text-purple-600 border-purple-200" },
  { v: "rejected",  l: "Zamítnuto", cls: "bg-red-50 text-red-500 border-red-200" },
  { v: "accepted",  l: "Přijato",   cls: "bg-green-50 text-green-600 border-green-200" },
];

const STATS = [
  { l: "Celkem",  fn: t => t.length,                                     color: "" },
  { l: "Čeká",   fn: t => t.filter(x => x.status === "todo").length,     color: "text-muted-foreground" },
  { l: "Zasláno",fn: t => t.filter(x => x.status === "sent").length,     color: "text-brand-teal" },
  { l: "Pohovor",fn: t => t.filter(x => x.status === "interview").length,color: "text-purple-600" },
  { l: "Přijato",fn: t => t.filter(x => x.status === "accepted").length, color: "text-green-600" },
];

export default function TrackerTab({ tracker, onTrackerSave }) {
  const update   = (id, data) => onTrackerSave(tracker.map(t => t.id === id ? { ...t, ...data } : t));
  const remove   = (id) => onTrackerSave(tracker.filter(t => t.id !== id));
  const setStatus = (id, status) => update(id, { status, ...(status === "sent" && !tracker.find(t => t.id === id)?.sent ? { sent: new Date().toLocaleDateString("cs-CZ") } : {}) });

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <IconChart cls="w-5 h-5 text-brand-blue" />
        <h2 className="font-poppins text-[22px] font-bold">Tracker přihlášek</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {STATS.map(s => (
          <div key={s.l} className="bg-white border border-border rounded-xl p-4 text-center shadow-sm">
            <div className={`font-poppins text-2xl font-bold ${s.color}`}>{s.fn(tracker)}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {tracker.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <div className="flex justify-center mb-4 opacity-40"><IconChart cls="w-12 h-12" /></div>
          <p className="font-poppins font-bold text-foreground/60 mb-1">Tracker je prázdný</p>
          <p className="text-sm">Přidej firmy z Discover nebo Generátoru</p>
        </div>
      ) : (
        <AnimatePresence>
          {tracker.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white border border-border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <div className="font-poppins font-bold text-sm">{e.name}</div>
                  <div className="text-sm text-muted-foreground">{e.pos}</div>
                  {e.sent && (
                    <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono mt-0.5">
                      <IconCalendar cls="w-3 h-3" /> {e.sent}
                    </div>
                  )}
                </div>
                <button onClick={() => remove(e.id)} className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors shrink-0">✕</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {STATUSES.map(s => (
                  <button key={s.v} onClick={() => setStatus(e.id, s.v)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-semibold transition-all ${e.status === s.v ? s.cls : "bg-secondary text-muted-foreground border-border hover:border-brand-teal/60 hover:text-brand-teal"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input value={e.notes || ""} onChange={ev => update(e.id, { notes: ev.target.value })}
                  placeholder="Poznámky, kontakt..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-teal transition-colors" />
                {e.url && (
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">
                    <IconExtLink cls="w-3.5 h-3.5" />
                  </a>
                )}
                {e.email && (
                  <a href={`mailto:${e.email}`} className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">
                    <IconMail cls="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}