import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ─── helpers ───────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function scoreJob(job, profile) {
  let score = 0;
  const breakdown = { field: 0, level: 0, location: 0, recency: 0 };
  const reasons = [];

  const text = `${job.title} ${job.snippet}`.toLowerCase();
  const skills = (profile.skills || "").toLowerCase();
  const field = (profile.field || "").toLowerCase();

  // 1. Field match (40pts)
  const fieldKeywords = field.split(/[\s,]+/).filter(Boolean);
  const skillKeywords = skills.split(/[\s,;]+/).filter(k => k.length > 2).slice(0, 15);
  const allKeywords = [...new Set([...fieldKeywords, ...skillKeywords])];
  const matchedKeywords = allKeywords.filter(kw => text.includes(kw));
  if (matchedKeywords.length > 0) {
    breakdown.field = Math.min(40, Math.round((matchedKeywords.length / Math.max(allKeywords.length, 1)) * 80));
    reasons.push(`Odpovídá oboru: ${matchedKeywords.slice(0, 3).join(", ")}`);
  }

  // 2. Level match (25pts)
  const levelPref = (profile.level || "").toLowerCase();
  const juniorTerms = ["junior", "stáž", "staz", "internship", "trainee", "absolvent", "praktikant", "entry"];
  const seniorTerms = ["senior", "vedoucí", "manažer", "ředitel", "5+ let", "10+ let", "head of"];

  const isJuniorJob = juniorTerms.some(t => text.includes(t));
  const isSeniorJob = seniorTerms.some(t => text.includes(t));
  const userIsJunior = juniorTerms.some(t => levelPref.includes(t)) || levelPref.includes("bakalář") || levelPref.includes("magistr");

  if (isJuniorJob && userIsJunior) {
    breakdown.level = 25;
    reasons.push("Junior / stáž pozice");
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
  } else if (jobLoc.includes("remote") || jobLoc.includes("home office") || jobLoc.includes("vzdáleně")) {
    breakdown.location = profile.acceptRemote ? 20 : 10;
    if (profile.acceptRemote) reasons.push("Remote / home office");
  } else if (jobLoc === "" || jobLoc === "česká republika" || jobLoc === "czech republic") {
    breakdown.location = 10;
  }

  // 4. Recency (15pts)
  const now = new Date();
  let postedDate = null;
  if (job.posted_date) {
    postedDate = new Date(job.posted_date);
  }
  if (postedDate && !isNaN(postedDate)) {
    const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) { breakdown.recency = 15; reasons.push("Zveřejněno dnes"); }
    else if (diffDays < 7) { breakdown.recency = 10; reasons.push("Zveřejněno tento týden"); }
    else if (diffDays < 30) { breakdown.recency = 5; }
  } else {
    breakdown.recency = 5;
  }

  score = breakdown.field + breakdown.level + breakdown.location + breakdown.recency;
  return { score: Math.min(100, score), breakdown, reasons };
}

// ─── scrapers ──────────────────────────────────────────────────────────────

async function fetchJobsCzRss(keyword, location) {
  const jobs = [];
  const url = `https://www.jobs.cz/rss/jobs/?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}`;
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`jobs.cz RSS ${res.status}`);
  const xml = await res.text();

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of items.slice(0, 50)) {
    const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
    const link = (item.match(/<link>(.*?)<\/link>/) || [])[1] || "";
    const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || "";
    const company = (item.match(/<jobs:employer>(.*?)<\/jobs:employer>/) || item.match(/<employer>(.*?)<\/employer>/) || [])[1] || "";
    const loc = (item.match(/<jobs:location>(.*?)<\/jobs:location>/) || [])[1] || location;

    if (title) {
      jobs.push({
        title: title.trim(),
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

async function fetchJuristicCz() {
  const jobs = [];
  const res = await fetch("https://juristic.cz/pracovni-mista/", { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`juristic.cz ${res.status}`);
  const html = await res.text();

  // Extract job listings from HTML
  const articleMatches = html.match(/<article[^>]*>([\s\S]*?)<\/article>/gi) || [];
  for (const art of articleMatches.slice(0, 30)) {
    const title = (art.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i) || [])[1]?.replace(/<[^>]+>/g, "").trim() || "";
    const link = (art.match(/href="(https?:\/\/[^"]*juristic[^"]*)"/) || art.match(/href="(\/pracovni-mista\/[^"]*)"/) || [])[1] || "";
    const snippet = art.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);

    if (title && title.length > 5) {
      jobs.push({
        title: title.slice(0, 100),
        company: "Juristic.cz",
        location: "Praha",
        snippet: snippet,
        url: link.startsWith("http") ? link : `https://juristic.cz${link}`,
        posted_date: null,
        source: "juristic.cz"
      });
    }
  }
  return jobs;
}

async function fetchPracevpravu() {
  const jobs = [];
  const res = await fetch("https://www.pracevpravu.cz/", { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`pracevpravu.cz ${res.status}`);
  const html = await res.text();

  // Extract title from title attribute or anchor text
  const pattern = /href="(https?:\/\/[^"]*pracevpravu[^"]*inzerat[^"]*)"(?:[^>]*title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null && jobs.length < 30) {
    const href = match[1] || "";
    const titleAttr = match[2] || "";
    const innerText = (match[3] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const title = (titleAttr || innerText).slice(0, 100);
    if (title.length > 4 && href) {
      jobs.push({
        title,
        company: "pracevpravu.cz",
        location: "Praha",
        snippet: "",
        url: href,
        posted_date: null,
        source: "pracevpravu.cz"
      });
    }
  }
  return jobs;
}

async function fetchCareerPage(name, url, _selector) {
  const jobs = [];
  const res = await fetch(url, { headers: { "User-Agent": "GetJob.cz aggregator/1.0" } });
  if (!res.ok) throw new Error(`${name} ${res.status}`);
  const html = await res.text();

  const pattern = /<a[^>]+href="([^"#][^"]*)"(?:[^>]*title="([^"]*)")?[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const NAV_WORDS = /^(home|menu|contact|about|login|search|next|back|více|zpět|přihlásit|registrace|cookie|privacy|careers|kariera|jobs|english|czech)/i;

  while ((match = pattern.exec(html)) !== null && jobs.length < 20) {
    const href = match[1] || "";
    const titleAttr = match[2] || "";
    const innerText = (match[3] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const title = (titleAttr || innerText).slice(0, 100);

    if (title.length > 8 && title.length < 120 && !NAV_WORDS.test(title)) {
      const fullUrl = href.startsWith("http") ? href : (url.replace(/\/$/, "") + (href.startsWith("/") ? href : "/" + href));
      jobs.push({
        title,
        company: name,
        location: "Česká republika",
        snippet: "",
        url: fullUrl,
        posted_date: null,
        source: name.toLowerCase().replace(/\s+/g, "")
      });
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

    const keyword = profile.field || profile.skills?.split(",")[0] || "junior";
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

    // Fetch from each source with delay
    const sources = [
      { name: "jobs.cz", fn: () => fetchJobsCzRss(keyword, location) },
      { name: "juristic.cz", fn: () => fetchJuristicCz() },
      { name: "pracevpravu.cz", fn: () => fetchPracevpravu() },
      { name: "RSJ Careers", fn: () => fetchCareerPage("RSJ", "https://www.rsj.com/en/careers", null) },
      { name: "CNB Kariéra", fn: () => fetchCareerPage("ČNB", "https://www.cnb.cz/cs/o_cnb/kariera/", null) },
    ];

    for (const src of sources) {
      await sleep(2000);
      try {
        const jobs = await src.fn();
        allJobs.push(...jobs);
        sourcesChecked.push(src.name);
      } catch (e) {
        sourcesFailed.push(`${src.name}: ${e.message}`);
      }
    }

    // Deduplicate by URL
    const seen = new Set();
    const unique = allJobs.filter(j => {
      if (!j.url || seen.has(j.url)) return false;
      seen.add(j.url);
      return true;
    });

    // Score and rank
    const scored = unique.map(job => {
      const { score, breakdown, reasons } = scoreJob(job, profile);
      return { ...job, match_score: score, match_breakdown: breakdown, match_reasons: reasons };
    }).sort((a, b) => b.match_score - a.match_score).slice(0, 20);

    // Save listings to DB
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    const runId = run.id;

    for (const job of scored) {
      await base44.entities.JobListing.create({
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
      });
    }

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