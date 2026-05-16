import React, { useState, useRef, useEffect } from "react";

const EMAIL_DOMAINS = ["gmail.com", "seznam.cz", "email.cz", "centrum.cz", "outlook.com", "hotmail.com", "icloud.com", "yahoo.com"];

export default function EmailField({ label, value, onChange, placeholder = "jan@email.cz", className = "" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const wrapRef = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    const atIdx = v.indexOf("@");
    if (atIdx !== -1) {
      const typed = v.slice(atIdx + 1).toLowerCase();
      const filtered = EMAIL_DOMAINS.filter(d => d.startsWith(typed)).map(d => v.slice(0, atIdx + 1) + d);
      setSuggestions(filtered);
      setShow(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShow(false);
    }
  };

  const pick = (s) => { onChange(s); setShow(false); };

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`relative ${className}`} ref={wrapRef}>
      {label && <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>}
      <input
        type="email"
        value={value}
        onChange={handleChange}
        onFocus={() => { if (suggestions.length > 0) setShow(true); }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-white border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
      />
      {show && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.map(s => (
            <button key={s} onMouseDown={() => pick(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2">
              <span className="text-base">📧</span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}