import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = [
  { v: "todo", l: "Nezasláno", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  { v: "sent", l: "Zasláno", cls: "bg-blue-50 text-blue-600 border-blue-200" },
  { v: "reply", l: "Odpověď", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  { v: "interview", l: "Pohovor", cls: "bg-purple-50 text-purple-600 border-purple-200" },
  { v: "rejected", l: "Zamítnuto", cls: "bg-red-50 text-red-500 border-red-200" },
  { v: "accepted", l: "Přijato 🎉", cls: "bg-green-50 text-green-600 border-green-200" },
];

const STATS = [
  { l: "Celkem", fn: t => t.length, color: "" },
  { l: "Čeká", fn: t => t.filter(x => x.status === "todo").length, color: "text-muted-foreground" },
  { l: "Zasláno", fn: t => t.filter(x => x.status === "sent").length, color: "text-blue-600" },
  { l: "Pohovor", fn: t => t.filter(x => x.status === "interview").length, color: "text-purple-600" },
  { l: "Přijato", fn: t => t.filter(x => x.status === "accepted").length, color: "text-green-600" },
];

export default function TrackerTab({ tracker, onTrackerSave }) {
  const update = (id, data) => onTrackerSave(tracker.map(t => t.id === id ? { ...t, ...data } : t));
  const remove = (id) => onTrackerSave(tracker.filter(t => t.id !== id));
  const setStatus = (id, status) => update(id, { status, ...(status === "sent" && !tracker.find(t => t.id === id)?.sent ? { sent: new Date().toLocaleDateString("cs-CZ") } : {}) });

  return (
    <div>
      <h2 className="font-playfair text-[22px] font-bold mb-5">Tracker přihlášek 📊</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {STATS.map(s => (
          <div key={s.l} className="bg-white border border-border rounded-xl p-4 text-center shadow-sm">
            <div className={`font-playfair text-2xl font-bold ${s.color}`}>{s.fn(tracker)}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {tracker.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground">
          <div className="text-4xl mb-4 opacity-40">📊</div>
          <p className="font-playfair font-bold text-foreground/60 mb-1">Tracker je prázdný</p>
          <p className="text-sm">Přidej firmy z Discover nebo Generátoru</p>
        </div>
      ) : (
        <AnimatePresence>
          {tracker.map(e => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white border border-border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <div className="font-playfair font-bold text-sm">{e.name}</div>
                  <div className="text-sm text-muted-foreground">{e.pos}</div>
                  {e.sent && <div className="text-[11px] text-muted-foreground font-mono mt-0.5">📅 {e.sent}</div>}
                </div>
                <button onClick={() => remove(e.id)} className="px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors shrink-0">✕</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {STATUSES.map(s => (
                  <button key={s.v} onClick={() => setStatus(e.id, s.v)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-semibold transition-all ${e.status === s.v ? s.cls : "bg-[#f4f4f0] text-muted-foreground border-border hover:border-blue-400 hover:text-blue-500"}`}>
                    {s.l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input value={e.notes || ""} onChange={ev => update(e.id, { notes: ev.target.value })}
                  placeholder="Poznámky, kontakt..."
                  className="flex-1 bg-[#f4f4f0] border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors" />
                {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">🔗</a>}
                {e.email && <a href={`mailto:${e.email}`} className="px-2.5 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">📧</a>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}