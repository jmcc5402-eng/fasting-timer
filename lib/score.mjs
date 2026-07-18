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
 * - Each scored_action contributes severityPoints[severity] * count to its dimension.
 * - Dimension score is the additive sum, clamped to 0-100.
 * - Headline is the weighted mean of the six dimension scores (equal weights in v1).
 */
export function scoreFigure(figure, rubric, indicators) {
  const { severityPoints, indicatorById } = indexRubric(rubric, indicators)

  const dims = Object.fromEntries(rubric.dimensions.map((d) => [d.id, 0]))
  const unknown = []

  for (const a of figure.scored_actions || []) {
    const ind = indicatorById[a.indicator_id]
    if (!ind) {
      unknown.push(a.indicator_id)
      continue
    }
    const pts = (severityPoints[ind.severity] || 0) * (a.count || 1)
    dims[ind.dimension] += pts
  }

  // Clamp each dimension to 0-100.
  for (const id of Object.keys(dims)) dims[id] = Math.min(100, dims[id])

  // Weighted mean for the headline.
  let headline = 0
  for (const d of rubric.dimensions) headline += dims[d.id] * d.weight
  headline = Math.round(headline)

  if (unknown.length) {
    console.warn(`  ! ${figure.id}: unknown indicator ids: ${unknown.join(', ')}`)
  }

  return { dimensions: dims, headline, tier: tierFor(headline, rubric) }
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
