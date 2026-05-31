import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ─── helpers ───────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Words that indicate a result is NOT a job listing (navigation, sections, UI labels)
const NAV_BLACKLIST = /^(home|menu|contact|about|login|logout|search|next|back|více|zpět|přihlásit|registrace|cookie|privacy|careers|kariera|jobs|english|czech|uživatelská\s*sekce|my\s*account|account|dashboard|profil|nastavení|settings|přehled|aktuality|novinky|blog|press|média|media|investor|výroční|annual|report|gdpr|terms|podmínky|ochrana|sitemap|mapa\s*webu|newsletter|subscribe|odebírat|sdílet|share|tisk|print|zprávy|news|faq|nápověda|help|podpora|support|kontakt|kariéra\s*home|zpět\s*na|back\s*to|všechny\s*pozice|all\s*positions|zobrazit\s*více|load\s*more|další|previous|předchozí|filtr|filter|sort|řadit|kategorie|category)/i;

// Must look like a real job title: contains at least one "job-like" word or is short and specific
function isJobTitle(title) {
  if (!title || title.length < 4 || title.length > 130) return false;
  if (NAV_BLACKLIST.test(title.trim())) return false;
  // Reject if it's just a URL fragment or contains HTML
  if (title.includes('<') || title.includes('>') || title.includes('href=')) return false;
  // Reject pure numbers or single words that are generic
  if (/^\d+$/.test(title.trim())) return false;
  return true;
}

function scoreJob(job, profile) {
  let score = 0;
  const breakdown = { field: 0, level: 0, location: 0, recency: 0 };
  const reasons = [];

  const text = `${job.title} ${job.snippet}`.toLowerCase();
  const skills = (profile.skills || "").toLowerCase();
  const field = (profile.field || "").toLowerCase();

  // 1. Field match (40pts)
  const fieldKeywords = field.split(/[\s,]+/).filter(k => k.length > 2);
  const skillKeywords = skills.split(/[\s,;]+/).filter(k => k.length > 2).slice(0, 15);
  const allKeywords = [...new Set([...fieldKeywords, ...skillKeywords])];
  const matchedKeywords = allKeywords.filter(kw => text.includes(kw));
  if (matchedKeywords.length > 0) {
    breakdown.field = Math.min(40, Math.round((matchedKeywords.length / Math.max(allKeywords.length, 1)) * 80));
    reasons.push(`Odpovídá oboru: ${matchedKeywords.slice(0, 3).join(", ")}`);
  }

  // 2. Level match (25pts)
  const levelPref = (profile.level || "").toLowerCase();
  const juniorTerms = ["junior", "stáž", "staz", "brigáda", "brigada", "internship", "trainee", "absolvent", "praktikant", "entry", "student"];
  const seniorTerms = ["senior", "vedoucí", "manažer", "ředitel", "head of", "principal", "lead"];

  const isJuniorJob = juniorTerms.some(t => text.includes(t));
  const isSeniorJob = seniorTerms.some(t => text.includes(t));
  const userIsJunior = juniorTerms.some(t => levelPref.includes(t)) || levelPref.includes("bakalář") || levelPref.includes("magistr") || levelPref.includes("střední");

  if (isJuniorJob && userIsJunior) {
    breakdown.level = 25;
    reasons.push("Junior / stáž / brigáda pozice");
  } else if (!isSeniorJob && userIsJunior) {
    breakdown.level = 12;
  } else if (isSeniorJob && !userIsJunior) {
    breakdown.level = 10;
  } else {
    breakdown.level = 15;
  }

  // 3. Location match (20pts)
  const userCity = (profile.city || "Praha").toLowerCase();
  const jobLoc = (job.location || "").toLowerCase();
  if (jobLoc.includes(userCity) || userCity.includes(jobLoc)) {
    breakdown.location = 20;
    reasons.push(`Lokalita: ${job.location}`);
  } else if (jobLoc.includes("remote") || jobLoc.includes("home office") || jobLoc.includes("vzdáleně") || jobLoc.includes("online")) {
    breakdown.location = 12;
    reasons.push("Remote / home office");
  } else if (jobLoc === "" || jobLoc.includes("česká republika") || jobLoc.includes("czech republic") || jobLoc.includes("celá čr")) {
    breakdown.location = 10;
  } else {
    breakdown.location = 5;
  }

  // 4. Recency (15pts)
  const now = new Date();
  if (job.posted_date) {
    const postedDate = new Date(job.posted_date);
    if (!isNaN(postedDate)) {
      const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
      if (diffDays < 1) { breakdown.recency = 15; reasons.push("Zveřejněno dnes"); }
      else if (diffDays < 7) { breakdown.recency = 10; reasons.push("Zveřejněno tento týden"); }
      else if (diffDays < 30) { breakdown.recency = 5; }
      else { breakdown.recency = 2; }
    }
  } else {
    breakdown.recency = 5;
  }

  score = breakdown.field + breakdown.level + breakdown.location + breakdown.recency;
  return { score: Math.min(100, score), breakdown, reasons };
}

// ─── scrapers ──────────────────────────────────────────────────────────────

// jobs.cz — official RSS feed
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
    const company = (item.match(/<jobs:employer>(.*?)<\/jobs:employer>/) || item.match(/<employer>(.*?)<\/employer>/) || [])[1] || "";
    const loc = (item.match(/<jobs:location>(.*?)<\/jobs:location>/) || [])[1] || location;

    const cleanTitle = title.trim();
    if (isJobTitle(cleanTitle) && link) {
      jobs.push({
        title: cleanTitle,
        company: company.trim() || "Neznámá firma",
        location: loc.trim(),
        snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200),
        url: link.trim(),
        posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null,
        source: "jobs.cz"
      });
    }
  }
  return jobs;
}

// startupjobs.cz — RSS feed
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
      jobs.push({
        title: cleanTitle,
        company: company.trim() || "Startup",
        location: loc.trim() || "Praha / Remote",
        snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200),
        url: link.trim(),
        posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null,
        source: "startupjobs.cz"
      });
    }
  }
  return jobs;
}

// jenprace.cz — RSS
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
      jobs.push({
        title: cleanTitle,
        company: "jenprace.cz",
        location: "Česká republika",
        snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200),
        url: link.trim(),
        posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null,
        source: "jenprace.cz"
      });
    }
  }
  return jobs;
}

// fajnbrigady.cz — HTML scrape with strict job filtering
async function fetchFajnBrigady(keyword) {
  const jobs = [];
  const url = `https://www.fajnbrigady.cz/brigady/?q=${encodeURIComponent(keyword)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`fajnbrigady.cz ${res.status}`);
  const html = await res.text();

  // fajnbrigady lists jobs in article/div blocks with /brigada/ or /prace/ in hrefs
  const pattern = /href="(https?:\/\/[^"]*fajnbrigady[^"]*(?:brigada|prace|inzerat)[^"]*)"[^>]*>([^<]{5,120})/gi;
  let match;
  while ((match = pattern.exec(html)) !== null && jobs.length < 25) {
    const href = match[1];
    const title = match[2].trim();
    if (isJobTitle(title)) {
      jobs.push({
        title,
        company: "fajnbrigady.cz",
        location: "Česká republika",
        snippet: "",
        url: href,
        posted_date: null,
        source: "fajnbrigady.cz"
      });
    }
  }

  // fallback: pick up article h2/h3 headings
  if (jobs.length === 0) {
    const articles = html.match(/<(?:article|div)[^>]*class="[^"]*(?:job|brigada|listing|card)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>/gi) || [];
    for (const art of articles.slice(0, 30)) {
      const hMatch = art.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
      const title = hMatch ? hMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      const href = (art.match(/href="(https?:\/\/[^"]+)"/) || [])[1] || "";
      if (isJobTitle(title) && href) {
        jobs.push({ title, company: "fajnbrigady.cz", location: "Česká republika", snippet: "", url: href, posted_date: null, source: "fajnbrigady.cz" });
      }
    }
  }
  return jobs;
}

// volnamista.cz — RSS
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
      jobs.push({
        title: cleanTitle,
        company: company.trim() || "volnamista.cz",
        location: loc.trim(),
        snippet: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200),
        url: link.trim(),
        posted_date: pubDate ? new Date(pubDate).toISOString().split("T")[0] : null,
        source: "volnamista.cz"
      });
    }
  }
  return jobs;
}

// juristic.cz — law-specific jobs HTML scrape
async function fetchJuristicCz() {
  const jobs = [];
  const res = await fetch("https://juristic.cz/pracovni-mista/", { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`juristic.cz ${res.status}`);
  const html = await res.text();

  const articleMatches = html.match(/<article[^>]*>([\s\S]*?)<\/article>/gi) || [];
  for (const art of articleMatches.slice(0, 30)) {
    const title = (art.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i) || [])[1]?.replace(/<[^>]+>/g, "").trim() || "";
    const link = (art.match(/href="(https?:\/\/[^"]*juristic[^"]*)"/) || art.match(/href="(\/pracovni-mista\/[^"]+)"/) || [])[1] || "";
    const snippet = art.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);

    if (isJobTitle(title) && link) {
      jobs.push({
        title: title.slice(0, 100),
        company: "Juristic.cz",
        location: "Praha",
        snippet,
        url: link.startsWith("http") ? link : `https://juristic.cz${link}`,
        posted_date: null,
        source: "juristic.cz"
      });
    }
  }
  return jobs;
}

// pracevpravu.cz — law-specific jobs HTML scrape
async function fetchPracevpravu() {
  const jobs = [];
  const res = await fetch("https://www.pracevpravu.cz/", { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`pracevpravu.cz ${res.status}`);
  const html = await res.text();

  const pattern = /href="(https?:\/\/[^"]*pracevpravu[^"]*inzerat[^"]*)"(?:[^>]*title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null && jobs.length < 30) {
    const href = match[1] || "";
    const titleAttr = (match[2] || "").trim();
    const innerText = (match[3] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const title = (titleAttr || innerText).slice(0, 100);
    if (isJobTitle(title) && href) {
      jobs.push({ title, company: "pracevpravu.cz", location: "Praha", snippet: "", url: href, posted_date: null, source: "pracevpravu.cz" });
    }
  }
  return jobs;
}

// LinkedIn public job search — no auth needed for public listings page
async function fetchLinkedInPublic(keyword, location) {
  const jobs = [];
  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&f_TPR=r604800`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "cs,en;q=0.9"
    }
  });
  if (!res.ok) throw new Error(`LinkedIn ${res.status}`);
  const html = await res.text();

  // LinkedIn public listing cards: <a ... class="...base-card__full-link...">Title</a>
  const titlePattern = /<a[^>]+class="[^"]*base-card__full-link[^"]*"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = titlePattern.exec(html)) !== null && jobs.length < 20) {
    const href = m[1].split("?")[0]; // strip tracking params
    const title = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (isJobTitle(title) && href) {
      jobs.push({ title, company: "LinkedIn", location: location, snippet: "", url: href, posted_date: null, source: "linkedin" });
    }
  }

  // Fallback: JSON-LD structured data which LinkedIn sometimes embeds
  const jsonLdMatches = html.match(/"title"\s*:\s*"([^"]{5,120})","url"\s*:\s*"(https:\/\/[^"]*linkedin[^"]*)"/g) || [];
  for (const block of jsonLdMatches.slice(0, 20)) {
    const t = (block.match(/"title"\s*:\s*"([^"]+)"/) || [])[1] || "";
    const u = (block.match(/"url"\s*:\s*"([^"]+)"/) || [])[1] || "";
    if (isJobTitle(t) && u && !jobs.find(j => j.url === u)) {
      jobs.push({ title: t, company: "LinkedIn", location, snippet: "", url: u, posted_date: null, source: "linkedin" });
    }
  }
  return jobs;
}

// ─── main handler ──────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const profile = body.profile || {};

    const keyword = profile.field || profile.skills?.split(",")[0]?.trim() || "junior";
    const location = profile.city || "Praha";

    // Create run record
    const run = await base44.entities.JobSearchRun.create({
      user_id: user.id,
      status: "running",
      profile_snapshot: profile,
      sources_checked: [],
      sources_failed: []
    });

    const allJobs = [];
    const sourcesChecked = [];
    const sourcesFailed = [];

    // Run all sources in parallel for speed (with individual error handling)
    const sources = [
      { name: "jobs.cz", fn: () => fetchJobsCzRss(keyword, location) },
      { name: "startupjobs.cz", fn: () => fetchStartupJobsRss(keyword) },
      { name: "jenprace.cz", fn: () => fetchJenpraceRss(keyword) },
      { name: "volnamista.cz", fn: () => fetchVolnaMistaRss(keyword, location) },
      { name: "fajnbrigady.cz", fn: () => fetchFajnBrigady(keyword) },
      { name: "juristic.cz", fn: () => fetchJuristicCz() },
      { name: "pracevpravu.cz", fn: () => fetchPracevpravu() },
      { name: "linkedin", fn: () => fetchLinkedInPublic(keyword, location) },
    ];

    const results = await Promise.allSettled(sources.map(s => s.fn()));
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        allJobs.push(...result.value);
        sourcesChecked.push(sources[i].name);
      } else {
        sourcesFailed.push(`${sources[i].name}: ${result.reason?.message || "failed"}`);
      }
    });

    // Deduplicate by URL
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.url || seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    // Score, rank, take top 25
    const scored = unique
      .map(job => {
        const { score, breakdown, reasons } = scoreJob(job, profile);
        return { ...job, match_score: score, match_breakdown: breakdown, match_reasons: reasons };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 25);

    // Save listings to DB
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    const runId = run.id;

    await Promise.all(scored.map(job =>
      base44.entities.JobListing.create({
        run_id: runId,
        user_id: user.id,
        external_id: job.url,
        title: job.title,
        company: job.company,
        location: job.location,
        match_score: job.match_score,
        match_breakdown: job.match_breakdown,
        match_reasons: job.match_reasons,
        posted_date: job.posted_date,
        source: job.source,
        url: job.url,
        snippet: job.snippet || "",
        tags: job.tags || [],
        saved: false,
        expires_at: expiresAt
      })
    ));

    // Update run record
    await base44.entities.JobSearchRun.update(runId, {
      status: "done",
      total_found: unique.length,
      filtered_to: scored.length,
      sources_checked: sourcesChecked,
      sources_failed: sourcesFailed
    });

    return Response.json({
      run_id: runId,
      jobs: scored,
      total_found: unique.length,
      filtered_to: scored.length,
      sources_checked: sourcesChecked,
      sources_failed: sourcesFailed,
      run_timestamp: new Date().toISOString()
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});