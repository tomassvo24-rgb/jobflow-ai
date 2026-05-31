import React, { useState } from "react";
import DiscoverTab from "./DiscoverTab";
import GeneratorTab from "./GeneratorTab";
import TrackerTab from "./TrackerTab";
import ProfileTab from "./ProfileTab";
import CVBuilderTab from "./CVBuilderTab";
import NewsTab from "./NewsTab";
import Logo from "./Logo";
import AgentDiscoveryTab from "./discovery/AgentDiscoveryTab";

const TABS = [
  { id: "agent",     label: "AI Agent",   icon: "🤖" },
  { id: "discover",  label: "Discover",   icon: "🔍" },
  { id: "generator", label: "Generátor",  icon: "✉️" },
  { id: "cvbuilder", label: "CV Builder", icon: "📝" },
  { id: "news",      label: "Novinky",    icon: "📰" },
  { id: "tracker",   label: "Tracker",    icon: "📊" },
  { id: "profile",   label: "Profil",     icon: "👤" },
];

export default function AppShell({ profile, discover, custom, tracker, onProfileSave, onDiscoverSave, onCustomSave, onTrackerSave, onReset, onGoHome }) {
  const [tab, setTab] = useState("agent");
  const [generatorPreset, setGeneratorPreset] = useState(null);

  const openGenerator = (company, type = "mail") => {
    setGeneratorPreset({ ...company, genType: type });
    setTab("generator");
  };

  return (
    <div className="min-h-screen flex flex-col font-poppins" style={{ background: "#f6f8fb" }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 h-[58px] flex items-center px-5 md:px-8 border-b"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          borderColor: "#e3e8f0",
          boxShadow: "0 1px 24px 0 rgba(13,27,42,0.06)",
        }}
      >
        {/* Logo */}
        <div className="shrink-0 pr-5 border-r mr-5" style={{ borderColor: "#e3e8f0" }}>
          <Logo small onClick={onGoHome} />
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:flex flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            const label = t.id === "tracker" && tracker.length > 0 ? `${t.icon} Tracker (${tracker.length})` : `${t.icon} ${t.label}`;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative h-[58px] px-4 text-[13px] font-semibold whitespace-nowrap transition-all"
                style={{ color: isActive ? "#2563eb" : "#5b6577" }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full"
                    style={{ background: "linear-gradient(90deg,#2563eb,#14b8a6)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile: current tab label */}
        <div className="md:hidden flex-1 text-center text-sm font-semibold" style={{ color: "#0d1b2a" }}>
          {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
        </div>

        {/* Avatar */}
        <div className="ml-auto pl-4 shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#14b8a6)" }}
          >
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 md:px-6 py-7 pb-28 md:pb-10">
        {tab === "agent"     && <AgentDiscoveryTab profile={profile} onOpenGenerator={openGenerator} />}
        {tab === "discover"  && <DiscoverTab profile={profile} discover={discover} custom={custom} tracker={tracker} onDiscoverSave={onDiscoverSave} onCustomSave={onCustomSave} onTrackerSave={onTrackerSave} onOpenGenerator={openGenerator} />}
        {tab === "generator" && <GeneratorTab profile={profile} allCompanies={[...discover, ...custom]} tracker={tracker} onTrackerSave={onTrackerSave} preset={generatorPreset} onPresetConsumed={() => setGeneratorPreset(null)} />}
        {tab === "cvbuilder" && <CVBuilderTab profile={profile} />}
        {tab === "news"      && <NewsTab />}
        {tab === "tracker"   && <TrackerTab tracker={tracker} onTrackerSave={onTrackerSave} />}
        {tab === "profile"   && <ProfileTab profile={profile} onSave={onProfileSave} onReset={onReset} />}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderColor: "#e3e8f0" }}
      >
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all"
              style={{ color: isActive ? "#2563eb" : "#9ca3af" }}
            >
              <span className="text-base leading-none">{t.icon}</span>
              <span className="text-[9px] font-semibold leading-none mt-0.5">{t.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <footer className="hidden md:block border-t py-5" style={{ background: "rgba(255,255,255,0.7)", borderColor: "#e3e8f0" }}>
        <div className="max-w-[1000px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <Logo small onClick={onGoHome} />
          <div className="flex gap-5 text-xs" style={{ color: "#9ca3af" }}>
            <span className="hover:text-foreground cursor-pointer transition-colors">O projektu</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Kontakt</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Ochrana dat</span>
          </div>
          <div className="text-xs font-mono" style={{ color: "#9ca3af" }}>© 2026 getjob.cz · Powered by AI</div>
        </div>
      </footer>
    </div>
  );
}