# Event-Sourcing Protocol (the live method)

This is the live-phase counterpart to the rubric. The rubric says *how* an action is
scored; this says *which* actions get scored and *how they are sourced* — the part where
selection bias hides. Modeled on unbiasedheadlines.com: one agent, one fixed standard,
applied identically to every event, with every claim linked to its source.

## 1. Selection is rule-driven, not editorial

The site's core defense is **not** "we scored this fairly." It is: *we did not choose to
score this — the catalog did.*

- **Indicator-triggered inclusion.** An event is scored **if and only if** it matches a
  pre-committed indicator in `data/indicators.json` AND clears the sourcing bar below. We
  never add an event because it is "important," "alarming," or "newsworthy." The fixed
  catalog is the filter, set before we know who triggers it.
- **The matched indicator is the reason for inclusion**, and it is printed in the event's
  reasoning trail. Inclusion is therefore auditable: anyone can check that the event maps
  to the indicator claimed.
- **Comprehensive within intake, not curated.** Within a defined full-spectrum intake over
  a period, we score *every* qualifying action. Scoring one faction's actions more than
  another's then shows up as a measurable coverage gap we can flag — not a hidden choice.

## 2. What qualifies

Only an **observable, verifiable action**: a law signed, an order or decree issued, an
office abolished, a court defied, a person detained, an outlet shut. Explicitly OUT of scope:

- Rhetoric, speeches, statements of intent, campaign promises.
- Polls, opinion, "X is becoming authoritarian" interpretations.
- Anything not sourced to a document or credible reporting.

## 3. Sourcing bar

- The **primary artifact** where one exists (the actual law, executive order, ruling,
  official gazette) — the ground truth.
- **Plus at least two independent credible outlets**, ideally spanning the political
  spectrum. When only one side of the spectrum covered it, we still may score it but we
  **flag the coverage imbalance** (per the unbiasedheadlines balance rule).
- Every source is stored on the scored action (title, url, publisher), exactly like the
  historical figures.

## 4. Document the non-events

When something is widely *called* authoritarian but matches no indicator — because it is
rhetoric, an interpretation, or unsourced — we log it as an **excluded item with the reason
for exclusion**. This paper trail is the proof of discipline and pre-empts "why didn't you
cover X?"

## 5. The symmetry test (unchanged)

Before an event's score is final: *would this identical action, taken by the opposing
faction, score exactly the same?* If not, fix the rubric, not the case.

## 6. Naming

Score the action and name the concrete instrument (the law, order, office, court) and the
actor where sourced — but keep the framing on the **behavior**, never a verdict on the
person. (This revises the historical-set rule 8, which barred living figures; live scoring
requires them, and the discipline that protects us is selection + sourcing + symmetry, not
anonymity.)

## 7. Cost discipline (carried from the sustainment model)

Never re-analyze the same event twice: each scored event is cached by a stable event id.
Re-scoring only happens on a documented, dated score change (see `changelog.json`).

## 8. Output shape

Each scored event reuses the figure `scored_actions` shape (see `schema/figure.schema.json`),
so an event and a historical action are the same object to the scoring engine. An event also
carries its closest **historical parallel** (a figure id + the shared indicator) for the
"placed beside history" comparison.
