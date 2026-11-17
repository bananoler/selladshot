// Cloudflare Worker: serves the static site (assets) and handles POST /api/lead via Resend.
// Secrets/vars: RESEND_API_KEY (secret), RESEND_FROM (optional), ALLOW_PREVIEW=1 (allows *.workers.dev origins for testing).
const TO = 'denys@selladshot.com';
const ORIGINS = ['https://selladshot.com', 'https://www.selladshot.com'];
const MAX_BODY = 12000;
const hits = new Map();
const LIMIT = 5, WINDOW = 10 * 60 * 1000;

const clean = (s, n) => (typeof s === 'string' ? s : '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, n);
const cleanBlock = (s, n) => (typeof s === 'string' ? s : '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const H = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const reply = (code, obj, extra) => new Response(JSON.stringify(obj), { status: code, headers: { ...H, ...(extra || {}) } });
const fail = (code, msg, extra) => reply(code, { success: false, message: msg }, extra);

function originOk(req, env) {
  const o = req.headers.get('origin') || '';
  if (ORIGINS.includes(o)) return true;
  return env.ALLOW_PREVIEW === '1' && /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)?\.workers\.dev$/.test(o);
}
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 2000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW)) hits.delete(k);
  return arr.length > LIMIT;
}
// Branded HTML for the price-guide copy sent to the enquirer. `text` is the plain-text version (paragraphs split by blank lines).
function mailHtml(text) {
  const de = /^Hallo/.test(text);
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const sig = paras.pop() || '';
  const body = paras.map((p, i) => {
    const e = esc(p).replace(/\n/g, '<br>');
    if (/^(Erste Einschätzung|First estimate):/.test(p)) {
      const [first, ...rest] = p.split('\n');
      const [label, ...val] = first.split(':');
      return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px"><tr><td style="background:#eaf3fd;border-left:4px solid #ff6b1a;border-radius:8px;padding:16px 18px">'
        + '<div style="font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#0e2a5c;opacity:.7">' + esc(label) + '</div>'
        + '<div style="font:800 24px Arial,sans-serif;color:#0e2a5c;padding:4px 0 6px">' + esc(val.join(':').trim()) + '</div>'
        + (rest.length ? '<div style="font:13px/1.5 Arial,sans-serif;color:#4a5878">' + esc(rest.join(' ')) + '</div>' : '')
        + '</td></tr></table>';
    }
    return '<p style="margin:0 0 16px;font:' + (i === 0 ? '700 18px' : '16px') + '/1.55 Arial,sans-serif;color:#0e2a5c">' + e + '</p>';
  }).join('');
  const btn = de ? 'Beispiele ansehen' : 'See examples';
  return '<!doctype html><html><body style="margin:0;padding:0;background:#f4f7fb">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb"><tr><td align="center" style="padding:24px 12px">'
    + '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden">'
    + '<tr><td style="background:#0e2a5c;padding:20px 28px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>'
    + '<td><img src="https://selladshot.com/favicon-192.png" width="36" height="36" alt="" style="display:block;border-radius:8px"></td>'
    + '<td style="padding-left:12px;font:800 20px Arial,sans-serif;color:#ffffff;letter-spacing:.02em">SellAdShot</td>'
    + '</tr></table></td></tr>'
    + '<tr><td style="height:4px;background:#ff6b1a;font-size:0;line-height:0">&nbsp;</td></tr>'
    + '<tr><td style="padding:28px 28px 8px">' + body
    + '<p style="margin:8px 0 22px"><a href="https://selladshot.com' + (de ? '/de/' : '/') + '" style="display:inline-block;background:#ff6b1a;color:#ffffff;font:800 14px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;padding:13px 24px;border-radius:999px">' + btn + '</a></p>'
    + '<p style="margin:0 0 6px;font:16px/1.5 Arial,sans-serif;color:#0e2a5c">' + esc(sig).replace(/\n/g, '<br>') + '</p></td></tr>'
    + '<tr><td style="padding:18px 28px 24px;border-top:1px solid #e3e9f2"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
    + '<td valign="bottom" style="font:12px/1.5 Arial,sans-serif;color:#7a879f">SellAdShot · Denys Myroniuk · Berlin<br><a href="https://selladshot.com" style="color:#7a879f">selladshot.com</a></td>'
    + '<td align="right" valign="bottom"><div style="font:12px Arial,sans-serif;color:#7a879f;padding-bottom:6px">' + (de ? 'Direkt erreichen' : 'Reach me directly') + '</div>'
    + '<a href="https://wa.me/4917663444890" style="text-decoration:none"><img src="https://selladshot.com/mail-wa.png" width="32" height="32" alt="WhatsApp" style="border-radius:16px;vertical-align:middle"></a>'
    + '&nbsp;&nbsp;<a href="https://instagram.com/denysonlyfacts" style="text-decoration:none"><img src="https://selladshot.com/mail-ig.png" width="32" height="32" alt="Instagram" style="border-radius:16px;vertical-align:middle"></a></td>'
    + '</tr></table></td></tr>'
    + '</table></td></tr></table></body></html>';
}
async function send(key, body) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

async function lead(req, env) {
  if (req.method !== 'POST') return fail(405, 'method', { Allow: 'POST' });
  if (!originOk(req, env)) return fail(403, 'origin');
  if (!/^application\/json/i.test(req.headers.get('content-type') || '')) return fail(415, 'type');
  const ip = (req.headers.get('cf-connecting-ip') || 'x').trim();
  if (limited(ip)) return fail(429, 'rate', { 'Retry-After': '600' });
  const key = env.RESEND_API_KEY;
  if (!key) return fail(503, 'not configured');

  let b;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return fail(413, 'size');
    b = JSON.parse(raw || '{}');
    if (!b || typeof b !== 'object' || Array.isArray(b)) return fail(400, 'invalid');
  } catch (e) { return fail(400, 'invalid'); }

  const name = clean(b.name, 120), email = clean(b.email, 200), message = cleanBlock(b.message, 4000), auto = cleanBlock(b.auto, 2000);
  let subject = clean(b.subject, 80);
  if (!/^SellAdShot [A-Za-z0-9 ()]+$/.test(subject)) subject = 'SellAdShot enquiry';
  if (!name || !/^[^@\s<>",;]+@[^@\s<>",;]+\.[^@\s<>",;]+$/.test(email) || !message) return fail(400, 'invalid');

  const from = env.RESEND_FROM || 'SellAdShot <onboarding@resend.dev>';
  try {
    await send(key, { from, to: [TO], reply_to: email, subject, html: '<p><b>' + esc(name) + '</b> &lt;' + esc(email) + '&gt;</p><p style="white-space:pre-line">' + esc(message.replace(/ \| /g, '\n')) + '</p>' });
    if (env.RESEND_FROM && auto) await send(key, { from, to: [email], reply_to: TO, subject: 'SellAdShot', text: auto, html: mailHtml(auto) }).catch(() => {});
    return reply(200, { success: true });
  } catch (e) {
    console.error(e.message);
    return fail(502, 'mail failed');
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/api/lead') return lead(req, env);
    if (url.pathname.startsWith('/api/')) return fail(404, 'not found');
    return env.ASSETS.fetch(req);
  },
};
