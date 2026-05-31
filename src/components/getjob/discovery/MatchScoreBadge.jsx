import React from "react";

export default function MatchScoreBadge({ score }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700 border-green-300" :
    score >= 60 ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                  "bg-gray-100 text-gray-500 border-gray-200";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${color}`}>
      {score}%
    </span>
  );
}