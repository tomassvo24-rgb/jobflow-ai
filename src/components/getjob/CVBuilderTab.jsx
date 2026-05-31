import React, { useState, useRef } from "react";
import { IconFile, IconEye, IconPrint, IconUser, IconGrad, IconBriefcase, IconTool, IconTrophy, IconMail, IconPhone, IconPin, IconLinkedin } from "./Icons";

const DEGREES   = ["Bakalář (Bc.)", "Magistr (Mgr.)", "Doktor (PhD.)", "Maturita"];
const WORK_TYPES = ["Part-time", "Full-time", "Stáž", "Brigáda", "Freelance"];

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors" />
    </div>
  );
}

export default function CVBuilderTab({ profile }) {
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState({
    name: profile?.name || "", title: "", email: profile?.email || "",
    phone: profile?.phone || "", linkedin: "", city: profile?.city || "", summary: "",
  });
  const [edu,   setEdu]   = useState([{ school: "", field: "", degree: "Bakalář (Bc.)", years: "", note: "" }]);
  const [work,  setWork]  = useState([{ company: "", role: "", type: "Part-time", period: "", desc: "" }]);
  const [skills,setSkills]= useState({ tech: "", soft: profile?.skills || "", langs: profile?.langs || "", certs: "" });
  const [extra, setExtra] = useState({ awards: "", hobbies: "" });
  const printRef = useRef(null);

  const set         = (k, v) => setInfo(f => ({ ...f, [k]: v }));
  const setSkill    = (k, v) => setSkills(f => ({ ...f, [k]: v }));
  const setExtraField=(k,v) => setExtra(f => ({ ...f, [k]: v }));

  const addEdu    = () => setEdu(e => [...e, { school: "", field: "", degree: "Bakalář (Bc.)", years: "", note: "" }]);
  const removeEdu = (i) => edu.length > 1 && setEdu(e => e.filter((_, j) => j !== i));
  const setEduField = (i, k, v) => setEdu(e => e.map((x, j) => j === i ? { ...x, [k]: v } : x));

  const addWork    = () => setWork(e => [...e, { company: "", role: "", type: "Part-time", period: "", desc: "" }]);
  const removeWork = (i) => work.length > 1 && setWork(e => e.filter((_, j) => j !== i));
  const setWorkField = (i, k, v) => setWork(e => e.map((x, j) => j === i ? { ...x, [k]: v } : x));

  const handlePrint = () => { setShowPreview(true); setTimeout(() => window.print(), 300); };

  if (showPreview) {
    return (
      <div>
        <div className="flex gap-2 mb-4 flex-wrap no-print">
          <button onClick={() => setShowPreview(false)} className="px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">← Zpět na editaci</button>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <IconPrint cls="w-4 h-4" /> Tisknout / PDF
          </button>
        </div>
        <div ref={printRef} className="bg-white border border-border rounded-xl p-8 shadow-md">
          <div className="font-poppins text-2xl font-extrabold mb-1">{info.name || "Jméno Příjmení"}</div>
          {info.title && <div className="text-sm text-muted-foreground font-medium mb-1">{info.title}</div>}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-5">
            {info.email    && <span className="inline-flex items-center gap-1"><IconMail cls="w-3.5 h-3.5" /> {info.email}</span>}
            {info.phone    && <span className="inline-flex items-center gap-1"><IconPhone cls="w-3.5 h-3.5" /> {info.phone}</span>}
            {info.city     && <span className="inline-flex items-center gap-1"><IconPin cls="w-3.5 h-3.5" /> {info.city}</span>}
            {info.linkedin && <span className="inline-flex items-center gap-1"><IconLinkedin cls="w-3.5 h-3.5" /> {info.linkedin}</span>}
          </div>
          {info.summary && <Section title="O mně"><p className="text-sm text-foreground leading-relaxed">{info.summary}</p></Section>}
          {edu.some(e => e.school || e.field) && (
            <Section title="Vzdělání">
              {edu.filter(e => e.school || e.field).map((e, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between"><span className="font-semibold text-sm">{e.school}</span><span className="text-xs text-muted-foreground font-mono">{e.years}</span></div>
                  <div className="text-sm text-muted-foreground">{e.field}{e.degree ? " · " + e.degree : ""}</div>
                  {e.note && <div className="text-sm mt-0.5">{e.note}</div>}
                </div>
              ))}
            </Section>
          )}
          {work.some(w => w.company || w.role) && (
            <Section title="Pracovní zkušenosti">
              {work.filter(w => w.company || w.role).map((w, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between"><span className="font-semibold text-sm">{w.role}</span><span className="text-xs text-muted-foreground font-mono">{w.period}</span></div>
                  <div className="text-sm text-muted-foreground">{w.company}{w.type ? " · " + w.type : ""}</div>
                  {w.desc && <div className="text-sm mt-0.5 leading-relaxed">{w.desc}</div>}
                </div>
              ))}
            </Section>
          )}
          {(skills.tech || skills.soft || skills.langs || skills.certs) && (
            <Section title="Dovednosti & Jazyky">
              {skills.tech  && <SkillRow label="Technické"   value={skills.tech} />}
              {skills.soft  && <SkillRow label="Soft skills" value={skills.soft} />}
              {skills.langs && <SkillRow label="Jazyky"      value={skills.langs} />}
              {skills.certs && <SkillRow label="Certifikáty" value={skills.certs} />}
            </Section>
          )}
          {(extra.awards || extra.hobbies) && (
            <Section title="Úspěchy & Zájmy">
              {extra.awards  && <SkillRow label="Úspěchy" value={extra.awards} />}
              {extra.hobbies && <SkillRow label="Zájmy"   value={extra.hobbies} />}
            </Section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <IconFile cls="w-5 h-5 text-brand-blue" />
          <h2 className="font-poppins text-[22px] font-bold">CV Builder</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
            <IconEye cls="w-3.5 h-3.5" /> Náhled
          </button>
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-blue text-white text-xs font-medium hover:opacity-90 transition-opacity">
            <IconFile cls="w-3.5 h-3.5" /> Stáhnout PDF
          </button>
        </div>
      </div>

      <CVSection icon={<IconUser cls="w-4 h-4" />} title="Osobní informace">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jméno a příjmení" value={info.name}     onChange={v => set("name", v)}     placeholder="Jan Novák" />
          <Field label="Pozice / titul"   value={info.title}    onChange={v => set("title", v)}    placeholder="Student práv · Junior Analyst" />
          <Field label="Email"            value={info.email}    onChange={v => set("email", v)}    placeholder="jan@email.cz" type="email" />
          <Field label="Telefon"          value={info.phone}    onChange={v => set("phone", v)}    placeholder="+420 123 456 789" />
          <Field label="LinkedIn"         value={info.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/jan-novak" />
          <Field label="Město"            value={info.city}     onChange={v => set("city", v)}     placeholder="Praha, Česká republika" />
        </div>
        <div className="mt-3">
          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Profesní profil / o mně</label>
          <textarea value={info.summary} onChange={e => set("summary", e.target.value)} rows={3} placeholder="Krátký odstavec o sobě, svých cílech a hodnotách..."
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors resize-none" />
        </div>
      </CVSection>

      <CVSection icon={<IconGrad cls="w-4 h-4" />} title="Vzdělání" action={<button onClick={addEdu} className="px-3 py-1 rounded-full bg-accent text-accent-foreground border border-brand-teal/30 text-xs font-semibold hover:bg-accent/80 transition-colors">+ Přidat</button>}>
        {edu.map((e, i) => (
          <div key={i} className="bg-secondary border border-border rounded-lg p-4 mb-3 relative">
            <button onClick={() => removeEdu(i)} className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-500 text-base transition-colors">×</button>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Škola / Instituce" value={e.school} onChange={v => setEduField(i, "school", v)} placeholder="Univerzita Karlova" />
              <Field label="Obor"               value={e.field}  onChange={v => setEduField(i, "field", v)}  placeholder="Právo (PF UK)" />
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Stupeň</label>
                <select value={e.degree} onChange={ev => setEduField(i, "degree", ev.target.value)} className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  {DEGREES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <Field label="Rok od–do" value={e.years} onChange={v => setEduField(i, "years", v)} placeholder="2025 – dosud" />
            </div>
            <Field label="Poznámky (volitelné)" value={e.note} onChange={v => setEduField(i, "note", v)} placeholder="Stipendium, ocenění, průměr..." />
          </div>
        ))}
      </CVSection>

      <CVSection icon={<IconBriefcase cls="w-4 h-4" />} title="Pracovní zkušenosti" action={<button onClick={addWork} className="px-3 py-1 rounded-full bg-accent text-accent-foreground border border-brand-teal/30 text-xs font-semibold hover:bg-accent/80 transition-colors">+ Přidat</button>}>
        {work.map((w, i) => (
          <div key={i} className="bg-secondary border border-border rounded-lg p-4 mb-3 relative">
            <button onClick={() => removeWork(i)} className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-500 text-base transition-colors">×</button>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Firma"   value={w.company} onChange={v => setWorkField(i, "company", v)} placeholder="Firma s.r.o." />
              <Field label="Pozice"  value={w.role}    onChange={v => setWorkField(i, "role", v)}    placeholder="Junior Analyst" />
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Typ</label>
                <select value={w.type} onChange={ev => setWorkField(i, "type", ev.target.value)} className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors">
                  {WORK_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Období" value={w.period} onChange={v => setWorkField(i, "period", v)} placeholder="6/2023 – dosud" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Popis práce</label>
              <textarea value={w.desc} onChange={e => setWorkField(i, "desc", e.target.value)} rows={2} placeholder="Co jsi dělal/a, jaké byly tvé výsledky..."
                className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal transition-colors resize-none" />
            </div>
          </div>
        ))}
      </CVSection>

      <CVSection icon={<IconTool cls="w-4 h-4" />} title="Dovednosti">
        <div className="space-y-3">
          <Field label="Technické dovednosti" value={skills.tech}  onChange={v => setSkill("tech", v)}  placeholder="Python, Excel, Photoshop, SQL..." />
          <Field label="Měkké dovednosti"     value={skills.soft}  onChange={v => setSkill("soft", v)}  placeholder="Komunikace, týmová práce..." />
          <Field label="Jazyky"               value={skills.langs} onChange={v => setSkill("langs", v)} placeholder="Čeština (rodilý), Angličtina (B2-C1)..." />
          <Field label="Certifikáty"          value={skills.certs} onChange={v => setSkill("certs", v)} placeholder="ECDL, Cambridge B2, Google Analytics..." />
        </div>
      </CVSection>

      <CVSection icon={<IconTrophy cls="w-4 h-4" />} title="Úspěchy a zájmy (volitelné)">
        <div className="space-y-3">
          <Field label="Úspěchy"       value={extra.awards}  onChange={v => setExtraField("awards", v)}  placeholder="Matematická olympiáda, soutěže, ocenění..." />
          <Field label="Zájmy a koníčky" value={extra.hobbies} onChange={v => setExtraField("hobbies", v)} placeholder="Fotografie, sport, programování..." />
        </div>
      </CVSection>

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <IconEye cls="w-4 h-4" /> Zobrazit náhled
        </button>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-teal text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <IconFile cls="w-4 h-4" /> Stáhnout jako PDF
        </button>
      </div>
    </div>
  );
}

function CVSection({ icon, title, children, action }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="font-poppins font-bold text-sm flex items-center gap-2">
          <span className="text-brand-blue">{icon}</span> {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-brand-teal font-mono mb-2 pb-1.5 border-b-2 border-accent">{title}</div>
      {children}
    </div>
  );
}

function SkillRow({ label, value }) {
  return (
    <div className="mb-1.5">
      <span className="font-semibold text-xs">{label}: </span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}