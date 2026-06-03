import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SYSTEM = `Jsi expert na psaní motivačních dopisů v češtině. Napiš personalizovaný motivační dopis na základě inzerátu a CV uchazeče. Instrukce: (1) V prvním odstavci zmíň konkrétní důvod proč právě tato firma a pozice. (2) Ve druhém odstavci propoj 2-3 konkrétní zkušenosti z CV s požadavky z inzerátu. (3) Ve třetím odstavci ukaž přidanou hodnotu. (4) Zakončí výzvou k akci. Styl: profesionální ale přirozený, max 250 slov, žádná klišé, konkrétní čísla kde to jde. NIKDY nevymýšlej zkušenosti které v CV nejsou. Výstup: pouze text dopisu, žádné komentáře.`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { jobText, cvData } = await req.json();
    if (!jobText || !cvData) {
      return Response.json({ error: 'jobText and cvData are required' }, { status: 400 });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
    }

    const userMessage = `=== INZERÁT ===\n${jobText}\n\n=== CV UCHAZEČE ===\n${cvData}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Anthropic API error' }, { status: 500 });
    }

    return Response.json({ letter: data.content?.[0]?.text || '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});