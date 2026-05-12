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

- [ ] tanyazakus.com attached to my-portfolio Pages project on {YYYY-MM-DD HH:MM}
- [ ] www.tanyazakus.com attached to my-portfolio Pages project on {YYYY-MM-DD HH:MM}
- [ ] Universal SSL provisioned for tanyazakus.com — issuer: {Google Trust Services / Let's Encrypt}, expires {date}
- [ ] Universal SSL provisioned for www.tanyazakus.com — issuer: {issuer}, expires {date}
- [ ] curl -vI https://tanyazakus.com returns HTTP 200 with valid cert

### Raw curl output (apex)
```
{pending Task 3 verification}
```

### Raw curl output (www)
```
{pending Task 3 verification}
```

## Cloudflare hardening

- [ ] SSL/TLS encryption mode set to Full (strict)
- [ ] Always Use HTTPS toggle ON
- [ ] Redirect Rule created: hostname `www.tanyazakus.com` → 301 to https://tanyazakus.com (preserve path + query)
- [ ] curl https://www.tanyazakus.com → 301 to https://tanyazakus.com — verified {YYYY-MM-DD HH:MM}
- [ ] curl http://tanyazakus.com → 301 to https://tanyazakus.com — verified {YYYY-MM-DD HH:MM}
- [ ] curl https://tanyazakus.com → 200 — verified {YYYY-MM-DD HH:MM}

### Raw curl output (www → apex)
```
{pending Task 4 verification}
```

### Raw curl output (http → https)
```
{pending Task 4 verification}
```
