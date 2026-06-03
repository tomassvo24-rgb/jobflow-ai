import React, { useState } from "react";
import { IconClose, IconCopy, IconCheck, IconLoader } from "../Icons";

export default function CoverLetterModal({ job, letter, loading, error, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(13,27,42,0.6)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col" style={{ border: "1px solid #e8edf4" }}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: "#e8edf4" }}>
          <div>
            <h2 className="font-extrabold text-lg" style={{ color: "#0d1b2a" }}>Motivační dopis</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>
              {job.title} · {job.company}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: "#6b7280" }}>
            <IconClose cls="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <IconLoader cls="w-8 h-8 text-blue-500" />
              <p className="text-sm font-medium" style={{ color: "#6b7280" }}>AI píše motivační dopis…</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>Trvá přibližně 10–20 sekund</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl p-4 text-sm" style={{ background: "#fff1f2", color: "#be123c" }}>
              Chyba: {error}
            </div>
          )}

          {letter && !loading && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#1e293b" }}>
              {letter}
            </div>
          )}
        </div>

        {/* Footer */}
        {letter && !loading && (
          <div className="p-4 border-t flex gap-2" style={{ borderColor: "#e8edf4" }}>
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={copied
                ? { background: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7" }
                : { background: "linear-gradient(90deg,#2563eb,#14b8a6)", color: "white" }
              }
            >
              {copied ? <IconCheck cls="w-4 h-4" /> : <IconCopy cls="w-4 h-4" />}
              {copied ? "Zkopírováno!" : "Kopírovat"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors"
              style={{ borderColor: "#e3e8f0", color: "#6b7280" }}
            >
              Zavřít
            </button>
          </div>
        )}
      </div>
    </div>
  );
}