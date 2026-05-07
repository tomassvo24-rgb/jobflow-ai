import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function GeneratorTab({ profile, allCompanies, tracker, onTrackerSave, preset, onPresetConsumed }) {
  const [selectedId, setSelectedId] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPos, setManualPos] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [curCompany, setCurCompany] = useState(null);
  const [curMail, setCurMail] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preset) {
      setSelectedId(preset.id);
      setManualName("");
      setManualPos("");
      generateEmail(preset);
      onPresetConsumed();
    }
  }, [preset]);

  const getCompany = () => {
    if (selectedId) return allCompanies.find(c => c.id === selectedId);
    if (manualName.trim() && manualPos.trim()) {
      return { id: "tmp_" + Date.now(), name: manualName.trim(), position: manualPos.trim(), email: "", url: "", match: "mid", type: "", matchReason: "", hours: "", src: "custom" };
    }
    return null;
  };

  const generateEmail = async (company) => {
    const c = company || getCompany();
    if (!c) return;
    setCurCompany(c);
    setCurMail(null);
    setLoading(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional job application email.

Applicant: ${profile.name}, ${profile.email}, ${profile.phone || ""}, ${profile.city || ""}
Field: ${profile.field}, Level: ${profile.level}
Skills: ${profile.skills || ""}
Languages: ${profile.langs || ""}

Company: ${c.name}
Position: ${c.position}
Type: ${c.type || ""}
Why I match: ${c.matchReason || ""}
Note: ${note || "none"}

Rules:
- Max 110 words body
- Write in Czech for Czech companies, English for international ones
- First line must be: SUBJECT: [your subject line]
- Then blank line
- Then email body only
- No signature (will be appended)
- No markdown`,
    });

    const text = (result || "").trim();
    const subjectMatch = text.match(/^SUBJECT:\s*(.+)/m);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Zájem o pozici – ${c.name}`;
    const body = text.replace(/^SUBJECT:\s*.+\n?/, "").trim()
      + `\n\nS pozdravem,\n${profile.name}\n${profile.email}${profile.phone ? " | " + profile.phone : ""}`;

    setCurMail({ subject, body });
    setLoading(false);
  };

  const copyMail = () => {
    if (!curMail) return;
    navigator.clipboard.writeText("Předmět: " + curMail.subject + "\n\n" + curMail.body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const addToTracker = () => {
    if (!curCompany) return;
    if (tracker.find(t => t.cid === curCompany.id)) return;
    onTrackerSave([...tracker, {
      id: Date.now(),
      cid: curCompany.id,
      name: curCompany.name,
      pos: curCompany.position,
      status: "todo",
      sent: null,
      notes: "",
      email: curCompany.email || "",
      url: curCompany.url || "",
    }]);
  };

  return (
    <div>
      <h2 className="font-syne text-xl font-bold mb-5">Generátor mailů ✉️</h2>

      <div className="bg-card border border-border rounded-xl p-5 mb-5">
        <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Vyber firmu nebo zadej vlastní</label>
        <select
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setManualName(""); setManualPos(""); }}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors mb-3"
        >
          <option value="">-- Vyber z discovery --</option>
          {allCompanies.map(c => (
            <option key={c.id} value={c.id}>{c.name} – {c.position}</option>
          ))}
        </select>

        {!selectedId && (
          <>
            <p className="text-xs text-muted-foreground text-center mb-3">— nebo zadej ručně —</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Název firmy" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
              <input value={manualPos} onChange={e => setManualPos(e.target.value)} placeholder="Pozice" className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Poznámka pro AI (volitelné)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Mezinárodní prostředí, startup kultura, M&A zaměření..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => generateEmail(null)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">✨ Generovat mail</button>
          {curCompany && <button onClick={() => generateEmail(curCompany)} className="px-4 py-2 rounded-lg bg-secondary border border-border text-secondary-foreground text-sm font-medium hover:bg-border transition-colors">🔄 Regenerovat</button>}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 animate-pulse-slow">✍️</div>
          <p className="font-semibold">{curCompany ? `Generuji mail pro ${curCompany.name}...` : "Generuji mail..."}</p>
          <p className="text-sm text-muted-foreground">AI píše za tebe</p>
        </div>
      )}

      <AnimatePresence>
        {curMail && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-syne font-bold uppercase tracking-wider text-muted-foreground mb-3">Vygenerovaný mail</p>
            <div className="bg-secondary border border-border rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-2.5 border-b border-border flex gap-2 items-center">
                <span className="text-[11px] font-bold text-muted-foreground font-mono min-w-16">Komu:</span>
                <span className="text-sm text-foreground">{curCompany?.email || "(z webu firmy)"}</span>
              </div>
              <div className="px-4 py-2.5 border-b border-border flex gap-2 items-center">
                <span className="text-[11px] font-bold text-muted-foreground font-mono min-w-16">Předmět:</span>
                <span className="text-sm font-medium text-foreground">{curMail.subject}</span>
              </div>
              <div className="px-4 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono max-h-72 overflow-y-auto">
                {curMail.body}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={copyMail} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                {copied ? "✓ Zkopírováno!" : "📋 Kopírovat"}
              </button>
              <button onClick={addToTracker} className="px-4 py-2 rounded-lg bg-accent text-accent-foreground border border-primary/20 text-sm font-medium hover:opacity-80 transition-opacity">
                + Tracker
              </button>
            </div>
          </motion.div>
        )}

        {!curMail && !loading && (
          <div className="text-center py-14 text-muted-foreground">
            <div className="text-4xl mb-3 opacity-40">✉️</div>
            <p className="font-syne font-bold text-foreground/50 mb-1">Zvol firmu a klikni Generovat</p>
            <p className="text-sm">AI napíše personalizovaný mail přesně pro tebe</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}