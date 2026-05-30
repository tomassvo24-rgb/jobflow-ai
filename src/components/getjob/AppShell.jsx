import React, { useState } from "react";
import DiscoverTab from "./DiscoverTab";
import GeneratorTab from "./GeneratorTab";
import TrackerTab from "./TrackerTab";
import ProfileTab from "./ProfileTab";
import CVBuilderTab from "./CVBuilderTab";
import NewsTab from "./NewsTab";
import Logo from "./Logo";

const TABS = [
  { id: "discover", label: "🔍 Discover" },
  { id: "generator", label: "✉️ Generátor" },
  { id: "cvbuilder", label: "📝 CV Builder" },
  { id: "news", label: "📰 Novinky" },
  { id: "tracker", label: "📊 Tracker" },
  { id: "profile", label: "👤 Profil" },
];

export default function AppShell({ profile, discover, custom, tracker, onProfileSave, onDiscoverSave, onCustomSave, onTrackerSave, onReset, onGoHome }) {
  const [tab, setTab] = useState("discover");
  const [generatorPreset, setGeneratorPreset] = useState(null);

  const openGenerator = (company, type = "mail") => {
    setGeneratorPreset({ ...company, genType: type });
    setTab("generator");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-brand-blue border-b border-blue-700 sticky top-0 z-20 h-14 flex items-center px-6">
        <div className="pr-4 border-r border-white/20 mr-2 shrink-0">
          <Logo small dark onClick={onGoHome} />
        </div>
        <div className="flex flex-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 h-14 text-[13px] font-medium whitespace-nowrap border-b-[2.5px] transition-all flex items-center gap-1 ${tab === t.id ? "text-brand-teal border-brand-teal" : "text-white/60 border-transparent hover:text-white"}`}>
              {t.id === "tracker" && tracker.length > 0 ? `📊 Tracker (${tracker.length})` : t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto pl-4 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white text-brand-blue font-poppins text-sm font-bold flex items-center justify-center">
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[960px] mx-auto px-5 py-6">
        {tab === "discover" && <DiscoverTab profile={profile} discover={discover} custom={custom} tracker={tracker} onDiscoverSave={onDiscoverSave} onCustomSave={onCustomSave} onTrackerSave={onTrackerSave} onOpenGenerator={openGenerator} />}
        {tab === "generator" && <GeneratorTab profile={profile} allCompanies={[...discover, ...custom]} tracker={tracker} onTrackerSave={onTrackerSave} preset={generatorPreset} onPresetConsumed={() => setGeneratorPreset(null)} />}
        {tab === "cvbuilder" && <CVBuilderTab profile={profile} />}
        {tab === "news" && <NewsTab />}
        {tab === "tracker" && <TrackerTab tracker={tracker} onTrackerSave={onTrackerSave} />}
        {tab === "profile" && <ProfileTab profile={profile} onSave={onProfileSave} onReset={onReset} />}
      </main>

      <footer className="bg-brand-blue border-t border-blue-700 py-5 mt-5">
        <div className="max-w-[960px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <Logo small dark onClick={onGoHome} />
          <div className="flex gap-4 text-xs text-white/50">
            <span className="hover:text-white cursor-pointer transition-colors">O projektu</span>
            <span className="hover:text-white cursor-pointer transition-colors">Kontakt</span>
            <span className="hover:text-white cursor-pointer transition-colors">Ochrana dat</span>
          </div>
          <div className="text-xs text-white/40 font-mono">© 2026 getjob.cz · Powered by AI</div>
        </div>
      </footer>
    </div>
  );
}