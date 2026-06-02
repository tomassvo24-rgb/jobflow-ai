import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/getjob/ThemeToggle";

const LOGO_LIGHT = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/a4e34759e_getjob_logo_white-removebg-preview.png";
const LOGO_DARK = "https://media.base44.com/images/public/69fc9f905d0066a88e5bce3f/8a276674d_e9868ad2-36e2-46c9-921c-b693ef439451.png";

function useDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}
import { base44 } from "@/api/base44Client";

const CONTACTS = [
  {
    icon: "✉️",
    label: "EMAIL",
    value: "getjobcz1@gmail.com",
    href: "mailto:getjobcz1@gmail.com"
  },
  {
    icon: "💼",
    label: "LINKEDIN",
    value: "linkedin.com/company/getjobcz",
    href: "https://linkedin.com/company/getjobcz"
  },
  {
    icon: "🎵",
    label: "TIKTOK",
    value: "@getjobcz",
    href: "https://tiktok.com/@getjobcz"
  },
  {
    icon: "📷",
    label: "INSTAGRAM",
    value: "@getjobcz",
    href: "https://instagram.com/getjobcz"
  },
  {
    icon: "👍",
    label: "FACEBOOK",
    value: "facebook.com/getjobcz",
    href: "https://facebook.com/getjobcz"
  },
  {
    icon: "📍",
    label: "ADRESA",
    value: "Volutová 2524/12, 158 00 Praha 13-Stodůlky",
    href: null
  }
];

export default function Contact() {
  const dark = useDark();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.functions.invoke("sendContactEmail", {
      name: form.name,
      email: form.email,
      message: form.message
    });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen font-poppins bg-background text-foreground">

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/90 border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img
              src={dark ? LOGO_DARK : LOGO_LIGHT}
              alt="GetJob.cz" className={dark ? "h-28 w-auto object-contain" : "h-9 w-auto object-contain"}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-foreground">
            <Link to="/home" className="hover:text-primary transition-colors">Domů</Link>
            <Link to="/o-nas" className="hover:text-primary transition-colors">O nás</Link>
            <Link to="/kontakt" className="text-primary font-semibold">Kontakt</Link>
            <Link to="/ochrana-udaju" className="hover:text-primary transition-colors">Ochrana údajů</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-24 text-white text-center" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)" }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#fff" }} />
        <div className="max-w-3xl mx-auto px-6 relative">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">Kontaktujte nás</h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
            Máte dotaz, nápad nebo nás chcete jen pozdravit? Ozvěte se.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* LEFT — contact info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-foreground mb-6">Spojte se s námi</h2>

            {CONTACTS.map((c, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all">
                <span className="text-2xl w-10 text-center shrink-0">{c.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline truncate block">
                      {c.value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">{c.value}</span>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-border bg-muted p-5 mt-4">
              <div className="flex items-center gap-2 font-bold text-foreground mb-1">
                <span>🕐</span> Doba odezvy
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Snažíme se odpovídat do 24 hodin ve všední dny. O víkendu to může trvat o něco déle.
              </p>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm h-fit">
            <h2 className="text-2xl font-extrabold text-foreground mb-6">Napište nám</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full grid place-items-center text-3xl" style={{ background: "rgba(20,184,166,0.12)" }}>✓</div>
                <p className="text-xl font-bold text-foreground">Zpráva odeslána!</p>
                <p className="text-sm text-muted-foreground">Ozveme se vám do 24 hodin.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary transition"
                >
                  Odeslat další zprávu
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Jméno</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Vaše jméno"
                    className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Email</label>
                  <input
                    required type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="vas@email.cz"
                    className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Zpráva</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Čím vám můžeme pomoci?"
                    rows={5}
                    className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-primary transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full text-white py-3.5 text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)" }}
                >
                  {sending ? "Odesílám…" : "Odeslat zprávu →"}
                </button>
              </form>
            )}
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