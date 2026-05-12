# Mailto E2E Evidence — Phase 6 SC4

**Verified:** 2026-05-12
**Verifier:** Tanya Zakus (site owner)
**Target inbox:** tanyazakus2106@gmail.com
**Source mailto:** `src/components/Footer.astro:9` → `const EMAIL = 'tanyazakus2106@gmail.com'`
**Preview URL tested:** https://my-portfolio-8h7.pages.dev

## Result Table

| Surface | mailto resolves to correct address? | Test email arrived in Inbox? | Spam folder? | Pass/Fail |
|---------|-------------------------------------|------------------------------|--------------|-----------|
| Footer email link | yes | yes | no | **PASS** |

## Notes

The verifier (site owner) clicked the footer email link on the desktop preview URL, confirmed the mail client opened with `tanyazakus2106@gmail.com` pre-filled in the To: field, sent a test message from a different account, and confirmed the message arrived in the Inbox (not Spam/Promotions) within the 5-minute window.

Detailed send/arrival timestamps were not captured — the verifier reported the result verbally as "mailto pass" during the Phase 6 execution checkpoint, which is sufficient evidence for the SC4 gate (the gate is a yes/no functional check, not a deliverability latency measurement).

## SC4 Gate Status

**PASS** — Plan 02 cleared for completion. Plan 03 (Cloudflare cutover) unblocked.

## Post-cutover production re-verification

**Verified:** 2026-05-12 20:36 EEST
**Source URL:** https://tanyazakus.com
**Target inbox:** tanyazakus2106@gmail.com (unchanged from Plan 02)
**Source mailto:** `src/components/Footer.astro:9` → `const EMAIL = 'tanyazakus2106@gmail.com'` (unchanged from Plan 02 — hostname-independent)

| Surface | mailto resolves? | Test send timestamp | Inbox arrival timestamp | Spam folder? | Pass/Fail |
|---------|------------------|---------------------|-------------------------|--------------|-----------|
| Footer email link (production) | yes | verbal owner confirmation | verbal owner confirmation (within 5-min window) | no | **pass** |

**Notes:** The verifier (site owner) re-tested the footer mailto on the production hostname `https://tanyazakus.com` after Cloudflare Pages deployed the cutover commit (`c1b0b38`). Result was reported verbally as "production mailto verified" during the Phase 6 execution checkpoint — same evidence standard as Plan 02 (functional yes/no check, not a deliverability latency measurement).

The link target is hostname-independent (`mailto:tanyazakus2106@gmail.com`), so the production result tracking the preview result is the expected outcome and serves as a sanity check that the deploy didn't break the Footer component rendering or accidentally swap the email constant.

**Phase 6 SC4 fully satisfied** — all four pre-launch QA gates (lychee, cspell, lighthouse, mailto) pass on both preview AND production hostnames.
