import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow admin user or scheduled automation (no user)
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    let jobOpenings = null;
    let avgWage = null;
    let unemploymentRate = null;
    const itAvgWage = 78000;

    // 1. MPSV — volná místa
    try {
      const res = await fetch('https://data.mpsv.cz/api/volna-mista/count', {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      // API vrací buď { count: N } nebo { pocet: N } nebo přímo číslo
      jobOpenings = data.count ?? data.pocet ?? data.total ?? (typeof data === 'number' ? data : null);
    } catch (e) {
      console.log('MPSV fetch failed:', e.message);
    }

    // 2. ČSÚ SPARQL — průměrná mzda (dataset 110080) a nezaměstnanost (dataset 250169)
    const sparqlEndpoint = 'https://api.czso.cz/csw/run/v1/sparql';

    try {
      const wageQuery = `
        PREFIX qb: <http://purl.org/linked-data/cube#>
        SELECT ?val WHERE {
          ?obs qb:dataSet <https://data.czso.cz/zdroj/datova-sada/110080> ;
               <https://data.czso.cz/ontologie/sdmx/measure/hodnota> ?val .
        }
        ORDER BY DESC(?val)
        LIMIT 1
      `;
      const wageRes = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(wageQuery)}&format=json`);
      const wageData = await wageRes.json();
      const bindings = wageData?.results?.bindings;
      if (bindings?.length > 0) {
        avgWage = parseFloat(bindings[0].val?.value);
      }
    } catch (e) {
      console.log('CZSO wage fetch failed:', e.message);
    }

    try {
      const unempQuery = `
        PREFIX qb: <http://purl.org/linked-data/cube#>
        SELECT ?val WHERE {
          ?obs qb:dataSet <https://data.czso.cz/zdroj/datova-sada/250169> ;
               <https://data.czso.cz/ontologie/sdmx/measure/hodnota> ?val .
        }
        ORDER BY DESC(?val)
        LIMIT 1
      `;
      const unempRes = await fetch(`${sparqlEndpoint}?query=${encodeURIComponent(unempQuery)}&format=json`);
      const unempData = await unempRes.json();
      const bindings = unempData?.results?.bindings;
      if (bindings?.length > 0) {
        unemploymentRate = parseFloat(bindings[0].val?.value);
      }
    } catch (e) {
      console.log('CZSO unemployment fetch failed:', e.message);
    }

    // Získej poslední uložená data jako fallback
    const existing = await base44.asServiceRole.entities.LaborStats.list('-created_date', 1);
    const prev = existing[0] || {};

    const stats = {
      job_openings: jobOpenings ?? prev.job_openings ?? 341000,
      avg_wage: (avgWage && !isNaN(avgWage)) ? Math.round(avgWage) : (prev.avg_wage ?? 46500),
      it_avg_wage: itAvgWage,
      unemployment_rate: (unemploymentRate && !isNaN(unemploymentRate)) ? unemploymentRate : (prev.unemployment_rate ?? 3.9),
      source_date: new Date().toISOString(),
    };

    if (existing.length > 0) {
      await base44.asServiceRole.entities.LaborStats.update(existing[0].id, stats);
    } else {
      await base44.asServiceRole.entities.LaborStats.create(stats);
    }

    return Response.json({ success: true, stats });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});