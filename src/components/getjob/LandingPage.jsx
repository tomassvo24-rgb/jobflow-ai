import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const FEATURES = [
{ icon: "📤", title: "Nahrání a analýza CV", desc: "Nahrajte svůj PDF životopis a AI okamžitě extrahuje vaše dovednosti, zkušenosti, jazyky a obor studia." },
{ icon: "✨", title: "AI objevování pracovních míst", desc: "Na základě vašeho profilu AI navrhne 12 relevantních pracovních příležitostí s filtry na plat, lokalitu, úvazek a benefity." },
{ icon: "✉️", title: "Generátor e-mailů a motivačních dopisů", desc: "AI napíše personalizovaný přihlašovací e-mail nebo motivační dopis pro každou konkrétní firmu — odeslat lze přímo z appky." },
{ icon: "📋", title: "Tracker přihlášek", desc: "Sledujte stav každé přihlášky od Odesláno přes Odpověď, Pohovor až po Přijato — s poznámkami a přímými odkazy." },
{ icon: "📝", title: "CV Builder", desc: "Vytvořte profesionální životopis přímo v prohlížeči a stáhněte si ho jako PDF během pár minut." },
{ icon: "📰", title: "Novinky a inspirace", desc: "Aktuality z trhu práce, statistiky platů a kariérní tipy, které vám pomohou růst." }];


const STEPS = [
{ n: "01", title: "Nahrajte své CV", desc: "AI okamžitě extrahuje vaše dovednosti, zkušenosti a preferovaný obor. Žádné ruční vyplňování profilu." },
{ n: "02", title: "Objevte 12 šitých na míru", desc: "AI vyhledá pracovní nabídky přesně podle vašeho profilu, lokality a preferencí. Filtrovat můžete podle platu, úvazku i benefitů." },
{ n: "03", title: "Aplikujte a sledujte", desc: "Vygenerujte personalizovaný e-mail nebo motivační dopis, odešlete ho jedním klikem a sledujte stav v trackeru." }];


const TESTIMONIALS = [
{ name: "Jana K.", role: "Produktová manažerka", quote: "AI mi našla práci, o které jsem ani nevěděla, že existuje. Za týden jsem měla tři pohovory." },
{ name: "Tomáš N.", role: "Frontend developer", quote: "Generátor e-mailů šetří hodiny času. Tracker je gamechanger — vím, kde stojím u každé firmy." },
{ name: "Petra S.", role: "Marketingová specialistka", quote: "Doporučení sedí přesně. Žádné scrollování přes stovky irelevantních nabídek." }];


const STATS = [
{ v: "10 000+", l: "Aktivních nabídek" },
{ v: "850+", l: "Ověřených firem" },
{ v: "94%", l: "Spokojenost uživatelů" },
{ v: "3 kroky", l: "Od CV k přihlášce" }];


const FAQS = [
{ q: "Je GetJob.cz zdarma?", a: "Ano. Prvních 500 studentů má plný přístup zdarma. Žádná karta, žádný háček." },
{ q: "Co se stane s mým CV?", a: "CV zpracovává AI lokálně pro extrakci dovedností. Neukládáme ho a nesdílíme s třetími stranami." },
{ q: "Jak AI najde relevantní nabídky?", a: "Na základě vašich dovedností, zkušeností, oboru studia a preferencí vám AI navrhne 12 nejlépe odpovídajících pozic." },
{ q: "Můžu odpovídat přímo z aplikace?", a: "Ano. Motivační dopis i e-mail vygenerovaný AI pošlete jedním klikem přes Gmail, Outlook nebo Seznam." },
{ q: "Mám už životopis. Můžu si ho jen upravit?", a: "Jasně. V CV Builderu si životopis přepíšete nebo postavíte nový a stáhnete jako PDF." }];


const TRUSTED = ["Productboard", "Rohlik", "Mall.cz", "Avast", "Kiwi.com", "Notino"];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border bg-white p-6 transition-all cursor-pointer ${open ? "shadow-lg border-blue-200" : "border-border"}`}
      onClick={() => setOpen((v) => !v)}>
      
      <div className="flex items-center justify-between gap-4 font-semibold text-foreground">
        {q}
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-brand-blue shrink-0 transition-transform text-lg font-bold"
          style={{ background: "#e6f0ff", transform: open ? "rotate(45deg)" : "none" }}>
          +</span>
      </div>
      {open && <p className="mt-4 text-muted-foreground leading-relaxed text-sm">{a}</p>}
    </div>);

}

export default function LandingPage({ onStart, onContinue }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const savedProfile = (() => {
    try {return JSON.parse(localStorage.getItem("gj_prof"));} catch {return null;}
  })();

  const handleWaitlist = (e) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <div className="min-h-screen font-poppins" style={{ background: "#f6f8fb", color: "#0d1b2a" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(255,255,255,0.85)", borderColor: "#e3e8f0" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png" alt="GetJob.cz" className="h-10 w-auto object-contain" />
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
            <a href="#funkce" className="hover:text-brand-blue transition-colors" style={{ color: "#0d1b2a" }}>Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-brand-blue transition-colors" style={{ color: "#0d1b2a" }}>Jak to funguje</a>
            <a href="#faq" className="hover:text-brand-blue transition-colors" style={{ color: "#0d1b2a" }}>FAQ</a>
            <Link to="/o-nas" className="hover:text-brand-blue transition-colors" style={{ color: "#0d1b2a" }}>O nás</Link>
            <Link to="/kontakt" className="hover:text-brand-blue transition-colors" style={{ color: "#0d1b2a" }}>Kontakt</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {savedProfile ?
            <button
              onClick={onContinue}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:opacity-90 transition"
              style={{ background: "#2563eb", boxShadow: "0 10px 40px -12px rgba(13,27,42,0.12)", fontSize: "1.1rem", fontFamily: "var(--font-poppins)", fontWeight: 800 }}
              title={savedProfile.name}>
              
                {savedProfile.name?.[0]?.toUpperCase() || "?"}
              </button> :

            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              style={{ boxShadow: "0 10px 40px -12px rgba(13,27,42,0.12)" }}>
              
                Začít zdarma →
              </button>
            }
          </div>
        </div>
      </header>

      {/* RETURNING USER BANNER */}
      {savedProfile &&
      <div className="border-b py-3 px-6" style={{ background: "#e6f0ff", borderColor: "#bfdbfe" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm font-medium" style={{ color: "#1e40af" }}>
              👋 Vítej zpět, <strong>{savedProfile.name}</strong>! Máš uložený profil.
            </p>
            <button
            onClick={onContinue}
            className="rounded-full px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition"
            style={{ background: "#2563eb", color: "#fff" }}>
            
              Přejít do aplikace →
            </button>
          </div>
        </div>
      }

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#f6f9ff 0%,#e6f0ff 100%)", opacity: 0.6 }} />
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full blur-3xl -z-10" style={{ background: "rgba(37,99,235,0.10)" }} />
        <div className="absolute top-60 -left-20 w-[300px] h-[300px] rounded-full blur-3xl -z-10" style={{ background: "rgba(20,184,166,0.10)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center relative">
          {/* Left */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-7" style={{ background: "#e6f0ff", borderColor: "rgba(37,99,235,0.15)", color: "#2563eb" }}>
              ✨ Chytřejší způsob hledání práce
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight">
              Méně hledání,<br />
              <span style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                více pohovorů
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed max-w-xl" style={{ color: "#5b6577" }}>
              GetJob.cz spojuje sílu umělé inteligence s vaším potenciálem. Najděte práci, která vám skutečně sedne, nechte si napsat motivační dopis na míru a připravte se na pohovor jako profesionál.
            </p>

            <form onSubmit={handleWaitlist} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.cz"
                className="flex-1 rounded-full bg-white border px-5 py-3.5 text-sm outline-none transition"
                style={{ borderColor: "#e3e8f0" }}
                onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                onBlur={(e) => e.target.style.borderColor = "#e3e8f0"} />
              
              <button type="submit" className="rounded-full bg-brand-blue text-white px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2" style={{ boxShadow: "0 10px 40px -12px rgba(13,27,42,0.12)" }}>
                Přidat se do waitlistu →
              </button>
            </form>
            {joined && <p className="mt-5 text-sm font-semibold" style={{ color: "#14b8a6" }}>✓ Přihlášení proběhlo úspěšně! Dáme vám vědět.</p>}
            <p className="mt-3 text-sm flex items-center gap-2" style={{ color: "#5b6577" }}>
              🎓 Přístup pro prvních 100 uživatelů zdarma
            </p>

            <div className="mt-10">
              <button
                onClick={onStart}
                className="px-8 py-4 rounded-full text-white font-bold text-base hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)", boxShadow: "0 20px 60px -20px rgba(37,99,235,0.35)" }}>
                
                🚀 Vyzkoušet platformu zdarma
              </button>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[280px] h-[560px]">
              
              <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-20" style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)" }} />
              <div className="relative h-full rounded-[2.6rem] p-2.5" style={{ background: "#0d1b2a", boxShadow: "0 20px 60px -20px rgba(37,99,235,0.25)" }}>
                <div className="h-full rounded-[2.2rem] bg-white overflow-hidden flex flex-col">
                  <div className="relative px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-semibold text-foreground">
                    <span>9:41</span>
                    <span className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-5 rounded-full" style={{ background: "#0d1b2a" }} />
                    <span>●●●</span>
                  </div>
                  <div className="px-5 pt-2 pb-2"><Logo small /></div>
                  <div className="px-4 mt-2">
                    <div className="rounded-2xl border p-4" style={{ borderColor: "#e3e8f0", boxShadow: "0 10px 40px -12px rgba(13,27,42,0.12)" }}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl grid place-items-center text-xl" style={{ background: "#e6f0ff" }}>💼</div>
                          <div>
                            <div className="text-sm font-bold leading-snug">UX/UI Designer</div>
                            <div className="text-[11px]" style={{ color: "#5b6577" }}>TechStart Praha</div>
                          </div>
                        </div>
                        <div className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>94%</div>
                      </div>
                      <div className="mt-3 space-y-1 text-[11px]" style={{ color: "#5b6577" }}>
                        <div>✅ Figma & Prototyping</div>
                        <div>✅ VŠ projekty</div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 mt-3">
                    <div className="rounded-2xl p-3 text-[11px] italic" style={{ background: "rgba(230,240,255,0.6)", border: "1px solid rgba(37,99,235,0.15)" }}>
                      "Skvělá shoda s vaším portfoliem! Motivační dopis připraven."
                    </div>
                  </div>
                  <div className="px-4 mt-3">
                    <div className="rounded-2xl border p-3 flex items-center gap-3" style={{ borderColor: "#e3e8f0" }}>
                      <div className="w-8 h-8 rounded-full grid place-items-center text-base" style={{ background: "#e6f0ff" }}>✉️</div>
                      <div className="flex-1">
                        <div className="text-[12px] font-bold">Motivační dopis</div>
                        <div className="text-[10px] font-semibold" style={{ color: "#14b8a6" }}>Vygenerováno ✓</div>
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
      <section id="funkce" className="py-24 relative">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#2563eb" }}>Funkce</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
              Vše, co potřebujete<br />k{" "}
              <span style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                získání práce
              </span>.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) =>
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: "#2563eb" }}
              className="rounded-3xl bg-white border p-7 transition-all cursor-default"
              style={{ borderColor: "#e3e8f0" }}>
              
                <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl" style={{ background: "#e6f0ff" }}>
                  {f.icon}
                </div>
                <h3 className="mt-5 font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5b6577" }}>{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="jak-to-funguje" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#2563eb" }}>Jak to funguje</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Tři kroky k nové práci.</h2>
            <p className="mt-5" style={{ color: "#5b6577" }}>Žádné dlouhé formuláře. Žádné placené tarify. Nahrajte CV, nechte AI najít nabídky a aplikujte jedním klikem.</p>
            <button onClick={onStart} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
              Začít zdarma →
            </button>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {STEPS.map((s, i) =>
            <motion.div
              key={i}
              whileHover={{ borderColor: "#2563eb" }}
              className="rounded-3xl border bg-white p-7 flex gap-6 items-start transition-all"
              style={{ borderColor: "#e3e8f0", marginLeft: i * 28 }}>
              
                <div className="text-5xl font-extrabold leading-none w-20 shrink-0" style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{s.title}</h3>
                  <p className="mt-1.5" style={{ color: "#5b6577" }}>{s.desc}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#2563eb" }}>FAQ</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Časté otázky</h2>
        </div>
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-white" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)", boxShadow: "0 20px 60px -20px rgba(37,99,235,0.25)" }}>
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.10)" }} />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full blur-3xl" style={{ background: "rgba(20,184,166,0.40)" }} />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">Buďte mezi prvními,<br />kdo najde práci s AI.</h2>
            <p className="mt-6 text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>Přidejte se na waitlist. Prvních 100 uživatelů získá plný přístup zdarma.</p>
            <button
              onClick={onStart}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold hover:opacity-95 transition"
              style={{ color: "#2563eb" }}>
              
              Vyzkoušet platformu zdarma →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "#e3e8f0" }}>
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[hsl(var(--card))]">
          <div>
            <img src="https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/9adf27e99_image.png" alt="GetJob.cz" className="h-10 w-auto object-contain" />
            <p className="mt-4 text-sm max-w-xs" style={{ color: "#5b6577" }}>AI-powered job hunting platform. Made in Czechia.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm" style={{ color: "#5b6577" }}>
            <a href="#funkce" className="hover:text-foreground transition-colors">Funkce</a>
            <a href="#jak-to-funguje" className="hover:text-foreground transition-colors">Jak to funguje</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <span className="hover:text-foreground cursor-pointer transition-colors">Ochrana údajů</span>
            <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
          </div>
          <div className="text-xs" style={{ color: "#5b6577" }}>© 2026 GetJob.cz</div>
        </div>
      </footer>
    </div>);

}