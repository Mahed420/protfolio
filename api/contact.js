// Vercel serverless function: project inquiry -> email via Resend. Keys only in env vars.
const cors = (res, origin) => {
  const allow = process.env.ALLOWED_ORIGIN || '';
  if (origin && origin === allow) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};
const esc = s => String(s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).slice(0, 3000);
export default async function handler(req, res) {
  cors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO;
  if (!key || !to) return res.status(503).json({ error: 'Contact backend not configured' });
  const b = req.body || {};
  if (!b.name || !/^\S+@\S+\.\S+$/.test(b.email || '') || !b.msg) return res.status(400).json({ error: 'Missing fields' });
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'onboarding@resend.dev', to: [to], reply_to: b.email,
        subject: `Project request: ${esc(b.type)} from ${esc(b.name)}`,
        html: `<p><b>${esc(b.name)}</b> (${esc(b.email)})</p><p>Type: ${esc(b.type)} | Budget: ${esc(b.budget) || 'n/a'}</p><p>${esc(b.msg).replace(/\n/g, '<br>')}</p>`
      })
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) { return res.status(502).json({ error: 'Request failed' }); }
}
