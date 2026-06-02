import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const LOGO_LIGHT = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png";
const LOGO_DARK = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/8a276674d_e9868ad2-36e2-46c9-921c-b693ef439451.png";

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

const FEATURES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="2"/><path d="M7 19c0-2 1.3-3 3-3s3 1 3 3"/></svg>,
    title: "Nahrání a analýza CV",
    desc: "Nahrajte PDF životopis. GetJob přečte vaše zkušenosti, jazyky a obor studia. Žádné ruční vyplňování."
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>,
    title: "AI objevování pracovních míst",
    desc: "GetJob každý den prohledá jobs.cz, LinkedIn a stovky firemních kariérních stránek. Dostanete pozice, které odpovídají vašemu profilu, lokalitě a podmínkám."
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/></svg>,
    title: "Generátor e-mailů a motivačních dopisů",
    desc: "Ke každé pozici dostanete e-mail nebo motivační dopis napsaný pro tu konkrétní firmu. Odešlete přímo z GetJob přes Gmail, Outlook nebo Seznam."
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: "Tracker přihlášek",
    desc: "Přehled všech přihlášek na jednom místě. Stav, poznámky, přímý odkaz na pozici. Nezapomenete na žádnou odpověď."
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    title: "CV Builder",
    desc: "Postavte si životopis v prohlížeči a stáhněte jako PDF. Nebo nahrajte stávající a upravte ho."
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8"/><path d="M10 10h4"/></svg>,
    title: "Novinky a inspirace",
    desc: "Průměrné platy podle oboru, nové portály, tipy co říct na pohovoru. Jednou týdně, bez spamu."
  }
];

const STEPS = [
  { n: "01", title: "Nahrajte své CV", desc: "GetJob přečte váš životopis a vytáhne z něj dovednosti, zkušenosti a obor. Nemusíte nic vyplňovat ručně." },
  { n: "02", title: "Získejte nabídky přímo pro vás", desc: "GetJob prohledá jobs.cz, LinkedIn a firemní stránky. Filtrujete podle platu, lokality a úvazku." },
  { n: "03", title: "Aplikujte a sledujte", desc: "Ke každé pozici vygenerujete personalizovaný e-mail nebo motivační dopis a odešlete ho jedním klikem. Stav přihlášky sledujete v trackeru." }
];

const FAQS = [
  { q: "Je GetJob.cz zdarma?", a: "Prvních 100 uživatelů dostane plný přístup zdarma. Žádná kreditní karta, žádný háček." },
  { q: "Co se stane s mým CV?", a: "CV zpracovává AI lokálně pro extrakci dovedností. Neukládáme ho a nesdílíme s třetími stranami." },
  { q: "Jak AI najde relevantní nabídky?", a: "Na základě vašich dovedností, zkušeností, oboru studia a preferencí vám AI navrhne nejlépe odpovídající pozice." },
  { q: "Můžu odpovídat přímo z aplikace?", a: "Ano. Motivační dopis i e-mail vygenerovaný AI pošlete jedním klikem přes Gmail, Outlook nebo Seznam." },
  { q: "Mám už životopis. Můžu si ho jen upravit?", a: "Jasně. V CV Builderu si životopis přepíšete nebo postavíte nový a stáhnete jako PDF." }
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border-b border-border py-5 cursor-pointer transition-all`}
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex items-center justify-between gap-4 font-semibold text-foreground text-base">
        {q}
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all text-lg font-bold border border-border"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >+</span>
      </div>
      {open && <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{a}</p>}
    </div>
  );
}

export default function LandingPage({ onStart, onContinue }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const dark = useDark();

  const savedProfile = (() => {
    try { return JSON.parse(localStorage.getItem("gj_prof")); } catch { return null; }
  })();

  const handleWaitlist = (e) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <div className="min-h-screen font-poppins bg-background text-foreground">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/90 border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src={dark ? LOGO_DARK : LOGO_LIGHT}
            alt="GetJob.cz" className={dark ? "h-28 w-auto object-contain" : "h-11 w-auto object-contain ml-8"}
          />
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <a href="#funkce" className="hover:text-primary transition-colors">Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-primary transition-colors">Jak to funguje</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <Link to="/o-nas" className="hover:text-primary transition-colors">O nás</Link>
            <Link to="/kontakt" className="hover:text-primary transition-colors">Kontakt</Link>
            <Link to="/ochrana-udaju" className="hover:text-primary transition-colors">Ochrana údajů</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {savedProfile ? (
              <button
                onClick={onContinue}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
                style={{ background: "#2563eb" }}
                title={savedProfile.name}
              >
                {savedProfile.name?.[0]?.toUpperCase() || "?"}
              </button>
            ) : (
              <button
                onClick={onStart}
                className="rounded-full bg-primary text-white px-5 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Přidat se do waitlistu →
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RETURNING USER BANNER */}
      {savedProfile && (
        <div className="border-b border-border py-3 px-6 bg-primary/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm font-medium text-foreground">
              👋 Vítej zpět, <strong>{savedProfile.name}</strong>! Máš uložený profil.
            </p>
            <button
              onClick={onContinue}
              className="rounded-full px-4 py-1.5 text-xs font-semibold bg-primary text-white hover:opacity-90 transition"
            >
              Přejít do aplikace →
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "linear-gradient(180deg,hsl(var(--background)) 0%,hsl(221,83%,97%) 100%)" }} />
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full blur-3xl -z-10" style={{ background: "rgba(37,99,235,0.08)" }} />
        <div className="absolute top-60 -left-20 w-[300px] h-[300px] rounded-full blur-3xl -z-10" style={{ background: "rgba(20,184,166,0.08)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-7" style={{ background: "rgba(37,99,235,0.07)", borderColor: "rgba(37,99,235,0.18)", color: "#2563eb" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Hledání práce bez zbytečného scrollování
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight text-foreground">
              Méně hledání,<br />
              <span style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                více pohovorů
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed max-w-xl text-muted-foreground">
              Nahrajte CV. GetJob prohledá jobs.cz, LinkedIn i firemní stránky, vybere pozice, které sedí vašemu profilu, a napíše přihlášku přímo pro danou firmu.
            </p>

            <form onSubmit={handleWaitlist} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.cz"
                className="flex-1 rounded-full border bg-card text-foreground px-5 py-3.5 text-sm outline-none transition focus:border-primary"
                style={{ borderColor: "hsl(var(--border))" }}
              />
              <button
                type="submit"
                className="rounded-full bg-primary text-white px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
              >
                Přidat se do waitlistu →
              </button>
            </form>

            {joined && (
              <p className="mt-4 text-sm font-semibold text-emerald-500">✓ Přihlášení proběhlo úspěšně! Dáme vám vědět.</p>
            )}

            <p className="mt-3 text-sm flex items-center gap-2 text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Prvních 100 uživatelů dostane plný přístup zdarma.
            </p>
          </div>

          {/* Phone mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[280px] h-[560px]"
            >
              <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-20" style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)" }} />
              <div className="relative h-full rounded-[2.6rem] p-2.5" style={{ background: "#0d1b2a", boxShadow: "0 20px 60px -20px rgba(37,99,235,0.3)" }}>
                <div className="h-full rounded-[2.2rem] bg-white overflow-hidden flex flex-col">
                  <div className="relative px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-semibold text-gray-800">
                    <span>9:41</span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 rounded-full" style={{ background: "#0d1b2a" }} />
                    <span>●●●</span>
                  </div>
                  <div className="px-5 pt-2 pb-2">
                    <img src="https://media.base44.com/images/public/6a1c279e369e180b9dc6dfde/fcedf8c30_getjob_logo_white-removebg-preview.png" alt="GetJob.cz" className="h-7 w-auto object-contain" />
                  </div>
                  <div className="px-4 mt-2">
                    <div className="rounded-2xl border p-4" style={{ borderColor: "#e3e8f0" }}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "#e6f0ff" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01" strokeWidth="3"/></svg>
                          </div>
                          <div>
                            <div className="text-sm font-bold leading-snug text-gray-900">UX/UI Designer</div>
                            <div className="text-[11px] text-gray-500">TechStart Praha</div>
                          </div>
                        </div>
                        <div className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>94%</div>
                      </div>
                      <div className="mt-3 space-y-1 text-[11px] text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
                          Figma & Prototyping
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
                          VŠ projekty
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 mt-3">
                    <div className="rounded-2xl p-3 text-[11px] italic text-gray-600 flex items-start gap-2" style={{ background: "rgba(230,240,255,0.6)", border: "1px solid rgba(37,99,235,0.15)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      "Skvělá shoda s vaším portfoliem! Motivační dopis připraven."
                    </div>
                  </div>
                  <div className="px-4 mt-3">
                    <div className="rounded-2xl border p-3 flex items-center gap-3" style={{ borderColor: "#e3e8f0" }}>
                      <div className="w-8 h-8 rounded-full grid place-items-center" style={{ background: "#e6f0ff" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-[12px] font-bold text-gray-900">Motivační dopis</div>
                        <div className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#14b8a6" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
                          Vygenerováno
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="px-4 pb-5">
                    <div className="w-full text-white text-sm font-semibold py-3 rounded-full text-center" style={{ background: "#2563eb" }}>Zobrazit pozici →</div>
                    <div className="mt-3 mx-auto w-28 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="funkce" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Funkce</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Vše, co potřebujete<br />k{" "}
              <span style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                získání práce
              </span>.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-card border border-border p-7 transition-all cursor-default hover:border-primary hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: "rgba(37,99,235,0.08)" }}>
                  {f.icon}
                </div>
                <h3 className="mt-5 font-bold text-lg text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="jak-to-funguje" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary">Jak to funguje</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Tři kroky k nové práci.</h2>
            <p className="mt-5 text-muted-foreground">Nahrajte CV, GetJob najde nabídky a napíše přihlášku. Vy ji odešlete.</p>
            <button
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Přidat se do waitlistu →
            </button>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                className="rounded-3xl border border-border bg-card p-7 flex gap-6 items-start transition-all hover:border-primary hover:shadow-sm"
                style={{ marginLeft: i * 24 }}
              >
                <div className="text-5xl font-extrabold leading-none w-20 shrink-0" style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Časté otázky</h2>
        </div>
        <div className="divide-y divide-border">
          {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-white"
          style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}
        >
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.10)" }} />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Hledání práce zabírá desítky hodin týdně.<br />
              <span className="opacity-90">GetJob to zvládne za deset minut.</span>
            </h2>
            <p className="mt-5 text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              Přidejte se na waitlist. Prvních 100 uživatelů dostane plný přístup zdarma.
            </p>
            <button
              onClick={onStart}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold hover:opacity-95 transition"
              style={{ color: "#2563eb" }}
            >
              Přidat se do waitlistu →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <img
              src={dark ? LOGO_DARK : LOGO_LIGHT}
              alt="GetJob.cz" className={dark ? "h-28 w-auto object-contain" : "h-9 w-auto object-contain"}
            />
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">Chytřejší hledání práce s pomocí AI.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <a href="#funkce" className="hover:text-foreground transition-colors">Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-foreground transition-colors">Jak to funguje</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <Link to="/o-nas" className="hover:text-foreground transition-colors">O nás</Link>
            <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 GetJob.cz</div>
        </div>
      </footer>
    </div>
  );
}