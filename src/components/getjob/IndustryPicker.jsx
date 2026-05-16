import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const INDUSTRY_TREE = [
  { id: "gastro", label: "🍽️ Gastro", subs: ["Číšník / Číšnice", "Barman / Barmanka", "Obsluha", "Kuchař / Kuchařka", "Pomocný kuchař", "Pizzař", "Cukrář", "Šéfkuchař", "Dishwasher / Mycí"] },
  { id: "hotely", label: "🏨 Hotely", subs: ["Recepční", "Pokojská / Housekeeping", "Concierge", "Event koordinátor", "F&B manažer", "Night audit", "Spa terapeut"] },
  { id: "ridic", label: "🚗 Řidič", subs: ["Řidič osobního vozu", "Řidič dodávky", "Řidič kamionu (C/CE)", "Kurýr / Doručovatel", "Taxikář / Uber", "Řidič autobusu", "Dispečer dopravy"] },
  { id: "admin", label: "🗂️ Administrativa", subs: ["Asistent/ka", "Office manager", "Recepční (kancelář)", "Sekretář/ka", "Správce dokumentů", "Fakturant/ka", "Back office"] },
  { id: "it", label: "💻 IT & Tech", subs: ["Frontend developer", "Backend developer", "Full-stack developer", "DevOps / SRE", "Data analyst", "UX/UI designer", "Tester / QA", "IT podpora", "Scrum master / PM"] },
  { id: "finance", label: "💰 Finance", subs: ["Účetní", "Finanční analytik", "Bankovní poradce", "Risk manažer", "Auditor", "Controller", "Daňový poradce"] },
  { id: "pravo", label: "⚖️ Právo", subs: ["Advokátní koncipient", "Právník / Jurist", "Paralegal", "Compliance officer", "Notářský asistent", "Firemní právník"] },
  { id: "marketing", label: "📣 Marketing", subs: ["Marketing specialist", "Content creator", "Social media manager", "SEO/SEM specialista", "Copywriter", "PR specialista", "Brand manager", "Performance marketer"] },
  { id: "obchod", label: "🤝 Obchod", subs: ["Obchodní zástupce", "Account manager", "Sales representative", "Key account manager", "Telemarketing", "Pokladní", "Prodejce v obchodě"] },
  { id: "logistika", label: "📦 Logistika", subs: ["Skladník", "Manipulant", "Logistik", "Vedoucí skladu", "Picker / Packer", "Dispečer logistiky", "Supply chain"] },
  { id: "zdravotnictvi", label: "🏥 Zdravotnictví", subs: ["Zdravotní sestra", "Lékař / Lékařka", "Záchranář", "Laborant", "Fyzioterapeut", "Sociální pracovník", "Pečovatel/ka"] },
  { id: "vzdelavani", label: "🎓 Vzdělávání", subs: ["Učitel / Učitelka", "Lektor / Lektorka", "Vychovatel/ka", "Tutor", "Instruktor", "Koordinátor kurzů"] },
  { id: "stavebnictvi", label: "🏗️ Řemesla", subs: ["Elektrikář", "Instalatér", "Malíř / Natěrač", "Zedník", "Tesař", "Klempíř", "Stavební dělník", "Správce budov"] },
  { id: "support", label: "🛎️ Zákaznická podpora", subs: ["Zákaznický servis", "Call centrum operátor", "Customer success", "Helpdesk", "Reklamační technik"] },
  { id: "media", label: "🎬 Média & Kreativa", subs: ["Fotograf", "Videograf", "Grafik", "Animator", "Redaktor / Novinář", "Moderátor", "Herec / Herečka"] },
];

// A selected value is either "catId" (whole category) or "catId/SubName"
export default function IndustryPicker({ selected, onSubsChange }) {
  const [openId, setOpenId] = useState(null);

  const isWholeSelected = (id) => selected.includes(id);
  const isSubSelected = (id, sub) => selected.includes(`${id}/${sub}`);
  const hasAnySelected = (cat) => isWholeSelected(cat.id) || cat.subs.some(s => isSubSelected(cat.id, s));

  const toggleWhole = (cat) => {
    const key = cat.id;
    if (isWholeSelected(key)) {
      // deselect whole + all subs
      onSubsChange(selected.filter(x => x !== key && !x.startsWith(`${key}/`)));
    } else {
      // select whole, remove any individual subs
      onSubsChange([...selected.filter(x => !x.startsWith(`${key}/`)), key]);
    }
  };

  const toggleSub = (cat, sub) => {
    const key = `${cat.id}/${sub}`;
    // If whole is selected, clicking sub deselects whole and selects all others except this
    if (isWholeSelected(cat.id)) {
      const others = cat.subs.filter(s => s !== sub).map(s => `${cat.id}/${s}`);
      onSubsChange([...selected.filter(x => x !== cat.id), ...others]);
    } else if (isSubSelected(cat.id, sub)) {
      onSubsChange(selected.filter(x => x !== key));
    } else {
      onSubsChange([...selected, key]);
    }
  };

  const handleBubbleClick = (cat) => {
    setOpenId(prev => prev === cat.id ? null : cat.id);
  };

  return (
    <div>
      {/* Bubble grid */}
      <div className="flex flex-wrap gap-2 mb-3">
        {INDUSTRY_TREE.map(cat => {
          const active = hasAnySelected(cat);
          const isOpen = openId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleBubbleClick(cat)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all select-none
                ${isOpen ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                ${active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-border text-muted-foreground hover:border-blue-400 hover:text-blue-500"}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sub-panel for open category */}
      <AnimatePresence>
        {openId && (() => {
          const cat = INDUSTRY_TREE.find(c => c.id === openId);
          if (!cat) return null;
          return (
            <motion.div
              key={openId}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="bg-[#f4f9ff] border border-blue-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{cat.label}</span>
                <button
                  onClick={() => toggleWhole(cat)}
                  className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all ${isWholeSelected(cat.id) ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                >
                  {isWholeSelected(cat.id) ? "✓ Celý obor" : "Celý obor"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.subs.map(sub => {
                  const isSel = isSubSelected(cat.id, sub) || isWholeSelected(cat.id);
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSub(cat, sub)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${isSel ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-border text-muted-foreground hover:border-blue-400 hover:text-blue-500"}`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}