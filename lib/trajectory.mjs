// Trajectory engine for the Dictator Meter (live phase).
//
// Turns a dated list of scored actions -- a historical figure's record OR a
// government's stream of news events -- into a time-ordered "creep line" plus
// an attempt-pressure signal. Same engine for both, because an event and a
// historical action are the same shape.
//
// Two things every action carries, kept deliberately separate:
//   - REALIZED impact: did a check actually fall? A blocked action scores low
//     here (the guardrail held). Controlled by `status`.
//   - ATTEMPT pressure: did they throw the punch? Every action counts fully
//     here regardless of status -- the jabs accumulate, repeats escalate.
//
// status factors apply ONLY to realized impact:
//   stood = 1.0 (full), reversed = 0.5 (damage done, then undone),
//   blocked = 0.25 (never took effect, but still a full attempt).

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const STATUS_FACTOR = { stood: 1, reversed: 0.5, blocked: 0.25 }

const sevPoints = (rubric) =>
  Object.fromEntries(rubric.severity_levels.map((s) => [s.id, s.points]))
const indexById = (indicators) =>
  Object.fromEntries(indicators.indicators.map((i) => [i.id, i]))

/**
 * Build a time-ordered trajectory from dated scored actions.
 * Returns { steps, current, attempts, pressure, repeats }.
 *   steps[i] = cumulative realized reading AFTER the i-th action.
 *   pressure = attempt count with repeated same-indicator jabs escalated.
 */
export function trajectory(actions, rubric, indicators) {
  const pts = sevPoints(rubric)
  const byId = indexById(indicators)
  const dimIds = rubric.dimensions.map((d) => d.id)

  const remaining = Object.fromEntries(dimIds.map((d) => [d, 1]))
  const hits = Object.fromEntries(dimIds.map((d) => [d, 0]))
  const attemptsByIndicator = {}

  const sorted = actions
    .filter((a) => byId[a.indicator_id])
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))

  const steps = []
  let pressure = 0

  for (const a of sorted) {
    const ind = byId[a.indicator_id]
    const p = (pts[ind.severity] || 0) / 100
    const factor = STATUS_FACTOR[a.status] ?? 1 // default: treat as stood

    // REALIZED: status-discounted, accumulates via diminishing returns.
    remaining[ind.dimension] *= Math.pow(1 - p * factor, a.count || 1)
    hits[ind.dimension] += 1

    // ATTEMPT PRESSURE: full credit regardless of status; repeats escalate.
    const repeat = (attemptsByIndicator[a.indicator_id] || 0) + 1
    attemptsByIndicator[a.indicator_id] = repeat
    pressure += 1 + 0.5 * (repeat - 1) // each repeat of the same jab adds half again

    // BREADTH INDEX: sum over ALL six dimensions / 6. In a trajectory an
    // untouched dimension is genuinely "not yet attacked" (a real 0-so-far),
    // not a coverage gap -- so this is monotonic non-decreasing and rewards
    // breadth. (This differs from the static figure snapshot in score.mjs,
    // which excludes unresearched dimensions.) PEAK = worst single dimension.
    let sum = 0, peak = 0
    for (const d of dimIds) {
      const v = hits[d] ? Math.round(100 * (1 - remaining[d])) : 0
      sum += v
      if (v > peak) peak = v
    }
    steps.push({
      date: a.date,
      indicator: a.indicator_id,
      status: a.status || 'stood',
      repeat,
      index: Math.round(sum / dimIds.length),
      peak,
    })
  }

  const repeats = Object.fromEntries(
    Object.entries(attemptsByIndicator).filter(([, n]) => n > 1)
  )
  const last = steps[steps.length - 1]
  return {
    steps,
    current: last ? last.index : null,
    peak: last ? last.peak : null,
    attempts: sorted.length,
    pressure: Math.round(pressure * 10) / 10,
    repeats,
  }
}

/** Group live events by their `government` field and score each as a trajectory. */
export function liveBoard(events, rubric, indicators) {
  const byGov = {}
  for (const e of events) (byGov[e.government] ||= []).push(e)
  return Object.entries(byGov)
    .map(([government, evs]) => ({
      government,
      ...trajectory(evs, rubric, indicators),
      events: evs.length,
    }))
    .sort((a, b) => (b.current ?? 0) - (a.current ?? 0))
}

// --- CLI demo --------------------------------------------------------------
const isMain = process.argv[1] === fileURLToPath(import.meta.url)
if (isMain) {
  const rubric = JSON.parse(readFileSync('data/rubric.json', 'utf8'))
  const indicators = JSON.parse(readFileSync('data/indicators.json', 'utf8'))

  // 1) Historical creep line, proving the accumulation math on dated actions.
  const milo = JSON.parse(readFileSync('data/figures/milosevic.json', 'utf8'))
  const t = trajectory(milo.scored_actions, rubric, indicators)
  console.log('=== CREEP LINE: Serbia under Milosevic (1989-2000) ===')
  console.log('  date        index  peak')
  for (const s of t.steps) {
    const bar = '#'.repeat(Math.round((s.index || 0) / 3))
    console.log(`  ${String(s.date).padEnd(10)} ${String(s.index).padStart(4)} ${String(s.peak).padStart(4)}  ${bar}`)
  }
  console.log(`  final index: ${t.current}, peak: ${t.peak}, attempts: ${t.attempts}, pressure: ${t.pressure}\n`)

  // 2) Live board, grouped by government.
  const batch = JSON.parse(readFileSync('data/events/prototype-2026-07.json', 'utf8'))
  const board = liveBoard(batch.events, rubric, indicators)
  console.log('=== LIVE BOARD (current governments, by realized reading) ===')
  const pad = (s, n) => String(s).padEnd(n)
  console.log(`  ${pad('idx', 5)}${pad('peak', 6)}${pad('ev', 4)}${pad('press', 7)}${pad('status', 9)}government`)
  for (const r of board) {
    const st = r.steps.map((s) => s.status).join(',')
    console.log(`  ${pad(r.current, 5)}${pad(r.peak, 6)}${pad(r.events, 4)}${pad(r.pressure, 7)}${pad(st, 9)}${r.government}`)
  }
}
