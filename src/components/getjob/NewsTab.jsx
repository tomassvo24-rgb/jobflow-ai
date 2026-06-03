import React, { useState, useEffect } from "react";
import { IconNews, IconChart, IconRocket } from "./Icons";
import { base44 } from "@/api/base44Client";

const RSS_SOURCES = [
  { url: "https://www.jobs.cz/rss/", label: "Jobs.cz", color: "#059669", bg: "#e8f5ee" },
  { url: "https://www.startupjobs.cz/rss", label: "StartupJobs", color: "#7c3aed", bg: "#f5f3ff" },
  { url: "https://cc.cz/feed/", label: "CzechCrunch", color: "#e11d48", bg: "#fff1f2" },
  { url: "https://forbes.cz/feed/", label: "Forbes CZ", color: "#d97706", bg: "#fef3c7" },
  { url: "https://www.lupa.cz/rss/clanky/", label: "Lupa.cz", color: "#2563eb", bg: "#eff6ff" },
  { url: "https://www.hr-news.cz/feed/", label: "HR News", color: "#0891b2", bg: "#ecfeff" },
  { url: "https://www.podnikatel.cz/rss/", label: "Podnikatel.cz", color: "#16a34a", bg: "#f0fdf4" },
  { url: "https://denikn.cz/feed/", label: "Deník N", color: "#475569", bg: "#f8fafc" },
];

const API_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

// Keywords relevant to job market / GetJob topics
const RELEVANT_KEYWORDS = [
  "práce", "zaměstnání", "kariéra", "plat", "mzda", "hr", "hiring", "recruiter",
  "startup", "it", "programátor", "developer", "ai", "umělá inteligence", "technologie",
  "trh práce", "nezaměstnanost", "brigáda", "pohovor", "cv", "životopis", "home office",
  "remote", "freelance", "agile", "linkedin", "workforce", "zaměstnanec", "zaměstnavatel",
];

function isRelevant(title, desc) {
  const text = (title + " " + desc).toLowerCase();
  return RELEVANT_KEYWORDS.some(k => text.includes(k));
}

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

// Extract image from RSS item
function extractImage(item) {
  // rss2json provides thumbnail or enclosure
  if (item.thumbnail && item.thumbnail.startsWith("http")) return item.thumbnail;
  if (item.enclosure?.link?.match(/\.(jpg|jpeg|png|webp)/i)) return item.enclosure.link;
  // Try to find img in content/description
  const html = item.content || item.description || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return null;
}

// Source-specific fallback images (relevant illustrations)
const SOURCE_FALLBACK = {
  "Jobs.cz": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
  "StartupJobs": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
  "CzechCrunch": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80",
  "Forbes CZ": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
  "Lupa.cz": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  "HR News": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
  "Podnikatel.cz": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
  "Deník N": "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&q=80",
};

function ArticleImage({ src, fallback, alt }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImgSrc(fallback)}
    />
  );
}

export default function NewsTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
                  description: truncate(item.description || item.content || "", 160),
                  date: item.pubDate || "",
                  url: item.link || "#",
                  source: src.label,
                  color: src.color,
                  bg: src.bg,
                  image: extractImage(item),
                }));
              })
          )
        );

        let all = [];
        results.forEach(r => {
          if (r.status === "fulfilled") all = all.concat(r.value);
        });

        // Prioritize relevant articles, then fill with rest
        const relevant = all.filter(a => isRelevant(a.title, a.description));
        const other = all.filter(a => !isRelevant(a.title, a.description));
        const merged = [...relevant, ...other];

        if (merged.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(merged.slice(0, 10));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const featured = articles.slice(0, 3);
  const rest = articles.slice(3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
      <div>
        <div className="flex items-center gap-3 mb-5">
          <IconNews cls="w-5 h-5 text-brand-blue" />
          <h2 className="font-poppins text-[22px] font-bold">Novinky ze světa práce</h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse flex gap-4 p-4">
                <div className="w-24 h-20 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
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
            {/* Featured cards — big with image */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {featured.map((n, i) => (
                  <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all block no-underline group">
                    <div className="h-36 overflow-hidden relative">
                      <ArticleImage
                        src={n.image}
                        fallback={SOURCE_FALLBACK[n.source] || SOURCE_FALLBACK["Jobs.cz"]}
                        alt={n.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span
                        className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: n.bg, color: n.color }}
                      >
                        {n.source}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-poppins font-bold text-sm text-foreground leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {n.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">{formatDate(n.date)}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <p className="text-[11px] font-bold text-brand-teal uppercase tracking-wider font-mono mb-3">Nejnovější články</p>

            {/* List articles with thumbnail */}
            <div className="space-y-2.5">
              {rest.map((n, i) => (
                <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-3 flex gap-3 items-start hover:shadow-md hover:-translate-y-0.5 transition-all block no-underline group">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                    <ArticleImage
                      src={n.image}
                      fallback={SOURCE_FALLBACK[n.source] || SOURCE_FALLBACK["Jobs.cz"]}
                      alt={n.title}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mb-1 inline-block"
                      style={{ background: n.bg, color: n.color }}
                    >
                      {n.source}
                    </span>
                    <div className="font-semibold text-sm text-foreground mb-0.5 line-clamp-2 group-hover:text-primary transition-colors">
                      {n.title}
                    </div>
                    {n.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">{n.description}</div>
                    )}
                    <div className="text-[11px] text-muted-foreground mt-0.5">{formatDate(n.date)}</div>
                  </div>
                </a>
              ))}
            </div>
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

        {/* Sources legend */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Zdroje</p>
          <div className="flex flex-wrap gap-1.5">
            {RSS_SOURCES.map(s => (
              <span key={s.label} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}