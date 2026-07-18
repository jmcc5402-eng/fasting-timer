# Dictator Meter — Roadmap & Open Threads

_Working notes. This is our standing memory between sessions — open here next time._

## ⭐ REMINDER (flagged by user, to brainstorm next session)
**The huge upcoming US midterm election (Nov 2026) — does it change our strategy?**
Initial thinking is in the "Midterm strategy" section below; treat that as a starting draft to
pressure-test together, not a decision.

## Status snapshot (done)
- Framework: 6 dimensions, 0–100 scale, 5 tiers, 5 severity levels (incl. Micro).
- Catalog: `data/indicators.json`, 45 pre-committed indicators (added rol-09 from a live event).
- Scoring: `lib/score.mjs` (diminishing-returns / noisy-OR; not-assessed handling).
- Three axes, validated on 11 sourced historical figures: **Power** (headline), **Harm**, **Competence**.
- Live method: `docs/event-sourcing-protocol.md` (selection is rule-driven, not editorial).
- Prototype: 15 sourced current events, globally balanced (`data/events/prototype-2026-07.json`).
- Trajectory engine: `lib/trajectory.mjs` (monotonic breadth INDEX + PEAK + attempt PRESSURE;
  blocked-action model: status discounts realized impact, never the attempt).

## Open threads (next up)
1. **US March–June 2026 creep demo** — IN PROGRESS (research launched). Prove a *current* rising
   line on one government, the way Milošević's 1989–2000 line rises.
2. **Midterm brainstorm** — the flagged reminder above.
3. **Front end** — not started. Method page first (credibility anchor), then Home / Profiles /
   Compare / Live (stub) / Press. README + EDITOR.md.

## Granularity & cadence (thinking, for review)
The question: how fine-grained do we score? Anchored to the target cadence — **1–2 published
pieces per week**, feeding news.

- **Atomic unit stays the discrete, sourced action** (a law signed, an order issued, a person
  detained). We never score "trends" or "a week" directly — we score actions, then aggregate.
- **Inclusion = catalog + sourcing bar, not importance.** Every qualifying action is scored,
  *including Micro ones.* Micro actions barely move the number alone (3 pts), so including them is
  cheap and safe — their value is cumulative. The severity tiers already do the "granularity
  weighting" for us; fine-grained texture enriches the trajectory without distorting it.
- **The catalog is the significance floor.** If it doesn't match an indicator, it's out. The
  smallest things we score are the Micro indicators (condition a court's budget; condition one
  outlet's access). Below that = not scored. Principled floor, not a vibe.
- **Publication unit = the weekly digest, not the single action.** We don't publish per action
  (too noisy). Each week we batch that week's scored actions into 1–2 digests: "this week, N
  scored actions, trajectory moved +X, here's each with its source and historical echo." Matches
  the 1–2x/week model.
- **One event, tracked over time — not re-scored per news beat.** A policy generates many
  headlines (announced → signed → challenged → enforced). We score the ACTION once and evolve its
  `status` (stood / blocked / reversed) as it moves through courts. This controls granularity AND
  honors the cost-discipline rule (never re-analyze the same event twice).

## Midterm strategy (draft brainstorm — pressure-test next session)
The Nov 2026 US midterm is strategically huge for this project. Initial read: **it does not change
the core strategy — it validates it, and raises the stakes on neutrality.**

1. **Elections concentrate our exact indicators** — gerrymandering (ele-07, already have TX+CA),
   voter-barrier laws (ele-08), election-authority control (ele-05), candidate/party bans (ele-04),
   refusal to certify or transfer (ele-06, our most severe electoral indicator). The run-up will
   generate a HIGH volume of qualifying events. Good for the product; high scrutiny.
2. **Maximum attention = maximum bias risk.** Everything we score will be read through a partisan
   lens; both sides will accuse us of favoring the other. This is when selection-discipline and the
   symmetry test matter most. The TX/CA gerrymander pairing (same indicator, both parties) is the
   template to lead with.
3. **Sequencing argument REINFORCED.** Build the boring, defensible method + a track record of
   even-handedness BEFORE scoring live election fights. Launch hot into the midterm with no track
   record → dismissed as a partisan gadget. Establish credibility first → the midterm is when
   journalists start citing us. So the midterm is a reason to nail neutrality first, not to rush.
4. **Pre-commit the hard election scenarios NOW** — how we'd score a refusal to certify, a
   contested result, a transfer dispute — *before* they happen, so no one can say we invented the
   rule to hit their side. Our `status` model (stood/blocked/reversed) already fits a contested
   aftermath.
5. **Keep a visible left/right balance ledger** during election season; lean hard on the
   coverage-imbalance flag. Symmetry has to be shown, not asserted.
6. **The "no rhetoric" rule is our shield.** Election season is peak fraud-claims and accusation;
   we score only observable acts (a specific law, a specific certification refusal), never claims
   or interpretations.

Open questions for next session:
- Launch timing relative to Nov 2026 — before (build credibility in-season) vs. quietly establish
  the method first and let the election be the citation moment?
- Do we make a dedicated, pre-committed "Election Integrity Watch" surface, or fold election events
  into the normal government trajectory?
- US-first vs. keep the global frame during the election (global frame is extra neutrality cover).

## Further roadmap / backlog (user-added)

### A. Auto-sourced historical context per live event (click-through precedents)
When we score a news event, don't stop at our own corpus parallel — also run a web search for
OTHER similar actions in history and surface them as a deeper layer the reader can click into from
the headline score, for detail and context.
- **Value:** turns each score into a mini history lesson ("banning an opposition party — here are
  documented instances: Germany 1933, others"), deepening credibility and education beyond our 11
  curated figures.
- **Two tiers:** (1) our CORPUS parallel — curated, scored, already computed (`parallels` field);
  (2) BROADER web-sourced precedents — illustrative context, generated on demand.
- **Guardrails (non-negotiable):** these precedents are CONTEXT, never part of the score (the
  number stays from the pre-committed rubric). Same sourcing bar as everything else (verifiable,
  credible). Search by the neutral indicator definition to avoid cherry-picking a leaning set.
  Cache per event (cost discipline — never re-run the same search).
- **Risk:** web precedents can be uneven/wrong and picking them is itself a selection surface —
  mitigate with the sourcing bar + indicator-driven (not vibe-driven) search.

### B. Open scoring matrix with knobs (adjustable weights/severities)
Let users adjust the dimensions' weights and severity values to their own perceptions and watch
scores recompute — radical transparency + engagement.
- **Why it's powerful for the core mission:** you can't credibly say "your weights are biased" if
  you can set your OWN and see the conclusions barely move. Best sub-feature: a **sensitivity
  view** showing the RANK ORDER is robust across wide weight settings (Stalin stays top, hybrids
  stay mid). That stability is a devastating rebuttal to bias accusations — arguably a headline
  trust feature, not just a toy.
- **The key tension + resolution:** this collides with Principle 4 (pre-commit + publish the
  weights). Resolution: keep ONE canonical, pre-committed **official score** — the immovable number
  journalists cite — and layer a clearly-watermarked **personal/sandbox view** on top ("your
  settings," never passable as the site's score). Never let a custom view masquerade as official.
- **Architecture is already ready:** `rubric.json` is data and `lib/score.mjs` / `lib/trajectory.mjs`
  are pure functions of (data, rubric). Swap in a user-modified rubric → everything recomputes
  instantly. So the knobs are technically cheap; the work is UI + guardrails, not engine.
- **Risk:** people tune to confirm bias and screenshot "under MY settings X is 90" as
  disinformation — mitigate with visible watermarking + the official number always shown alongside.
