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
  const [profile, setProfile] = useState(null);
  const [discover, setDiscover] = useState([]);
  const [custom, setCustom] = useState([]);
  const [tracker, setTracker] = useState([]);
  const [view, setView] = useState("landing"); // "landing" | "onboarding" | "app"

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("home") === "1") {
      setView("landing");
      return;
    }
    const prof = loadStorage(STORAGE_KEYS.profile);
    if (prof) {
      setProfile(prof);
      setDiscover(loadStorage(STORAGE_KEYS.discover) || []);
      setCustom(loadStorage(STORAGE_KEYS.custom) || []);
      setTracker(loadStorage(STORAGE_KEYS.tracker) || []);
      setView("app");
    }
  }, []);

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