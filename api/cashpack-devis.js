/api/cashpack-devis.js  (Next.js / Vercel)
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') {
    res.status(204).end(); // pré-vol OK, pas de corps
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const n8nUrl = 'https://vpjeammot.app.n8n.cloud/webhook-test/cashpack/devis'; // <- URL TEST n8n
    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Next/Vercel parse déjà le JSON => req.body est un objet
      body: JSON.stringify(req.body),
    });

    const text = await r.text(); // on renvoie tel quel
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || 'Proxy error' });
  }
}
