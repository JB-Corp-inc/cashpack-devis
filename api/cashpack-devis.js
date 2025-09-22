// api/cashpack-devis.js  — Vercel Serverless Function (site statique)
export default async function handler(req, res) {
  // CORS (autoriser l'appel depuis ton domaine Vercel)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    // 🔔 En phase de test n8n : utilise l’URL /webhook-test/ et clique "Listen for test event"
    const n8nUrl = 'https://vpjeammot.app.n8n.cloud/webhook-test/cashpack/devis';

    const r = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Vercel parse déjà le JSON -> req.body est un objet
      body: JSON.stringify(req.body ?? {}),
    });

    // On propage tel quel la réponse de n8n pour un debug clair
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || 'Proxy error' });
  }
}
