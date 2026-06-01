import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Chybějící pole' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'getjobcz1@gmail.com',
      from_name: 'GetJob.cz Kontaktní formulář',
      subject: `Nová zpráva od ${name} (${email})`,
      body: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});