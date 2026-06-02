import React, { useState, useEffect } from "react";
import Onboarding from "../components/getjob/Onboarding";
import AppShell from "../components/getjob/AppShell";
import LandingPage from "../components/getjob/LandingPage";

const STORAGE_KEYS = {
  profile: "gj_prof",
  discover: "gj_disc",
  custom: "gj_cust",
  tracker: "gj_trk",
};

function loadStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function GetJob() {
  const params = new URLSearchParams(window.location.search);
  const forceHome = params.get("home") === "1";
  const savedProfile = !forceHome ? loadStorage(STORAGE_KEYS.profile) : null;

  const [profile, setProfile] = useState(savedProfile);
  const [discover, setDiscover] = useState(() => loadStorage(STORAGE_KEYS.discover) || []);
  const [custom, setCustom] = useState(() => loadStorage(STORAGE_KEYS.custom) || []);
  const [tracker, setTracker] = useState(() => loadStorage(STORAGE_KEYS.tracker) || []);
  const [view, setView] = useState(forceHome ? "landing" : savedProfile ? "app" : "landing");

  const handleProfileSave = (prof) => {
    setProfile(prof);
    saveStorage(STORAGE_KEYS.profile, prof);
    setView("app");
  };

  const handleDiscoverSave = (items) => {
    setDiscover(items);
    saveStorage(STORAGE_KEYS.discover, items);
  };

  const handleCustomSave = (items) => {
    setCustom(items);
    saveStorage(STORAGE_KEYS.custom, items);
  };

  const handleTrackerSave = (items) => {
    setTracker(items);
    saveStorage(STORAGE_KEYS.tracker, items);
  };

  const handleReset = () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    setProfile(null);
    setDiscover([]);
    setCustom([]);
    setTracker([]);
    setView("landing");
  };

  if (view === "landing") {
    return <LandingPage onStart={() => setView("onboarding")} onContinue={() => setView("app")} />;
  }

  if (view === "onboarding") {
    return <Onboarding onComplete={handleProfileSave} onGoHome={() => setView("landing")} />;
  }

  return (
    <AppShell
      profile={profile}
      discover={discover}
      custom={custom}
      tracker={tracker}
      onProfileSave={handleProfileSave}
      onDiscoverSave={handleDiscoverSave}
      onCustomSave={handleCustomSave}
      onTrackerSave={handleTrackerSave}
      onReset={handleReset}
      onGoHome={() => setView("landing")}
    />
  );
}