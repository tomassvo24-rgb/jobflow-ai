import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/getjob/ThemeToggle";

const VALUES = [
  {
    icon: "🎯",
    title: "Relevance",
    desc: "Nabízíme jen to, co skutečně sedí vašemu profilu. Žádný spam, žádné zbytečné nabídky."
  },
  {
    icon: "🤖",
    title: "AI pro lidi",
    desc: "Technologie je nástroj. Rozhodnutí jsou vždy na vás — AI jen šetří váš čas."
  },
  {
    icon: "🔒",
    title: "Soukromí",
    desc: "Vaše CV ani data nesdílíme s třetími stranami. Nikdy."
  },
  {
    icon: "🇨🇿",
    title: "Made in Czechia",
    desc: "Vznikli jsme v Praze, myslíme lokálně a rozumíme českému trhu práce."
  }
];

const TEAM = [
  { name: "Tomáš Becher", role: "CEO & Co-founder", phone: "+420 774 122 939" },
  { name: "Tomáš Svoboda", role: "CEO & Co-founder", phone: "+420 608 377 407" }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen font-poppins bg-background text-foreground">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/90 border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img
              src="https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png"
              alt="GetJob.cz" className="h-9 w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <Link to="/home" className="hover:text-primary transition-colors">Domů</Link>
            <Link to="/o-nas" className="text-primary font-semibold">O nás</Link>
            <Link to="/kontakt" className="hover:text-primary transition-colors">Kontakt</Link>
            <Link to="/ochrana-udaju" className="hover:text-primary transition-colors">Ochrana údajů</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-24 text-white text-center" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#fff" }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#fff" }} />
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>
            Náš příběh
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Jsme GetJob.cz</h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
            Věříme, že hledání práce nemusí být stres. Postavili jsme platformu, která spojuje sílu AI s lidským přístupem — aby každý našel práci, která mu skutečně sedí.
          </p>
        </div>
      </section>

      {/* HOW IT STARTED */}
      <section className="bg-background py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Jak to začalo</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">Jak to začalo</h2>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>GetJob.cz vznikl z frustrace. Procházeli jsme stovky nabídek, psali generické motivační dopisy a čekali na odpovědi, které nikdy nepřišly. Věděli jsme, že musí existovat lepší způsob.</p>
            <p>V roce 2025 jsme začali stavět platformu, která AI využívá ne jako buzzword, ale jako skutečný nástroj — pro analýzu CV, hledání relevantních pozic a psaní přesvědčivých přihlášek.</p>
            <p>Dnes budujeme komunitu lidí, kteří chtějí najít práci chytřeji. A jsme teprve na začátku.</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Co nás řídí</div>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Naše hodnoty</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border p-7 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl mx-auto mb-5" style={{ background: "rgba(37,99,235,0.08)" }}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Lidé za produktem</div>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Tým</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((m, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-8 flex gap-5 items-center hover:shadow-md transition-all">
                <div
                  className="w-16 h-16 rounded-full grid place-items-center text-2xl font-extrabold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)" }}
                >
                  {m.name[0]}
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground">{m.name}</div>
                  <div className="text-sm font-semibold text-primary mb-1">{m.role}</div>
                  <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="text-sm text-primary hover:underline">{m.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl text-white text-center relative overflow-hidden py-16 px-10" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "#fff" }} />
          <div className="relative">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Připojte se k nám</h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.88)" }}>Buďte mezi prvními, kdo najde práci s GetJob.cz.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold hover:opacity-95 transition"
              style={{ color: "#2563eb" }}
            >
              Přidat se na waitlist →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 GetJob.cz</span>
          <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
        </div>
      </footer>
    </div>
  );
}