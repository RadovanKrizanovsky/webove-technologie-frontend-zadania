#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { PROJECT_ROOT, relativeToRoot, writeJson, ensureDir } = require('./lib/fs-utils')

const DATA_PATH = path.resolve(
  PROJECT_ROOT,
  'webove-technologie-1-zaverecne-zadanie',
  'Zaverecne_Sunava-Krizanovsky',
  'gameData',
  'game.json'
)

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8')
  return JSON.parse(raw)
}

function parseArgs() {
  const args = process.argv.slice(2)
  const runsArg = args.find((item) => item.startsWith('--runs='))
  const runs = runsArg ? Number(runsArg.split('=')[1]) : 1000
  const outArg = args.find((item) => item.startsWith('--out='))
  const outPath = outArg
    ? path.resolve(process.cwd(), outArg.split('=')[1])
    : path.resolve(__dirname, 'reports', 'simulation.json')
  return { runs, outPath }
}

function shuffle(items) {
  const clone = [...items]
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[clone[i], clone[j]] = [clone[j], clone[i]]
  }
  return clone
}

function simulateRun(items, bowls) {
  const hand = shuffle(items)
  let score = 0
  for (const item of hand) {
    const target = bowls.find((bowl) => bowl.content === item.type)
    if (target) {
      score += 1
    }
  }
  return score
}

function simulate(data, iterations = 500) {
  const items = data.items || []
  const bowls = data.bowls || []
  const runs = []
  for (let i = 0; i < iterations; i++) {
    runs.push(simulateRun(items, bowls))
  }
  const total = runs.reduce((sum, value) => sum + value, 0)
  const average = runs.length ? total / runs.length : 0
  const best = runs.length ? Math.max(...runs) : 0
  const worst = runs.length ? Math.min(...runs) : 0
  const buckets = buildHistogram(runs)
  return { average, best, worst, iterations, buckets }
}

function buildHistogram(values) {
  const map = new Map()
  values.forEach((value) => {
    map.set(value, (map.get(value) || 0) + 1)
  })
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([score, count]) => ({ score, count }))
}

function main() {
  const { runs, outPath } = parseArgs()
  const data = loadData()
  const result = simulate(data, runs)
  console.log(`Simulated ${result.iterations} rounds over ${data.items.length} items and ${data.bowls.length} bowls`)
  console.log(`Average correct placements: ${result.average.toFixed(2)}`)
  console.log(`Best: ${result.best} | Worst: ${result.worst}`)
  console.log(`Source data: ${relativeToRoot(DATA_PATH)}`)

  ensureDir(path.dirname(outPath))
  writeJson(outPath, { ...result, source: relativeToRoot(DATA_PATH) })
  console.log(`Saved histogram to ${relativeToRoot(outPath)}`)
}

if (require.main === module) {
  main()
}
