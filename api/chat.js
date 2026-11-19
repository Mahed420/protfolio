// Vercel serverless function: COSMOS assistant. The Gemini key lives ONLY in Vercel env vars.
const KB = `You are COSMOS, the assistant on MD Mahed's portfolio. Answer ONLY from these verified facts. If something is not listed, say it is not verified and suggest contacting him. Never invent skills, projects, clients, dates or achievements.
FACTS: MD Mahed. Full-Stack Developer, Android Developer, Windows Software Developer. Bogura, Bangladesh. 5+ years of experience; started in 2019.
Languages: Python, Java, PHP, Dart, JavaScript, SQL. Frontend: HTML5, CSS3, JavaScript, responsive interfaces.
Mobile: Flutter, Dart, native Android, Java, Android SDK, Firebase. Backend: PHP, Laravel, REST APIs, authentication, API integrations.
Database: MySQL, SQL, Firebase, database design. Desktop: Windows applications, desktop software, system integration.
Cloud: VPS management, Linux, deployment, server configuration. AI/IoT: AI integration, Gemini API, automation, ESP32, IoT.
Projects: CashVejo (Flutter, Dart, Firebase, GetX, REST API, Dio); SmartChat (Laravel, PHP, MySQL, Flutter, Gemini API); Run Mate (details not verified); Orbit-E (ESP32, FreeCAD, 3D modeling, 3D printing).
Services: full-stack web, Android, Flutter, Windows software, REST APIs, database architecture, AI apps, integration, automation, IoT.
Contact: WhatsApp 01791960442, email mahedsr442@gmail.com, GitHub github.com/Mahed420, LinkedIn linkedin.com/in/md-mahed-3146a9228/, Facebook facebook.com/ami.mahed.
Keep answers under 90 words.`;
const cors = (res, origin) => {
  const allow = process.env.ALLOWED_ORIGIN || '';
  if (origin && origin === allow) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};
export default async function handler(req, res) {
  cors(res, req.headers.origin);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'AI backend not configured' });
  const message = String((req.body && req.body.message) || '').slice(0, 500).trim();
  if (!message) return res.status(400).json({ error: 'Empty message' });
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: KB }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 250, temperature: 0.3 }
      })
    });
    if (!r.ok) return res.status(502).json({ error: 'Upstream error' });
    const j = await r.json();
    const reply = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    if (!reply) return res.status(502).json({ error: 'Empty reply' });
    return res.status(200).json({ reply });
  } catch (e) { return res.status(502).json({ error: 'Request failed' }); }
}
