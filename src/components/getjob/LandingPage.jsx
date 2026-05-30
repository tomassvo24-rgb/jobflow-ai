import React, { useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const FEATURES = [
  { icon: "📤", title: "Analýza CV", desc: "Nahraj PDF životopis a AI okamžitě extrahuje dovednosti, zkušenosti, jazyky a obor." },
  { icon: "✨", title: "AI doporučení pozic", desc: "Na základě profilu AI navrhne relevantní pracovní příležitosti přesně pro tebe." },
  { icon: "✉️", title: "Generátor e-mailů", desc: "AI napíše personalizovaný přihlašovací e-mail nebo motivační dopis pro každou firmu." },
  { icon: "📋", title: "Tracker přihlášek", desc: "Sleduj stav každé přihlášky — od Odesláno přes Pohovor až po Přijato." },
  { icon: "📝", title: "CV Builder", desc: "Vytvoř profesionální životopis přímo v prohlížeči a stáhni jako PDF." },
  { icon: "📰", title: "Novinky z trhu práce", desc: "Aktuality, statistiky platů a kariérní tipy, které ti pomohou růst." },
];

const STEPS = [
  { n: "01", title: "Nahraj své CV", desc: "AI extrahuje dovednosti, zkušenosti a obor. Žádné ruční vyplňování." },
  { n: "02", title: "Získej 12 nabídek na míru", desc: "AI vyhledá nabídky přesně podle tvého profilu, lokality a preferencí." },
  { n: "03", title: "Aplikuj a sleduj", desc: "Vygeneruj motivační dopis, odešli jedním klikem a sleduj stav v trackeru." },
];

const TESTIMONIALS = [
  { name: "Jana K.", role: "Produktová manažerka", quote: "AI mi našla práci, o které jsem ani nevěděla, že existuje. Za týden tři pohovory." },
  { name: "Tomáš N.", role: "Frontend developer", quote: "Generátor e-mailů šetří hodiny času. Tracker je gamechanger." },
  { name: "Petra S.", role: "Marketing specialistka", quote: "Doporučení sedí přesně. Žádné scrollování přes stovky irelevantních nabídek." },
];

const STATS = [
  { v: "10 000+", l: "Aktivních nabídek" },
  { v: "850+", l: "Ověřených firem" },
  { v: "94%", l: "Spokojenost" },
  { v: "3 kroky", l: "Od CV k přihlášce" },
];

const FAQS = [
  { q: "Je GetJob.cz zdarma?", a: "Ano. Prvních 500 studentů má plný přístup zdarma. Žádná karta, žádný háček." },
  { q: "Co se stane s mým CV?", a: "CV zpracovává AI pouze pro extrakci dovedností. Neukládáme ho a nesdílíme s třetími stranami." },
  { q: "Jak AI najde relevantní nabídky?", a: "Na základě tvých dovedností, zkušeností, oboru a preferencí AI navrhne nejlépe odpovídající pozice." },
  { q: "Můžu odpovídat přímo z aplikace?", a: "Ano. Motivační dopis i e-mail vygenerovaný AI pošleš jedním klikem přes Gmail nebo Outlook." },
  { q: "Mám už životopis. Můžu si ho jen upravit?", a: "Jasně. V CV Builderu si životopis přepíšeš nebo postavíš nový a stáhneš jako PDF." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(v => !v)}
      className="border-b cursor-pointer group py-6"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-base md:text-lg font-semibold text-white">{q}</span>
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-transform"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >+</span>
      </div>
      {open && <p className="mt-4 leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{a}</p>}
    </div>
  );
}

export default function LandingPage({ onStart }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <div className="min-h-screen font-poppins" style={{ background: "#0a0a0f", color: "#fff" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo dark />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
            <a href="#funkce" className="hover:text-white transition-colors">Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-white transition-colors">Jak to funguje</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <button
            onClick={onStart}
            className="rounded-full px-5 py-2 text-sm font-semibold transition"
            style={{ background: "#fff", color: "#0a0a0f" }}
          >
            Začít zdarma →
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Subtle glow bg */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] -z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, rgba(20,184,166,0.08) 60%, transparent 100%)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-10" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
            AI-powered · Zdarma pro studenty
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-[88px] font-extrabold leading-[1.01] tracking-[-0.03em] mb-7">
            Méně hledání,<br />
            <span style={{ background: "linear-gradient(90deg, #6ea8fe 0%, #38bdf8 40%, #2dd4bf 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              více pohovorů
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            GetJob.cz kombinuje AI s tvým potenciálem. Nahraj CV, získej nabídky na míru a nech AI napsat motivační dopis za tebe.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={onStart}
              className="rounded-full px-8 py-3.5 font-bold text-base transition hover:opacity-90"
              style={{ background: "#fff", color: "#0a0a0f", boxShadow: "0 0 40px rgba(255,255,255,0.08)" }}
            >
              🚀 Vyzkoušet zdarma
            </button>
            <a
              href="#jak-to-funguje"
              className="rounded-full px-8 py-3.5 font-semibold text-base border transition hover:border-white/30"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }}
            >
              Jak to funguje →
            </a>
          </div>

          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>🎓 Prvních 500 studentů získá plný přístup zdarma</p>

          {/* App preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 rounded-[2rem] mx-auto max-w-3xl overflow-hidden border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}
          >
            {/* Fake title bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              <span className="ml-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>getjob.cz — AI Discover</span>
            </div>
            {/* Content */}
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-left">
              {[
                { emoji: "💼", title: "UX/UI Designer", co: "TechStart Praha", match: "94%", skills: ["Figma", "Prototyping"] },
                { emoji: "📊", title: "Data Analyst", co: "Komerční banka", match: "89%", skills: ["Python", "SQL"] },
                { emoji: "🛒", title: "Brand Manager", co: "Notino", match: "85%", skills: ["Marketing", "Strategy"] },
              ].map((job, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg grid place-items-center text-lg" style={{ background: "rgba(37,99,235,0.15)" }}>{job.emoji}</div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(20,184,166,0.15)", color: "#2dd4bf" }}>{job.match}</span>
                  </div>
                  <div className="font-semibold text-sm text-white mb-0.5">{job.title}</div>
                  <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{job.co}</div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold" style={{ background: "linear-gradient(90deg,#6ea8fe,#2dd4bf)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s.v}</div>
              <div className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="funkce" className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6ea8fe" }}>Funkce</div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Vše na jednom místě.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ borderColor: "rgba(110,168,254,0.4)" }}
              className="rounded-2xl p-6 border transition-all"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="jak-to-funguje" className="border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6ea8fe" }}>Jak to funguje</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Tři kroky k nové práci.</h2>
          </div>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ borderColor: "rgba(110,168,254,0.3)" }}
                className="rounded-2xl border p-8 flex gap-8 items-start transition-all"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", marginLeft: i * 32 }}
              >
                <div className="text-5xl font-extrabold leading-none shrink-0 w-16" style={{ background: "linear-gradient(90deg,#6ea8fe,#2dd4bf)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-2">{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10">
            <button onClick={onStart} className="rounded-full px-7 py-3 font-semibold text-sm transition hover:opacity-90" style={{ background: "#fff", color: "#0a0a0f" }}>
              Začít zdarma →
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6ea8fe" }}>Reference</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Lidé, kteří už uspěli.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl p-7 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="text-sm" style={{ color: "#2dd4bf" }}>★★★★★</div>
                <p className="mt-4 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#6ea8fe" }}>FAQ</div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Časté otázky</h2>
          </div>
          {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            Najdi práci s AI.<br />
            <span style={{ background: "linear-gradient(90deg,#6ea8fe,#2dd4bf)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              Zdarma. Hned.
            </span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Přidej se do waitlistu. Prvních 500 studentů získá plný přístup zdarma.
          </p>
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className="flex-1 rounded-full px-5 py-3 text-sm outline-none border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
            />
            <button type="submit" className="rounded-full px-6 py-3 font-semibold text-sm whitespace-nowrap transition hover:opacity-90" style={{ background: "#fff", color: "#0a0a0f" }}>
              Přidat se →
            </button>
          </form>
          {joined && <p className="text-sm font-semibold" style={{ color: "#2dd4bf" }}>✓ Přihlášení proběhlo! Dáme ti vědět.</p>}
          <div className="mt-6">
            <button onClick={onStart} className="rounded-full px-8 py-3.5 font-bold text-base transition hover:opacity-90" style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)", boxShadow: "0 0 60px rgba(37,99,235,0.3)" }}>
              🚀 Vyzkoušet platformu zdarma
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo dark />
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            <a href="#funkce" className="hover:text-white transition-colors">Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-white transition-colors">Jak to funguje</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <span className="hover:text-white cursor-pointer transition-colors">Ochrana dat</span>
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© 2026 GetJob.cz</div>
        </div>
      </footer>
    </div>
  );
}