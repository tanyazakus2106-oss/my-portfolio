# Phase 6: Deployment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-12
**Phase:** 06-deployment
**Areas discussed:** Custom domain & DNS

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Custom domain & DNS | Domain name, registrar choice, apex/www canonical, sitemap/canonical URL cutover. | ✓ |
| Performance pass scope | How aggressive a Lighthouse/perf optimization pass beyond Astro defaults. | |
| Cloudflare config files | `_redirects`, `_headers`, `robots.txt` decisions. | |
| Pre-launch QA strategy | Tooling depth for SC4 (broken-link audit, spelling, mailto E2E). | |

**User's choice:** Custom domain & DNS (single area). Remaining three areas moved to Claude's Discretion in CONTEXT.md.

---

## Custom domain & DNS

### Q1 — Production domain name

| Option | Description | Selected |
|--------|-------------|----------|
| tanyazakus.com | Full name on `.com` — most-recognized pattern for designer portfolios. | ✓ |
| tanyazakus.design | `.design` TLD signals the craft; slightly pricier (~$40/yr). | |
| tanya.design | Shorter and brandable but trades resume-clarity for memorability. | |

**User's choice:** tanyazakus.com
**Notes:** —

### Mid-area clarification — "Why Cloudflare, not Vercel?"

Before Q2, the user asked for the rationale behind the Cloudflare Pages recommendation. Six reasons surfaced:
1. Vercel Hobby ToS forbids commercial use; portfolio targets freelance clients (commercial).
2. Vercel Pro ($20/mo) pays for SSR/edge features a static site can't use.
3. Cloudflare Pages free tier: unlimited bandwidth + requests; no commercial restriction.
4. CDN reach: Cloudflare ~330 POPs vs Vercel ~40.
5. Cloudflare Registrar at-cost pricing; Vercel uses partner registrar at market rates.
6. Site already on Cloudflare Pages (`my-portfolio-8h7.pages.dev`) since Phase 1.

Decision reaffirmed: stay on Cloudflare Pages. Stale STATE.md Vercel Pro note (line 67) was already superseded by Phase 1 D-02.

### Q2 — Registrar & ownership status

| Option | Description | Selected |
|--------|-------------|----------|
| Buy fresh at Cloudflare (Recommended) | Register through Cloudflare Registrar; at-cost; one dashboard. | ✓ |
| Already own — keep at current registrar | DNS-only setup pointing to Cloudflare Pages. | |
| Already own — transfer to Cloudflare | Consolidate registrar; 5-7 day transfer. | |
| Don't own — buy elsewhere first | Buy at e.g. Namecheap/Porkbun, DNS at Cloudflare. | |

**User's choice:** Buy fresh at Cloudflare (Recommended)
**Notes:** First version of this question was rejected by user as "wants to clarify" — reformulated to be a single ownership-and-registrar question with cleaner option semantics. Reformulated version accepted.

### Q3 — Canonical form (apex vs www)

| Option | Description | Selected |
|--------|-------------|----------|
| tanyazakus.com (apex) (Recommended) | Shorter, cleaner; www 301-redirects to apex. | ✓ |
| www.tanyazakus.com | Slightly more "corporate" feel; apex 301-redirects to www. | |

**User's choice:** tanyazakus.com (apex) (Recommended)
**Notes:** Cloudflare's CNAME flattening removes the historical technical reason to prefer www; decision is purely aesthetic.

### Q4 — DNS scope (subdomains + email forwarding)

| Option | Description | Selected |
|--------|-------------|----------|
| Just the website (Recommended) | tanyazakus.com + www only. No email forwarding, no reserved subdomains. | ✓ |
| Website + email forwarding | Add Cloudflare Email Routing: tanya@tanyazakus.com → existing Gmail. | |
| Website + reserved subdomains | Reserve blog./resume. for v2 use. | |
| Website + email + subdomains | Both: email forwarding + reserved subdomains. | |

**User's choice:** Just the website (Recommended)
**Notes:** Phase 4 mailto stays at tanyazakus2106@gmail.com. Email forwarding and subdomains both moved to Deferred Ideas.

---

## Next-step prompt

| Option | Description | Selected |
|--------|-------------|----------|
| I'm ready for context (Recommended) | Capture decisions; planner handles remaining areas with defaults. | ✓ |
| Discuss Cloudflare config files | Open the _redirects/_headers/robots.txt area. | |
| Discuss pre-launch QA strategy | Open the SC4 launch checklist area. | |
| More questions about Custom domain & DNS | Stay here; dig into SSL/HTTPS, sequencing, preview URL handling. | |

**User's choice:** I'm ready for context (Recommended)

---

## Claude's Discretion

The user explicitly chose not to discuss these areas this session:
- **Performance pass scope** (DEPLOY-02 + SEO-05) — planner picks tooling and depth.
- **Cloudflare config files** (`_redirects`, `_headers`, `robots.txt`) — planner picks which ship.
- **Pre-launch QA strategy** — planner picks broken-link / spelling / mailto-E2E / Lighthouse tooling.

## Deferred Ideas

- Email forwarding `tanya@tanyazakus.com` via Cloudflare Email Routing
- Reserved subdomains (`blog.`, `resume.`)
- Analytics (V2-FEAT-03)
- Preview-URL handling post-launch
- Custom 404 page
- CI typecheck gating
- Tightened security headers (CSP nonce, full Permissions-Policy)
- Real-device test matrix beyond iPhone (carried from Phase 5)
