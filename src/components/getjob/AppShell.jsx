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
  { id: "discover",  label: "Job Board",  },
  { id: "generator", label: "Generátor",  },
  { id: "cvbuilder", label: "CV Builder", },
  { id: "news",      label: "Novinky",    },
  { id: "tracker",   label: "Tracker",    },
  { id: "profile",   label: "Profil",     },
];

// Simple SVG icons — no emoji
const ICONS = {
  discover:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/></svg>,
  generator: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg>,
  cvbuilder: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
  news:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M4 22h16a2 2 0 0 0 2-2V6l-6-4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 10h8M8 14h6"/></svg>,
  tracker:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  profile:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
};

export default function AppShell({ profile, discover, custom, tracker, onProfileSave, onDiscoverSave, onCustomSave, onTrackerSave, onReset, onGoHome }) {
  const [tab, setTab] = useState("discover");
  const [generatorPreset, setGeneratorPreset] = useState(null);

  const openGenerator = (company, type = "mail") => {
    setGeneratorPreset({ ...company, genType: type });
    setTab("generator");
  };

  return (
    <div className="min-h-screen flex font-poppins bg-background">

      {/* ── Left Sidebar (desktop) ── */}
      <aside
        className="hidden md:flex flex-col w-52 shrink-0 fixed top-0 left-0 h-screen z-20 bg-card border-r border-border"
        style={{ boxShadow: "2px 0 16px 0 rgba(13,27,42,0.04)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Logo small onClick={onGoHome} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            const label = t.id === "tracker" && tracker.length > 0 ? `Tracker (${tracker.length})` : t.label;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{
                  background: isActive ? "hsl(var(--accent))" : "transparent",
                  color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "hsl(var(--muted))"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>{ICONS[t.id]}</span>
                {label}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#2563eb" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: avatar + name */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#2563eb,#0ea5e9)" }}
            >
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">{profile.name || "Uživatel"}</p>
              <p className="text-[10px] truncate text-muted-foreground">{profile.field || "Profil"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right: content area ── */}
      <div className="flex-1 md:ml-52 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header
          className="md:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-5 border-b border-border bg-card/90"
          style={{ backdropFilter: "blur(12px)" }}
        >
          <Logo small onClick={onGoHome} />
          <span className="text-sm font-semibold text-foreground">
            {TABS.find(t => t.id === tab)?.label}
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#0ea5e9)" }}
          >
            {profile.name?.[0]?.toUpperCase() || "?"}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-7 pb-28 md:pb-10 max-w-[900px] w-full mx-auto">
          {tab === "discover"  && <DiscoverTab profile={profile} tracker={tracker} onTrackerSave={onTrackerSave} onOpenGenerator={openGenerator} />}
          {tab === "generator" && <GeneratorTab profile={profile} allCompanies={[...discover, ...custom]} tracker={tracker} onTrackerSave={onTrackerSave} preset={generatorPreset} onPresetConsumed={() => setGeneratorPreset(null)} />}
          {tab === "cvbuilder" && <CVBuilderTab profile={profile} />}
          {tab === "news"      && <NewsTab />}
          {tab === "tracker"   && <TrackerTab tracker={tracker} onTrackerSave={onTrackerSave} />}
          {tab === "profile"   && <ProfileTab profile={profile} onSave={onProfileSave} onReset={onReset} />}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-card/95"
        style={{ backdropFilter: "blur(12px)" }}
      >
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all"
              style={{ color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
            >
              {ICONS[t.id]}
              <span className="text-[9px] font-semibold leading-none">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}