import React, { useState } from "react";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";

function Field({ label, value, onChange, placeholder, multiline }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors resize-none leading-relaxed" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-4 shadow-sm">
      <h3 className="font-poppins font-bold text-sm mb-4 flex items-center gap-2">{title}</h3>
      {children}
    </div>
  );
}

export default function ProfileTab({ profile, onSave, onReset }) {
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Opravdu smazat vše? Profil, pozice i tracker.")) onReset();
  };

  return (
    <div>
      <h2 className="font-poppins text-[22px] font-bold mb-5">Můj profil 👤</h2>

      <Section title="👤 Základní info">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jméno" value={form.name || ""} onChange={v => set("name", v)} placeholder="Jan Novák" />
          <EmailField label="Email" value={form.email || ""} onChange={v => set("email", v)} />
          <PhoneField label="Telefon" value={form.phone || ""} onChange={v => set("phone", v)} />
          <Field label="Město" value={form.city || ""} onChange={v => set("city", v)} placeholder="Praha" />
        </div>
      </Section>

      <Section title="🎓 Vzdělání & zkušenosti">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Obor" value={form.field || ""} onChange={v => set("field", v)} placeholder="Právo, IT, Marketing..." />
          <Field label="Úroveň" value={form.level || ""} onChange={v => set("level", v)} placeholder="Junior, Senior..." />
        </div>
        <div className="space-y-3">
          <Field label="Dovednosti" value={form.skills || ""} onChange={v => set("skills", v)} multiline placeholder="Co umíš, projekty, certifikáty..." />
          <Field label="Jazyky" value={form.langs || ""} onChange={v => set("langs", v)} placeholder="Čeština (rodilý), Angličtina B2..." />
        </div>
      </Section>

      <Section title="🎯 Co hledám">
        <div className="space-y-3">
          <Field label="Typ pozice" value={form.ttype || ""} onChange={v => set("ttype", v)} placeholder="Stáž, Part-time, Fulltime..." />
          <Field label="Odvětví" value={form.tind || ""} onChange={v => set("tind", v)} placeholder="Finance, IT, Marketing..." />
          <Field label="Ostatní preference" value={form.extra || ""} onChange={v => set("extra", v)} placeholder="Mezinárodní prostředí, startup kultura..." />
        </div>
      </Section>

      <div className="flex gap-3 flex-wrap">
        <button onClick={handleSave} className="px-5 py-2.5 rounded-full bg-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {saved ? "✓ Uloženo!" : "💾 Uložit profil"}
        </button>
        <button onClick={handleReset} className="px-5 py-2.5 rounded-full bg-red-50 text-red-500 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors">
          Resetovat vše
        </button>
      </div>
    </div>
  );
}