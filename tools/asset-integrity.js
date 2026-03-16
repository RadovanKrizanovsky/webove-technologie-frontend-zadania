#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const {
  PROJECT_ROOT,
  walkDir,
  relativeToRoot,
  hashFile,
  statFile,
  writeJson,
  readJson,
} = require('./lib/fs-utils')

const REPORT_PATH = path.resolve(__dirname, 'reports', 'asset-digests.json')
const DEFAULT_EXTENSIONS = new Set(['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2', '.ttf'])

function shouldKeep(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (!DEFAULT_EXTENSIONS.has(ext)) return false
  if (filePath.includes(`${path.sep}node_modules${path.sep}`)) return false
  return true
}

function collectAssets() {
  return walkDir(PROJECT_ROOT, { filter: shouldKeep })
}

function describe(filePath) {
  const stat = statFile(filePath)
  return {
    path: relativeToRoot(filePath),
    hash: hashFile(filePath),
    bytes: stat ? stat.size : 0,
    modified: stat ? stat.mtime.toISOString() : null,
  }
}

function createManifest(files) {
  const entries = files.map((file) => describe(file))
  entries.sort((a, b) => a.path.localeCompare(b.path))
  return {
    generatedAt: new Date().toISOString(),
    root: relativeToRoot(PROJECT_ROOT),
    count: entries.length,
    entries,
  }
}

function diffManifests(prev, next) {
  const before = new Map(prev.entries.map((item) => [item.path, item]))
  const after = new Map(next.entries.map((item) => [item.path, item]))

  const added = []
  const removed = []
  const changed = []

  for (const [pathKey, value] of after.entries()) {
    if (!before.has(pathKey)) {
      added.push(value)
    } else if (before.get(pathKey).hash !== value.hash) {
      changed.push({ before: before.get(pathKey), after: value })
    }
  }

  for (const [pathKey, value] of before.entries()) {
    if (!after.has(pathKey)) {
      removed.push(value)
    }
  }

  return { added, removed, changed }
}

function printSummary(manifest, diff) {
  console.log(`Assets: ${manifest.count}`)
  if (!diff) return
  console.log(`Added: ${diff.added.length}`)
  console.log(`Removed: ${diff.removed.length}`)
  console.log(`Changed: ${diff.changed.length}`)
}

function main() {
  const args = process.argv.slice(2)
  const comparePath = args.find((arg) => arg.startsWith('--compare='))
  const files = collectAssets()
  const manifest = createManifest(files)
  writeJson(REPORT_PATH, manifest)

  let diff = null
  if (comparePath) {
    const previous = readJson(comparePath.split('=')[1])
    if (previous) {
      diff = diffManifests(previous, manifest)
    }
  }

  printSummary(manifest, diff)

  if (diff) {
    const columns = (label, items) => {
      if (!items || items.length === 0) return '—'
      return items.slice(0, 5).map((item) => item.path || item.after.path).join(', ')
    }
    console.log(`Added sample: ${columns('added', diff.added)}`)
    console.log(`Removed sample: ${columns('removed', diff.removed)}`)
    console.log(`Changed sample: ${columns('changed', diff.changed)}`)
  }

  console.log(`Manifest saved to ${relativeToRoot(REPORT_PATH)}`)
}

if (require.main === module) {
  main()
}
