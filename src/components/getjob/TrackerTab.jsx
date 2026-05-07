import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = [
  { v: "todo", l: "Nezasláno", cls: "bg-secondary text-secondary-foreground border border-border" },
  { v: "sent", l: "Zasláno", cls: "bg-blue-light text-blue-brand border border-blue-brand/30" },
  { v: "reply", l: "Odpověď", cls: "bg-gold-light text-gold border border-gold/30" },
  { v: "interview", l: "Pohovor", cls: "bg-purple-light text-purple-brand border border-purple-brand/30" },
  { v: "rejected", l: "Zamítnuto", cls: "bg-red-50 text-red-600 border border-red-200" },
  { v: "accepted", l: "Přijato 🎉", cls: "bg-green-light text-accent-foreground border border-primary/20" },
];

const STATS = [
  { l: "Celkem", filter: () => true, color: "" },
  { l: "Čeká", filter: t => t.status === "todo", color: "text-muted-foreground" },
  { l: "Zasláno", filter: t => t.status === "sent", color: "text-blue-brand" },
  { l: "Pohovor", filter: t => t.status === "interview", color: "text-purple-brand" },
  { l: "Přijato", filter: t => t.status === "accepted", color: "text-primary" },
];

export default function TrackerTab({ tracker, onTrackerSave }) {
  const updateStatus = (id, status) => {
    onTrackerSave(tracker.map(t => {
      if (t.id !== id) return t;
      return { ...t, status, sent: status === "sent" && !t.sent ? new Date().toLocaleDateString("cs-CZ") : t.sent };
    }));
  };

  const updateNotes = (id, notes) => {
    onTrackerSave(tracker.map(t => t.id === id ? { ...t, notes } : t));
  };

  const remove = (id) => {
    onTrackerSave(tracker.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2 className="font-syne text-xl font-bold mb-5">Tracker přihlášek 📊</h2>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {STATS.map(s => (
          <div key={s.l} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className={`font-syne text-2xl font-black leading-none ${s.color}`}>
              {tracker.filter(s.filter).length}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {tracker.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <div className="text-4xl mb-3 opacity-40">📊</div>
          <p className="font-syne font-bold text-foreground/50 mb-1">Tracker je prázdný</p>
          <p className="text-sm">Přidej firmy z Discover nebo Generátoru</p>
        </div>
      ) : (
        <AnimatePresence>
          {tracker.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-4 mb-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-syne font-bold text-base">{entry.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{entry.pos}</p>
                  {entry.sent && <p className="text-[11px] text-muted-foreground font-mono mt-0.5">Zasláno: {entry.sent}</p>}
                </div>
                <button onClick={() => remove(entry.id)} className="px-2 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors shrink-0">✕</button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {STATUSES.map(s => (
                  <button
                    key={s.v}
                    onClick={() => updateStatus(entry.id, s.v)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      entry.status === s.v ? s.cls : "bg-secondary text-muted-foreground border border-border hover:border-border/80"
                    }`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <input
                  value={entry.notes || ""}
                  onChange={e => updateNotes(entry.id, e.target.value)}
                  placeholder="Poznámky, kontakt, termín..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                {entry.url && (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">🔗</a>
                )}
                {entry.email && (
                  <a href={`mailto:${entry.email}`} className="px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">📧</a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}