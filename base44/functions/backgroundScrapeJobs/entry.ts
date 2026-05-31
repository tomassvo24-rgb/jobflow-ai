import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "cs-CZ,cs;q=0.9,en;q=0.8",
};

const NAV_BLACKLIST = /^(home|menu|contact|about|login|logout|search|next|back|více|zpět|přihlásit|registrace|cookie|privacy|gdpr|terms|podmínky|sitemap|newsletter|subscribe|odebírat|sdílet|share|tisk|print|faq|nápověda|help|podpora|support|kontakt|zobrazit\s*více|load\s*more|další|previous|předchozí|filtr|filter|sort|řadit|kategorie|category|novinky|news|blog|press|media)/i;

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
  for (const item of items.slice(0, 100)) {
    const g = (patterns) => { for (const p of patterns) { const m = item.match(p); if (m?.[1]) return m[1].trim(); } return ""; };
    const title = g([/<title><!\[CDATA\[(.*?)\]\]><\/title>/s, /<title>\s*([^<]+?)\s*<\/title>/]);
    const link  = g([/<link>(https?:[^<]+)<\/link>/, /<guid isPermaLink="true">(https?:[^<]+)<\/guid>/, /<guid>(https?:[^<]+)<\/guid>/]);
    const desc  = g([/<description><!\[CDATA\[(.*?)\]\]><\/description>/s, /<description>([^<]*)<\/description>/]);
    const pub   = g([/<pubDate>([^<]+)<\/pubDate>/]);
    const co    = g([/<jobs:employer><!\[CDATA\[(.*?)\]\]><\/jobs:employer>/s, /<jobs:employer>([^<]+)<\/jobs:employer>/, /<company><!\[CDATA\[(.*?)\]\]><\/company>/s, /<company>([^<]+)<\/company>/, /<dc:creator>([^<]+)<\/dc:creator>/, /<author>([^<]+)<\/author>/]) || source;
    const loc   = g([/<jobs:location><!\[CDATA\[(.*?)\]\]><\/jobs:location>/s, /<jobs:location>([^<]+)<\/jobs:location>/, /<location><!\[CDATA\[(.*?)\]\]><\/location>/s, /<location>([^<]+)<\/location>/]) || defaultLoc;
    let date = null;
    if (pub) { try { date = new Date(pub).toISOString().split("T")[0]; } catch { date = null; } }
    const cleanTitle = title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({
        title: cleanTitle,
        company: co.replace(/&amp;/g, "&").trim(),
        location: loc.replace(/&amp;/g, "&").trim(),
        snippet: desc.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 250),
        url: link.trim(),
        posted_date: date,
        source,
      });
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

// remoteok.com — verified working, many categories, has CZ remote jobs
async function scrapeRemoteOk() {
  const slugs = [
    "remote-marketing-jobs", "remote-design-jobs", "remote-sales-jobs",
    "remote-backend-jobs", "remote-frontend-jobs", "remote-fullstack-jobs",
    "remote-data-jobs", "remote-devops-jobs", "remote-product-jobs",
    "remote-finance-jobs", "remote-hr-jobs", "remote-legal-jobs",
    "remote-ops-jobs", "remote-customer-support-jobs"
  ];
  const results = await Promise.allSettled(slugs.map(s => fetchRss(`https://remoteok.com/${s}.rss`, "remoteok.com", "Remote")));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// weworkremotely.com — curated remote, accessible from CZ
async function scrapeWWR() {
  const feeds = [
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
    "https://weworkremotely.com/categories/remote-design-jobs.rss",
    "https://weworkremotely.com/categories/remote-marketing-jobs.rss",
    "https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss",
    "https://weworkremotely.com/categories/remote-customer-support-jobs.rss",
  ];
  const results = await Promise.allSettled(feeds.map(url => fetchRss(url, "weworkremotely.com", "Remote")));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// jobicy.com — EU-friendly remote jobs
async function scrapeJobicy() {
  const cats = ["dev", "design", "marketing", "sales", "hr", "finance", "legal", "ops", "data", "customer-support"];
  const results = await Promise.allSettled(
    cats.map(c => fetchRss(`https://jobicy.com/?feed=job_feed&job_categories=${c}&search_region=eu`, "jobicy.com", "Remote / EU"))
  );
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// euremotejobs.com — Europe-focused remote
async function scrapeEuRemoteJobs() {
  const res = await fetch("https://euremotejobs.com/feed/", { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes("<item>")) throw new Error("no RSS items");
  return parseRss(text, "euremotejobs.com", "Remote / EU");
}

// linkedin.com — public Czech Republic job listings (no auth needed)
async function scrapeLinkedIn() {
  const keywords = ["developer", "marketing manager", "projektový manažer", "data analyst", "UX designer", "devops", "account manager", "obchodní zástupce", "customer success"];
  const results = await Promise.allSettled(keywords.map(async (kw) => {
    const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(kw)}&location=Czech+Republic&f_TPR=r604800`;
    const res = await fetch(url, { headers: { ...HEADERS, "Accept-Language": "cs,en;q=0.9" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`LinkedIn ${res.status}`);
    const html = await res.text();
    const jobs = [];
    const jsonLdMatches = html.match(/"title"\s*:\s*"([^"]{5,100})","url"\s*:\s*"(https:\/\/[^"]*linkedin[^"]*)"/g) || [];
    for (const block of jsonLdMatches.slice(0, 15)) {
      const t = (block.match(/"title"\s*:\s*"([^"]+)"/) || [])[1] || "";
      const u = (block.match(/"url"\s*:\s*"([^"]+)"/) || [])[1] || "";
      const cleanT = t.replace(/\\u[\dA-Fa-f]{4}/g, "").replace(/&amp;/g, "&").trim();
      if (isJobTitle(cleanT) && u) {
        jobs.push({ title: cleanT, company: "LinkedIn", location: "Česká republika", snippet: "", url: u.split("?")[0], posted_date: null, source: "linkedin" });
      }
    }
    return jobs;
  }));
  return results.flatMap(r => r.status === "fulfilled" ? r.value : []);
}

// ─── Main ────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const scrapers = [
      { name: "remoteok.com",     fn: scrapeRemoteOk },
      { name: "weworkremotely.com", fn: scrapeWWR },
      { name: "jobicy.com",       fn: scrapeJobicy },
      { name: "euremotejobs.com", fn: scrapeEuRemoteJobs },
      { name: "linkedin",         fn: scrapeLinkedIn },
    ];

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

    // Deduplicate by URL
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.url || seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    // DB cleanup + bulk insert
    const existingAll = await base44.asServiceRole.entities.JobListing.filter({ run_id: "global" }, "-created_date", 500);
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const old = existingAll.filter(j => j.created_date < cutoff);
    for (const j of old) {
      await base44.asServiceRole.entities.JobListing.delete(j.id);
      await sleep(40);
    }

    const existingUrls = new Set(existingAll.filter(j => j.created_date >= cutoff).map(j => j.external_id));
    const toInsert = unique.filter(j => !existingUrls.has(j.url)).slice(0, 400);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    if (toInsert.length > 0) {
      await base44.asServiceRole.entities.JobListing.bulkCreate(
        toInsert.map(job => ({
          run_id: "global",
          user_id: "system",
          external_id: job.url,
          title: job.title,
          company: job.company || "",
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