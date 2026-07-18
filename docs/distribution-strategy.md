# Distribution & Operating Strategy (research synthesis)

How to actually deploy the Dictator Meter as a **mostly-autonomous, Claude-run** civic-data
project with **minimal human-in-the-loop**. Synthesized from 2026 research on social-platform
automation and on how low-staff / automated news accounts operate, distribute, and get cited.

## The big reframe: RSS/website is the spine; social is a downstream auto-post
Research finding: for this use case, **social media is the *lowest* reach-per-unit-effort and the
most ops-heavy channel to sustain.** The high-leverage, low-labor architecture is:

```
scoring pipeline → website + RSS feed (source of truth)
                     ├── auto-email digest (beehiiv "RSS-to-Send")
                     ├── embeddable score card (others' articles carry our brand)
                     ├── public API / data feed (newsrooms & researchers pull)
                     └── social auto-post (Bluesky, X, …) — an afterthought fed from RSS
```
Build once around RSS; everything else fans out automatically. Starting with a *visible* social
account is still fine as the first step — but architect it as one output of the spine, not the
product itself.

## What makes newsrooms actually cite us ("according to the Dictator Meter…")
The citability checklist (we already have most of it):
- **A fixed, named, versioned rubric with a small ordinal label set** (our tiers:
  Constrained/Eroding/Hybrid/Authoritarian/Absolute). FiveThirtyEight proves a *fully automated*
  rater can be citation-grade **if the methodology is stable and public.** Brand the phrase so it
  travels.
- **Public, versioned methodology page** + **stability** (a shifting scale rots past citations).
- **Every score traceable to primary sources** — quantified, individually-sourced claims get cited;
  rhetoric does not. (We do this: `scored_actions` with source links.)
- **Embeddable + downloadable assets** — the meter card as a "visual primary source" others embed.
- **A public API / data feed.**
- **No login, open access; clear reuse/attribution terms.**

## The safety model that fits low-human-loop (most important operational finding)
The real errors live at the **data layer, not the prose.** (Cautionary tale: the 2017 LA Times
Quakebot published a 1925 quake as current because USGS pushed a bad-dated alert — bad input →
instant bad output.) AP scaled automated earnings stories 10× **while cutting errors** by investing
in a clean input feed + rules-based templates + human anomaly review + an "automated editor" layer.

**Therefore, don't gate every post — gate by anomaly.** Default to autonomous publishing for
clear-cut, high-confidence scores; auto-route to the human ONLY when a flag trips:
- `confidence` = low/medium
- `coverage_imbalance` = true (only one side of the spectrum reported it)
- an **extreme** score, or a novel/first-seen entity
- thin sourcing (< 2 independent sources) or missing primary document
- an interpretive-mechanism flag (e.g. legal/democratic mechanism, like the Mexico judiciary case)

This is the Quakebot single-gate model, made smart: **~90% autonomy at a fraction of the risk, and
the human reviews only the 10% that actually matter.** We ALREADY emit these exact signals
(confidence flags, coverage_imbalance, status, severity) — so the anomaly gate is mostly wiring up
what the scorer already produces.

## Audit trail + disclosure + corrections (the liability shield)
- **Log an audit record per published score**: rubric version, inputs, source links, indicator
  matched, model, timestamp, and whether a human reviewed. This is both the correction mechanism
  and the liability defense.
- **Disclose specifically, not generically.** Research: vague "made with AI" labels are ignored or
  erode trust; what *builds* trust is provenance detail — "scored by an AI agent against the vX.Y
  rubric," a methodology link, and every underlying source. (X also *requires* an "Automated"
  label tied to a human account.)
- **Publish a fast, visible corrections policy.** Automated publishers earn credibility not by
  never erring but by prompt, transparent, logged correction.

## Platform cheat-sheet (2026)
| Platform | Cost | Friction | Role |
|---|---|---|---|
| **Bluesky** | Free | None (open API, no review, bot-friendly) | **Start here** — prove the loop at zero cost/risk |
| **Mastodon** | Free | Low (pick a bot-friendly instance) | Easy secondary |
| **X / Twitter** | ~$2–3/mo (pay-per-use since Feb 2026; ~$0.20/post-with-link) | Low–moderate; must carry "Automated" label + linked human acct; stricter enforcement | Best political/journalist audience — add after loop works |
| **Threads** | Free | Moderate (Meta app review, token refresh, AI labels) | Phase 2 |
| **Instagram** | Free | Highest (Business acct + Page + review, JPEG-only cards) | Phase 2+, image reach |

Owned channels (no gatekeeper, never banned): **RSS**, **beehiiv email** (has an API + RSS-to-Send;
Substack has NO API so is bad for automation), **embeddable widget**, **public API**.

## Recommended path (crawl → walk → run)
1. **Crawl:** pipeline writes to the **website + RSS** (source of truth) and auto-posts to
   **Bluesky**; **anomaly-gated** human approval (you review only flagged drafts, from your phone
   via a Telegram/Slack Approve button). Zero platform cost.
2. **Walk:** fan out from RSS to a **beehiiv email digest** + an **embeddable score card**; add
   **X** (~$3/mo) for the political audience.
3. **Run:** ship a **public API / data feed** and pursue **newsroom embeds/citation** — the
   "according to the Dictator Meter" endgame. Reserve full autonomy for clear-cut items; keep the
   anomaly gate + audit log + corrections page.

## What we already have vs. still need
- Have: versioned rubric + tiers, per-event sourcing trail, confidence/coverage-imbalance/status
  flags, the Editor persona, the scoring + trajectory engines.
- Need: the website/RSS output, the anomaly-gate rules layer, the audit log, a methodology page,
  a corrections policy, and the approval bot + one social integration.
