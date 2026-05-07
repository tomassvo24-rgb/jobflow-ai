import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const POSITION_TYPES = ["Stáž / Internship", "Part-time", "Zkrácený úvazek", "Fulltime junior", "Remote", "Trainee program"];
const INDUSTRIES = ["Finance & Banking", "Právo & Advokacie", "IT & Tech", "Marketing & PR", "Consulting", "Startup / VC", "E-commerce", "HR & Recruitment", "Design & UX", "Účetnictví & Daně"];
const LEVELS = ["Střední škola", "Bakalář (1.–3. r.)", "Magistr (1.–2. r.)", "Absolvent VŠ", "Junior (1–3 roky)", "Mid (3–6 let)", "Senior (6+ let)"];

function Chip({ label, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer select-none ${
        selected
          ? "bg-accent border-primary text-accent-foreground"
          : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    field: "", level: "", skills: "", langs: "",
    types: [], industries: [], extra: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleArr = (key, val) => {
    setForm(f => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const validate = (s) => {
    if (s === 0 && (!form.name.trim() || !form.email.trim())) return "Zadej jméno a email";
    if (s === 1 && !form.field.trim()) return "Zadej svůj obor";
    return null;
  };

  const [error, setError] = useState("");

  const next = () => {
    const err = validate(step);
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
  };
  const back = () => { setError(""); setStep(s => s - 1); };

  const finish = () => {
    const err = validate(1);
    if (err) { setError(err); return; }
    onComplete({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || "Praha",
      field: form.field.trim(),
      level: form.level,
      skills: form.skills.trim(),
      langs: form.langs.trim(),
      ttype: form.types.join(", ") || "Stáž / Internship",
      tind: form.industries.join(", ") || "vše",
      extra: form.extra.trim(),
    });
  };

  const steps = [
    {
      title: "Vítej na getjob.cz 👋",
      sub: "Nastav profil — AI ti najde relevantní pozice a napíše maily na míru.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jméno" value={form.name} onChange={v => set("name", v)} placeholder="Jan Novák" />
            <Field label="Email" value={form.email} onChange={v => set("email", v)} placeholder="jan@email.cz" />
            <Field label="Telefon (volitelné)" value={form.phone} onChange={v => set("phone", v)} placeholder="+420 123 456 789" />
            <Field label="Město" value={form.city} onChange={v => set("city", v)} placeholder="Praha" />
          </div>
        </div>
      ),
    },
    {
      title: "Vzdělání & zkušenosti",
      sub: "Čím více toho o sobě řekneš, tím přesnější výsledky.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Obor / zaměření" value={form.field} onChange={v => set("field", v)} placeholder="Právo, IT, Marketing..." />
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Úroveň</label>
              <select value={form.level} onChange={e => set("level", e.target.value)} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                <option value="">Vyber...</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dovednosti & zkušenosti</label>
            <textarea value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="Co umíš, projekty, certifikáty, úspěchy..." rows={4} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed" />
          </div>
          <Field label="Jazyky" value={form.langs} onChange={v => set("langs", v)} placeholder="Čeština (rodilý), Angličtina B2..." />
        </div>
      ),
    },
    {
      title: "Co hledáš?",
      sub: "Upřesni typ pozice — AI přizpůsobí výsledky.",
      content: (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Typ pozice</label>
            <div className="flex flex-wrap gap-2">
              {POSITION_TYPES.map(t => (
                <Chip key={t} label={t} selected={form.types.includes(t)} onToggle={() => toggleArr("types", t)} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Odvětví (volitelné)</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(i => (
                <Chip key={i} label={i} selected={form.industries.includes(i)} onToggle={() => toggleArr("industries", i)} />
              ))}
            </div>
          </div>
          <Field label="Cokoli dalšího pro AI (volitelné)" value={form.extra} onChange={v => set("extra", v)} placeholder="Mezinárodní prostředí, startup kultura, Python..." />
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-3">
        <span className="font-syne text-xl font-black tracking-tight">getjob<span className="opacity-40 font-normal">.cz</span></span>
        <span className="text-primary-foreground/60 text-sm">Najdi práci s pomocí AI</span>
      </div>

      <div className="flex-1 flex items-start justify-center p-5 pt-10">
        <div className="w-full max-w-lg">
          {/* Progress dots */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-primary/50" : i === step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-lg"
            >
              <h2 className="font-syne text-2xl font-bold mb-1.5">{current.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{current.sub}</p>

              {current.content}

              {error && (
                <p className="text-sm text-destructive mt-4 font-medium">{error}</p>
              )}

              <div className="flex gap-3 justify-end mt-7">
                {step > 0 && (
                  <button onClick={back} className="px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-border transition-colors">← Zpět</button>
                )}
                {step < steps.length - 1 ? (
                  <button onClick={next} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Pokračovat →</button>
                ) : (
                  <button onClick={finish} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">🚀 Spustit getjob.cz</button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}