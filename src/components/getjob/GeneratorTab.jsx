import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconFile, IconSparkle, IconRefresh, IconSend, IconCopy, IconCheck, IconLightbulb, IconBook } from "./Icons";

export default function GeneratorTab({ profile, allCompanies, tracker, onTrackerSave, preset, onPresetConsumed }) {
  const [genType, setGenType] = useState("mail");
  const [selectedId, setSelectedId] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualPos, setManualPos] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [curCompany, setCurCompany] = useState(null);
  const [curDoc, setCurDoc] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (preset) {
      setSelectedId(preset.id);
      setManualName(""); setManualPos("");
      if (preset.genType) setGenType(preset.genType);
      generateEmail(preset);
      onPresetConsumed();
    }
  }, [preset]);

  const getCompany = () => {
    if (selectedId) return allCompanies.find(c => c.id === selectedId);
    if (manualName.trim() && manualPos.trim()) return { id: "tmp_" + Date.now(), name: manualName.trim(), position: manualPos.trim(), email: "", url: "", match: "mid", type: "", matchReason: "", hours: "", src: "custom" };
    return null;
  };

  const generateEmail = async (company) => {
    const c = company || getCompany();
    if (!c) return;
    setCurCompany(c); setCurDoc(null); setLoading(true);
    const isMail = genType === "mail";

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `${isMail ? `Write concise job application EMAIL (max 110 words body).` : `Write professional COVER LETTER (3-4 paragraphs, 280-350 words).`}
Applicant: ${profile.name}, ${profile.email}, ${profile.phone || ""}, ${profile.city || ""}
Field: ${profile.field}, Level: ${profile.level}, Skills: ${profile.skills || ""}, Languages: ${profile.langs || ""}
Company: ${c.name}, Position: ${c.position}, Type: ${c.type || ""}, Match reason: ${c.matchReason || ""}
Note: ${note || "none"}
Rules: Czech for Czech companies, English for international. First line: SUBJECT: [subject]. Then blank line. Then body only. No markdown.`,
    });

    const text = (result || "").trim();
    const sm = text.match(/^SUBJECT:\s*(.+)/m);
    const subject = sm ? sm[1].trim() : (isMail ? `Zájem o pozici – ${c.name}` : `Motivační dopis – ${c.name}`);
    const body = text.replace(/^SUBJECT:\s*.+\n?/, "").trim()
      + `\n\nS pozdravem,\n${profile.name}\n${profile.email}${profile.phone ? " | " + profile.phone : ""}${profile.city ? "\n" + profile.city : ""}`;

    setCurDoc({ subject, body, type: genType, toEmail: c.email || "" });
    setLoading(false);
  };

  const copyDoc = () => {
    if (!curDoc) return;
    navigator.clipboard.writeText((curDoc.type === "mail" ? "Předmět: " : "") + curDoc.subject + "\n\n" + curDoc.body).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    });
  };

  const addToTracker = () => {
    if (!curCompany || tracker.find(t => t.cid === curCompany.id)) return;
    onTrackerSave([...tracker, { id: Date.now(), cid: curCompany.id, name: curCompany.name, pos: curCompany.position, status: "todo", sent: null, notes: "", email: curCompany.email || "", url: curCompany.url || "" }]);
  };

  const openEmailClient = (type) => {
    if (!curDoc) return;
    const su = encodeURIComponent(curDoc.subject), bd = encodeURIComponent(curDoc.body), to = encodeURIComponent(curDoc.toEmail || "");
    const urls = {
      gmail:   `https://mail.google.com/mail/?view=cm&to=${to}&su=${su}&body=${bd}`,
      seznam:  `https://email.seznam.cz/compose?to=${to}&subject=${su}&body=${bd}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${bd}`,
      mail:    `mailto:${curDoc.toEmail || ""}?subject=${su}&body=${bd}`,
    };
    window.open(urls[type], "_blank");
    setShowEmailModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <IconMail cls="w-5 h-5 text-brand-blue" />
          <h2 className="font-poppins text-[22px] font-bold">Generátor dokumentů</h2>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 mb-4">
          {/* Type selector */}
          <div className="flex gap-2 mb-5">
            {[
              { id: "mail",   icon: <IconMail cls="w-5 h-5" />,  title: "Email / Přihláška",  sub: "Krátký, přímý · do 120 slov" },
              { id: "letter", icon: <IconFile cls="w-5 h-5" />,  title: "Motivační dopis",    sub: "Strukturovaný · 3–4 odstavce" },
            ].map(t => (
              <button key={t.id} onClick={() => setGenType(t.id)}
                className={`flex-1 p-3 rounded-xl border text-left transition-all ${genType === t.id ? "border-brand-teal bg-accent" : "border-border bg-white hover:border-brand-teal/50"}`}>
                <div className={`mb-1 ${genType === t.id ? "text-brand-teal" : "text-muted-foreground"}`}>{t.icon}</div>
                <div className={`text-sm font-semibold ${genType === t.id ? "text-brand-teal" : "text-foreground"}`}>{t.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>

          <div className="mb-3">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Vyber firmu z discovery</label>
            <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setManualName(""); setManualPos(""); }}
              className="w-full bg-[#f4f4f0] border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors mb-3">
              <option value="">-- Vyber firmu --</option>
              {allCompanies.map(c => <option key={c.id} value={c.id}>{c.name} – {c.position}</option>)}
            </select>
          </div>

          {!selectedId && (
            <>
              <p className="text-xs text-muted-foreground text-center mb-3">— nebo zadej ručně —</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Název firmy" className="bg-[#f4f4f0] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                <input value={manualPos} onChange={e => setManualPos(e.target.value)} placeholder="Pozice" className="bg-[#f4f4f0] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Poznámka pro AI (volitelné)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Mezinárodní prostředí, M&A, startup..." className="w-full bg-[#f4f4f0] border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => generateEmail(null)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <IconSparkle cls="w-4 h-4" /> Generovat
            </button>
            {curCompany && (
              <button onClick={() => generateEmail(curCompany)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                <IconRefresh cls="w-4 h-4" /> Regenerovat
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-3"><IconPencilAnim /></div>
            <p className="font-semibold">{curCompany ? `Generuji ${genType === "mail" ? "email" : "motivační dopis"} pro ${curCompany.name}...` : "Generuji..."}</p>
            <p className="text-sm text-muted-foreground">AI píše za tebe</p>
          </div>
        )}

        <AnimatePresence>
          {curDoc && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[11px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-3">Výsledek</p>
              <div className="mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${curDoc.type === "mail" ? "bg-accent text-accent-foreground" : "bg-accent/70 text-accent-foreground"}`}>
                  {curDoc.type === "mail" ? <IconMail cls="w-3 h-3" /> : <IconFile cls="w-3 h-3" />}
                  {curDoc.type === "mail" ? "Email" : "Motivační dopis"}
                </span>
              </div>
              <div className="bg-secondary border border-border rounded-xl overflow-hidden mb-4">
                {curDoc.type === "mail" && (
                  <div className="px-4 py-2.5 border-b border-border flex gap-3 items-center">
                    <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase min-w-12">Komu</span>
                    <span className="text-sm">{curDoc.toEmail || "(z webu firmy)"}</span>
                  </div>
                )}
                <div className="px-4 py-2.5 border-b border-border flex gap-3 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase min-w-12">Předmět</span>
                  <span className="text-sm font-medium">{curDoc.subject}</span>
                </div>
                <div className="px-4 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
                  {curDoc.body}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowEmailModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  <IconSend cls="w-4 h-4" /> Poslat emailem
                </button>
                <button onClick={copyDoc} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  {copied ? <IconCheck cls="w-4 h-4" /> : <IconCopy cls="w-4 h-4" />}
                  {copied ? "Zkopírováno!" : "Kopírovat"}
                </button>
                <button onClick={addToTracker} className="px-4 py-2 rounded-full bg-accent text-accent-foreground border border-brand-teal/30 text-sm font-medium hover:bg-accent/80 transition-colors">+ Tracker</button>
              </div>
            </motion.div>
          )}
          {!curDoc && !loading && (
            <div className="text-center py-14 text-muted-foreground">
              <div className="flex justify-center mb-3 opacity-40"><IconMail cls="w-12 h-12" /></div>
              <p className="font-poppins font-bold text-foreground/50 mb-1">Zvol firmu a klikni Generovat</p>
              <p className="text-sm">AI napíše personalizovaný mail nebo motivační dopis</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="font-poppins font-bold text-sm mb-3 flex items-center gap-2">
            <IconLightbulb cls="w-4 h-4 text-brand-teal" /> Tipy na mail
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            {["Personalizuj každý mail — zmíň konkrétní projekt firmy","Předmět emailu musí být jasný a konkrétní","Do 48h po odeslání pošli follow-up","Motivační dopis max. 1 strana A4"].map((t, i) => (
              <div key={i} className="pb-2 border-b border-border last:border-0 flex items-start gap-2">
                <IconCheck cls="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-teal" /> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-accent border border-brand-teal/20 rounded-xl p-4 text-center relative">
          <span className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest text-muted-foreground font-mono uppercase">Partneři</span>
          <div className="flex justify-center mb-2"><IconBook cls="w-8 h-8 text-brand-teal" /></div>
          <div className="font-poppins font-bold text-sm mb-1">Jak uspět u pohovoru</div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">E-book zdarma. 50 nejčastějších otázek a odpovědí.</p>
          <button className="w-full px-4 py-2 rounded-full bg-brand-teal text-white text-xs font-semibold hover:opacity-90 transition-opacity">Stáhnout zdarma</button>
        </div>
      </div>

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowEmailModal(false)}>
          <div className="bg-white rounded-t-2xl w-full max-w-[520px] p-6 pb-10 shadow-2xl">
            <div className="w-9 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="font-poppins text-lg font-bold mb-1">Otevřít v e-mailovém klientu</div>
            <p className="text-sm text-muted-foreground mb-5">Vyber svůj emailový klient — mail se otevře předvyplněný.</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { icon: <IconMail cls="w-6 h-6 text-red-500" />,   name: "Gmail",       sub: "Google Mail",    key: "gmail" },
                { icon: <IconMail cls="w-6 h-6 text-blue-500" />,  name: "Seznam Mail", sub: "seznam.cz",      key: "seznam" },
                { icon: <IconMail cls="w-6 h-6 text-brand-blue" />,name: "Outlook",     sub: "Microsoft",      key: "outlook" },
                { icon: <IconMail cls="w-6 h-6 text-gray-500" />,  name: "Apple Mail",  sub: "Nativní klient", key: "mail" },
              ].map(c => (
                <button key={c.key} onClick={() => openEmailClient(c.key)}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-xl hover:border-brand-teal/50 hover:bg-accent transition-all text-left">
                  {c.icon}
                  <div><div className="text-sm font-semibold">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.sub}</div></div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowEmailModal(false)} className="w-full px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Zavřít</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline animated pencil icon for loading
function IconPencilAnim() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10" style={{ animation: "bounce 1s ease-in-out infinite" }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}