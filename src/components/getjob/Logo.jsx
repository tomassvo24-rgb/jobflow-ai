import React, { useId } from "react";

/**
 * GetJob.cz logo — bez ikony, pouze wordmark s gradient úsměvem
 * Props:
 *   dark    — bílá verze textu (pro tmavý navbar)
 *   small   — menší varianta
 *   onClick — navigace zpět na landing
 */
export default function Logo({ dark = false, small = false, onClick }) {
  const uid = useId().replace(/:/g, "");

  const fontSize = small ? "18px" : "22px";
  const smileW = small ? "70%" : "80%";
  const smileH = small ? 9 : 11;
  const sw = small ? 2.5 : 3;

  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className="inline-flex items-center select-none bg-transparent border-0 p-0"
      style={{ cursor: onClick ? "pointer" : "default", lineHeight: 1 }}>
      
      <span style={{ position: "relative", display: "inline-block", paddingBottom: smileH + 6 }}>
        {/* Wordmark */}
        <span style={{ fontSize, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
          <span style={{ color: dark ? "#ffffff" : "#0d1b2a" }}>Get</span>
          <span style={{ color: "#2563eb" }}>Job</span>
          <span style={{ color: "#14b8a6" }}>.cz</span>
        </span>

        {/* Smile underline — přesně pod textem */}
        <svg
          viewBox="0 0 120 16"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: smileW,
            height: smileH,
            pointerEvents: "none",
            display: "block"
          }}
          fill="none">
          
          <defs>
            <linearGradient id={`sg-${uid}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path
            d="M4 3 Q60 16 116 3"
            stroke={`url(#sg-${uid})`}
            strokeWidth={sw}
            strokeLinecap="round" />
          
        </svg>
      </span>
    </Tag>);

}