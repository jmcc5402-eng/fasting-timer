# CLAUDE.md — The Dictator Meter

A methodology-driven website that scores authoritarian **actions** (not people) against a
published, pre-committed rubric and compares them to historical regimes. Credibility rests on
applying one transparent standard identically to everyone. **Start each session in
`docs/ROADMAP.md`** (status + open threads).

## Working with the project owner — READ THIS
The owner was a software developer years ago: solid on fundamentals (databases, storage, cloud)
but out of practice, and new to using Claude Code for a full greenfield build (has used it for
dashboards and slide decks, not whole app ecosystems). Therefore:

- **Explain any unfamiliar or newer technology in plain terms the first time it comes up** —
  frameworks, tools, cloud services, libraries. Assume no current knowledge of modern web tooling.
  Don't just name-drop "Astro" / "Vercel" / "edge function" — say what it is, why we'd use it, and
  what the alternative is.
- **Proactively coach on best practices — briefly, in plain language — whenever we:**
  - touch **git** (branch, commit, push, PR, merge, rebase): say what the command does and why,
    and explicitly flag anything hard to undo *before* doing it.
  - hit **context / session management**: remind the owner when and why to clear context
    (`/clear`), what auto-compaction is, and that it's safe because our real state lives in the repo.
- **Explain commands in plain language.** The owner copy-pastes and follows along; they are not
  hand-writing code.
- **The remote environment is ephemeral** — `git push` is the save button. Keep durable state in
  the repo (commits + `docs/ROADMAP.md`), commit in logical chunks with clear messages, and push
  regularly so nothing is lost.
- Development happens on branch `claude/phone-setup-1ia68z` (per current task); never push to
  `main` without explicit permission.

## Key files / layout
- `data/rubric.json` — dimensions, 0–100 scale, tiers, severity levels, scoring rules (pre-committed).
- `data/indicators.json` — the Action/Indicator Catalog (pre-committed severities).
- `lib/score.mjs` — static figure scoring; `lib/trajectory.mjs` — live creep line + attempt-pressure.
  Both are **pure functions of (data, rubric)** — swapping the rubric recomputes everything.
- `data/figures/*.json` — historical dataset (11 sourced figures).
- `data/events/*.json` — live-phase prototypes (global batch + US federal).
- `docs/event-sourcing-protocol.md` — the live method (selection is rule-driven, not editorial).
- `EDITOR.md` — the editorial persona and non-negotiable scoring rules.
- `docs/ROADMAP.md` — status, open threads, backlog. **Start here.**

## Core principles (see EDITOR.md for the full list)
Score the action not the person; observable sourced actions only (no rhetoric/intent); pre-commit
the weights; apply the symmetry test; publish the reasoning trail; one stated premise —
*unchecked concentration of power is dangerous regardless of who holds it.*
