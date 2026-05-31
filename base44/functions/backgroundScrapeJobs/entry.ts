import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const NAV_BLACKLIST = /^(home|menu|contact|about|login|logout|search|next|back|více|zpět|přihlásit|registrace|cookie|privacy|careers|kariera|jobs|english|czech|uživatelská\s*sekce|my\s*account|account|dashboard|profil|nastavení|settings|přehled|aktuality|novinky|blog|press|média|media|investor|výroční|annual|report|gdpr|terms|podmínky|ochrana|sitemap|mapa\s*webu|newsletter|subscribe|odebírat|sdílet|share|tisk|print|zprávy|news|faq|nápověda|help|podpora|support|kontakt|kariéra\s*home|zpět\s*na|back\s*to|všechny\s*pozice|all\s*positions|zobrazit\s*více|load\s*more|další|previous|předchozí|filtr|filter|sort|řadit|kategorie|category)/i;

function isJobTitle(title) {
  if (!title || title.length < 4 || title.length > 130) return false;
  if (NAV_BLACKLIST.test(title.trim())) return false;
  if (title.includes('<') || title.includes('>') || title.includes('href=')) return false;
  if (/^\d+$/.test(title.trim())) return false;
  return true;
}

async function fetchJobsCzRss(keyword, location) {
  const jobs = [];
  const url = `https://www.jobs.cz/rss/jobs/?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`jobs.cz RSS ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 40)) {
    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
    const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
    const company = (item.match(/<jobs:employer>(.*?)<\/jobs:employer>/) || [])[1] || "";
    const loc = (item.match(/<jobs:location>(.*?)<\/jobs:location>/) || [])[1] || location;
    const cleanTitle = title.trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({ title: cleanTitle, company: company.trim() || "Neznámá firma", location: loc.trim(), snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200), url: link.trim(), posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null, source: "jobs.cz" });
    }
  }
  return jobs;
}

async function fetchStartupJobsRss(keyword) {
  const jobs = [];
  const url = `https://www.startupjobs.cz/nabidky/rss?q=${encodeURIComponent(keyword)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`startupjobs.cz RSS ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 30)) {
    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
    const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
    const company = (item.match(/<author>(.*?)<\/author>/) || item.match(/<dc:creator>(.*?)<\/dc:creator>/) || [])[1] || "";
    const loc = (item.match(/<location>(.*?)<\/location>/) || [])[1] || "";
    const cleanTitle = title.trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({ title: cleanTitle, company: company.trim() || "Startup", location: loc.trim() || "Praha / Remote", snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200), url: link.trim(), posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null, source: "startupjobs.cz" });
    }
  }
  return jobs;
}

async function fetchJenpraceRss(keyword) {
  const jobs = [];
  const url = `https://www.jenprace.cz/rss/?q=${encodeURIComponent(keyword)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`jenprace.cz RSS ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 30)) {
    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
    const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
    const cleanTitle = title.trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({ title: cleanTitle, company: "jenprace.cz", location: "Česká republika", snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200), url: link.trim(), posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null, source: "jenprace.cz" });
    }
  }
  return jobs;
}

async function fetchVolnaMistaRss(keyword, location) {
  const jobs = [];
  const url = `https://www.volnamista.cz/rss/?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`volnamista.cz RSS ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 30)) {
    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
    const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
    const company = (item.match(/<company>(.*?)<\/company>/) || [])[1] || "";
    const loc = (item.match(/<location>(.*?)<\/location>/) || [])[1] || location;
    const cleanTitle = title.trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({ title: cleanTitle, company: company.trim() || "volnamista.cz", location: loc.trim(), snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200), url: link.trim(), posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null, source: "volnamista.cz" });
    }
  }
  return jobs;
}

async function fetchLinkedInPublic(keyword, location) {
  const jobs = [];
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&f_TPR=r604800`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Accept": "text/html,application/xhtml+xml", "Accept-Language": "cs,en;q=0.9" } });
  if (!res.ok) throw new Error(`LinkedIn ${res.status}`);
  const html = await res.text();
  const titlePattern = /<a[^>]+class="[^"]*base-card__full-link[^"]*"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = titlePattern.exec(html)) !== null && jobs.length < 20) {
    const href = m[1].split("?")[0];
    const title = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (isJobTitle(title) && href) {
      jobs.push({ title, company: "LinkedIn", location, snippet: "", url: href, posted_date: null, source: "linkedin" });
    }
  }
  return jobs;
}

// Keywords that cover most common job fields
const KEYWORDS = ["junior", "developer", "marketing", "právo", "finance", "obchod", "HR", "účetní", "grafik", "logistika"];
const LOCATIONS = ["Praha", "Brno"];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This runs as scheduled automation — use service role
    const allJobs = [];
    const sourcesChecked = [];
    const sourcesFailed = [];

    for (const keyword of KEYWORDS) {
      for (const location of LOCATIONS) {
        const sources = [
          { name: "jobs.cz", fn: () => fetchJobsCzRss(keyword, location) },
          { name: "startupjobs.cz", fn: () => fetchStartupJobsRss(keyword) },
          { name: "jenprace.cz", fn: () => fetchJenpraceRss(keyword) },
          { name: "volnamista.cz", fn: () => fetchVolnaMistaRss(keyword, location) },
          { name: "linkedin", fn: () => fetchLinkedInPublic(keyword, location) },
        ];

        const results = await Promise.allSettled(sources.map(s => s.fn()));
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            allJobs.push(...result.value);
            if (!sourcesChecked.includes(sources[i].name)) sourcesChecked.push(sources[i].name);
          } else {
            const errMsg = `${sources[i].name}(${keyword})`;
            if (!sourcesFailed.includes(errMsg)) sourcesFailed.push(errMsg);
          }
        });
      }
    }

    // Deduplicate by URL
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.url || seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    // Delete old global listings (older than 24h) to keep DB clean
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const oldListings = await base44.asServiceRole.entities.JobListing.filter({ run_id: "global" });
    const old = oldListings.filter(j => j.created_date < cutoff);
    await Promise.all(old.map(j => base44.asServiceRole.entities.JobListing.delete(j.id)));

    // Check which URLs already exist to avoid duplicates
    const existing = await base44.asServiceRole.entities.JobListing.filter({ run_id: "global" });
    const existingUrls = new Set(existing.map(j => j.external_id));

    const toInsert = unique.filter(j => !existingUrls.has(j.url)).slice(0, 200);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Insert in batches of 20
    for (let i = 0; i < toInsert.length; i += 20) {
      const batch = toInsert.slice(i, i + 20);
      await Promise.all(batch.map(job =>
        base44.asServiceRole.entities.JobListing.create({
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
        })
      ));
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