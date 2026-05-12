---
phase: 06-deployment
plan: 03
type: execute
wave: 3
depends_on:
  - "06-01"
  - "06-02"
files_modified:
  - .planning/phases/06-deployment/cloudflare-cutover-checklist.md
autonomous: false
requirements:
  - DEPLOY-01
  - DEPLOY-03
requirements_addressed:
  - DEPLOY-01
  - DEPLOY-03
tags:
  - cloudflare-dashboard
  - dns
  - https
  - custom-domain
  - manual

user_setup:
  - service: cloudflare-registrar
    why: "Purchase tanyazakus.com (D-02, D-03)"
    account_setup:
      - "Cloudflare account with 2FA enabled (security baseline; verify before proceeding)"
      - "Payment method on file (~$8/yr at-cost)"
    dashboard_config:
      - task: "Register tanyazakus.com fresh through Cloudflare Registrar"
        location: "https://dash.cloudflare.com → Domain Registration → Register Domains → search tanyazakus.com"
      - task: "Enable registrar lock + auto-renewal"
        location: "Cloudflare → Domain Registration → tanyazakus.com → Transfer Lock + Auto-Renew"
  - service: cloudflare-pages
    why: "Attach custom domain to existing my-portfolio Pages project (D-03, D-04, DEPLOY-03)"
    dashboard_config:
      - task: "Attach apex tanyazakus.com to my-portfolio Pages project"
        location: "Cloudflare → Workers & Pages → my-portfolio → Custom domains → Set up a domain"
      - task: "Attach www.tanyazakus.com to same Pages project"
        location: "Cloudflare → Workers & Pages → my-portfolio → Custom domains → Set up a domain"
      - task: "Wait for Universal SSL provisioning (5-30 min typical)"
        location: "Same Custom domains panel — SSL column"
      - task: "Set SSL/TLS encryption mode = Full (strict)"
        location: "Cloudflare → tanyazakus.com → SSL/TLS → Overview"
      - task: "Enable Always Use HTTPS"
        location: "Cloudflare → tanyazakus.com → SSL/TLS → Edge Certificates → Always Use HTTPS toggle"
      - task: "Create Redirect Rule: www.tanyazakus.com → tanyazakus.com (301, preserve path + query)"
        location: "Cloudflare → tanyazakus.com → Rules → Redirect Rules → Create rule"

must_haves:
  truths:
    - "tanyazakus.com is registered to Tanya at Cloudflare Registrar with auto-renewal + transfer lock on"
    - "https://tanyazakus.com responds 200 with a valid Cloudflare-issued cert"
    - "https://www.tanyazakus.com responds 301 to https://tanyazakus.com (apex canonical)"
    - "http://tanyazakus.com responds 301 to https://tanyazakus.com (Always Use HTTPS on)"
    - "Cloudflare SSL/TLS mode is Full (strict)"
    - "Cloudflare account has 2FA enabled (out-of-band verification)"
  artifacts:
    - path: ".planning/phases/06-deployment/cloudflare-cutover-checklist.md"
      provides: "Dashboard checklist with each step ticked + raw curl output snapshots as evidence"
      contains: "tanyazakus.com"
  key_links:
    - from: "Cloudflare Registrar"
      to: "Cloudflare DNS"
      via: "Same-dashboard auto-binding (consolidated account)"
      pattern: "tanyazakus.com appears in DNS dashboard immediately after purchase"
    - from: "Cloudflare DNS apex record"
      to: "my-portfolio.pages.dev backend"
      via: "CNAME flattening (auto-created on Pages custom-domain attach)"
      pattern: "dig +short tanyazakus.com resolves to Cloudflare IPs"
    - from: "www.tanyazakus.com"
      to: "tanyazakus.com"
      via: "Cloudflare Redirect Rule (dashboard, NOT public/_redirects)"
      pattern: "curl -I https://www.tanyazakus.com returns 301 with Location: https://tanyazakus.com"
---

<objective>
Complete the out-of-repo Cloudflare dashboard work that takes the site from `https://my-portfolio-8h7.pages.dev` to live HTTPS on `https://tanyazakus.com` and `https://www.tanyazakus.com → 301 → tanyazakus.com`. Capture the result as a committed checklist (with raw curl output snapshots) so Plan 04 has verified-live evidence before flipping `astro.config.mjs:9`.

Purpose: Address DEPLOY-01 (Cloudflare Pages — verify still-green after custom domain attach) and DEPLOY-03 (custom domain + HTTPS resolves). Enforce the D-06 sequencing landmine: the `site:` flip in Plan 04 MUST NOT happen until this plan's `curl https://tanyazakus.com` verification passes.

Output: A single committed checklist file. All actual state changes (domain registration, DNS records, Redirect Rules, SSL mode) live in the Cloudflare dashboard — out of repo by necessity.

**This plan is non-autonomous.** Every step requires Tanya at the Cloudflare dashboard. Claude can perform the curl verifications, write the checklist, and check ticked items — but cannot click the Cloudflare buttons. The plan is structured as a series of `checkpoint:human-action` tasks because none of the dashboard work has a CLI/API alternative that Claude can run (the Cloudflare API exists but requires API tokens with scary scopes; using the dashboard is safer + simpler for a one-shot launch).
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

<interfaces>
<!-- This plan exercises the Cloudflare dashboard, not the codebase. The "interface"
     is the dashboard navigation path for each setting + the curl commands that
     verify success. -->

Dashboard navigation paths (Cloudflare 2026 dashboard layout):
- Registrar: dash.cloudflare.com → Domain Registration → Register Domains
- Pages custom domain: dash.cloudflare.com → Workers & Pages → my-portfolio → Custom domains
- SSL/TLS mode: dash.cloudflare.com → tanyazakus.com (after registration) → SSL/TLS → Overview
- Always Use HTTPS: dash.cloudflare.com → tanyazakus.com → SSL/TLS → Edge Certificates
- Redirect Rules: dash.cloudflare.com → tanyazakus.com → Rules → Redirect Rules

Verification commands (run from terminal):
- `curl -vI https://tanyazakus.com 2>&1 | grep -i "subject\|issuer\|HTTP/"` — cert + status
- `curl -sI https://www.tanyazakus.com | head -3` — should show `HTTP/2 301` and `location: https://tanyazakus.com`
- `curl -sI http://tanyazakus.com | head -3` — should show 301 to https (Always Use HTTPS)
- `dig +short tanyazakus.com` — should return Cloudflare IPs (104.21.x.x or 172.67.x.x range)
</interfaces>
</context>

<tasks>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 1 (CHECKPOINT): Cloudflare account 2FA + registrar lock pre-flight</name>
  <files>.planning/phases/06-deployment/cloudflare-cutover-checklist.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Security Domain → Known Threat Patterns → Domain hijacking / DNS takeover") — 2FA is the most important control
  </read_first>
  <what-built>
    Before purchasing a domain that will represent Tanya professionally, the underlying Cloudflare account must be hardened. This checkpoint exists because no code can verify 2FA status; only a human inspecting the Cloudflare account settings can.
  </what-built>
  <how-to-verify>
    Tanya performs in the Cloudflare dashboard:

    1. Navigate: `dash.cloudflare.com` → top-right avatar → My Profile → Authentication.
    2. Confirm **Two-Factor Authentication is ENABLED**. If not enabled, enable it now using either an authenticator app (recommended) or hardware key. Do NOT proceed to Task 2 until 2FA is on.
    3. Save the 2FA recovery codes to a password manager (1Password, Bitwarden, etc.). These are the only way back in if the 2FA device is lost.
    4. Begin creating the checklist file `.planning/phases/06-deployment/cloudflare-cutover-checklist.md` with the following structure (more rows are added by later tasks in this plan):

    ```markdown
    # Cloudflare Cutover Checklist — Phase 6

    **Started:** {YYYY-MM-DD HH:MM}
    **Operator:** Tanya Zakus
    **Target domain:** tanyazakus.com
    **Pages project:** my-portfolio

    ## Pre-flight

    - [x] Cloudflare account 2FA enabled — confirmed {YYYY-MM-DD HH:MM} via dash.cloudflare.com → My Profile → Authentication
    - [x] 2FA recovery codes stored in password manager
    ```

    Tick the checkboxes only after each step is genuinely complete.
  </how-to-verify>
  <verify>
    <automated>test -f .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Cloudflare account 2FA enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - File `.planning/phases/06-deployment/cloudflare-cutover-checklist.md` exists
    - Contains the literal line beginning `- [x] Cloudflare account 2FA enabled`
    - Contains a ticked line for 2FA recovery codes stored
    - Contains a real timestamp (YYYY-MM-DD HH:MM format), NOT a `{}` placeholder
  </acceptance_criteria>
  <resume-signal>Type "2FA confirmed — proceed to registrar purchase"</resume-signal>
  <done>
    2FA verified on; recovery codes stored; checklist file initialized with the pre-flight section.
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 2 (CHECKPOINT): Purchase tanyazakus.com via Cloudflare Registrar</name>
  <files>.planning/phases/06-deployment/cloudflare-cutover-checklist.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-CONTEXT.md (D-02 — production domain is tanyazakus.com; D-03 — register fresh through Cloudflare Registrar; fallback: if domain is taken, flag immediately, do NOT proceed silently)
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 4: Cloudflare custom-domain attach sequence" steps 1-2)
  </read_first>
  <what-built>
    Domain purchase from Cloudflare Registrar (~$8/yr at-cost). Required for every subsequent step.
  </what-built>
  <how-to-verify>
    Tanya performs:

    1. Navigate: `dash.cloudflare.com` → left sidebar → **Domain Registration** → **Register Domains**.
    2. Search: `tanyazakus.com`.
    3. **FALLBACK BRANCH (D-03):** If the domain is already registered to someone else (Cloudflare shows "Unavailable" or similar), HALT this plan immediately. Notify the user and request guidance — do NOT proceed to register a different name silently. Per CONTEXT D-03: "the planner falls back to a brand pivot — flag immediately, do not proceed silently."
    4. If available, add `tanyazakus.com` to cart and complete checkout. Expected price: ~$8/yr USD. Renewal: same at-cost price.
    5. After checkout, the domain auto-lands in the Cloudflare DNS dashboard (registrar + DNS are the same Cloudflare dashboard when buying through Cloudflare Registrar — no separate "Add a Site" step needed).
    6. Navigate to: `dash.cloudflare.com` → Domain Registration → tanyazakus.com → Manage. Confirm and enable:
       - **Transfer Lock: ON** (default; verify it is enabled — prevents unauthorized transfer-out)
       - **Auto-Renew: ON** (so the domain renews automatically; missing a renewal could lose the domain)
    7. Append to the checklist file:

    ```markdown
    ## Registration

    - [x] Purchased tanyazakus.com via Cloudflare Registrar — order confirmation #{order-id} on {YYYY-MM-DD HH:MM}
    - [x] Transfer Lock enabled
    - [x] Auto-Renew enabled
    - [x] Domain appears in Cloudflare DNS dashboard sidebar
    ```
  </how-to-verify>
  <verify>
    <automated>grep -qE "^- \[x\] Purchased tanyazakus.com via Cloudflare Registrar" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Transfer Lock enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Auto-Renew enabled" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - Checklist file contains ticked `- [x] Purchased tanyazakus.com via Cloudflare Registrar` line with a real order ID and timestamp
    - Ticked line for Transfer Lock enabled
    - Ticked line for Auto-Renew enabled
    - Ticked line for domain appearing in DNS dashboard
    - If the domain was unavailable, no ticked lines for purchase — instead a HALT note documenting the fallback decision is required, and this plan does not proceed
  </acceptance_criteria>
  <resume-signal>Type "domain registered — proceed to custom domain attach" OR "domain unavailable — HALT for guidance"</resume-signal>
  <done>
    tanyazakus.com is owned by Tanya at Cloudflare Registrar with lock + auto-renew on; visible in DNS dashboard.
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 3 (CHECKPOINT): Attach apex + www to my-portfolio Pages project, wait for Universal SSL</name>
  <files>.planning/phases/06-deployment/cloudflare-cutover-checklist.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 4: Cloudflare custom-domain attach sequence" steps 3-5, and "Pitfall 2: Universal SSL stuck pending due to CAA records")
    - .planning/phases/06-deployment/06-CONTEXT.md (D-04 — apex canonical; www redirects to apex)
  </read_first>
  <what-built>
    Both `tanyazakus.com` (apex) and `www.tanyazakus.com` (www) are attached to the existing `my-portfolio` Cloudflare Pages project. Universal SSL provisions certificates for both. The CNAME flattening makes the apex resolve to the Pages backend automatically — no manual DNS A record edit needed (Cloudflare handles it when registrar + DNS + Pages are in the same account).
  </what-built>
  <how-to-verify>
    Tanya performs:

    1. Navigate: `dash.cloudflare.com` → Workers & Pages → my-portfolio (the Pages project) → **Custom domains** tab → **Set up a domain**.
    2. Enter: `tanyazakus.com` → Continue. Cloudflare auto-creates the DNS record (CNAME-flattened from apex to my-portfolio.pages.dev). Click Activate domain.
    3. Repeat for `www.tanyazakus.com`: Set up a domain → enter `www.tanyazakus.com` → Continue → Activate domain.
    4. Wait for Universal SSL provisioning. The Custom domains panel shows an SSL column — wait until both rows show "Active" or "Certificate active" (typically 5–30 minutes; can be up to 24h if CAA records block CAs, but fresh Cloudflare-registered domains have no CAA records by default per RESEARCH.md Pitfall 2).
    5. From a terminal (Claude can run these on Tanya's machine if available), verify cert is live:
       ```bash
       curl -vI https://tanyazakus.com 2>&1 | grep -i "subject\|issuer\|HTTP/" | head -5
       ```
       Expected output includes a 200 (or 308 to apex if hit on a subpath), an `issuer:` line referencing Google Trust Services or Let's Encrypt, and a `subject:` line referencing `tanyazakus.com`.
    6. Same for www:
       ```bash
       curl -vI https://www.tanyazakus.com 2>&1 | grep -i "subject\|issuer\|HTTP/" | head -5
       ```
       At this stage `www.` should serve the SAME content as apex (the Redirect Rule comes in Task 4 — without the rule, www just shows the same Pages content).
    7. Append to checklist:

    ```markdown
    ## Custom domain attach

    - [x] tanyazakus.com attached to my-portfolio Pages project on {YYYY-MM-DD HH:MM}
    - [x] www.tanyazakus.com attached to my-portfolio Pages project on {YYYY-MM-DD HH:MM}
    - [x] Universal SSL provisioned for tanyazakus.com — issuer: {Google Trust Services / Let's Encrypt}, expires {date}
    - [x] Universal SSL provisioned for www.tanyazakus.com — issuer: {issuer}, expires {date}
    - [x] curl -vI https://tanyazakus.com returns HTTP 200 with valid cert

    ### Raw curl output (apex)
    ```
    {paste curl output here}
    ```

    ### Raw curl output (www)
    ```
    {paste curl output here}
    ```
    ```

    **Pitfall 2 escalation:** If SSL is still pending after 30 minutes, check Cloudflare → tanyazakus.com → DNS for any CAA records. None should exist on a fresh Cloudflare-registered domain — if any are present, delete them or update them to include `letsencrypt.org` and `pki.goog`. RESEARCH.md Pitfall 2 has the full fix.
  </how-to-verify>
  <verify>
    <automated>grep -qE "^- \[x\] tanyazakus.com attached" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] www.tanyazakus.com attached" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Universal SSL provisioned for tanyazakus.com" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl -vI https://tanyazakus.com returns HTTP 200" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - Checklist has ticked line `- [x] tanyazakus.com attached to my-portfolio Pages project` with real timestamp
    - Ticked line `- [x] www.tanyazakus.com attached to my-portfolio Pages project` with real timestamp
    - Ticked line `- [x] Universal SSL provisioned for tanyazakus.com` with issuer + expiry recorded
    - Ticked line `- [x] curl -vI https://tanyazakus.com returns HTTP 200 with valid cert`
    - Raw curl output sections present for both apex and www (proves a real verification ran, not just tick-and-go)
    - `curl -sI https://tanyazakus.com | head -1` (run independently) returns `HTTP/2 200` or `HTTP/1.1 200`
  </acceptance_criteria>
  <resume-signal>Type "domains attached and HTTPS verified — proceed to redirect + SSL hardening"</resume-signal>
  <done>
    Both apex and www are attached to the Pages project with valid certs; curl confirms HTTPS on both; checklist documents issuer/expiry/timestamp.
  </done>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 4 (CHECKPOINT): Configure SSL mode = Full (strict), Always Use HTTPS, www→apex Redirect Rule</name>
  <files>.planning/phases/06-deployment/cloudflare-cutover-checklist.md</files>
  <read_first>
    - .planning/phases/06-deployment/06-RESEARCH.md (section "Pattern 4" steps 6-9; "Specifics → HTTPS / SSL mode" in 06-CONTEXT.md)
    - .planning/phases/06-deployment/06-CONTEXT.md (D-04 — apex canonical; www 301-redirects to apex)
  </read_first>
  <what-built>
    Three Cloudflare zone-level settings hardened: SSL/TLS mode = Full (strict), Always Use HTTPS = on, www→apex 301 Redirect Rule active.
  </what-built>
  <how-to-verify>
    Tanya performs:

    1. **SSL/TLS mode = Full (strict).** Navigate: `dash.cloudflare.com` → tanyazakus.com → **SSL/TLS** → **Overview**. Set the encryption mode radio to **Full (strict)**. (Pages always serves valid HTTPS on the backend, so Full strict is correct and required. Flexible would be a downgrade; Off is wrong.)

    2. **Always Use HTTPS = on.** Navigate: `dash.cloudflare.com` → tanyazakus.com → SSL/TLS → **Edge Certificates**. Find the "Always Use HTTPS" toggle and ensure it is **ON**. This redirects any plain HTTP requests to HTTPS at the edge.

    3. **www → apex Redirect Rule.** Navigate: `dash.cloudflare.com` → tanyazakus.com → **Rules** → **Redirect Rules** → **Create rule**. Configure:
       - Rule name: `Redirect www to apex`
       - **When incoming requests match:** (use Custom filter expression)
         - Field: `Hostname`
         - Operator: `equals`
         - Value: `www.tanyazakus.com`
       - **Then:**
         - Type: **Static**
         - URL: `https://tanyazakus.com${path}${query}` (or use the toggles: "Preserve query string: YES" + "Preserve path: YES" if the UI exposes them)
         - Status code: **301**
       - Save and deploy.

    4. Verify all three settings with curl (Claude can run these):
       ```bash
       # www → apex 301 with preserved path/query
       curl -sI "https://www.tanyazakus.com/about?test=1" | head -5
       # Expect: HTTP/2 301; location: https://tanyazakus.com/about?test=1

       # Plain HTTP → HTTPS apex 301 (Always Use HTTPS)
       curl -sI "http://tanyazakus.com/" | head -3
       # Expect: HTTP/1.1 301 or HTTP/2 301; location: https://tanyazakus.com/

       # Apex over HTTPS still 200
       curl -sI "https://tanyazakus.com/" | head -3
       # Expect: HTTP/2 200
       ```

    5. Append to checklist:

    ```markdown
    ## Cloudflare hardening

    - [x] SSL/TLS encryption mode set to Full (strict)
    - [x] Always Use HTTPS toggle ON
    - [x] Redirect Rule created: hostname `www.tanyazakus.com` → 301 to https://tanyazakus.com (preserve path + query)
    - [x] curl https://www.tanyazakus.com → 301 to https://tanyazakus.com — verified {YYYY-MM-DD HH:MM}
    - [x] curl http://tanyazakus.com → 301 to https://tanyazakus.com — verified {YYYY-MM-DD HH:MM}
    - [x] curl https://tanyazakus.com → 200 — verified {YYYY-MM-DD HH:MM}

    ### Raw curl output (www → apex)
    ```
    {paste curl output here}
    ```

    ### Raw curl output (http → https)
    ```
    {paste curl output here}
    ```
    ```
  </how-to-verify>
  <verify>
    <automated>grep -qE "^- \[x\] SSL/TLS encryption mode set to Full \(strict\)" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Always Use HTTPS toggle ON" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] Redirect Rule created" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl https://www.tanyazakus.com .* 301" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && grep -qE "^- \[x\] curl http://tanyazakus.com .* 301" .planning/phases/06-deployment/cloudflare-cutover-checklist.md && echo "OK"</automated>
  </verify>
  <acceptance_criteria>
    - Ticked line `- [x] SSL/TLS encryption mode set to Full (strict)` in checklist
    - Ticked line `- [x] Always Use HTTPS toggle ON` in checklist
    - Ticked line `- [x] Redirect Rule created: hostname www.tanyazakus.com → 301 to https://tanyazakus.com (preserve path + query)`
    - Three curl-verification ticks: www→apex 301, http→https 301, apex 200
    - Raw curl output blocks present for at least the www→apex case (proves the 301 was observed, not just trusted)
    - Independent re-verification: `curl -sI https://www.tanyazakus.com | grep -iE "^location:" | grep -q "tanyazakus.com"` exits 0 and DOES NOT include `www.`
  </acceptance_criteria>
  <resume-signal>Type "Cloudflare hardening complete — DNS+HTTPS verified live — proceed to Plan 04 (code cutover)"</resume-signal>
  <done>
    SSL Full strict on; Always Use HTTPS on; www→apex Redirect Rule live; all three curl verifications captured. The D-06 sequencing landmine is now satisfied — Plan 04 may flip the `site:` URL.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Tanya's local browser → Cloudflare dashboard | Authenticated session controls registrar, DNS, SSL, Redirect Rules |
| Cloudflare → external CA (Google Trust Services / Let's Encrypt) | Universal SSL provisioning fetches certs over public internet |
| visitor → Cloudflare edge | All HTTPS traffic terminates at Cloudflare |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-06-14 | Spoofing | Cloudflare account compromised → domain hijack, DNS takeover, content replacement | HIGH | mitigate | Task 1 — 2FA on the Cloudflare account verified before any other step; Task 2 — Transfer Lock + Auto-Renew prevent silent transfer-out and lapsed-renewal scenarios |
| T-06-15 | Spoofing | Wrong domain accidentally registered (e.g., typo "tanyazakus.co" or "tanya-zakus.com") | HIGH | mitigate | Task 2 explicit value check — domain string exactly `tanyazakus.com`; checklist captures the order ID; fallback branch handles the "domain unavailable" case explicitly per D-03 |
| T-06-16 | Tampering | SSL mode set to Flexible (HTTP between Cloudflare and Pages origin) — MITM possible between Cloudflare and backend | HIGH | mitigate | Task 4 explicit setting — Full (strict) — verified in dashboard; this is the only acceptable setting because Pages serves valid HTTPS |
| T-06-17 | Tampering | Plain HTTP traffic not auto-redirected to HTTPS — first-request MITM | MEDIUM | mitigate | Task 4 — Always Use HTTPS toggle ON; verified by curl on http://tanyazakus.com returning 301 |
| T-06-18 | Information Disclosure | www and apex serve duplicate content (no canonical enforcement) — SEO duplicate-content + accidental hostname leak | LOW | mitigate | Task 4 — Redirect Rule www→apex 301; verified by curl on https://www.tanyazakus.com returning 301 to apex |
| T-06-19 | Denial of Service | Domain expires due to missed renewal payment → entire site goes dark | MEDIUM | mitigate | Task 2 — Auto-Renew ON; Cloudflare also sends expiry warning emails; recovery codes for 2FA prevent account lockout from blocking renewal payment |
| T-06-20 | Tampering | Open-redirect via overly-permissive Redirect Rule | LOW | accept | Task 4 — Redirect Rule destination is hardcoded to `https://tanyazakus.com${path}${query}`; the only "variable" parts are path+query from the original request, which are appended to the trusted apex hostname; no external destination can be injected |
| T-06-21 | Information Disclosure | Universal SSL stuck pending due to CAA records leaks "site not ready" state | LOW | accept | RESEARCH.md Pitfall 2 — fresh Cloudflare-registered domains have no CAA records by default; pitfall is documented and recovery is one-step (delete the CAA record) |

**ASVS L1 mapping:**
- V6 (Cryptography) — Universal SSL + HSTS + Full (strict) mode covers transport encryption end-to-end ✓
- V9 (Communication) — HTTPS-only enforced; HSTS from Plan 01 makes it sticky ✓
- V14 (Configuration) — Cloudflare zone hardened: 2FA, Transfer Lock, Auto-Renew, Full strict, Always Use HTTPS, Redirect Rule ✓
</threat_model>

<verification>
After all four checkpoint tasks complete:

```bash
# Checklist file is fully populated
test -f .planning/phases/06-deployment/cloudflare-cutover-checklist.md
grep -c "^- \[x\]" .planning/phases/06-deployment/cloudflare-cutover-checklist.md
# Expect: at least 14 ticked items (2 pre-flight + 4 registration + 5 attach + 6 hardening)

# Independent live-state verification (run from any network — these test the public-facing reality)
curl -sI https://tanyazakus.com | head -1                              # HTTP/2 200
curl -sI https://www.tanyazakus.com | grep -i "^location"              # location: https://tanyazakus.com
curl -sI http://tanyazakus.com | grep -i "^location"                   # location: https://tanyazakus.com/
curl -vI https://tanyazakus.com 2>&1 | grep -i "issuer"                # Google Trust Services or Let's Encrypt

# DNS resolves to Cloudflare
dig +short tanyazakus.com | head -1                                    # Cloudflare IP range (104.21.x or 172.67.x)
```
</verification>

<success_criteria>
- Cloudflare account has 2FA enabled, recovery codes saved
- tanyazakus.com is owned, locked, auto-renewing at Cloudflare Registrar
- Both apex and www attached to my-portfolio Pages project with valid SSL certs
- SSL/TLS mode = Full (strict), Always Use HTTPS ON, www→apex 301 Redirect Rule live
- All curl verifications captured in the checklist with raw output blocks
- D-06 sequencing landmine is now satisfied: Plan 04 may proceed
- No code in repo changed by this plan EXCEPT the cutover-checklist.md evidence file
</success_criteria>

<output>
After completion, create `.planning/phases/06-deployment/06-03-SUMMARY.md` documenting:
- Date/time domain was purchased + order ID (no payment info)
- SSL cert issuer + expiry
- Confirmation that all 4 Cloudflare zone settings are correctly configured
- The exact curl outputs captured (or reference to checklist sections)
- Explicit go-signal for Plan 04: "DNS+HTTPS verified live at {timestamp}; Plan 04 may flip `site:` URL"
</output>
