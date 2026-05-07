import React, { useState } from "react";
import DiscoverTab from "./DiscoverTab";
import GeneratorTab from "./GeneratorTab";
import TrackerTab from "./TrackerTab";
import ProfileTab from "./ProfileTab";

const TABS = [
  { id: "discover", label: "🔍 Discover" },
  { id: "generator", label: "✉️ Generátor" },
  { id: "tracker", label: "📊 Tracker" },
  { id: "profile", label: "👤 Profil" },
];

export default function AppShell({ profile, discover, custom, tracker, onProfileSave, onDiscoverSave, onCustomSave, onTrackerSave, onReset }) {
  const [tab, setTab] = useState("discover");
  const [generatorPreset, setGeneratorPreset] = useState(null);

  const openGenerator = (company) => {
    setGeneratorPreset(company);
    setTab("generator");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center px-4 overflow-x-auto">
          <div className="font-syne text-lg font-black text-primary tracking-tight py-4 pr-4 border-r border-border mr-2 whitespace-nowrap shrink-0">
            getjob<span className="opacity-40 font-normal">.cz</span>
          </div>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                tab === t.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {t.id === "tracker" && tracker.length > 0
                ? `📊 Tracker (${tracker.length})`
                : t.label}
            </button>
          ))}
          <div className="ml-auto pl-4 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-syne text-sm font-bold flex items-center justify-center">
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        {tab === "discover" && (
          <DiscoverTab
            profile={profile}
            discover={discover}
            custom={custom}
            tracker={tracker}
            onDiscoverSave={onDiscoverSave}
            onCustomSave={onCustomSave}
            onTrackerSave={onTrackerSave}
            onOpenGenerator={openGenerator}
          />
        )}
        {tab === "generator" && (
          <GeneratorTab
            profile={profile}
            allCompanies={[...discover, ...custom]}
            tracker={tracker}
            onTrackerSave={onTrackerSave}
            preset={generatorPreset}
            onPresetConsumed={() => setGeneratorPreset(null)}
          />
        )}
        {tab === "tracker" && (
          <TrackerTab
            tracker={tracker}
            onTrackerSave={onTrackerSave}
          />
        )}
        {tab === "profile" && (
          <ProfileTab
            profile={profile}
            onSave={onProfileSave}
            onReset={onReset}
          />
        )}
      </main>

      <footer className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground">
        getjob.cz &nbsp;·&nbsp; Powered by AI &nbsp;·&nbsp;
        <a href="mailto:info@getjob.cz" className="hover:text-primary transition-colors">Kontakt</a>
      </footer>
    </div>
  );
}