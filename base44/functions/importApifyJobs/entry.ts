import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const APIFY_TOKEN = Deno.env.get("APIFY_TOKEN");
    if (!APIFY_TOKEN) {
      return Response.json({ error: 'APIFY_TOKEN not set' }, { status: 500 });
    }

    // Get latest runs
    const runsRes = await fetch(`https://api.apify.com/v2/actor-runs?token=${APIFY_TOKEN}&limit=10`);
    const runsData = await runsRes.json();

    const latestRun = runsData?.data?.items?.find(r => r.status === 'SUCCEEDED') || runsData?.data?.items?.[0];

    if (!latestRun) {
      return Response.json({ error: 'No Apify runs found', raw: runsData }, { status: 404 });
    }

    const datasetId = latestRun.defaultDatasetId;

    // Fetch items from dataset
    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=100`);
    const items = await datasetRes.json();

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'No items in dataset', datasetId }, { status: 404 });
    }

    // Map Apify items to JobListing schema
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const runId = `apify_${latestRun.id}`;

    const jobs = items.map(item => ({
      run_id: runId,
      user_id: user.id,
      external_id: item.id || item.url || item.title,
      title: item.title || item.positionName || item.jobTitle || "Neznámá pozice",
      company: item.company || item.companyName || item.employer || "",
      location: item.location || item.city || item.place || "",
      url: item.url || item.applyUrl || item.externalUrl || "#",
      snippet: item.description || item.snippet || item.jobDescription || "",
      source: item.source || "Apify",
      posted_date: item.postedAt || item.datePosted || item.publishedAt || now.toISOString(),
      match_score: 70,
      match_reasons: ["Importováno z Apify"],
      saved: false,
      expires_at: expiresAt,
      tags: item.tags || [],
    }));

    // Bulk create
    await base44.entities.JobListing.bulkCreate(jobs);

    return Response.json({ success: true, imported: jobs.length, runId, datasetId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});