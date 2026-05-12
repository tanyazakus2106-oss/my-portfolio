---
phase: 06-deployment
plan: 04
type: execute
wave: 4
depends_on:
  - "06-01"
  - "06-02"
  - "06-03"
files_modified:
  - astro.config.mjs
  - README.md
  - src/layouts/BaseLayout.astro
  - .planning/STATE.md
  - .planning/phases/06-deployment/lighthouse-mobile-launch.html
  - .planning/phases/06-deployment/lighthouse-mobile-launch.json
  - .planning/phases/06-deployment/post-cutover-verification.md
autonomous: false
requirements:
  - DEPLOY-01
  - DEPLOY-03
  - SEO-05
requirements_addressed:
  - DEPLOY-01
  - DEPLOY-03
  - SEO-05
tags:
  - launch
  - cutover
  - site-url
  - lighthouse
  - housekeeping

must_haves:
  truths:
    - "astro.config.mjs:9 contains site: 'https://tanyazakus.com'"
    - "README.md no longer references the preview URL my-portfolio-8h7.pages.dev"
    - "BaseLayout.astro Astro.site fallbacks use the production hostname"
    - ".planning/STATE.md no longer contains the stale Vercel Pro blocker"
    - "Post-merge sitemap-index.xml on production uses tanyazakus.com URLs"
    - "Post-cutover Lighthouse mobile score on https://tanyazakus.com is ≥ 0.80"
    - "Resume PDF still downloads from https://tanyazakus.com/tanya-zakus-designer-resume.pdf"
  artifacts:
    - path: "astro.config.mjs"
      provides: "Build config with production site URL"
      contains: "site: 'https://tanyazakus.com'"
    - path: "README.md"
      provides: "Public-facing live-site pointer at apex hostname"
      contains: "https://tanyazakus.com"
    - path: "src/layouts/BaseLayout.astro"
      provides: "Canonical/OG fallback strings reference production hostname (defense-in-depth; unreachable when site: is set)"
      contains: "https://tanyazakus.com"
    - path: ".planning/STATE.md"
      provides: "State doc with stale Vercel blocker retired"
      not_contains: "Vercel Pro"
    - path: ".planning/phases/06-deployment/lighthouse-mobile-launch.html"
      provides: "Post-cutover Lighthouse mobile report against production URL — SEO-05 final gate evidence"
      contains: "tanyazakus.com"
    - path: ".planning/phases/06-deployment/post-cutover-verification.md"
      provides: "Curl + visual + sitemap verification after launch deploy"
      contains: "sitemap-index.xml"
  key_links:
    - from: "astro.config.mjs site: field"
      to: "dist/sitemap-0.xml absolute URLs"
      via: "@astrojs/sitemap integration"
      pattern: "site: 'https://tanyazakus\\.com'"
    - from: "BaseLayout.astro canonicalUrl computation"
      to: "<link rel=\"canonical\"> on every rendered page"
      via: "Astro.site resolution (fallback string is defense-in-depth only)"
      pattern: "Astro.site \\?\\? 'https://tanyazakus.com'"
    - from: "push to main"
      to: "Cloudflare Pages auto-deploy"
      via: "existing repo→Pages binding"
      pattern: "Cloudflare Pages picks up commit hash within minutes"
---

<objective>
With Plan 03 verifying that `https://tanyazakus.com` resolves with valid HTTPS, execute the in-repo cutover: flip `astro.config.mjs:9` `site:` URL, update the README "Live site" pointer, flip the two stale BaseLayout fallback strings (housekeeping), retire the obsolete Vercel Pro blocker in `.planning/STATE.md`, push to `main` (triggers Cloudflare Pages auto-deploy), then run final verification including a production-hostname Lighthouse score capture for the SEO-05 gate.

Purpose: Complete D-06 (`site:` flip), D-07 (README pointer), the BaseLayout fallback housekeeping (CONTEXT specifics + RESEARCH Runtime State Inventory), the STATE.md cleanup (CONTEXT specifics + RESEARCH Pitfall 8), and the post-cutover SEO-05 gate.

**Sequencing landmine encoded as plan dependencies:** `depends_on: ["06-03"]` ensures Plan 04 only runs after Plan 03's checkpoint resume-signal has been issued — that is, after `https://tanyazakus.com` is verified live with HTTPS. Pitfall 3 (flipping `site:` before HTTPS works → broken sitemap) is structurally prevented.

Output: 4 source-file edits + 1 push to main + 1 production-Lighthouse artifact + 1 post-cutover verification artifact. This is the final plan of Phase 6.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-deployment/06-CONTEXT.md
@.planning/phases/06-deployment/06-RESEARCH.md
@.planning/phases/06-deployment/06-PATTERNS.md
@.planning/phases/06-deployment/06-01-SUMMARY.md
@.planning/phases/06-deployment/06-02-SUMMARY.md
@.planning/phases/06-deployment/06-03-SUMMARY.md
@CLAUDE.md
@astro.config.mjs
@README.md
@src/layouts/BaseLayout.astro

<interfaces>
<!-- The four files touched in this plan are all in-context above. The key coupling
     surface is `Astro.site` → `@astrojs/sitemap` → `dist/sitemap-index.xml`. -->

astro.config.mjs (current line 9):
  site: 'https://my-portfolio-8h7.pages.dev',

BaseLayout.astro (current lines 22-23):
  const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
  const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;

README.md (current line 5):
  **Live site:** https://my-portfolio-8h7.pages.dev

.planning/STATE.md (line 79 in the Blockers/Concerns section):
  - Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Flip site: URL + README pointer + BaseLayout fallbacks + retire STATE.md Vercel blocker (single launch commit)</name>
  <files>astro.config.mjs, README.md, src/layouts/BaseLayout.astro, .planning/STATE.md</files>
  <read_first>
    - astro.config.mjs (current 15 lines — confirm line 9 is the `site:` line)
    - README.md (current line 5 — confirm "Live site" pointer)
    - src/layouts/BaseLayout.astro (current lines 22-23 — both contain the fallback string `'https://my-portfolio-8h7.pages.dev'`)
    - .planning/STATE.md (current line 79 — confirm the Vercel Pro blocker bullet)
    - .planning/phases/06-deployment/06-CONTEXT.md (D-06 — flip site: URL once DNS+HTTPS verified; D-07 — README pointer update; "Specifics → stale Vercel reference in STATE.md")
    - .planning/phases/06-deployment/06-RESEARCH.md ("Pitfall 3: Flipping site: before HTTPS works" — already mitigated by depends_on, but executor should re-confirm Plan 03's resume-signal was actually issued)
    - .planning/phases/06-deployment/06-03-SUMMARY.md (must exist before this task runs — it contains the go-signal)
  </read_first>
  <action>
    Pre-flight gate: Confirm Plan 03 produced an `06-03-SUMMARY.md` that includes the go-signal "DNS+HTTPS verified live". If that file is missing OR does not contain `tanyazakus.com` confirmed as live, HALT — do not edit anything in this task. The D-06 sequencing landmine is enforced by this pre-flight gate.

    Then make FOUR file edits in a single launch commit. Each edit is a one- or two-line surgical change. Combined commit message: `feat(06): production domain cutover (D-06/D-07)`.

    **Edit 1 — astro.config.mjs:9** (D-06)
    ```diff
    -  site: 'https://my-portfolio-8h7.pages.dev',
    +  site: 'https://tanyazakus.com',
    ```

    **Edit 2 — README.md:5** (D-07)
    ```diff
    -**Live site:** https://my-portfolio-8h7.pages.dev
    +**Live site:** https://tanyazakus.com
    ```

    **Edit 3 — src/layouts/BaseLayout.astro:22-23** (housekeeping per RESEARCH Runtime State Inventory)
    ```diff
    -const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
    -const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://my-portfolio-8h7.pages.dev').href;
    +const canonicalUrl = canonical ?? new URL(Astro.url.pathname, Astro.site ?? 'https://tanyazakus.com').href;
    +const absoluteOgImage = new URL(ogImage, Astro.site ?? 'https://tanyazakus.com').href;
    ```

    **Edit 4 — .planning/STATE.md:79** (housekeeping per CONTEXT Specifics + RESEARCH Pitfall 8)

    Delete the bullet line:
    ```
    - Vercel Pro cost: Verify Pro plan billing before Phase 6 planning begins.
    ```

    After deletion, run `grep -i vercel .planning/STATE.md` and confirm zero matches (the line was the only Vercel reference; CONTEXT Specifics confirmed it).

    Build verification (do not skip): After the four edits, run `npm run build`. The build must succeed. Inspect `dist/sitemap-0.xml` — confirm at least one URL begins with `https://tanyazakus.com/` (proves the `site:` flip drove the sitemap regeneration correctly):
    ```bash
    grep -c "https://tanyazakus.com/" dist/sitemap-0.xml
    ```
    Expect a number ≥ 1 (likely the homepage + project pages + about page).

    Then commit all four files in a single atomic commit:
    ```bash
    git add astro.config.mjs README.md src/layouts/BaseLayout.astro .planning/STATE.md
    git commit -m "feat(06): production domain cutover (D-06/D-07)

    - Flip site: URL to https://tanyazakus.com (D-06)
    - Update README Live site pointer (D-07)
    - Flip BaseLayout.astro canonical/og fallback strings to apex (housekeeping)
    - Retire stale Vercel Pro blocker from STATE.md (housekeeping)

    Plan 03 verified https://tanyazakus.com resolves with valid HTTPS before this commit.

    Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
    ```

    Do NOT push yet — pushing happens in Task 2 once a final pre-push grep sanity check passes.
  </action>
  <verify>
    <automated>grep -qE "^  site: 'https://tanyazakus\.com',$" astro.config.mjs && grep -qE "^\*\*Live site:\*\* https://tanyazakus\.com$" README.md && grep -qE "Astro\.site \?\? 'https://tanyazakus\.com'" src/layouts/BaseLayout.astro && [ "$(grep -c "Astro.site ?? 'https://tanyazakus.com'" src/layouts/BaseLayout.astro)" -eq 2 ] && ! grep -q "Vercel Pro" .planning/STATE.md && ! grep -q "my-portfolio-8h7.pages.dev" astro.config.mjs && ! grep -q "my-portfolio-8h7.pages.dev" README.md && ! grep -q "my-portfolio-8h7.pages.dev" src/layouts/BaseLayout.astro && npm run build > /dev/null 2>&1 && grep -q "https://tanyazakus.com/" dist/sitemap-0.xml && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - `astro.config.mjs` line 9 matches exactly `  site: 'https://tanyazakus.com',` (two-space indent preserved, trailing comma preserved)
    - `astro.config.mjs` does NOT contain the substring `my-portfolio-8h7.pages.dev`
    - `README.md` contains exact line `**Live site:** https://tanyazakus.com`
    - `README.md` does NOT contain the substring `my-portfolio-8h7.pages.dev`
    - `src/layouts/BaseLayout.astro` contains the substring `Astro.site ?? 'https://tanyazakus.com'` EXACTLY TWICE (one per fallback on lines 22 and 23)
    - `src/layouts/BaseLayout.astro` does NOT contain the substring `my-portfolio-8h7.pages.dev`
    - `.planning/STATE.md` does NOT contain the substring `Vercel Pro` (case-sensitive — the original line used "Vercel Pro" capitalized)
    - `npm run build` exits 0
    - `dist/sitemap-0.xml` contains at least one URL beginning with `https://tanyazakus.com/`
    - A single new git commit exists with message starting `feat(06): production domain cutover (D-06/D-07)` containing exactly 4 modified files (`astro.config.mjs`, `README.md`, `src/layouts/BaseLayout.astro`, `.planning/STATE.md`) — verified via `git diff-tree --no-commit-id --name-only -r HEAD | sort` returning those four paths
  </acceptance_criteria>
  <done>
    Four files edited per the spec, build passes, sitemap regenerates with apex URLs, single atomic commit on local `main` (not yet pushed).
  </done>
</task>

<task type="auto">
  <name>Task 2: Push to main + monitor Cloudflare Pages deploy + run post-cutover curl/sitemap verification</name>
  <files>.planning/phases/06-deployment/post-cutover-verification.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 4" steps 10-11 — post-merge verification; "Pattern 5" measurement-first)
    - .planning/phases/06-deployment/06-CONTEXT.md ("Specifics → Resume PDF ships unchanged" — sanity-check that internal /tanya-zakus-designer-resume.pdf still resolves)
    - .planning/phases/06-deployment/cloudflare-cutover-checklist.md (Plan 03 output — confirms live-state baseline)
  </read_first>
  <action>
    Steps:

    1. Pre-push sanity check — re-run `grep -RIn "my-portfolio-8h7.pages.dev" . --include="*.mjs" --include="*.md" --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.json" 2>/dev/null` from repo root. Expected result: zero matches under the source tree. Note: matches under `.planning/` are acceptable (history docs may reference the old URL) but must be zero under `src/`, `astro.config.mjs`, `README.md`, and `package.json`. If matches surface outside `.planning/`, halt and address before pushing.

    2. Push to `main`:
       ```bash
       git push origin main
       ```

    3. Wait for Cloudflare Pages deploy to complete. Cloudflare Pages picks up the commit automatically (per Phase 1 D-03 — preview deploy on push to main; the Pages project is bound to `tanyazakus2106-oss/my-portfolio` per the git remote in memory). Build typically takes 30-90 seconds. Either:
       - Watch dashboard: `dash.cloudflare.com → Workers & Pages → my-portfolio → Deployments` until the latest deployment shows status "Success"
       - OR poll the deployed sitemap (will only contain `tanyazakus.com` URLs after the new build deploys):
         ```bash
         until curl -s https://tanyazakus.com/sitemap-0.xml | grep -q "https://tanyazakus.com/"; do sleep 10; echo "Waiting for deploy..."; done
         echo "Deploy live"
         ```

    4. Run the post-cutover verification curls. Write the results into `.planning/phases/06-deployment/post-cutover-verification.md`:

    ```markdown
    # Post-cutover Verification — Phase 6

    **Verified:** {YYYY-MM-DD HH:MM TZ}
    **Deploy commit:** {git rev-parse HEAD}
    **Pages deployment ID:** {dashboard deployment ID, if captured}

    ## Live-state checks

    | Check | Command | Expected | Actual | Status |
    |-------|---------|----------|--------|--------|
    | Apex 200 OK over HTTPS | `curl -sI https://tanyazakus.com \| head -1` | `HTTP/2 200` | {actual} | pass/fail |
    | www 301 to apex | `curl -sI https://www.tanyazakus.com \| grep -i ^location` | `location: https://tanyazakus.com` | {actual} | pass/fail |
    | http 301 to https | `curl -sI http://tanyazakus.com \| grep -i ^location` | `location: https://tanyazakus.com/` | {actual} | pass/fail |
    | Sitemap absolute URLs reflect apex | `curl -s https://tanyazakus.com/sitemap-0.xml \| grep -c "https://tanyazakus.com/"` | `>= 1` | {actual count} | pass/fail |
    | Sitemap does NOT contain preview URL | `curl -s https://tanyazakus.com/sitemap-0.xml \| grep -c "my-portfolio-8h7.pages.dev"` | `0` | {actual} | pass/fail |
    | Canonical tag on homepage uses apex | `curl -s https://tanyazakus.com/ \| grep -oE '<link rel="canonical"[^>]*>'` | href contains `tanyazakus.com` | {actual} | pass/fail |
    | OG URL on homepage uses apex | `curl -s https://tanyazakus.com/ \| grep -oE '<meta property="og:url"[^>]*>'` | content contains `tanyazakus.com` | {actual} | pass/fail |
    | Resume PDF still resolves | `curl -sI https://tanyazakus.com/tanya-zakus-designer-resume.pdf \| head -1` | `HTTP/2 200` | {actual} | pass/fail |
    | Favicon resolves | `curl -sI https://tanyazakus.com/favicon.svg \| head -1` | `HTTP/2 200` | {actual} | pass/fail |
    | OG image resolves | `curl -sI https://tanyazakus.com/og-image.png \| head -1` | `HTTP/2 200` | {actual} | pass/fail |
    | HSTS header present | `curl -sI https://tanyazakus.com \| grep -i ^strict-transport-security` | `strict-transport-security: max-age=31536000; includeSubDomains` | {actual} | pass/fail |
    | X-Frame-Options header present | `curl -sI https://tanyazakus.com \| grep -i ^x-frame-options` | `x-frame-options: DENY` | {actual} | pass/fail |
    | Astro asset cache-control immutable | Build site, then `curl -sI https://tanyazakus.com/_astro/<hashed-asset>.css \| grep -i cache-control` | `cache-control: public, max-age=31536000, immutable` | {actual} | pass/fail |
    | Legacy /work redirect | `curl -sI https://tanyazakus.com/work \| grep -i ^location` | `location: /#projects` | {actual} | pass/fail |
    | robots.txt serves with sitemap pointer | `curl -s https://tanyazakus.com/robots.txt` | contains `Sitemap: https://tanyazakus.com/sitemap-index.xml` | {actual} | pass/fail |

    ## Notes
    {any deferrals, follow-ups, anomalies — e.g., "Cloudflare Pages took 4 minutes to deploy due to image regen", or "the /_astro/* cache-control check used the homepage's main CSS asset path"}
    ```

    Fill in every `{actual}` and `status` field. Any `fail` row that is not a documented false positive halts Phase 6 completion. Common false-positive: the legacy /work redirect's `location:` header may include a fully-qualified `https://tanyazakus.com/#projects` instead of just `/#projects` — both are correct; document the actual form.

    5. If all rows pass, this task is done.
  </action>
  <verify>
    <automated>test -f .planning/phases/06-deployment/post-cutover-verification.md && grep -qE "https://tanyazakus.com" .planning/phases/06-deployment/post-cutover-verification.md && [ "$(grep -c '| pass |' .planning/phases/06-deployment/post-cutover-verification.md)" -ge 10 ] && ! grep -qE "\| fail \|" .planning/phases/06-deployment/post-cutover-verification.md && curl -sI https://tanyazakus.com | head -1 | grep -qE "HTTP/[12](\.[01])? 200" && curl -s https://tanyazakus.com/sitemap-0.xml | grep -q "https://tanyazakus.com/" && curl -s https://tanyazakus.com/sitemap-0.xml | grep -vq "my-portfolio-8h7.pages.dev" && curl -sI https://tanyazakus.com | grep -qi "strict-transport-security: max-age=31536000" && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - `git push origin main` succeeded (commit on remote main)
    - Cloudflare Pages deploy completed successfully (visible in dashboard OR sitemap poll succeeded)
    - File `.planning/phases/06-deployment/post-cutover-verification.md` exists
    - File has at least 10 rows marked `| pass |` (out of 15 checks)
    - File has ZERO rows marked `| fail |` (any fail = halt and fix)
    - Independent live re-verification:
      - `curl -sI https://tanyazakus.com | head -1` returns HTTP 200
      - `curl -s https://tanyazakus.com/sitemap-0.xml | grep -c "https://tanyazakus.com/"` returns a count ≥ 1
      - `curl -s https://tanyazakus.com/sitemap-0.xml | grep -c "my-portfolio-8h7.pages.dev"` returns 0
      - `curl -sI https://tanyazakus.com | grep -i strict-transport-security` returns a line containing `max-age=31536000`
      - `curl -sI https://tanyazakus.com | grep -i x-frame-options` returns a line containing `DENY`
  </acceptance_criteria>
  <done>
    Code pushed, Pages deployed, all 15 live-state checks captured in `post-cutover-verification.md` with at minimum 10 passes and zero fails.
  </done>
</task>

<task type="auto">
  <name>Task 3: Run final Lighthouse mobile against https://tanyazakus.com (SEO-05 final gate)</name>
  <files>.planning/phases/06-deployment/lighthouse-mobile-launch.html, .planning/phases/06-deployment/lighthouse-mobile-launch.json</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md ("Pattern 6 → lighthouse — SEO-05 gate" — invocation flags; "Pattern 5: Performance pass — measurement-first" — measurement comes after, not before, fixes)
    - .planning/phases/06-deployment/lighthouse-mobile-baseline.html (Plan 02 baseline against preview URL — for comparison)
    - .planning/phases/06-deployment/lighthouse-mobile-baseline.json (Plan 02 baseline JSON — performance score for comparison)
  </read_first>
  <action>
    Run Lighthouse against the LIVE production URL (not preview, not localhost). This is the final SEO-05 gate evidence and must be committed to the phase folder.

    ```bash
    npx --yes lighthouse@latest https://tanyazakus.com \
      --preset=mobile \
      --output html \
      --output json \
      --output-path .planning/phases/06-deployment/lighthouse-mobile-launch \
      --quiet \
      --only-categories=performance,accessibility,best-practices,seo \
      --chrome-flags="--headless=new"
    ```

    Rename the two output files to drop the `.report` suffix that Lighthouse adds:
    ```bash
    mv .planning/phases/06-deployment/lighthouse-mobile-launch.report.html .planning/phases/06-deployment/lighthouse-mobile-launch.html
    mv .planning/phases/06-deployment/lighthouse-mobile-launch.report.json .planning/phases/06-deployment/lighthouse-mobile-launch.json
    ```

    Extract the performance score and assert SEO-05:
    ```bash
    PERF_SCORE=$(python3 -c "import json; print(json.load(open('.planning/phases/06-deployment/lighthouse-mobile-launch.json'))['categories']['performance']['score'])")
    echo "FINAL Mobile Performance score on https://tanyazakus.com: $PERF_SCORE"
    BASELINE=$(python3 -c "import json; print(json.load(open('.planning/phases/06-deployment/lighthouse-mobile-baseline.json'))['categories']['performance']['score'])")
    echo "(Plan 02 baseline against preview was: $BASELINE)"
    ```

    **SEO-05 gate:** $PERF_SCORE >= 0.80. If less than 0.80, halt Phase 6 completion. The expected case is that the production score is within a few points of the baseline (Plan 02 already vetted the score on the preview URL). The most likely score-mover post-cutover is that `_headers` cache-control headers now apply, which should NUDGE the score UP (flips `uses-long-cache-ttl` audit pass), not down.

    If the score is below 0.80 (unexpected): identify the failing audits per RESEARCH.md decision flowchart, apply surgical fixes per CONTEXT/CLAUDE.md guardrails, push fix commits, rerun Lighthouse, repeat until ≥ 0.80. Each fix gets its own atomic commit per the Phase 5 pattern.

    Append a brief note to `post-cutover-verification.md` recording:
    - Final production mobile perf score
    - Baseline preview perf score
    - Delta (production - baseline) — for the record
  </action>
  <verify>
    <automated>test -f .planning/phases/06-deployment/lighthouse-mobile-launch.html && test -f .planning/phases/06-deployment/lighthouse-mobile-launch.json && python3 -c "import json; d=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-launch.json')); s=d['categories']['performance']['score']; print(f'Production mobile perf: {s}'); assert s>=0.80, f'SEO-05 FINAL GATE FAILED: {s} < 0.80'; assert d['finalUrl'].startswith('https://tanyazakus.com'), 'wrong URL audited'" && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/phases/06-deployment/lighthouse-mobile-launch.html` exists
    - File `.planning/phases/06-deployment/lighthouse-mobile-launch.json` exists and is valid JSON
    - JSON has `.finalUrl` starting with `https://tanyazakus.com` (NOT the preview URL — proves the right hostname was audited)
    - JSON `.categories.performance.score` ≥ 0.80 (SEO-05 final gate)
    - `post-cutover-verification.md` updated with final + baseline + delta
    - Both artifacts committed to git
  </acceptance_criteria>
  <done>
    Production Lighthouse report committed, mobile performance score ≥ 0.80, SEO-05 gate satisfied with on-production-hostname evidence.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4 (CHECKPOINT): Post-launch mailto E2E re-verification on production URL</name>
  <files>.planning/phases/06-deployment/mailto-e2e-evidence.md</files>
  <read_first>
    - .planning/phases/06-deployment/mailto-e2e-evidence.md (Plan 02 evidence — confirms mailto worked on the preview URL)
    - .planning/phases/06-deployment/06-RESEARCH.md ("Pattern 6 → Mailto E2E test (manual)")
  </read_first>
  <what-built>
    All scripted post-cutover verifications passed (curl, sitemap, Lighthouse). The mailto link should behave identically on production as it did on preview because the link target (`mailto:tanyazakus2106@gmail.com`) is hostname-agnostic. But CONTEXT specifics calls for a final sanity-check on the production hostname — this is the lowest-friction way to confirm.
  </what-built>
  <how-to-verify>
    Tanya performs:

    1. Visit `https://tanyazakus.com` in a desktop browser.
    2. Click the footer email link. Confirm the mail client opens with `To: tanyazakus2106@gmail.com` prefilled (same behavior as Plan 02 Task 4).
    3. Send a single test message from a non-Tanya account with subject `Phase 6 production launch — mailto verify [timestamp]`.
    4. Confirm inbox arrival within 5 minutes.
    5. Append a new row to `.planning/phases/06-deployment/mailto-e2e-evidence.md` under a new "Post-cutover production re-verification" section:

    ```markdown
    ## Post-cutover production re-verification

    **Verified:** {YYYY-MM-DD HH:MM TZ}
    **Source URL:** https://tanyazakus.com

    | Surface | mailto resolves? | Test send timestamp | Inbox arrival timestamp | Spam folder? | Pass/Fail |
    |---------|------------------|---------------------|-------------------------|--------------|-----------|
    | Footer email link (production) | yes | {HH:MM:SS} | {HH:MM:SS} | no | pass |
    ```

    Adding a "fail" row here halts Phase 6 completion (mailto is one of the four SC4 gates from ROADMAP).
  </how-to-verify>
  <verify>
    <automated>grep -q "Post-cutover production re-verification" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "https://tanyazakus.com" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -c "| pass |" .planning/phases/06-deployment/mailto-e2e-evidence.md | awk '$1 >= 2 {exit 0} {exit 1}' && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - `mailto-e2e-evidence.md` contains a new section heading `## Post-cutover production re-verification`
    - File contains the string `https://tanyazakus.com`
    - File has at least 2 total `| pass |` rows (one from Plan 02 + at least one from this task)
    - File has ZERO `| fail |` rows
  </acceptance_criteria>
  <resume-signal>Type "production mailto verified — Phase 6 launch complete"</resume-signal>
  <done>
    Footer mailto link on production confirmed working end-to-end; evidence appended to the existing Plan 02 evidence file; Phase 6 SC4 fully satisfied.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local repo → GitHub remote | `git push origin main` triggers Cloudflare Pages auto-deploy |
| Cloudflare Pages → public internet | Production hostname now serves real traffic |
| Lighthouse CLI → https://tanyazakus.com | Live audit consumes public bandwidth |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-06-22 | Tampering | site: flip pushed BEFORE Plan 03's HTTPS verification completes — sitemap regenerates with non-resolvable URLs, Google indexes 404s (RESEARCH Pitfall 3) | HIGH | mitigate | Task 1 pre-flight gate — checks `06-03-SUMMARY.md` exists with go-signal; structural enforcement via `depends_on: ["06-03"]` |
| T-06-23 | Information Disclosure | Stale preview URL leaks in BaseLayout fallback string — future contributor reads stale URL and uses it accidentally | LOW | mitigate | Task 1 Edit 3 — both fallback strings flipped to production hostname |
| T-06-24 | Repudiation | Cutover commit history doesn't capture WHY each line changed | LOW | mitigate | Task 1 commit message references D-06 / D-07 / housekeeping; Phase 5 atomic-commit pattern preserved |
| T-06-25 | Information Disclosure | Sitemap retains preview-URL entries after cutover (mixed-hostname sitemap → SEO duplicate-content) | MEDIUM | mitigate | Task 2 explicit acceptance criterion — `grep -c "my-portfolio-8h7.pages.dev" dist/sitemap-0.xml` returns 0 after the post-deploy build |
| T-06-26 | Information Disclosure | Canonical tag on production page still points at preview hostname (Astro.site set correctly but fallback used due to a config bug) | MEDIUM | mitigate | Task 2 explicit check — `curl -s https://tanyazakus.com/ | grep -oE '<link rel="canonical"[^>]*>'` confirms tanyazakus.com hostname |
| T-06-27 | Spoofing | Future contributor sees the `.planning/STATE.md` Vercel Pro blocker, assumes Vercel is the deploy target, makes a deploy decision based on stale information | LOW | mitigate | Task 1 Edit 4 — Vercel Pro line deleted; `grep -i vercel .planning/STATE.md` returns 0 matches |
| T-06-28 | Denial of Service | Cloudflare Pages build fails on the launch commit (e.g., bad config), production goes offline | MEDIUM | mitigate | Task 1 mandatory `npm run build` BEFORE the commit; Task 2 deploy-status verification before declaring complete |
| T-06-29 | Tampering | Resume PDF link broken on production (recruiters cannot download it) | MEDIUM | mitigate | Task 2 explicit row — `curl -sI https://tanyazakus.com/tanya-zakus-designer-resume.pdf | head -1` must return 200 |
| T-06-30 | Repudiation | SEO-05 final gate met but no auditable evidence retained | LOW | mitigate | Task 3 — HTML + JSON Lighthouse report committed to `.planning/phases/06-deployment/lighthouse-mobile-launch.{html,json}` |

**ASVS L1 mapping:** Same boundaries as Plan 03 — V6, V9, V14. This plan is the final wiring step; no new ASVS controls introduced.
</threat_model>

<verification>
After all four tasks complete:

```bash
# Source files reflect cutover
grep -E "^  site: 'https://tanyazakus\.com',\$" astro.config.mjs
grep "tanyazakus.com" README.md
grep -c "Astro.site ?? 'https://tanyazakus.com'" src/layouts/BaseLayout.astro
# Expect: 2 matches

# Cleanup landed
! grep -q "Vercel Pro" .planning/STATE.md
! grep -RIn "my-portfolio-8h7.pages.dev" astro.config.mjs README.md src/

# Production is live and correct
curl -sI https://tanyazakus.com | head -1                              # HTTP/2 200
curl -sI https://www.tanyazakus.com | grep -i ^location                # location: https://tanyazakus.com
curl -s https://tanyazakus.com/sitemap-0.xml | grep -c "tanyazakus.com" # >= 1
curl -s https://tanyazakus.com/sitemap-0.xml | grep -c "my-portfolio-8h7" # 0
curl -sI https://tanyazakus.com | grep -i strict-transport-security    # max-age=31536000
curl -sI https://tanyazakus.com | grep -i x-frame-options              # DENY

# SEO-05 final gate
python3 -c "import json; d=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-launch.json')); s=d['categories']['performance']['score']; print(f'Final mobile perf: {s}'); assert s>=0.80"

# Evidence trail intact
test -f .planning/phases/06-deployment/lighthouse-mobile-launch.html
test -f .planning/phases/06-deployment/lighthouse-mobile-launch.json
test -f .planning/phases/06-deployment/post-cutover-verification.md
grep -q "Post-cutover production re-verification" .planning/phases/06-deployment/mailto-e2e-evidence.md
```
</verification>

<success_criteria>
- Four source files committed atomically with reference to D-06 / D-07
- `astro.config.mjs:9` is `site: 'https://tanyazakus.com'`
- README "Live site" pointer is `https://tanyazakus.com`
- BaseLayout fallback strings updated (housekeeping done)
- STATE.md Vercel Pro blocker removed (housekeeping done)
- Commit pushed to main, Cloudflare Pages deploy succeeded
- `https://tanyazakus.com` serves the new build with apex-hostname sitemap, canonical, OG tags
- All 15 post-cutover live-state checks passed (or documented false positives)
- Production Lighthouse mobile performance ≥ 0.80 (SEO-05 final gate)
- Mailto E2E re-verified on production hostname
- All evidence committed to `.planning/phases/06-deployment/`
- Phase 6 is launched.
</success_criteria>

<output>
After completion, create `.planning/phases/06-deployment/06-04-SUMMARY.md` documenting:
- Launch commit hash (the `feat(06): production domain cutover` commit)
- Cloudflare Pages deployment ID
- Final mobile Lighthouse performance score on https://tanyazakus.com
- Baseline (Plan 02) vs final (Plan 04) score delta
- Live-state verification summary (X of Y checks passed)
- Any deferrals (e.g., preview URL not redirected — per CONTEXT Claude's Discretion; CSP not shipped — per RESEARCH Option A)
- Explicit launch confirmation line — `Phase 6 launched at {timestamp}; https://tanyazakus.com is live`
</output>
