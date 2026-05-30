import React, { useId } from "react";

/**
 * GetJob.cz logo
 * Props:
 *   dark    — světlá verze textu (pro tmavý navbar)
 *   small   — menší varianta
 *   onClick — navigace zpět na landing
 */
export default function Logo({ dark = false, small = false, onClick }) {
  const uid = useId().replace(/:/g, "");

  const size = small ? 18 : 22; // font-size px
  const lineH = small ? 9 : 11; // SVG height
  const lineW = small ? 68 : 86; // SVG width  (px, not %)
  const sw = small ? 2.8 : 3.4; // stroke-width

  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className="inline-flex items-center select-none bg-transparent border-0 p-0"
      style={{ cursor: onClick ? "pointer" : "default", lineHeight: 1 }}>
      
      {/* ── Icon mark: magnifier ── */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: small ? 28 : 34,
          height: small ? 28 : 34,
          borderRadius: small ? 8 : 10,
          background: dark ? "rgba(255,255,255,0.13)" : "#2563eb",
          marginRight: small ? 8 : 10,
          flexShrink: 0
        }}>
        
        <svg
          width={small ? 14 : 17}
          height={small ? 14 : 17}
          viewBox="0 0 18 18"
          fill="none">
          
          <circle cx="7.5" cy="7.5" r="5" stroke="white" strokeWidth="1.9" />
          <line
            x1="11.5" y1="11.5" x2="16" y2="16"
            stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" />
          
        </svg>
      </span>

      {/* ── Wordmark ── */}
      <span style={{ position: "relative", display: "inline-block", paddingBottom: lineH + 4 }}>
        <span style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
          <span style={{ color: dark ? "#ffffff" : "#0d1b2a" }} className="text-[hsl(var(--foreground))]">get</span>
          <span style={{ color: "#2563eb" }}>job</span>
          <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "#94a3b8", fontWeight: 600 }}>.cz</span>
        </span>

        {/* Underline arc — stays under the text, never overlaps */}
        <svg
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: lineW,
            height: lineH,
            pointerEvents: "none",
            display: "block"
          }}
          fill="none">
          
          <defs>
            <linearGradient id={`lg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path
            d="M2 2 Q50 14 98 2"
            stroke={`url(#lg-${uid})`}
            strokeWidth={sw}
            strokeLinecap="round" />
          
        </svg>
      </span>
    </Tag>);

}