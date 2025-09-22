// pages/api/cashpack-devis.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  try {
    const n8nUrl = 'https://vpjeammot.app.n8n.cloud/webhook-test/cashpack/devis'; // TEST

    // (facultatif) timeout de 12s
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);

    const upstream = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: ctrl.signal,
    });
    clearTimeout(t);

    const text = await upstream.text();

    // Essaie de renvoyer du JSON si possible pour que le front lise {ok:...}
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      // Sinon renvoie tel quel
      return res.status(upstream.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ ok:false, error: err?.message || 'Proxy error' });
  }
}
