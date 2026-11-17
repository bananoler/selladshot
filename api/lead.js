// Receives pop-up enquiries and mails them via Resend.
// Needs env RESEND_API_KEY. Optional: RESEND_FROM (e.g. "Denys <denys@selladshot.com>", a verified domain) to also mail the price guide to the client.
const TO = 'denys@selladshot.com';
const ok = (s) => typeof s === 'string' ? s.trim() : '';
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
async function send(key, body) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('resend ' + r.status + ' ' + (await r.text()).slice(0, 200));
}
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ success: false }); return; }
  const key = process.env.RESEND_API_KEY;
  if (!key) { res.status(503).json({ success: false, message: 'not configured' }); return; }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const name = ok(b.name).slice(0, 120), email = ok(b.email).slice(0, 200), message = ok(b.message).slice(0, 4000), subject = ok(b.subject).slice(0, 150) || 'SellAdShot enquiry', auto = ok(b.auto).slice(0, 2000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) { res.status(400).json({ success: false, message: 'invalid' }); return; }
  const from = process.env.RESEND_FROM || 'SellAdShot <onboarding@resend.dev>';
  try {
    await send(key, { from, to: [TO], reply_to: email, subject, html: '<p><b>' + esc(name) + '</b> &lt;' + esc(email) + '&gt;</p><p style="white-space:pre-line">' + esc(message.replace(/ \| /g, '\n')) + '</p>' });
    if (process.env.RESEND_FROM && auto) await send(key, { from, to: [email], reply_to: TO, subject: 'SellAdShot', text: auto }).catch(() => {});
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e.message);
    res.status(502).json({ success: false, message: 'mail failed', detail: String(e.message).slice(0, 160) });
  }
};
