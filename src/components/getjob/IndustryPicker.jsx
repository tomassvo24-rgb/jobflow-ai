import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const INDUSTRY_TREE = [
  {
    id: "gastro", label: "🍽️ Gastro & Restaurace",
    subs: ["Číšník / Číšnice", "Barman / Barmanka", "Obsluha", "Kuchař / Kuchařka", "Pomocný kuchař", "Pizzař", "Cukrář", "Šéfkuchař", "Dishwasher / Mycí"],
  },
  {
    id: "hotely", label: "🏨 Hotely & Ubytování",
    subs: ["Recepční", "Pokojská / Housekeeping", "Concierge", "Event koordinátor", "F&B manažer", "Night audit", "Spa terapeut"],
  },
  {
    id: "ridic", label: "🚗 Řidič & Doprava",
    subs: ["Řidič osobního vozu", "Řidič dodávky", "Řidič kamionu (C/CE)", "Kurýr / Doručovatel", "Taxikář / Uber", "Řidič autobusu", "Dispečer dopravy"],
  },
  {
    id: "admin", label: "🗂️ Administrativa",
    subs: ["Asistent/ka", "Office manager", "Recepční (kancelář)", "Sekretář/ka", "Správce dokumentů", "Fakturant/ka", "Back office"],
  },
  {
    id: "it", label: "💻 IT & Tech",
    subs: ["Frontend developer", "Backend developer", "Full-stack developer", "DevOps / SRE", "Data analyst", "UX/UI designer", "Tester / QA", "IT podpora", "Scrum master / PM"],
  },
  {
    id: "finance", label: "💰 Finance & Bankovnictví",
    subs: ["Účetní", "Finanční analytik", "Bankovní poradce", "Risk manažer", "Auditor", "Controller", "Daňový poradce"],
  },
  {
    id: "pravo", label: "⚖️ Právo & Advokacie",
    subs: ["Advokátní koncipient", "Právník / Jurist", "Paralegal", "Compliance officer", "Notářský asistent", "Firemní právník"],
  },
  {
    id: "marketing", label: "📣 Marketing & PR",
    subs: ["Marketing specialist", "Content creator", "Social media manager", "SEO/SEM specialista", "Copywriter", "PR specialista", "Brand manager", "Performance marketer"],
  },
  {
    id: "obchod", label: "🤝 Obchod & Prodej",
    subs: ["Obchodní zástupce", "Account manager", "Sales representative", "Key account manager", "Telemarketing", "Pokladní", "Prodejce v obchodě"],
  },
  {
    id: "logistika", label: "📦 Logistika & Sklad",
    subs: ["Skladník", "Manipulant", "Logistik", "Vedoucí skladu", "Picker / Packer", "Dispečer logistiky", "Supply chain"],
  },
  {
    id: "zdravotnictvi", label: "🏥 Zdravotnictví",
    subs: ["Zdravotní sestra", "Lékař / Lékařka", "Záchranář", "Laborant", "Fyzioterapeut", "Sociální pracovník", "Pečovatel/ka"],
  },
  {
    id: "vzdelavani", label: "🎓 Vzdělávání",
    subs: ["Učitel / Učitelka", "Lektor / Lektorka", "Vychovatel/ka", "Tutor", "Instruktor", "Koordinátor kurzů"],
  },
  {
    id: "stavebnictvi", label: "🏗️ Stavebnictví & Řemesla",
    subs: ["Elektrikář", "Instalatér", "Malíř / Natěrač", "Zedník", "Tesař", "Klempíř", "Stavební dělník", "Správce budov"],
  },
  {
    id: "it_support", label: "🛎️ Zákaznická podpora",
    subs: ["Zákaznický servis", "Call centrum operátor", "Customer success", "Helpdesk", "Reklamační technik"],
  },
  {
    id: "media", label: "🎬 Média & Kreativa",
    subs: ["Fotograf", "Videograf", "Grafik", "Animator", "Redaktor / Novinář", "Moderátor", "Herec / Herečka"],
  },
];

export default function IndustryPicker({ selected, onSubsChange }) {
  // selected = array of "Gastro / Číšník" type strings
  // We track which parent categories are open
  const [openIds, setOpenIds] = useState([]);

  const toggleOpen = (id) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSub = (parentLabel, sub) => {
    const val = `${parentLabel} / ${sub}`;
    if (selected.includes(val)) {
      onSubsChange(selected.filter(x => x !== val));
    } else {
      onSubsChange([...selected, val]);
    }
  };

  const countSelected = (parentLabel) => {
    return INDUSTRY_TREE.find(i => i.label === parentLabel)?.subs.filter(s => selected.includes(`${parentLabel} / ${s}`)).length || 0;
  };

  return (
    <div className="space-y-2">
      {INDUSTRY_TREE.map(cat => {
        const isOpen = openIds.includes(cat.id);
        const selectedCount = countSelected(cat.label);
        return (
          <div key={cat.id} className={`border rounded-xl overflow-hidden transition-all ${selectedCount > 0 ? "border-blue-300" : "border-border"}`}>
            <button
              onClick={() => toggleOpen(cat.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${isOpen ? "bg-blue-50" : "bg-white hover:bg-[#f4f4f0]"}`}
            >
              <span className="flex items-center gap-2">
                {cat.label}
                {selectedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">{selectedCount}</span>
                )}
              </span>
              <span className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 bg-[#f9f9f6] border-t border-border flex flex-wrap gap-2">
                    {cat.subs.map(sub => {
                      const val = `${cat.label} / ${sub}`;
                      const isSel = selected.includes(val);
                      return (
                        <button
                          key={sub}
                          onClick={() => toggleSub(cat.label, sub)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${isSel ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-border text-muted-foreground hover:border-blue-400 hover:text-blue-500"}`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}