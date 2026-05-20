import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";
import IndustryPicker from "./IndustryPicker";

const POSITION_TYPES = ["Stáž / Internship", "Part-time", "Zkrácený úvazek", "Fulltime junior", "Remote", "Trainee program"];
const LEVELS = ["Střední škola", "Bakalář (1.–3. r.)", "Magistr (1.–2. r.)", "Absolvent VŠ", "Junior (1–3 roky)", "Mid (3–6 let)", "Senior (6+ let)"];

function Chip({ label, selected, onToggle }) {
  return (
    <button onClick={onToggle}
      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer select-none ${selected ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-border text-muted-foreground hover:border-blue-400 hover:text-blue-500"}`}>
      {label}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", field: "", level: "", skills: "", langs: "", types: ["Stáž / Internship"], industries: [], extra: "" });
  const [cvLoading, setCvLoading] = useState(false);
  const [cvDone, setCvDone] = useState(false);
  const [cvError, setCvError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCvUpload = async (file) => {
    if (!file) return;
    setCvLoading(true); setCvError(""); setCvDone(false);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            field: { type: "string" }, level: { type: "string" },
            skills: { type: "string" }, langs: { type: "string" },
            name: { type: "string" }, email: { type: "string" },
            phone: { type: "string" }, city: { type: "string" },
          },
        },
      });
      if (result.status === "success" && result.output) {
        const d = result.output;
        setForm(f => ({
          ...f,
          field: d.field || f.field, level: d.level || f.level,
          skills: d.skills || f.skills, langs: d.langs || f.langs,
          name: d.name || f.name, email: d.email || f.email,
          phone: d.phone || f.phone, city: d.city || f.city,
        }));
        setCvDone(true);
      } else { setCvError("AI nedokázala zpracovat CV. Zkus jiný soubor."); }
    } catch { setCvError("Chyba při nahrávání. Zkus to znovu."); }
    setCvLoading(false);
  };

  const toggleArr = (key, val) => setForm(f => {
    const arr = f[key];
    return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const validate = (s) => {
    if (s === 0 && (!form.name.trim() || !form.email.trim())) return "Zadej jméno a email";
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) { setError(err); return; }
    setError(""); setStep(s => s + 1);
  };
  const back = () => { setError(""); setStep(s => s - 1); };

  const finish = () => {
    onComplete({
      name: form.name.trim(), email: form.email.trim(),
      phone: form.phone.trim(), city: form.city.trim() || "Praha",
      field: form.field.trim(), level: form.level,
      skills: form.skills.trim(), langs: form.langs.trim(),
      ttype: form.types.join(", ") || "Stáž / Internship",
      tind: form.industries.join(", ") || "vše",
      extra: form.extra.trim(),
    });
  };

  const steps = [
    {
      title: "Vítej na getjob.cz 👋",
      sub: "Nastav profil — AI ti najde relevantní pozice a napíše maily i motivační dopisy přesně pro tebe.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jméno" value={form.name} onChange={v => set("name", v)} placeholder="Jan Novák" />
            <EmailField label="Email" value={form.email} onChange={v => set("email", v)} />
            <PhoneField label="Telefon (volitelné)" value={form.phone} onChange={v => set("phone", v)} />
            <Field label="Město" value={form.city} onChange={v => set("city", v)} placeholder="Praha" />
          </div>
        </div>
      ),
    },
    {
      title: "Nahraj své CV 📄",
      sub: "AI z CV automaticky vytáhne tvůj obor, zkušenosti, dovednosti i jazyky.",
      content: (
        <div className="space-y-4">
          {!cvDone && !cvLoading && (
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all bg-secondary">
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                onChange={e => handleCvUpload(e.target.files?.[0])} />
              <div className="text-4xl mb-3">📎</div>
              <p className="font-semibold mb-1">Přetáhni CV sem nebo klikni pro výběr</p>
              <p className="text-sm text-muted-foreground">PDF, TXT, DOC · Max 5 MB</p>
            </div>
          )}
          {cvLoading && (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary">
              <div className="text-4xl mb-3 animate-spin inline-block">⚙️</div>
              <p className="font-semibold">AI zpracovává CV...</p>
              <p className="text-sm text-muted-foreground mt-1">Extrahuji tvůj profil</p>
            </div>
          )}
          {cvDone && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-green-500 bg-green-50 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-bold text-green-700 mb-1">CV zpracováno!</p>
                <p className="text-sm text-muted-foreground mb-3">AI vyplnila tvůj profil. Klikni pro nahrání jiného CV.</p>
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" id="cv2"
                  onChange={e => handleCvUpload(e.target.files?.[0])} />
                <button onClick={() => document.getElementById("cv2").click()}
                  className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  📎 Nahrát jiné CV
                </button>
              </div>
              <div className="bg-secondary border border-border rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Vytaženo z CV</p>
                {form.field && <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-20 shrink-0">Obor:</span><span className="font-medium">{form.field}</span></div>}
                {form.level && <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-20 shrink-0">Úroveň:</span><span className="font-medium">{form.level}</span></div>}
                {form.langs && <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-20 shrink-0">Jazyky:</span><span className="font-medium">{form.langs}</span></div>}
                {form.skills && <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-20 shrink-0">Dovednosti:</span><span className="font-medium line-clamp-2">{form.skills}</span></div>}
              </div>
              <button onClick={() => setShowManual(v => !v)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ▶ ✏️ Upravit ručně
              </button>
              {showManual && (
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Obor" value={form.field} onChange={v => set("field", v)} placeholder="Právo, IT, Marketing..." />
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Úroveň</label>
                      <select value={form.level} onChange={e => set("level", e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors">
                        <option value="">Vyber...</option>
                        {LEVELS.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dovednosti</label>
                    <textarea value={form.skills} onChange={e => set("skills", e.target.value)} rows={2}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                  </div>
                  <Field label="Jazyky" value={form.langs} onChange={v => set("langs", v)} placeholder="Čeština (rodilý), Angličtina B2..." />
                </div>
              )}
            </div>
          )}
          {cvError && <p className="text-sm text-destructive font-medium">{cvError}</p>}
          {!cvDone && !cvLoading && (
            <p className="text-xs text-center text-muted-foreground">
              Nemáš CV po ruce?{" "}
              <button type="button" onClick={() => { setCvDone(true); }}
                className="text-blue-600 underline hover:no-underline">Přeskočit →</button>
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Co hledáš? 🎯",
      sub: "Upřesni typ pozice — AI přizpůsobí výsledky.",
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Typ pozice</label>
            <div className="flex flex-wrap gap-2">
              {POSITION_TYPES.map(t => <Chip key={t} label={t} selected={form.types.includes(t)} onToggle={() => toggleArr("types", t)} />)}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Odvětví <span className="font-normal normal-case tracking-normal text-muted-foreground">(volitelné)</span>
              {form.industries.length > 0 && <span className="ml-2 text-blue-600">{form.industries.length} vybráno</span>}
            </label>
            <IndustryPicker selected={form.industries} onSubsChange={v => set("industries", v)} />
          </div>
          <Field label="Cokoli dalšího pro AI (volitelné)" value={form.extra} onChange={v => set("extra", v)} placeholder="Mezinárodní prostředí, korporátní právo, Python..." />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <nav className="bg-navy border-b border-navy px-7 h-14 flex items-center">
        <LogoFull />
      </nav>
      <div className="flex-1 flex flex-col items-center px-5 pt-9 pb-16">
        <div className="w-full max-w-[600px] flex gap-1.5 mb-7">
          {steps.map((_, i) => (
            <div key={i} className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-brand-teal" : i === step ? "bg-brand-blue" : "bg-border"}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
            className="bg-white border border-border rounded-2xl p-9 w-full max-w-[600px] shadow-xl">
            <h2 className="font-poppins text-2xl font-bold mb-2">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{steps[step].sub}</p>
            {steps[step].content}
            {error && <p className="text-sm text-destructive mt-4 font-medium">{error}</p>}
            <div className="flex gap-2.5 justify-end mt-7">
              {step > 0 && <button onClick={back} className="px-4 py-2 rounded-full border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-border transition-colors">← Zpět</button>}
              {step < steps.length - 1 ? (
                <button onClick={next} className="px-6 py-2.5 rounded-full bg-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity">Pokračovat →</button>
              ) : (
                <button onClick={finish} className="px-6 py-2.5 rounded-full bg-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity">🚀 Spustit getjob.cz</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors" />
    </div>
  );
}

export function LogoFull({ small }) {
  return (
    <div className={`flex items-center ${small ? "gap-2" : "gap-3"}`}>
      {/* GJ icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-navy flex-shrink-0 ${small ? "w-7 h-7" : "w-9 h-9"}`}>
        <span className={`font-poppins font-extrabold text-white leading-none ${small ? "text-[13px]" : "text-[16px]"}`}>GJ</span>
        {/* smile arc */}
        <svg className="absolute bottom-1 left-1/2 -translate-x-1/2" width={small ? 12 : 16} height={small ? 5 : 6} viewBox="0 0 16 6" fill="none">
          <path d="M1 1 Q8 7 15 1" stroke="#14BBA6" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      {/* wordmark */}
      <div className={`font-poppins font-extrabold leading-none tracking-tight ${small ? "text-[17px]" : "text-[22px]"}`}>
        <span style={{ color: "#0D1B2A" }}>Get</span><span style={{ color: "#2563EB" }}>Job</span><span className="text-muted-foreground font-semibold" style={{ fontSize: small ? "12px" : "15px" }}>.cz</span>
      </div>
    </div>
  );
}