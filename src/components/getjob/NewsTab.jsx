import React, { useState } from "react";
import Sidebar from "./Sidebar";

const NEWS_DATA = [
  { cat: "Trh práce", title: "AI mění svět práce — které pozice jsou nejžádanější v 2026?", date: "7. 5. 2026", icon: "🤖", bg: "#e8f5ee", body: "Počet pracovních míst vyžadujících znalost AI nástrojů vzrostl o 340 % za poslední rok. Nejvíce poptávané jsou pozice v data science, AI inženýrství a AI product managementu." },
  { cat: "Studenti", title: "5 tipů jak získat stáž v top firmě bez zkušeností", date: "5. 5. 2026", icon: "🎓", bg: "#eff6ff", body: "Recruiteři z McKinsey, Deloitte a EY prozradili, co hledají u studentů bez praxe. Klíčem je prokázat analytické myšlení a zájem o obor — ne certifikáty." },
  { cat: "Platy", title: "Průměrné platy v IT v ČR 2026: kdo vydělává nejvíc?", date: "3. 5. 2026", icon: "💰", bg: "#fef3c7", body: "Senior backend developer průměrně bere 120 000 Kč/měs., zatímco junior pozice startují na 45 000. Data science a AI role jsou nejlépe placené v celém sektoru." },
  { cat: "Kariéra", title: "Remote vs. office: co opravdu chtějí zaměstnanci v 2026?", date: "1. 5. 2026", icon: "🏠", bg: "#f5f3ff", body: "Průzkum mezi 10 000 zaměstnanci ukázal, že 67 % preferuje hybridní model. Plně remote pozice jsou nejžádanější v IT, marketing a HR sektorech." },
  { cat: "Inspirace", title: "Příběh: Z práva k venture capital — jak Tomáš vybudoval kariéru snů", date: "29. 4. 2026", icon: "⭐", bg: "#fef2f2", body: "Tomáš studoval práva, ale vždy ho zajímaly investice. Po stáži v J&T přešel do VC fondu a dnes investuje do startupů. Jeho klíčová rada: nebát se ptát." },
  { cat: "Tipy", title: "Jak napsat životopis, který AI recruiteři nepřeskočí", date: "27. 4. 2026", icon: "📄", bg: "#e8f5ee", body: "80 % velkých firem používá ATS systémy pro třídění CV. Naučte se klíčová slova a formát, který projde automatickým filtrem a dostane se k člověku." },
];

export default function NewsTab() {
  const [openArticle, setOpenArticle] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div>
        <h2 className="font-playfair text-[22px] font-bold mb-5">Novinky & Inspirace 📰</h2>

        {/* Featured 2 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {NEWS_DATA.slice(0, 2).map((n, i) => (
            <div key={i} onClick={() => setOpenArticle(n)}
              className="bg-white border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-border/80 hover:-translate-y-0.5 transition-all">
              <div className="h-28 flex items-center justify-center text-5xl" style={{ background: n.bg }}>{n.icon}</div>
              <div className="p-4">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono mb-1">{n.cat}</div>
                <div className="font-playfair font-bold text-sm text-foreground leading-snug mb-1">{n.title}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{n.date}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono mb-3">Nejnovější články</p>
        {NEWS_DATA.slice(2).map((n, i) => (
          <div key={i} onClick={() => setOpenArticle(n)}
            className="bg-white border border-border rounded-xl p-4 mb-2.5 flex gap-4 items-start cursor-pointer hover:shadow-md hover:border-border/80 transition-all">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center text-2xl shrink-0" style={{ background: n.bg }}>{n.icon}</div>
            <div>
              <div className="font-semibold text-sm text-foreground mb-0.5">{n.title}</div>
              <div className="text-xs text-muted-foreground">{n.cat} · {n.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#2756F3,#1d46d8)" }}>
          <div className="font-playfair text-base font-bold mb-1.5 text-white">📬 Newsletter</div>
          <p className="text-xs text-blue-100 mb-4 leading-relaxed">Novinky ze světa práce každý týden. Přihlás se zdarma.</p>
          <div className="flex flex-col gap-2">
            <input type="email" placeholder="tvůj@email.cz" className="bg-white/15 border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:border-white/60 transition-all" />
            <button className="bg-white text-blue-700 rounded-full px-4 py-2.5 text-sm font-bold hover:bg-blue-50 transition-colors">Přihlásit se</button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#f0f7f3] to-blue-50 border border-blue-200 rounded-xl p-4 text-center relative">
          <span className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest text-muted-foreground font-mono uppercase">Partneři</span>
          <div className="text-3xl mb-2">🚀</div>
          <div className="font-bold text-sm mb-1">Startup víkend Praha</div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Postav produkt za 54 hodin. Networking, mentoři, ceny.</p>
          <button className="w-full px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Registrovat se</button>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <div className="font-playfair font-bold text-sm mb-3">📊 Trh práce v číslech</div>
          <div className="text-sm text-muted-foreground space-y-1">
            {[["Volných míst (ČR)", "341 000", "text-blue-600"], ["Průměrná mzda", "46 500 Kč", ""], ["IT průměr", "78 000 Kč", ""], ["Nezaměstnanost", "3.9 %", ""]].map(([l, v, c]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span>{l}</span><span className={`font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article modal */}
      {openArticle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setOpenArticle(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="h-32 flex items-center justify-center text-6xl" style={{ background: openArticle.bg }}>{openArticle.icon}</div>
            <div className="p-6">
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono mb-2">{openArticle.cat} · {openArticle.date}</div>
              <h3 className="font-playfair text-xl font-bold mb-4 leading-snug">{openArticle.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{openArticle.body}</p>
              <button onClick={() => setOpenArticle(null)} className="px-5 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Zavřít</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}