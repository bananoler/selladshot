# Security

Static site (HTML/CSS/JS) on Vercel plus one serverless function, `api/lead.js`.

## What is in place
- **Headers** (`vercel.json`): Content-Security-Policy (scripts only from this site, no inline scripts), HSTS, X-Content-Type-Options, X-Frame-Options DENY (no clickjacking), Referrer-Policy, Permissions-Policy (microphone only for this site), COOP.
- **`/api/lead`**: POST only, JSON only, allowed origins `selladshot.com` / `www.selladshot.com`, body size limit, input cleaning (control characters, header injection), fixed subject pattern, HTML escaping in the mail, rate limit per IP (best effort per instance), no internal error details in responses.
- **Secrets** only as Vercel environment variables (`RESEND_API_KEY`, `RESEND_FROM`), never in the repository. `.gitignore` excludes `.env*`, keys and `.vercel`.
- No third-party scripts, fonts or trackers; fonts are served from this site.

## Reporting
denys@selladshot.com (see `/.well-known/security.txt`).

## Manual settings outside the repo
- 2FA on GitHub, Vercel, Resend and the mailbox denys@selladshot.com.
- GitHub: protect `main` (no force-push), enable Secret scanning and Push protection.
- Vercel: only needed environment variables, Resend key with "Sending access" only.
- Resend: verify selladshot.com; set SPF, DKIM and a DMARC record at the domain registrar.
