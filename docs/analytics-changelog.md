# Analytics changelog — systemai.co.uk

System: post-redesign analytics loop (observe → one hypothesis → one change →
next window → keep or revert). Tooling: Microsoft Clarity (project
`xg8c31d1ng`, geo-based consent mode, no banner) + GA4 (`G-4ZHPB1VY2K`).

## Loop rules

- **Success metric (primary):** clicks on "Let's talk" (Calendly link).
  GA4 events: `hero_lets_talk_click`, `header_lets_talk_click`,
  `contact_book_call_click`, `cs_kestrl_lets_talk_click`,
  `cs_srama_lets_talk_click`. Clarity smart event: outbound click to
  calendly.com.
- **Window:** 100 sessions on the page being judged, or 4 weeks — whichever
  comes first. At current traffic (~180 sessions/28d, nearly all homepage)
  the homepage window is ~2–3 weeks. Case-study pages don't reach 100
  sessions in 4 weeks: judge them on trend only, never on one window.
- **One change per cycle.** During a window: change nothing except outright
  breakage.

## Baseline (control) — pre-Clarity GA4 snapshot, 2026-06-04 → 2026-07-01

- Sessions: 182 (homepage only — GA was missing from all other pages until
  2026-07-02, so case-study traffic was invisible).
- Calendly clicks: 6 (hero 3, contact 3, header 0) ≈ **3.3% of sessions**.
- Header desktop CTA: **0 clicks in 28 days**.
- Mobile menu opens: 12. Case-study card clicks: 8 (kestrl 6, srama 2).
- Engagement: avg ~12s/session (Direct), ~8s (Organic Search); engagement
  rate 39% Direct / 24% Organic Search. Most visitors leave in seconds.
- Channels (sessions): Direct 103 (57%), Organic Search 49 (27%),
  Referral 17, Organic Social 10, AI Assistant 3.
- Geo (active users): GB 51, US 38, FR 11, IN 11 — UK/EEA ≈ half of traffic
  (cookieless Clarity, fragmented sessions), US/rest gets full recordings.

## Changes

| Date | Change | Hypothesis | Metric watched | Result (next window) |
|---|---|---|---|---|
| 2026-07-02 | Instrumentation only: Clarity added to all 5 pages; GA4 + analytics.js added to case-study/privacy/terms pages (was homepage-only); CSP updated for clarity.ms + unpkg.com; privacy policy discloses Clarity. | Not a site change — baseline starts on deploy. | — | — |
