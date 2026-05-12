---
phase: 6
slug: deployment
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-12
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | npx-driven CLIs (lighthouse 12.x, cspell 9.x) + brew-installed lychee + native curl/grep/jq. No test framework installed (static site). |
| **Config file** | `cspell.json`, `.cspell-words.txt` (created in Plan 06-01 Task 3) |
| **Quick run command** | `npm run build && npm run typecheck` |
| **Full suite command** | `npm run build && npm run typecheck && npx lychee --no-progress ./dist && npx cspell "src/content/**/*.mdx" "src/pages/**/*.astro" --no-summary && npx lighthouse https://<host>/ --preset=desktop --quiet --output=json --chrome-flags='--headless' \| jq '.categories.performance.score'` |
| **Estimated runtime** | ~120 seconds (build 12s + typecheck 6s + lychee 8s + cspell 4s + lighthouse 90s) |

---

## Sampling Rate

- **After every task commit:** `npm run build && npm run typecheck` (quick)
- **After every plan wave:** full suite as above against preview URL (Waves 1–2) or production (Wave 4)
- **Before `/gsd-verify-work`:** full suite green AND Lighthouse mobile ≥ 0.80 on production
- **Max feedback latency:** ~120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | DEPLOY-02, SEO-05 | T-06-01..05 | Security headers + cache-control headers in `public/_headers`, CSP intentionally absent | smoke | `test -f public/_headers && grep -q "^  Strict-Transport-Security: max-age=31536000; includeSubDomains$" public/_headers && grep -q "^/_astro/\*$" public/_headers && grep -q "^  Cache-Control: public, max-age=31536000, immutable$" public/_headers && grep -q "^  X-Frame-Options: DENY$" public/_headers && grep -q "^  Referrer-Policy: strict-origin-when-cross-origin$" public/_headers && grep -q "Permissions-Policy: camera=()" public/_headers && ! grep -q "$(printf '\t')" public/_headers && ! grep -q "preload" public/_headers && ! grep -q "Content-Security-Policy" public/_headers && echo "OK"` | ✅ | ⬜ pending |
| 06-01-02 | 01 | 1 | DEPLOY-02, SEO-05 | T-06-06, T-06-08 | Path-only `_redirects` (no hostname-source open-redirect surface); robots.txt sitemap pointer at apex hostname | smoke | `test -f public/_redirects && test -f public/robots.txt && grep -qE "^/work[[:space:]]+/#projects[[:space:]]+301$" public/_redirects && grep -qE "^/work/[[:space:]]+/#projects[[:space:]]+301$" public/_redirects && ! grep -q "www\." public/_redirects && grep -q "^User-agent: \*$" public/robots.txt && grep -q "^Allow: /$" public/robots.txt && grep -q "^Sitemap: https://tanyazakus\.com/sitemap-index\.xml$" public/robots.txt && echo "OK"` | ✅ | ⬜ pending |
| 06-01-03 | 01 | 1 | DEPLOY-02 (SC4 spelling gate) | — | Project dictionary scoped — `.planning/` excluded so plan docs don't pollute spelling-review signal | smoke | `test -f cspell.json && python3 -c "import json; d=json.load(open('cspell.json')); assert d['version']=='0.2', 'wrong version'; assert 'tanyazakus' in d['words'], 'missing tanyazakus'; assert 'Fontshare' in d['words'], 'missing Fontshare'; assert '.planning' in d['ignorePaths'], 'missing .planning ignore'; assert 'node_modules' in d['ignorePaths'], 'missing node_modules ignore'; print('OK')"` | ✅ | ⬜ pending |
| 06-02-01 | 02 | 2 | DEPLOY-02 (SC4 broken-link gate) | T-06-08 | Lychee scan of `dist/` exits 0 — no broken internal links surface at launch | unit | `test -f .planning/phases/06-deployment/lychee-report.txt && grep -qE "lychee exit code: 0" .planning/phases/06-deployment/lychee-report.txt && echo "OK"` | ❌ Wave 2 produces | ⬜ pending |
| 06-02-02 | 02 | 2 | DEPLOY-02 (SC4 spelling gate) | — | cspell exits 0 across MDX/Astro/Markdown + README — dictionary tuned to zero-error | unit | `npx cspell "src/**/*.{mdx,astro,md}" "README.md" && echo "OK"` | ✅ (config exists post 06-01-03) | ⬜ pending |
| 06-02-03 | 02 | 2 | SEO-05 (baseline gate) | T-06-30 | Mobile Lighthouse perf score on preview ≥ 0.80 — baseline evidence for SEO-05 measurement-first pattern | unit | `test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.html && test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.json && python3 -c "import json,sys; data=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-baseline.json')); score=data['categories']['performance']['score']; print(f'Performance score: {score}'); assert score >= 0.80, f'SEO-05 gate FAILED: score {score} < 0.80'" && echo "OK"` | ❌ Wave 2 produces | ⬜ pending |
| 06-02-04 | 02 | 2 | (SC4 mailto gate) | — | Manual mailto E2E send-and-receive — see Manual-Only block | checkpoint:human-verify | `test -f .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "tanyazakus2106@gmail.com" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "pass" .planning/phases/06-deployment/mailto-e2e-evidence.md && echo "OK"` | ❌ Wave 2 produces (manual evidence) | ⬜ pending |
| 06-03-01 | 03 | 3 | DEPLOY-03 (D-02/D-03 pre-flight) | T-06-09..11 | Account hardening — 2FA + Transfer Lock + Auto-Renew enabled before purchase | checkpoint:human-action | `test -f .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Cloudflare account 2FA enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"` | ❌ Wave 3 produces (dashboard) | ⬜ pending |
| 06-03-02 | 03 | 3 | DEPLOY-03 (D-02/D-03) | T-06-12..14 | Domain purchased on registrar with Transfer Lock + Auto-Renew | checkpoint:human-action | `grep -qE "^- \[x\] Purchased tanyazakus.com via Cloudflare Registrar" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Transfer Lock enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Auto-Renew enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"` | ❌ Wave 3 produces (dashboard) | ⬜ pending |
| 06-03-03 | 03 | 3 | DEPLOY-03 | T-06-15..18 | Custom domain attached (apex + www); Universal SSL provisioned; live HTTPS confirmed | checkpoint:human-action | `grep -qE "^- \[x\] tanyazakus.com attached" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] www.tanyazakus.com attached" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Universal SSL provisioned for tanyazakus.com" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl -vI https://tanyazakus.com returns HTTP 200" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"` | ❌ Wave 3 produces (dashboard) | ⬜ pending |
| 06-03-04 | 03 | 3 | DEPLOY-03 (D-04) | T-06-19..21 | SSL/TLS = Full (strict), Always Use HTTPS = ON, www→apex 301 Redirect Rule active | checkpoint:human-action | `grep -qE "^- \[x\] SSL/TLS encryption mode set to Full \(strict\)" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Always Use HTTPS toggle ON" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Redirect Rule created" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl https://www.tanyazakus.com .* 301" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl http://tanyazakus.com .* 301" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"` | ❌ Wave 3 produces (dashboard) | ⬜ pending |
| 06-04-01 | 04 | 4 | DEPLOY-01, DEPLOY-03 (D-06/D-07) | T-06-22..24, T-06-27..28 | Atomic launch commit — `site:` flip + README + BaseLayout fallbacks + STATE.md Vercel cleanup, build green, sitemap regenerates with apex URLs | unit | `grep -qE "^  site: 'https://tanyazakus\.com',$" astro.config.mjs && grep -qE "^\*\*Live site:\*\* https://tanyazakus\.com$" README.md && grep -qE "Astro\.site \?\? 'https://tanyazakus\.com'" src/layouts/BaseLayout.astro && [ "$(grep -c "Astro.site ?? 'https://tanyazakus.com'" src/layouts/BaseLayout.astro)" -eq 2 ] && ! grep -qi "vercel" .planning/STATE.md && ! grep -q "my-portfolio-8h7.pages.dev" astro.config.mjs && ! grep -q "my-portfolio-8h7.pages.dev" README.md && ! grep -q "my-portfolio-8h7.pages.dev" src/layouts/BaseLayout.astro && npm run build > /dev/null 2>&1 && grep -q "https://tanyazakus.com/" dist/sitemap-0.xml && echo "OK"` | ✅ (post-edit) | ⬜ pending |
| 06-04-02 | 04 | 4 | DEPLOY-01, DEPLOY-03 | T-06-25..26, T-06-29 | Post-deploy live-state — HTTPS 200, sitemap (both `sitemap-0.xml` and `sitemap-index.xml`) reflects apex, canonical + OG correct, HSTS + XFO headers present, resume PDF still resolves | smoke | `test -f .planning/phases/06-deployment/post-cutover-verification.md && grep -qE "https://tanyazakus.com" .planning/phases/06-deployment/post-cutover-verification.md && [ "$(grep -c '| pass |' .planning/phases/06-deployment/post-cutover-verification.md)" -ge 10 ] && ! grep -qE "\| fail \|" .planning/phases/06-deployment/post-cutover-verification.md && curl -sI https://tanyazakus.com \| head -1 \| grep -qE "HTTP/[12](\.[01])? 200" && curl -s https://tanyazakus.com/sitemap-0.xml \| grep -q "https://tanyazakus.com/" && curl -s https://tanyazakus.com/sitemap-0.xml \| grep -vq "my-portfolio-8h7.pages.dev" && curl -sI https://tanyazakus.com \| grep -qi "strict-transport-security: max-age=31536000" && echo "OK"` | ❌ Wave 4 produces (live) | ⬜ pending |
| 06-04-03 | 04 | 4 | SEO-05 (final gate) | T-06-30 | Production mobile Lighthouse perf score ≥ 0.80 on apex hostname — SEO-05 final gate evidence | unit | `test -f .planning/phases/06-deployment/lighthouse-mobile-launch.html && test -f .planning/phases/06-deployment/lighthouse-mobile-launch.json && python3 -c "import json; d=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-launch.json')); s=d['categories']['performance']['score']; print(f'Production mobile perf: {s}'); assert s>=0.80, f'SEO-05 FINAL GATE FAILED: {s} < 0.80'; assert d['finalUrl'].startswith('https://tanyazakus.com'), 'wrong URL audited'" && echo "OK"` | ❌ Wave 4 produces (live) | ⬜ pending |
| 06-04-04 | 04 | 4 | (SC4 mailto gate, production) | — | Manual mailto E2E re-verification on production hostname — see Manual-Only block | checkpoint:human-verify | `grep -q "Post-cutover production re-verification" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "https://tanyazakus.com" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -c "| pass |" .planning/phases/06-deployment/mailto-e2e-evidence.md \| awk '$1 >= 2 {exit 0} {exit 1}' && echo "OK"` | ❌ Wave 4 produces (manual evidence) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements. (no Wave 0 — no test framework installation needed; npx-based tooling has zero install cost)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mailto E2E send-and-receive | CONT-01/02/03 (carried fwd) | Requires opening a real mail client and confirming receipt at tanyazakus2106@gmail.com — not scriptable | 06-02 Task 4 + 06-04 Task 4: click `mailto:` link → compose → send → confirm receipt within 5 minutes |
| Cloudflare Registrar purchase | DEPLOY-03 (D-02/D-03) | Payment + ICANN identity verification — dashboard transaction | 06-03 Task 2: dash.cloudflare.com → Domain Registration → search tanyazakus.com → purchase |
| Custom domain attach (apex + www) | DEPLOY-03 | Cloudflare Pages dashboard UI flow | 06-03 Task 3: Pages project → Custom domains → Add both apex and www |
| SSL/TLS mode + Always Use HTTPS | DEPLOY-03 | Dashboard toggles, no API | 06-03 Task 4 first phase: SSL/TLS → Overview → Full (strict); Edge Certificates → Always Use HTTPS = ON |
| www → apex Redirect Rule | DEPLOY-03 (D-04) | Dashboard rule editor | 06-03 Task 4 second phase: Rules → Redirect Rules → www.tanyazakus.com → tanyazakus.com 301 |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or are intrinsically manual (mailto + 4 dashboard checkpoints, documented in Manual-Only block)
- [x] Sampling continuity: no 3 consecutive auto tasks without verify (06-01: 3/3, 06-02: 3/4 auto, 06-03: 0/4 manual block, 06-04: 3/4 auto — gap in Wave 3 is intentional and bounded by manual block)
- [x] Wave 0 covers all MISSING references (N/A — no Wave 0 needed)
- [x] No watch-mode flags (all commands one-shot)
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-12
