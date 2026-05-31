import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const NAV_BLACKLIST = /^(home|menu|contact|about|login|logout|search|next|back|více|zpět|přihlásit|registrace|cookie|privacy|careers|kariera|jobs|english|czech|uživatelská\s*sekce|my\s*account|account|dashboard|profil|nastavení|settings|přehled|aktuality|novinky|blog|press|média|media|investor|výroční|annual|report|gdpr|terms|podmínky|ochrana|sitemap|mapa\s*webu|newsletter|subscribe|odebírat|sdílet|share|tisk|print|zprávy|news|faq|nápověda|help|podpora|support|kontakt|kariéra\s*home|zpět\s*na|back\s*to|všechny\s*pozice|all\s*positions|zobrazit\s*více|load\s*more|další|previous|předchozí|filtr|filter|sort|řadit|kategorie|category)/i;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function isJobTitle(t) {
  if (!t || t.length < 4 || t.length > 130) return false;
  if (NAV_BLACKLIST.test(t.trim())) return false;
  if (t.includes('<') || t.includes('>') || t.includes('href=')) return false;
  if (/^\d+$/.test(t.trim())) return false;
  return true;
}

function parseRss(xml, source, defaultLoc = "Remote") {
  const jobs = [];
  if (!xml || !xml.includes("<item>")) return jobs;
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 80)) {
    const g = (patterns) => { for (const p of patterns) { const m = item.match(p); if (m?.[1]) return m[1].trim(); } return ""; };
    const title = g([/<title><!\[CDATA\[(.*?)\]\]><\/title>/s, /<title>\s*([^<]+?)\s*<\/title>/]);
    const link  = g([/<link>(https?:[^<]+)<\/link>/, /<guid>(https?:[^<]+)<\/guid>/]);
    const desc  = g([/<description><!\[CDATA\[(.*?)\]\]><\/description>/s, /<description>([^<]*)<\/description>/]);
    const pub   = g([/<pubDate>([^<]+)<\/pubDate>/]);
    const co    = g([/<company><!\[CDATA\[(.*?)\]\]><\/company>/s, /<company>([^<]+)<\/company>/, /<dc:creator>([^<]+)<\/dc:creator>/, /<author>([^<]+)<\/author>/]) || source;
    const loc   = g([/<location><!\[CDATA\[(.*?)\]\]><\/location>/s, /<location>([^<]+)<\/location>/]) || defaultLoc;
    let date = null;
    if (pub) { try { date = new Date(pub).toISOString().split("T")[0]; } catch { date = null; } }
    if (isJobTitle(title) && link) {
      jobs.push({ title, company: co, location: loc, snippet: desc.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 250), url: link, posted_date: date, source });
    }
  }
  return jobs;
}

async function fetchRss(url, source, defaultLoc = "Remote") {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(18000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes("<item>")) throw new Error("no RSS items");
  return parseRss(text, source, defaultLoc);
}

// remoteok.com — verified working, many categories
async function scrapeRemoteOk() {
  const slugs = ["remote-marketing-jobs", "remote-design-jobs", "remote-sales-jobs", "remote-backend-jobs", "remote-frontend-jobs", "remote-fullstack-jobs", "remote-data-jobs", "remote-devops-jobs", "remote-product-jobs", "remote-finance-jobs", "remote-hr-jobs", "remote-legal-jobs", "remote-ops-jobs"];
  const results = await Promise.allSettled(slugs.map(s => fetchRss(`https://remoteok.com/${s}.rss`, "remoteok.com")));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// jobicy.com — EU remote jobs
async function scrapeJobicy() {
  const cats = ["dev", "design", "marketing", "sales", "hr", "finance", "legal", "ops", "data"];
  const results = await Promise.allSettled(cats.map(c => fetchRss(`https://jobicy.com/?feed=job_feed&job_categories=${c}&search_region=eu`, "jobicy.com", "Remote / EU")));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// weworkremotely.com — curated remote
async function scrapeWWR() {
  const feeds = [
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
    "https://weworkremotely.com/categories/remote-design-jobs.rss",
    "https://weworkremotely.com/categories/remote-marketing-jobs.rss",
    "https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss",
  ];
  const results = await Promise.allSettled(feeds.map(url => fetchRss(url, "weworkremotely.com")));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// pracevpravu.cz — CZ legal jobs HTML scrape (verified working)
async function scrapePracevpravu() {
  const jobs = [];
  const res = await fetch("https://www.pracevpravu.cz/", { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const pattern = /href="(https?:\/\/[^"]*pracevpravu[^"]*(?:inzerat|pozice|nabidka|detail)[^"]*)"(?:[^>]*title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = pattern.exec(html)) !== null && jobs.length < 60) {
    const title = ((m[2] || "").trim() || (m[3] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).slice(0, 100);
    if (isJobTitle(title) && m[1]) jobs.push({ title, company: "pracevpravu.cz", location: "Praha", snippet: "", url: m[1], posted_date: null, source: "pracevpravu.cz" });
  }
  if (jobs.length === 0) throw new Error("0 jobs found");
  return jobs;
}

// ─── Main ────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const scrapers = [
      { name: "remoteok.com",       fn: scrapeRemoteOk },
      { name: "jobicy.com",         fn: scrapeJobicy },
      { name: "weworkremotely.com", fn: scrapeWWR },
      { name: "pracevpravu.cz",     fn: scrapePracevpravu },
    ];

    // Phase 1: scrape all sources in parallel
    const scraperResults = await Promise.allSettled(scrapers.map(s => s.fn()));

    const allJobs = [];
    const sourcesChecked = [];
    const sourcesFailed = [];

    scraperResults.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value.length > 0) {
        allJobs.push(...r.value);
        sourcesChecked.push(scrapers[i].name);
      } else {
        sourcesFailed.push(`${scrapers[i].name}: ${r.reason?.message || "0 jobs"}`);
      }
    });

    // Deduplicate
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.url || seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    // Phase 2: DB operations — sequential to avoid rate limits
    const existingAll = await base44.asServiceRole.entities.JobListing.filter({ run_id: "global" }, "-created_date", 500);
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Delete old — sequentially, small batches
    const old = existingAll.filter(j => j.created_date < cutoff);
    for (const j of old) {
      await base44.asServiceRole.entities.JobListing.delete(j.id);
      await sleep(50);
    }

    const existingUrls = new Set(existingAll.filter(j => j.created_date >= cutoff).map(j => j.external_id));
    const toInsert = unique.filter(j => !existingUrls.has(j.url)).slice(0, 300);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Bulk insert — one request instead of hundreds
    if (toInsert.length > 0) {
      await base44.asServiceRole.entities.JobListing.bulkCreate(
        toInsert.map(job => ({
          run_id: "global",
          user_id: "system",
          external_id: job.url,
          title: job.title,
          company: job.company,
          location: job.location || "",
          match_score: 0,
          match_breakdown: {},
          match_reasons: [],
          posted_date: job.posted_date,
          source: job.source,
          url: job.url,
          snippet: job.snippet || "",
          tags: [],
          saved: false,
          expires_at: expiresAt,
        }))
      );
    }

    return Response.json({
      status: "ok",
      scraped: unique.length,
      inserted: toInsert.length,
      sources_checked: sourcesChecked,
      sources_failed: sourcesFailed,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});