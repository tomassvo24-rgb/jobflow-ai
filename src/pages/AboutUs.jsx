import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/getjob/ThemeToggle";

const VALUES = [
  { icon: "🎯", title: "Relevance", desc: "Nabízíme jen to, co skutečně odpovídá vašemu profilu. Žádné generické nabídky." },
  { icon: "🤖", title: "AI pro lidi", desc: "Technologie je nástroj. Rozhodujete vy — AI vám jen pomáhá být lepší verzí sebe." },
  { icon: "🔒", title: "Soukromí", desc: "Vaše CV ani data nesdílíme se třetími stranami. Nikdy." },
  { icon: "🇨🇿", title: "Made in Czechia", desc: "Vznikli jsme v Praze a myslíme lokálně — rozumíme českému trhu práce." },
];

const TEAM = [
  { name: "Tomáš Becher", role: "CEO & Co-founder", phone: "+420 666 577 407", desc: "CEO & mezi sociálními věcmi a technologiemi se cítí jako doma." },
  { name: "Tomáš Svoboda", role: "CTO & Co-founder", phone: "+420 666 577 407", desc: "Vznikli jsme v Praze a myslíme lokálně." },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen font-poppins" style={{ background: "#f6f8fb", color: "#0d1b2a" }}>

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ background: "rgba(255,255,255,0.85)", borderColor: "#e3e8f0" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/?home=1">
            <img src="https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png" alt="GetJob.cz" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
            <Link to="/" className="hover:text-blue-600 transition-colors" style={{ color: "#0d1b2a" }}>Domů</Link>
            <Link to="/o-nas" className="text-blue-600 font-bold">O nás</Link>
            <Link to="/kontakt" className="hover:text-blue-600 transition-colors" style={{ color: "#0d1b2a" }}>Kontakt</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg,#0d1b2a 0%,#1e3a5f 100%)" }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "#2563eb" }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ background: "rgba(37,99,235,0.25)", color: "#93c5fd" }}>
            🙌 Jsme GetJob.cz
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-3xl">
            Hledání práce<br />
            <span style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              nemu být frustrující.
            </span>
          </h1>
          <p className="mt-6 text-lg max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
            Věříme, že hledání práce nemu být. Postavili jsme platformu, která vznikl z přístupu — aby každý našel práci, která nu skutečně sedí. Spojujeme sílu AI a lidský přístup.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#2563eb" }}>Náš příběh</div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">Jak to začalo</h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#5b6577" }}>
            <p>
              GetJob.cz vznikl z frustrace. Procházeli jsme stovky generických motivačních dopisů a věřili jsme, že AI může přístup motoinast lepším způsobem. Čekali jsme na odpovědi, které nikdy nepřišly.
            </p>
            <p>
              Věděli jsme, že ne existovat to, co prvním naší práci. Jsme za sme vám cíleně relevantní pozici a pazní přesevzdlívých skutečně sedí.
            </p>
            <p>
              V roce 2025 jsme začali platforma konterátoru AI výzýna mozi, ale jako skutečný nástroj — pro analýzu CV relevantní pozici paziny presedních přihlášek. Dnes budujeme tým, který chytele. A jsme tepne na začátku.
            </p>
          </div>
        </div>
        <div className="rounded-3xl p-10 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "#fff" }} />
          <div className="relative text-5xl font-extrabold leading-tight mb-4">
            "Každý si zaslouží práci, která ho baví."
          </div>
          <div className="text-base" style={{ color: "rgba(255,255,255,0.80)" }}>— Tým GetJob.cz</div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#2563eb" }}>Co nás řídí</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Naše hodnoty</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="rounded-3xl border p-7 text-center hover:shadow-lg transition-all" style={{ borderColor: "#e3e8f0" }}>
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl mx-auto mb-5" style={{ background: "#e6f0ff" }}>{v.icon}</div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5b6577" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#2563eb" }}>Lidé za produktem</div>
          <h2 className="text-4xl font-extrabold tracking-tight">Tým</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {TEAM.map((m, i) => (
            <div key={i} className="rounded-3xl border bg-white p-8 flex gap-5 items-start hover:shadow-lg transition-all" style={{ borderColor: "#e3e8f0" }}>
              <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg,#e6f0ff,#d1fae5)" }}>👤</div>
              <div>
                <div className="font-bold text-lg">{m.name}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#2563eb" }}>{m.role}</div>
                <div className="text-sm" style={{ color: "#5b6577" }}>{m.phone}</div>
                <div className="text-sm mt-2" style={{ color: "#5b6577" }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-white" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.10)" }} />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Připojte se k nám</h2>
            <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>Buďte mezi prvními, kdo najde práci s AI GetJob.cz.</p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold hover:opacity-95 transition" style={{ color: "#2563eb" }}>
              Přidat se na waitlist →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "#e3e8f0", color: "#5b6577" }}>
        © 2026 GetJob.cz — Made in Czechia
      </footer>
    </div>
  );
}