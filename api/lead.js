// Receives pop-up and chat enquiries and mails them via Resend.
// Env: RESEND_API_KEY (required). RESEND_FROM (optional, verified domain) also mails the price guide to the sender.
const TO = 'denys@selladshot.com';
const ORIGINS = ['https://selladshot.com', 'https://www.selladshot.com'];
const MAX_BODY = 12000;
const hits = new Map(); // best-effort rate limit per warm instance: ip -> [timestamps]
const LIMIT = 5, WINDOW = 10 * 60 * 1000;

const clean = (s, n) => (typeof s === 'string' ? s : '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, n);
const cleanBlock = (s, n) => (typeof s === 'string' ? s : '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fail = (res, code, msg) => res.status(code).json({ success: false, message: msg });

function originOk(req) {
  const o = req.headers.origin || '';
  if (ORIGINS.includes(o)) return true;
  // Vercel preview deployments of this project (set ALLOW_PREVIEW=1 to enable)
  return process.env.ALLOW_PREVIEW === '1' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(o);
}
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 2000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW)) hits.delete(k);
  return arr.length > LIMIT;
}
async function send(key, body) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

module.exports = async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return fail(res, 405, 'method'); }
  if (!originOk(req)) return fail(res, 403, 'origin');
  if (!/^application\/json/i.test(req.headers['content-type'] || '')) return fail(res, 415, 'type');
  const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || 'x').trim();
  if (limited(ip)) { res.setHeader('Retry-After', '600'); return fail(res, 429, 'rate'); }
  const key = process.env.RESEND_API_KEY;
  if (!key) return fail(res, 503, 'not configured');

  let b = req.body;
  try {
    if (typeof b === 'string') { if (b.length > MAX_BODY) return fail(res, 413, 'size'); b = JSON.parse(b || '{}'); }
    if (!b || typeof b !== 'object' || Array.isArray(b) || JSON.stringify(b).length > MAX_BODY) return fail(res, 400, 'invalid');
  } catch (e) { return fail(res, 400, 'invalid'); }

  const name = clean(b.name, 120), email = clean(b.email, 200), message = cleanBlock(b.message, 4000), auto = cleanBlock(b.auto, 2000);
  let subject = clean(b.subject, 80);
  if (!/^SellAdShot [A-Za-z0-9 ()]+$/.test(subject)) subject = 'SellAdShot enquiry';
  if (!name || !/^[^@\s<>",;]+@[^@\s<>",;]+\.[^@\s<>",;]+$/.test(email) || !message) return fail(res, 400, 'invalid');

  const from = process.env.RESEND_FROM || 'SellAdShot <onboarding@resend.dev>';
  try {
    await send(key, { from, to: [TO], reply_to: email, subject, html: '<p><b>' + esc(name) + '</b> &lt;' + esc(email) + '&gt;</p><p style="white-space:pre-line">' + esc(message.replace(/ \| /g, '\n')) + '</p>' });
    // price guide copy to the sender: only when a verified sending domain is configured
    if (process.env.RESEND_FROM && auto) await send(key, { from, to: [email], reply_to: TO, subject: 'SellAdShot', text: auto }).catch(() => {});
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e.message);
    fail(res, 502, 'mail failed');
  }
};
