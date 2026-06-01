import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/getjob/ThemeToggle";
import { base44 } from "@/api/base44Client";

const SOCIAL = [
  { label: "getjob@gmail.com", icon: "✉️", href: "mailto:getjob@gmail.com" },
  { label: "linkedin.com/company/getjobcz", icon: "💼", href: "https://linkedin.com/company/getjobcz" },
  { label: "@getjobcz", icon: "📘", href: "#" },
  { label: "facebook.com/getjobcz", icon: "🔵", href: "https://facebook.com/getjobcz" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.functions.invoke('sendContactEmail', {
      name: form.name,
      email: form.email,
      message: form.message,
    });
    setSending(false);
    setSent(true);
  };

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
            <Link to="/o-nas" className="hover:text-blue-600 transition-colors" style={{ color: "#0d1b2a" }}>O nás</Link>
            <Link to="/kontakt" className="text-blue-600 font-bold">Kontakt</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg,#0d1b2a 0%,#1e3a5f 100%)" }}>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "#2563eb" }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ background: "rgba(37,99,235,0.25)", color: "#93c5fd" }}>
            📬 Jsme tu pro vás
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Kontaktujte nás
          </h1>
          <p className="mt-6 text-lg max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
            Máte otázku, nápad nebo chcete spolupracovat? Ozvěte se nám — rádi vám pomůžeme.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">

        {/* FORM */}
        <div className="rounded-3xl bg-white border p-8 shadow-sm" style={{ borderColor: "#e3e8f0" }}>
          <h2 className="text-2xl font-extrabold mb-6">Napište nám</h2>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-full grid place-items-center text-3xl" style={{ background: "#d1fae5" }}>✓</div>
              <p className="text-xl font-bold">Zpráva odeslána!</p>
              <p className="text-sm" style={{ color: "#5b6577" }}>Ozveme se vám do 24 hodin.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-2 rounded-full border px-6 py-2.5 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition"
                style={{ borderColor: "#e3e8f0", color: "#5b6577" }}
              >
                Odeslat další zprávu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#5b6577" }}>Jméno</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Jan Novák"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{ borderColor: "#e3e8f0" }}
                    onFocus={e => e.target.style.borderColor = "#2563eb"}
                    onBlur={e => e.target.style.borderColor = "#e3e8f0"}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#5b6577" }}>Email</label>
                  <input
                    required type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="vas@email.cz"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition"
                    style={{ borderColor: "#e3e8f0" }}
                    onFocus={e => e.target.style.borderColor = "#2563eb"}
                    onBlur={e => e.target.style.borderColor = "#e3e8f0"}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#5b6577" }}>Zpráva</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Vaše zpráva…"
                  rows={5}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition resize-none"
                  style={{ borderColor: "#e3e8f0" }}
                  onFocus={e => e.target.style.borderColor = "#2563eb"}
                  onBlur={e => e.target.style.borderColor = "#e3e8f0"}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full text-white py-3.5 text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
                style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)" }}
                disabled={sending}
              >
                {sending ? "Odesílám…" : "Odeslat zprávu →"}
              </button>
            </form>
          )}
        </div>

        {/* CONTACT INFO */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border p-8 shadow-sm" style={{ borderColor: "#e3e8f0" }}>
            <h2 className="text-2xl font-extrabold mb-6">Spojte se s námi</h2>
            <div className="space-y-4">
              {SOCIAL.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="flex items-center gap-4 p-4 rounded-2xl border hover:border-blue-300 hover:shadow-sm transition-all"
                  style={{ borderColor: "#e3e8f0" }}
                >
                  <span className="text-2xl w-10 text-center">{s.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: "#0d1b2a" }}>{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#2563eb 0%,#14b8a6 100%)", borderColor: "transparent" }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "#fff" }} />
            <div className="relative">
              <div className="text-2xl font-extrabold mb-2">Firemní adresa</div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                Václavské náměstí 1234/12<br />
                110 00 Praha 1<br />
                Česká republika
              </p>
            </div>
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