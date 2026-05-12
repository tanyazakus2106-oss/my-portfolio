# Cloudflare Cutover Checklist — Phase 6

**Started:** 2026-05-12 15:53 EEST
**Operator:** Tanya Zakus
**Target domain:** tanyazakus.com
**Pages project:** my-portfolio

## Pre-flight

- [x] Cloudflare account 2FA enabled — confirmed 2026-05-12 16:28 EEST via dash.cloudflare.com → My Profile → Authentication (TOTP authenticator app; password reset performed first because an earlier enrollment attempt leaked the seed to a shared screenshot — fresh enrollment supersedes the abandoned one)
- [x] 2FA recovery codes stored in password manager — confirmed 2026-05-12 16:28 EEST

## Registration

- [x] Purchased tanyazakus.com via Cloudflare Registrar — order confirmation pending receipt lookup (recoverable via Cloudflare → Billing → Order history) on 2026-05-12 17:01 EEST
- [x] Transfer Lock enabled — verified at dash.cloudflare.com → Domain Registration → tanyazakus.com → Manage (status: locked; ICANN 60-day lock also active as belt-and-suspenders)
- [x] Auto-Renew enabled — verified at same panel (status: ON)
- [x] Domain appears in Cloudflare DNS dashboard sidebar — verified at 2026-05-12 17:01 EEST

## Custom domain attach

- [x] tanyazakus.com attached to my-portfolio Pages project on 2026-05-12 17:10 EEST
- [x] www.tanyazakus.com attached to my-portfolio Pages project on 2026-05-12 17:10 EEST
- [x] Universal SSL provisioned for tanyazakus.com — issuer: Google Trust Services (CN=WE1), expires 2026-08-10 14:07 UTC (90-day cert, auto-rotated by Cloudflare)
- [x] Universal SSL provisioned for www.tanyazakus.com — issuer: Google Trust Services (CN=WE1), expires 2026-08-10 14:07 UTC
- [x] curl -vI https://tanyazakus.com returns HTTP 200 with valid cert

### Raw curl output (apex)
```
* IPv4: 188.114.97.11, 188.114.96.11
* Connected to tanyazakus.com (188.114.97.11) port 443
* ALPN: curl offers h2,http/1.1
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=tanyazakus.com
*  start date: May 12 13:07:41 2026 GMT
*  expire date: Aug 10 14:07:34 2026 GMT
*  subjectAltName: host "tanyazakus.com" matched cert's "tanyazakus.com"
*  issuer: C=US; O=Google Trust Services; CN=WE1
*  SSL certificate verify ok.
* using HTTP/2
< HTTP/2 200
HTTP/2 200
date: Tue, 12 May 2026 14:09:27 GMT
content-type: text/html; charset=utf-8
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
```

### Raw curl output (www)
```
* IPv4: 188.114.96.3, 188.114.97.3
* Connected to www.tanyazakus.com (188.114.96.3) port 443
* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=www.tanyazakus.com
*  start date: May 12 13:07:31 2026 GMT
*  expire date: Aug 10 14:07:22 2026 GMT
*  subjectAltName: host "www.tanyazakus.com" matched cert's "www.tanyazakus.com"
*  issuer: C=US; O=Google Trust Services; CN=WE1
*  SSL certificate verify ok.
* using HTTP/2
< HTTP/2 200
HTTP/2 200
```

DNS resolution: `dig +short tanyazakus.com` → `188.114.96.11`, `188.114.97.11` (Cloudflare edge, expected).

## Cloudflare hardening

- [x] SSL/TLS encryption mode set to Full (strict) — verified at dash.cloudflare.com → tanyazakus.com → SSL/TLS → Overview on 2026-05-12 17:31 EEST
- [x] Always Use HTTPS toggle ON — verified at SSL/TLS → Edge Certificates on 2026-05-12 17:31 EEST
- [x] Redirect Rule created: hostname `www.tanyazakus.com` → 301 to https://tanyazakus.com (preserve path + query) — Dynamic mode with expression `concat("https://tanyazakus.com", http.request.uri)` after two iterations to debug `${1}` literal-placeholder bug and Static-mode path-loss issue
- [x] curl https://www.tanyazakus.com → 301 to https://tanyazakus.com — verified 2026-05-12 17:31 EEST
- [x] curl http://tanyazakus.com → 301 to https://tanyazakus.com — verified 2026-05-12 17:31 EEST
- [x] curl https://tanyazakus.com → 200 — verified 2026-05-12 17:31 EEST

### Raw curl output (www → apex)
```
$ curl -sI https://www.tanyazakus.com/
HTTP/2 301
location: https://tanyazakus.com/
server: cloudflare

$ curl -sI https://www.tanyazakus.com/about?test=1
HTTP/2 301
location: https://tanyazakus.com/about?test=1     ← path AND query preserved
server: cloudflare

$ curl -sI https://www.tanyazakus.com/projects/alpha
HTTP/2 301
location: https://tanyazakus.com/projects/alpha   ← deep path preserved
server: cloudflare
```

Hard pass checks (independent grep verification):
- no `${...}` literal placeholder in Location: PASS
- no `www.` prefix in Location target: PASS
- `/about` path preserved: PASS
- `test=1` query preserved: PASS

### Raw curl output (http → https)
```
$ curl -sI http://tanyazakus.com/
HTTP/1.1 301 Moved Permanently
Location: https://tanyazakus.com/
Server: cloudflare
```

## Redirect Rule iteration notes (D-06 sequencing landmine satisfied)

Three iterations were needed to land on a working Cloudflare Redirect Rule. Recording for future-Tanya's reference:

1. **Iteration 1 — Static mode with `${1}` placeholder:** Cloudflare accepted the URL `https://tanyazakus.com${1}` but treated `${1}` as a literal string, not a substitution token. Resulting Location header included a literal `${1}` segment that would 404. The hard-curl evidence step caught this even though a weaker grep would have falsely passed.

2. **Iteration 2 — Dynamic mode with `if()` branch:** Tried `concat("https://tanyazakus.com", http.request.uri.path, if(len(http.request.uri.query) > 0, concat("?", http.request.uri.query), ""))`. Cloudflare rejected with "Filter parsing error (1:57): unknown identifier" — the `if()` function isn't available in Redirect Rules' expression subset (it exists elsewhere in the Rules engine but not here).

3. **Iteration 3 — Dynamic mode with `http.request.uri` (FINAL):** Expression `concat("https://tanyazakus.com", http.request.uri)`. Works because `http.request.uri` is a single token containing path + (optional ?query) already. No branching needed. This is the cleanest pattern for any apex-canonical redirect on Cloudflare.

**D-06 sequencing landmine:** SATISFIED. DNS+HTTPS verified live with correct redirect semantics. Plan 04 may flip `astro.config.mjs:9` `site:` URL.
