import React, { useState } from "react";

const TIPS = [
  "Personalizuj každý mail — zmíň konkrétní projekt nebo hodnotu firmy. Ukáže to, že jsi udělal research.",
  "LinkedIn profil aktualizuj před každou přihláškou. Recruiters ho vždy zkontrolují.",
  "Follow-up email po 48–72 hodinách zvyšuje šanci na odpověď o 40 %.",
  "Motivační dopis max. 1 strana A4. Kvalita nad kvantitou.",
  "Při pohovoru měj připravené 3 konkrétní příklady ze svých zkušeností.",
  "Výzkum ukazuje, že optimální čas odeslání přihlášky je úterý–čtvrtek dopoledne.",
  "Networking tvoří 70 % pracovních příležitostí.",
];

export default function Sidebar() {
  const [tip, setTip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = () => {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      {/* Newsletter */}
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#2756F3,#1d46d8)" }}>
        <div className="font-playfair text-base font-bold mb-1.5 text-white">📬 Pracovní novinky</div>
        <p className="text-xs text-blue-100 mb-4 leading-relaxed">Dostávej nejlepší nabídky a tipy přímo do emailu. 1× týdně, žádný spam.</p>
        {subscribed ? (
          <div className="text-sm font-semibold text-white bg-white/20 rounded-xl p-3 text-center">✓ Přihlášen k odběru!</div>
        ) : (
          <div className="flex flex-col gap-2">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="tvůj@email.cz"
              className="bg-white/15 border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all" />
            <button onClick={subscribe} className="bg-white text-blue-700 rounded-full px-4 py-2.5 text-sm font-bold hover:bg-blue-50 transition-colors">Přihlásit se k odběru</button>
          </div>
        )}
      </div>

      {/* Ad banner */}
      <div className="bg-gradient-to-br from-[#f0f7f3] to-blue-50 border border-blue-200 rounded-xl p-4 text-center relative">
        <span className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest text-muted-foreground font-mono uppercase">Partneři</span>
        <div className="text-3xl mb-2">🎓</div>
        <div className="font-bold text-sm mb-1">Jazykové kurzy online</div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Zlepši svoji angličtinu a němčinu. Kurzy od 299 Kč/měsíc.</p>
        <button className="w-full px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Zjistit více</button>
      </div>

      {/* Tip of day */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
        <div className="font-playfair font-bold text-sm mb-3">💡 Tip dne</div>
        <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
        <button onClick={() => setTip(TIPS[Math.floor(Math.random() * TIPS.length)])}
          className="mt-3 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">🔄 Další tip</button>
      </div>

      {/* Ad banner 2 */}
      <div className="bg-gradient-to-br from-[#f0f7f3] to-blue-50 border border-blue-200 rounded-xl p-4 text-center relative">
        <span className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest text-muted-foreground font-mono uppercase">Partneři</span>
        <div className="text-3xl mb-2">💻</div>
        <div className="font-bold text-sm mb-1">IT kurzy — Czechitas</div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Nauč se programovat a získej práci v IT za 6 měsíců.</p>
        <button className="w-full px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">Chci vědět více</button>
      </div>
    </div>
  );
}