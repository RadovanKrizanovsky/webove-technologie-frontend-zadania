#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const {
  PROJECT_ROOT,
  relativeToRoot,
  statFile,
  writeJson,
  ensureDir,
} = require('./lib/fs-utils')

const REPORT_PATH = path.resolve(__dirname, 'reports', 'regression-report.json')

const scenarios = [
  {
    name: 'cv',
    root: 'cv',
    required: ['index.html', 'web/cv.html', 'web/image.html', 'web/schedule.html', 'vendor/style.css'],
    optional: ['fonts', 'images'],
  },
  {
    name: 'dom',
    root: 'dom',
    required: ['index.html', 'js/main.js', 'vendor/style.css'],
    optional: [],
  },
  {
    name: 'xml',
    root: 'xml',
    required: ['index.html', 'second.html', 'js/main.js', 'js/component.js', 'js/data.js', 'xml/z03.xml'],
    optional: ['zadanie3Webte1XMLmaterial.xml'],
  },
  {
    name: 'map',
    root: 'map',
    required: ['index.html', 'map.html', 'map.js', 'style.css', 'js/main.js', 'galery.json'],
    optional: ['js/photos'],
  },
  {
    name: 'exam1',
    root: 'exam1',
    required: ['index.html', 'style.css'],
    optional: ['images'],
  },
  {
    name: 'exam2',
    root: 'exam2',
    required: ['index.html', 'main.js', 'style.css'],
    optional: [],
  },
  {
    name: 'game',
    root: path.join('game', 'game'),
    required: [
      'index.html',
      'authors.html',
      'tutorial.html',
      'sources.html',
      'js/script.js',
      'css/style.css',
      'gameData/game.json',
      'service-worker.js',
      'sw.js',
    ],
    optional: ['icons', 'src'],
  },
]

function fileStatus(base, relativePath) {
  const absolute = path.resolve(PROJECT_ROOT, base, relativePath)
  const stat = statFile(absolute)
  return {
    path: relativeToRoot(absolute),
    exists: Boolean(stat),
    bytes: stat ? stat.size : 0,
  }
}

function folderStatus(base, name) {
  const absolute = path.resolve(PROJECT_ROOT, base, name)
  const stat = statFile(absolute)
  return {
    path: relativeToRoot(absolute),
    exists: Boolean(stat && stat.isDirectory()),
  }
}

function runScenario(scenario) {
  const required = scenario.required.map((item) => fileStatus(scenario.root, item))
  const optional = scenario.optional.map((item) => folderStatus(scenario.root, item))
  const missing = required.filter((item) => !item.exists)
  const size = required.reduce((sum, item) => sum + item.bytes, 0)

  return {
    name: scenario.name,
    root: relativeToRoot(path.resolve(PROJECT_ROOT, scenario.root)),
    required,
    optional,
    missing,
    size,
    ok: missing.length === 0,
  }
}

function printResult(result) {
  const label = result.ok ? 'OK ' : 'WARN'
  console.log(`${label} ${result.name} (${result.size} bytes)`) 
  if (!result.ok) {
    result.missing.forEach((item) => console.log(`  - missing ${item.path}`))
  }
}

function main() {
  const results = scenarios.map(runScenario)
  results.forEach(printResult)

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      scenarios: results.length,
      ok: results.filter((item) => item.ok).length,
      bytes: results.reduce((sum, item) => sum + item.size, 0),
      missing: results.reduce((sum, item) => sum + item.missing.length, 0),
    },
    results,
  }

  ensureDir(path.dirname(REPORT_PATH))
  writeJson(REPORT_PATH, summary)
  console.log(`Report saved to ${relativeToRoot(REPORT_PATH)}`)
}

if (require.main === module) {
  main()
}
