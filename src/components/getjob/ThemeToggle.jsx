import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("gj_theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("gj_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("gj_theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(v => !v)}
      className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-105"
      style={{
        background: dark ? "#1e293b" : "#f1f5f9",
        borderColor: dark ? "#334155" : "#e3e8f0",
        color: dark ? "#fbbf24" : "#64748b",
      }}
      title={dark ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}