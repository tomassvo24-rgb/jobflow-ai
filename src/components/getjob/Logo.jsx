import React, { useId } from "react";

/**
 * GetJob.cz logo — identické s landing page HTML originálem.
 * Props:
 *   dark   — bílá verze textu (pro tmavý navbar)
 *   small  — menší varianta
 *   onClick — kliknutí (navigace na landing)
 */
export default function Logo({ dark = false, small = false, onClick }) {
  const fontSize = small ? "text-xl" : "text-2xl";
  const smileW = small ? 80 : 108;
  const smileH = small ? 10 : 14;
  const uid = useId().replace(/:/g, "");

  const getColor = (light, darkColor) => dark ? darkColor : light;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 select-none bg-transparent border-0 p-0 cursor-pointer"
      style={{ lineHeight: 1 }}
    >
      <span className="relative inline-block">
        {/* Wordmark */}
        <span className={`${fontSize} font-extrabold tracking-tight leading-none`}>
          <span style={{ color: dark ? "#ffffff" : "#0d1b2a" }}>Get</span>
          <span style={{ color: "#2563eb" }}>Job</span>
          <span style={{ color: "#14b8a6" }}>.cz</span>
        </span>

        {/* Smile underline gradient */}
        <svg
          viewBox="0 0 120 24"
          style={{
            position: "absolute",
            bottom: small ? -6 : -8,
            left: 0,
            width: `${smileW}%`,
            height: smileH,
            pointerEvents: "none",
          }}
          fill="none"
        >
          <defs>
            <linearGradient id={`sg-${uid}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path
            d="M4 4 Q60 32 116 4"
            stroke={`url(#sg-${uid})`}
            strokeWidth={small ? 3.5 : 4}
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );
}