import React from "react";

export default function PhoneField({ label, value, onChange, className = "" }) {
  // value stored without prefix, display with +420
  const raw = value.startsWith("+420") ? value.slice(4).trimStart() : value.startsWith("+") ? value : value;

  const handleChange = (e) => {
    const input = e.target.value.replace(/[^\d\s]/g, "");
    onChange("+420 " + input.trimStart());
  };

  const displayValue = value.startsWith("+420") ? value.slice(4).trimStart() : value.startsWith("+") ? value : value;

  return (
    <div className={className}>
      {label && <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="flex items-stretch border border-border rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-colors bg-white">
        <div className="flex items-center gap-1.5 px-3 bg-[#f4f4f0] border-r border-border text-sm font-medium text-foreground shrink-0 select-none">
          <span>🇨🇿</span>
          <span className="text-muted-foreground">+420</span>
        </div>
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="123 456 789"
          className="flex-1 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none bg-white"
        />
      </div>
    </div>
  );
}