---
phase: 06-deployment
plan: 02
type: execute
wave: 2
depends_on:
  - "06-01"
files_modified:
  - .planning/phases/06-deployment/lighthouse-mobile-baseline.html
  - .planning/phases/06-deployment/lychee-report.txt
  - .planning/phases/06-deployment/mailto-e2e-evidence.md
  - cspell.json
autonomous: false
requirements:
  - SEO-05
  - DEPLOY-02
requirements_addressed:
  - SEO-05
  - DEPLOY-02
tags:
  - lighthouse
  - lychee
  - cspell
  - mailto
  - pre-launch-qa

must_haves:
  truths:
    - "lychee reports zero broken internal links in the latest dist/ build"
    - "cspell reports zero unrecognized words across src/**/*.{mdx,astro,md} + README.md"
    - "A baseline mobile Lighthouse score is recorded as evidence (gates whether perf-pass work is needed)"
    - "A real test email sent via the footer mailto link was received in tanyazakus2106@gmail.com inbox (not spam)"
  artifacts:
    - path: ".planning/phases/06-deployment/lighthouse-mobile-baseline.html"
      provides: "Baseline Lighthouse mobile report against preview URL — proves SEO-05 measurement happened pre-cutover"
      contains: "categories"
    - path: ".planning/phases/06-deployment/lychee-report.txt"
      provides: "Stdout/stderr capture of lychee run against dist/"
      contains: "Total"
    - path: ".planning/phases/06-deployment/mailto-e2e-evidence.md"
      provides: "Manual mailto E2E evidence — send timestamp, inbox arrival timestamp, screenshot reference"
      contains: "tanyazakus2106@gmail.com"
  key_links:
    - from: "npm run build (Plan 01 _headers/_redirects/robots.txt + existing site)"
      to: "lychee scan of dist/"
      via: "lychee CLI with --base flag"
      pattern: "lychee dist/"
    - from: "preview deploy URL https://my-portfolio-8h7.pages.dev"
      to: "lighthouse-mobile-baseline.html"
      via: "npx lighthouse"
      pattern: "lighthouse.*--preset=mobile"
---

<objective>
Run the four SC4 pre-launch QA gates while still on the preview URL. Produce three committable evidence artifacts and a go/no-go decision for the Lighthouse mobile score.

Purpose: Satisfy SC4 of the ROADMAP phase 6 goal ("broken link audit, spelling review, and contact mailto end-to-end test all pass before the site is considered launched") and capture the SEO-05 baseline measurement that decides whether the perf pass is `done by default` (score ≥ 80 already) or needs work (score < 80 — requires surgical fixes per RESEARCH.md decision flowchart).

Output: Three artifacts committed under `.planning/phases/06-deployment/` + possible follow-up edits to `cspell.json` words list if Task 2 surfaces legit project terms not in the dictionary.

**Critical sequencing:** This plan runs BEFORE Plan 03 (Cloudflare dashboard cutover). Lighthouse here measures the preview URL — Plan 04 re-measures against the production hostname after launch.
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
@CLAUDE.md

<interfaces>
<!-- Tooling contracts the executor needs. All three tools are dev-time only and
     do NOT land in package.json — invoked via Homebrew (lychee) or npx (cspell, lighthouse). -->

lychee CLI:
- Install: `brew install lychee` (one-time; macOS preferred path per RESEARCH.md)
- Invocation: `lychee dist/ --base https://my-portfolio-8h7.pages.dev --exclude-mail --exclude linkedin.com --exclude instagram.com --max-concurrency 10 --accept 200,206,429`
- Exit code 0 = clean, 2 = broken links found
- Known false-positives: LinkedIn (999/403), Instagram (999/403) — excluded by flag

cspell CLI:
- Invocation: `npx cspell "src/**/*.{mdx,astro,md}" "README.md"`
- Exit code 0 = clean, nonzero = misspellings; uses cspell.json from repo root
- Astro/MDX-aware via built-in parsers

lighthouse CLI:
- Invocation: `npx lighthouse <URL> --preset=mobile --output html --output-path <path> --quiet --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new"`
- Produces HTML report; the "Performance" category score is what SEO-05 gates on (≥ 0.80)
- For machine-readable score: re-run with `--output json` and `jq '.categories.performance.score'`
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install lychee + run broken-link audit against dist/</name>
  <files>.planning/phases/06-deployment/lychee-report.txt</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 6 → lychee — broken-link audit", and "Pitfall 5: lychee false-positives from LinkedIn / Instagram") — exact invocation flags and false-positive handling
    - public/_redirects (created in Plan 01) — confirms /work redirect is in place so any internal /work links resolve cleanly
    - .planning/phases/06-deployment/06-CONTEXT.md (D-05 — mailto stays at tanyazakus2106@gmail.com) — confirms mailto-exclusion is correct
  </read_first>
  <action>
    Steps:

    1. Check if `lychee` is already installed: `which lychee`. If installed, skip to step 3. If not, install via Homebrew: `brew install lychee`. If `brew` itself is not present, fall back to: `cargo install lychee` (if cargo present) OR fail with a clear message instructing the user to install lychee manually (do NOT silently skip — the SC4 audit is required).

    2. Verify install: `lychee --version` returns a version string.

    3. Build the site fresh so dist/ reflects the Plan 01 additions (`_headers`, `_redirects`, `robots.txt`):
       ```bash
       npm run build
       ```

    4. Run lychee against `dist/` using the EXACT invocation below (matches RESEARCH.md recommended flags including the false-positive exclusions and the rate-limit accept list). Use the preview URL as `--base` because that's where dist/ is currently deployed:
       ```bash
       lychee dist/ \
         --base https://my-portfolio-8h7.pages.dev \
         --exclude-mail \
         --exclude linkedin.com \
         --exclude instagram.com \
         --max-concurrency 10 \
         --accept 200,206,429 \
         2>&1 | tee .planning/phases/06-deployment/lychee-report.txt
       ```

    5. Capture the exit code: `LYCHEE_EXIT=$?`. Append it to the report file:
       ```bash
       echo "" >> .planning/phases/06-deployment/lychee-report.txt
       echo "lychee exit code: $LYCHEE_EXIT" >> .planning/phases/06-deployment/lychee-report.txt
       ```

    6. If exit code is non-zero, INSPECT the report — the only acceptable failures are LinkedIn/Instagram false positives (already excluded by flags) or transient 429s (already in accept list). Any real broken internal link is a fix-first blocker. Do NOT proceed to Plan 03 / Plan 04 with broken internal links. If a real broken link is found, halt this plan and write a brief note to the report file describing what needs fixing.

    7. If exit code is 0 (or the only failures are documented false positives), proceed to commit the report.

    Required: `--base https://my-portfolio-8h7.pages.dev` in this Pre-cutover run. Plan 04 re-runs against `--base https://tanyazakus.com` post-launch.
  </action>
  <verify>
    <automated>test -f .planning/phases/06-deployment/lychee-report.txt && grep -qE "lychee exit code: 0" .planning/phases/06-deployment/lychee-report.txt && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - `lychee --version` returns a version string (binary is installed)
    - File `.planning/phases/06-deployment/lychee-report.txt` exists and is non-empty
    - File contains the literal line `lychee exit code: 0` (any other exit code requires human review and an explicit override note in the report)
    - File contains at minimum one of: `Total` summary line, or per-link status lines (proves the run actually scanned)
    - If non-zero exit code is captured, the report has a follow-up note explaining each failing link (allows human escalation; do NOT commit a non-zero result without escalation)
  </acceptance_criteria>
  <done>
    Lychee installed, ran against `dist/` with the exact RESEARCH.md flags, produced a zero-exit report committed to the phase folder.
  </done>
</task>

<task type="auto">
  <name>Task 2: Run cspell across MDX/Astro/Markdown and tune the dictionary to zero-error</name>
  <files>cspell.json</files>
  <read_first>
    - cspell.json (created in Plan 01) — current `words` array baseline
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 6 → cspell — spelling review" and "Pitfall 6: cspell flags every proper noun on the site") — iterate-until-clean pattern
    - All files in src/content/projects/ (MDX case studies — likely source of project-specific proper nouns) — pre-scan via `ls src/content/projects/`
    - README.md
  </read_first>
  <action>
    Steps:

    1. Run the initial cspell scan:
       ```bash
       npx cspell "src/**/*.{mdx,astro,md}" "README.md"
       ```

    2. Capture any unrecognized words. Two categories of result are possible:
       - **a) Real misspellings** — typos in MDX body or README. FIX them in the source file. Do NOT add typos to the dictionary.
       - **b) Legit project-specific proper nouns** — case study brand names, founder names, location names, technical jargon not in the standard dictionary. ADD these to `cspell.json` `words` array (alphabetical order is not required by cspell but preserve sensible grouping — add new entries near related terms or at the end).

    3. Iterate: rerun `npx cspell "src/**/*.{mdx,astro,md}" "README.md"` after each round of fixes / dictionary additions until exit code is 0.

    4. **Discipline rule:** Never add a word to `cspell.json` without confirming it's a legitimate proper noun, brand, or domain term. When in doubt, fix the source. The goal is a useful spell-checker for the next quarter, not a green light.

    5. Final state must have `npx cspell ...` return exit code 0 with no flagged words.
  </action>
  <verify>
    <automated>npx cspell "src/**/*.{mdx,astro,md}" "README.md" && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - `npx cspell "src/**/*.{mdx,astro,md}" "README.md"` exits with status code 0 (no unrecognized words remain)
    - `cspell.json` is valid JSON after any edits
    - `cspell.json` `words` array still contains all Plan 01 baseline terms (`tanyazakus`, `Fontshare`, `Satoshi`, etc.); new additions APPEND, do not replace
    - Any MDX/Markdown source-file fixes (real typos) are committed alongside `cspell.json`
  </acceptance_criteria>
  <done>
    cspell scan exits 0; any genuine typos in source content are fixed; `cspell.json` `words` array extended only with legitimate project-specific terms.
  </done>
</task>

<task type="auto">
  <name>Task 3: Capture baseline Lighthouse mobile report against the preview URL</name>
  <files>.planning/phases/06-deployment/lighthouse-mobile-baseline.html, .planning/phases/06-deployment/lighthouse-mobile-baseline.json</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (sections "Pattern 5: Performance pass — measurement-first", "Performance Pass — Audit Checklist", "Pattern 6 → lighthouse — SEO-05 gate") — invocation flags, score threshold, audit interpretation
    - .planning/phases/06-deployment/06-CONTEXT.md ("Claude's Discretion → Performance optimization pass scope") — guardrail: surgical edits only, no new tooling unless evidence of a real gap
    - src/layouts/BaseLayout.astro (lines 73-93) — current font loading approach; only relevant if Lighthouse flags font-related audits
  </read_first>
  <action>
    Steps:

    1. Run Lighthouse against the live preview URL (NOT localhost — preview deploy is the closest pre-cutover proxy for production network conditions). Produce both HTML (for committing as visual evidence) and JSON (for machine-readable score extraction):

       ```bash
       npx --yes lighthouse@latest https://my-portfolio-8h7.pages.dev \
         --preset=mobile \
         --output html \
         --output json \
         --output-path .planning/phases/06-deployment/lighthouse-mobile-baseline \
         --quiet \
         --only-categories=performance,accessibility,best-practices,seo \
         --chrome-flags="--headless=new"
       ```

       Lighthouse will produce two files: `lighthouse-mobile-baseline.report.html` and `lighthouse-mobile-baseline.report.json`. Rename them to drop `.report` so the filenames match the must-haves and verification commands:
       ```bash
       mv .planning/phases/06-deployment/lighthouse-mobile-baseline.report.html .planning/phases/06-deployment/lighthouse-mobile-baseline.html
       mv .planning/phases/06-deployment/lighthouse-mobile-baseline.report.json .planning/phases/06-deployment/lighthouse-mobile-baseline.json
       ```

    2. Extract the performance score:
       ```bash
       PERF_SCORE=$(cat .planning/phases/06-deployment/lighthouse-mobile-baseline.json | python3 -c "import json,sys; print(json.load(sys.stdin)['categories']['performance']['score'])")
       echo "Mobile Performance score: $PERF_SCORE"
       ```

    3. **Decision branch based on score (SEO-05 gate is ≥ 0.80):**

       - **If `PERF_SCORE >= 0.80`** — Baseline already passes. Print the score, note it as the baseline number in the report, proceed. The full perf-pass work is "done by default" because Astro 6 + Vite + Lightning CSS + Phase 5 image work already covers DEPLOY-02. Plan 04 will re-run against production hostname for final confirmation.

       - **If `PERF_SCORE < 0.80`** — Identify the failing audits using the audit checklist in 06-RESEARCH.md (the table mapping Lighthouse audit IDs to surgical fixes for THIS project). Apply ONLY the surgical fixes for the failing audits. Most likely candidates per RESEARCH.md:
         - `uses-long-cache-ttl` → already fixed by Plan 01 `_headers` (will pass next deploy)
         - `largest-contentful-paint-element` → consider `fetchpriority="high"` on hero/featured image (1-line change to `<Image>` props)
         - Font-related audits → RESEARCH.md explicitly recommends NOT migrating to Astro 6 Fonts API unless these specifically fail; CONTEXT/CLAUDE.md push surgical-over-refactor
         - Image budget (`total-byte-weight`) → verify Phase 5 widths/sizes are still in place; compress any oversized image
         - DO NOT add PostCSS plugins, image-CDN integrations, or new dependencies (guardrail per CONTEXT Claude's Discretion).

         After each fix, rebuild, push to preview, wait for Cloudflare Pages to redeploy, rerun Lighthouse. Repeat until score ≥ 0.80. Save the FINAL baseline (the one that passes) as the artifact.

    4. **Document the baseline in the report comment** — append a brief note to `06-VALIDATION.md` (or, simpler, write a small "perf-pass-decision.md" sibling file) capturing:
       - Initial score (number)
       - Whether any surgical fixes were applied (list them with commit refs)
       - Final score that this artifact represents

    Reminder: This is the baseline number — Plan 04 produces the post-cutover final number against `https://tanyazakus.com`.
  </action>
  <verify>
    <automated>test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.html && test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.json && python3 -c "import json,sys; data=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-baseline.json')); score=data['categories']['performance']['score']; print(f'Performance score: {score}'); assert score >= 0.80, f'SEO-05 gate FAILED: score {score} < 0.80'" && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/phases/06-deployment/lighthouse-mobile-baseline.html` exists and is non-empty
    - File `.planning/phases/06-deployment/lighthouse-mobile-baseline.json` exists and is valid JSON
    - JSON has path `.categories.performance.score` resolvable
    - `jq -r '.categories.performance.score' .planning/phases/06-deployment/lighthouse-mobile-baseline.json` (or Python equivalent) returns a number `>= 0.80`
    - If any surgical fixes were applied during this task, they are committed atomically (one commit per concern per Phase 5 pattern) and listed in the perf-pass-decision note
    - No new npm dependencies appear in `package.json` `dependencies` or `devDependencies` after this task (RESEARCH.md guardrail: surgical edits only)
  </acceptance_criteria>
  <done>
    Baseline Lighthouse HTML + JSON committed; performance score ≥ 0.80 documented; any surgical fixes committed atomically; no new tooling pulled into package.json.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 4 (CHECKPOINT): Manual mailto E2E send-and-receive test</name>
  <files>.planning/phases/06-deployment/mailto-e2e-evidence.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 6 → Mailto E2E test (manual)") — exact steps + receipt criteria
    - .planning/phases/06-deployment/06-CONTEXT.md (D-05 — mailto stays at tanyazakus2106@gmail.com) — confirms the target address
    - src/components/Footer.astro — the footer email link is the primary mailto surface tested
  </read_first>
  <what-built>
    All scripted SC4 gates (lychee, cspell, Lighthouse) have passed against the preview deploy. The mailto link cannot be automated end-to-end because it requires an actual email to leave the OS mail client, arrive at the inbox, and be confirmed not-in-spam. Human verification only.
  </what-built>
  <how-to-verify>
    Tanya (or any human verifier) performs these steps:

    1. Visit `https://my-portfolio-8h7.pages.dev` in a desktop browser (the preview URL is acceptable for this pre-cutover test; Plan 04 re-verifies on production)
    2. Click the email icon / mailto link in the **footer**. Confirm:
       - Default mail client opens (Apple Mail, Gmail in browser, Outlook, etc.)
       - The `To:` field is pre-filled with **`tanyazakus2106@gmail.com`**
       - No other recipients, no broken pre-fill
    3. From a **different** email account (not the inbox above — use a personal account, a friend's, or a temp-mail service for true E2E), compose and send a test email to `tanyazakus2106@gmail.com`:
       - Subject: `Phase 6 launch — mailto E2E test [timestamp]`
       - Body: `Confirming the portfolio footer mailto link reaches the inbox. — sent from Phase 6 SC4 verification.`
    4. Wait up to 5 minutes. Confirm:
       - The message arrives in the **Inbox** (not Spam, not Promotions)
       - The arrival is within 5 minutes of send
    5. If Phase 4 also added a mailto link in the About page header or MobileNav, repeat steps 1–4 for each additional surface (per RESEARCH.md "Repeat for the About-page email link...")

    After verification, write the evidence file `.planning/phases/06-deployment/mailto-e2e-evidence.md` with the following content (fill in `{}` placeholders):

    ```markdown
    # Mailto E2E Evidence — Phase 6 SC4

    **Verified:** {YYYY-MM-DD HH:MM TZ}
    **Verifier:** {name / email used to send}
    **Target inbox:** tanyazakus2106@gmail.com

    | Surface | mailto resolves? | Test send timestamp | Inbox arrival timestamp | Spam folder? | Pass/Fail |
    |---------|------------------|---------------------|-------------------------|--------------|-----------|
    | Footer email link | yes/no | {HH:MM:SS} | {HH:MM:SS} | yes/no | pass/fail |
    | About page email (if present) | {} | {} | {} | {} | {} |
    | Mobile nav email (if present) | {} | {} | {} | {} | {} |

    **Notes:** {any anomalies, e.g., delayed arrival, mail-client mismatch, prefill issues}
    ```

    A failed result (mailto opens to wrong address, message lands in spam, no arrival in 5 min) is a fix-first blocker. Halt and report — do not proceed to Plan 03.
  </how-to-verify>
  <verify>
    <automated>test -f .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "tanyazakus2106@gmail.com" .planning/phases/06-deployment/mailto-e2e-evidence.md && grep -q "pass" .planning/phases/06-deployment/mailto-e2e-evidence.md && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/phases/06-deployment/mailto-e2e-evidence.md` exists
    - File contains the string `tanyazakus2106@gmail.com` (the verified target inbox)
    - File contains at least one `pass` row in the verification table
    - File contains a real timestamp in the YYYY-MM-DD HH:MM format (not a placeholder `{}`)
    - No row in the verification table reads `fail` (any `fail` halts Phase 6 cutover — fix first, then redo the test)
  </acceptance_criteria>
  <resume-signal>Type "mailto E2E pass — proceed to Plan 03" once the evidence file is written and reviewed. If the test fails, fix the mailto surface in the relevant component, run quick build verification, then redo this checkpoint.</resume-signal>
  <done>
    `mailto-e2e-evidence.md` committed with at least one passing row, real timestamp, no failing rows. Phase 6 is cleared to proceed to Plan 03 (Cloudflare dashboard cutover).
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| local CLI → external HTTP | lychee fetches `--base`-resolved URLs from public internet; could exfiltrate path info via referer headers |
| local OS mail client → recipient inbox | mailto E2E test routes a real email through the wider SMTP layer |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-06-09 | Information Disclosure | lychee leaking internal-path information to external hosts (LinkedIn, Instagram) when checking outbound links | LOW | mitigate | Task 1 — `--exclude linkedin.com --exclude instagram.com` (already false-positive-prone, also reduces external leakage); `--exclude-mail` prevents pinging the mail address |
| T-06-10 | Repudiation | mailto E2E test email is not retained as audit evidence | LOW | mitigate | Task 4 — `mailto-e2e-evidence.md` captures send + arrival timestamps in the repo as durable evidence |
| T-06-11 | Spoofing | Wrong mailto target (tanyazakus2106@gmail.com vs anything else) routes recruiter mail to a third party | HIGH | mitigate | Task 4 explicit acceptance criterion — grep for exact string `tanyazakus2106@gmail.com` in the evidence file; visual confirmation in the test that the mail client prefilled the correct address |
| T-06-12 | Information Disclosure | Lighthouse HTML report includes the preview URL and could be indexed if committed to a public repo | LOW | accept | Repo is public (per CLAUDE.md). The preview URL is already in `astro.config.mjs:9` and `README.md:5`. Lighthouse report adds no NEW disclosure. |
| T-06-13 | Tampering | A real broken link inside dist/ that lychee misses (e.g., a stub anchor in MDX) | MEDIUM | mitigate | Task 1 — lychee scans all HTML in dist/, including MDX-rendered pages. Plus Task 4's manual click-through of the footer covers high-traffic flows. |

**ASVS L1 mapping:**
- V14 (Configuration) — Verifies the public-facing artifact's outbound link health and content quality before launch.

**Out-of-scope-but-noted security items:** Cloudflare account 2FA enforcement and registrar lock are Plan 03 (dashboard) checklist items; not actionable in this code-side plan.
</threat_model>

<verification>
After all four tasks complete:

```bash
# All three evidence artifacts exist
test -f .planning/phases/06-deployment/lychee-report.txt && \
test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.html && \
test -f .planning/phases/06-deployment/lighthouse-mobile-baseline.json && \
test -f .planning/phases/06-deployment/mailto-e2e-evidence.md && \
echo "All evidence artifacts present"

# Lighthouse mobile performance ≥ 0.80
python3 -c "import json; d=json.load(open('.planning/phases/06-deployment/lighthouse-mobile-baseline.json')); s=d['categories']['performance']['score']; print(f'Baseline mobile perf: {s}'); assert s>=0.80, 'SEO-05 fail'"

# lychee exit-0 captured
grep -q "lychee exit code: 0" .planning/phases/06-deployment/lychee-report.txt

# cspell exits 0 on current source
npx cspell "src/**/*.{mdx,astro,md}" "README.md"

# Mailto evidence has a passing row
grep -E "pass" .planning/phases/06-deployment/mailto-e2e-evidence.md
```
</verification>

<success_criteria>
- `lychee-report.txt`, `lighthouse-mobile-baseline.html`, `lighthouse-mobile-baseline.json`, `mailto-e2e-evidence.md` all committed to `.planning/phases/06-deployment/`
- lychee exit 0 (no real broken links; documented false positives only)
- cspell exit 0 (no spelling errors; dictionary tuned only with legitimate proper nouns)
- Lighthouse mobile performance score ≥ 0.80 (SEO-05 baseline gate)
- Mailto E2E evidence: at least one passing row, no failing rows, real timestamp
- No new npm dependencies added (RESEARCH.md guardrail)
- Phase 6 cleared to proceed to Plan 03 (Cloudflare dashboard cutover)
</success_criteria>

<output>
After completion, create `.planning/phases/06-deployment/06-02-SUMMARY.md` documenting:
- Baseline Lighthouse mobile performance score (the number)
- Any surgical perf fixes applied (with commit hashes)
- Any cspell.json dictionary additions made (and why each was a legit project term)
- Any real broken links found and fixed (with commit refs)
- Mailto E2E surfaces verified (footer always; About / MobileNav if present)
- Go/no-go decision for Plan 03 (always "go" once all four tasks pass)
</output>
