import React, { useState, useEffect } from "react";
import { IconNews, IconClose, IconChart, IconStar, IconRocket } from "./Icons";
import { base44 } from "@/api/base44Client";

const RSS_SOURCES = [
  { url: "https://www.jobs.cz/rss/", label: "Jobs.cz" },
  { url: "https://forbes.cz/feed/", label: "Forbes" },
  { url: "https://www.novinky.cz/ekonomika/rss", label: "Novinky.cz" },
];

const API_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

const CAT_COLORS = {
  "Jobs.cz": { bg: "#e8f5ee", color: "#059669" },
  "Forbes": { bg: "#fef3c7", color: "#d97706" },
  "Novinky.cz": { bg: "#eff6ff", color: "#2563eb" },
};

function truncate(str, max) {
  if (!str) return "";
  const clean = str.replace(/<[^>]*>/g, "").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function NewsTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openArticle, setOpenArticle] = useState(null);
  const [laborStats, setLaborStats] = useState(null);

  useEffect(() => {
    base44.entities.LaborStats.list('-created_date', 1).then(data => {
      if (data?.length > 0) setLaborStats(data[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(false);
      try {
        const results = await Promise.allSettled(
          RSS_SOURCES.map(src =>
            fetch(`${API_BASE}${encodeURIComponent(src.url)}`)
              .then(r => r.json())
              .then(data => {
                if (data.status !== "ok") return [];
                return (data.items || []).map(item => ({
                  title: item.title || "",
                  description: truncate(item.description || item.content || "", 150),
                  date: item.pubDate || "",
                  url: item.link || "#",
                  source: src.label,
                }));
              })
          )
        );

        let all = [];
        results.forEach(r => {
          if (r.status === "fulfilled") all = all.concat(r.value);
        });

        if (all.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        // Sort by date descending
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(all.slice(0, 8));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const featured = articles.slice(0, 2);
  const rest = articles.slice(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <IconNews cls="w-5 h-5 text-brand-blue" />
          <h2 className="font-poppins text-[22px] font-bold">Novinky & Inspirace</h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-3">📡</div>
            <p className="font-semibold">Nepodařilo se načíst novinky</p>
            <p className="text-sm mt-1">Zkuste to prosím znovu později.</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {featured.map((n, i) => {
                  const style = CAT_COLORS[n.source] || { bg: "#f3f4f6", color: "#6b7280" };
                  return (
                    <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all block no-underline">
                      <div className="h-20 flex items-center justify-center px-4" style={{ background: style.bg }}>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: style.color }}>{n.source}</span>
                      </div>
                      <div className="p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider font-mono mb-1" style={{ color: style.color }}>{n.source}</div>
                        <div className="font-poppins font-bold text-sm text-foreground leading-snug mb-1 line-clamp-2">{n.title}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{formatDate(n.date)}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            <p className="text-[11px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-3">Nejnovější články</p>
            {rest.map((n, i) => {
              const style = CAT_COLORS[n.source] || { bg: "#f3f4f6", color: "#6b7280" };
              return (
                <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-4 mb-2.5 flex gap-4 items-start cursor-pointer hover:shadow-md transition-all block no-underline">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-bold uppercase text-center leading-tight" style={{ background: style.bg, color: style.color }}>
                    {n.source.split(".")[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground mb-0.5 line-clamp-2">{n.title}</div>
                    {n.description && <div className="text-xs text-muted-foreground mb-0.5 line-clamp-2">{n.description}</div>}
                    <div className="text-xs text-muted-foreground">{n.source} · {formatDate(n.date)}</div>
                  </div>
                </a>
              );
            })}
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#0D1B2A,#1a3050)" }}>
          <div className="font-poppins text-base font-bold mb-1.5 text-white flex items-center gap-2">
            <IconNews cls="w-4 h-4" /> Newsletter
          </div>
          <p className="text-xs text-blue-100 mb-4 leading-relaxed">Novinky ze světa práce každý týden. Přihlás se zdarma.</p>
          <div className="flex flex-col gap-2">
            <input type="email" placeholder="tvůj@email.cz" className="bg-white/15 border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:border-white/60 transition-all" />
            <button className="bg-brand-teal text-white rounded-full px-4 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity">Přihlásit se</button>
          </div>
        </div>
        <div className="bg-accent border border-brand-teal/20 rounded-xl p-4 text-center relative">
          <span className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest text-muted-foreground font-mono uppercase">Partneři</span>
          <div className="flex justify-center mb-2"><IconRocket cls="w-8 h-8 text-brand-blue" /></div>
          <div className="font-poppins font-bold text-sm mb-1">Startup víkend Praha</div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Postav produkt za 54 hodin. Networking, mentoři, ceny.</p>
          <button className="w-full px-4 py-2 rounded-full bg-brand-blue text-white text-xs font-semibold hover:opacity-90 transition-opacity">Registrovat se</button>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="font-poppins font-bold text-sm mb-3 flex items-center gap-2">
            <IconChart cls="w-4 h-4 text-brand-blue" /> Trh práce v číslech
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            {[
              ["Volných míst (ČR)", laborStats ? laborStats.job_openings?.toLocaleString("cs-CZ") : "341 000", "text-blue-600"],
              ["Průměrná mzda", laborStats ? `${laborStats.avg_wage?.toLocaleString("cs-CZ")} Kč` : "46 500 Kč", ""],
              ["IT průměr", laborStats ? `${laborStats.it_avg_wage?.toLocaleString("cs-CZ")} Kč` : "78 000 Kč", ""],
              ["Nezaměstnanost", laborStats ? `${laborStats.unemployment_rate} %` : "3.9 %", ""],
            ].map(([l, v, c]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span>{l}</span><span className={`font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
          {laborStats?.source_date && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Data ze dne {new Date(laborStats.source_date).toLocaleDateString("cs-CZ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}