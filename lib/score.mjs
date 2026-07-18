// Scoring engine for the Dictator Meter.
//
// Composites are DERIVED here from a figure's scored_actions + the rubric.
// Nothing is hand-entered. The same function scores a historical figure and a
// future live news event, because both are just a list of scored_actions.
//
// Usage:
//   import { scoreFigure } from './lib/score.mjs'
//   const computed = scoreFigure(figure, rubric, indicators)
//
// CLI (recompute one figure file and print the result):
//   node lib/score.mjs data/figures/stalin.json

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/** Build quick lookup maps from the rubric + catalog. */
function indexRubric(rubric, indicators) {
  const severityPoints = Object.fromEntries(
    rubric.severity_levels.map((s) => [s.id, s.points])
  )
  const indicatorById = Object.fromEntries(
    indicators.indicators.map((i) => [i.id, i])
  )
  return { severityPoints, indicatorById }
}

/** Which tier a 0-100 headline lands in. */
export function tierFor(headline, rubric) {
  const t = rubric.tiers.find((t) => headline >= t.min && headline <= t.max)
  return t ? t.name : null
}

/**
 * Compute dimension scores, the headline, and the tier for one figure.
 *
 * Dimension score uses a DIMINISHING-RETURNS (noisy-OR) model instead of a
 * capped sum. Each action's severity is read as p = points/100 -- the fraction
 * of the *remaining* freedom in that dimension it removes. Independent actions
 * combine as: score = 100 * (1 - product(1 - p_i)). So one Severe act lands ~50,
 * two ~68, a true Extreme ~85, and a dimension only approaches 100 with real
 * breadth. Repeatable indicators apply their factor `count` times, so many small
 * (Micro/Minor) captures still accumulate -- realistically, with each additional
 * one adding a little less than the last.
 *
 * Headline is the equal-weighted mean of the six dimension scores.
 */
export function scoreFigure(figure, rubric, indicators) {
  const { severityPoints, indicatorById } = indexRubric(rubric, indicators)

  // Track the surviving-freedom product per dimension (starts at 1 = untouched)
  // and how many indicators actually hit each dimension.
  const remaining = Object.fromEntries(rubric.dimensions.map((d) => [d.id, 1]))
  const hits = Object.fromEntries(rubric.dimensions.map((d) => [d.id, 0]))
  const unknown = []

  for (const a of figure.scored_actions || []) {
    const ind = indicatorById[a.indicator_id]
    if (!ind) {
      unknown.push(a.indicator_id)
      continue
    }
    const p = (severityPoints[ind.severity] || 0) / 100
    const factor = Math.pow(1 - p, a.count || 1)
    remaining[ind.dimension] *= factor
    hits[ind.dimension] += 1
  }

  // A dimension with NO matched indicator is "not assessed" (null), NOT a
  // literal 0 -- a coverage gap must not read as a pristine record. Assessed
  // dimensions get their diminishing-returns score.
  const dims = {}
  const notAssessed = []
  for (const id of Object.keys(remaining)) {
    if (hits[id] === 0) {
      dims[id] = null
      notAssessed.push(id)
    } else {
      dims[id] = Math.round(100 * (1 - remaining[id]))
    }
  }

  // Headline = weighted mean over ASSESSED dimensions only (weights renormalized).
  let wsum = 0
  let acc = 0
  for (const d of rubric.dimensions) {
    if (dims[d.id] === null) continue
    acc += dims[d.id] * d.weight
    wsum += d.weight
  }
  const headline = wsum > 0 ? Math.round(acc / wsum) : null

  if (unknown.length) {
    console.warn(`  ! ${figure.id}: unknown indicator ids: ${unknown.join(', ')}`)
  }

  return { dimensions: dims, headline, tier: tierFor(headline, rubric), notAssessed }
}

// --- CLI -------------------------------------------------------------------
const isMain = process.argv[1] === fileURLToPath(import.meta.url)
if (isMain) {
  const [, , figurePath] = process.argv
  if (!figurePath) {
    console.error('usage: node lib/score.mjs data/figures/<id>.json')
    process.exit(1)
  }
  const rubric = JSON.parse(readFileSync('data/rubric.json', 'utf8'))
  const indicators = JSON.parse(readFileSync('data/indicators.json', 'utf8'))
  const figure = JSON.parse(readFileSync(figurePath, 'utf8'))
  const computed = scoreFigure(figure, rubric, indicators)
  console.log(JSON.stringify(computed, null, 2))
}
