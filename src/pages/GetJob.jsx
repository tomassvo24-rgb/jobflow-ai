import React, { useState, useEffect } from "react";
import Onboarding from "../components/getjob/Onboarding";
import AppShell from "../components/getjob/AppShell";

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

  useEffect(() => {
    const prof = loadStorage(STORAGE_KEYS.profile);
    if (prof) {
      setProfile(prof);
      setDiscover(loadStorage(STORAGE_KEYS.discover) || []);
      setCustom(loadStorage(STORAGE_KEYS.custom) || []);
      setTracker(loadStorage(STORAGE_KEYS.tracker) || []);
    }
  }, []);

  const handleProfileSave = (prof) => {
    setProfile(prof);
    saveStorage(STORAGE_KEYS.profile, prof);
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
  };

  if (!profile) {
    return <Onboarding onComplete={handleProfileSave} />;
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
    />
  );
}