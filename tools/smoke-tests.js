#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const {
  PROJECT_ROOT,
  walkDir,
  readFileSafe,
  resolveAsset,
  relativeToRoot,
  statFile,
} = require('./lib/fs-utils')
const { summarize } = require('./lib/html-inspector')
const { printSummary, writeReport } = require('./lib/reporter')

const args = process.argv.slice(2)
const filters = args.filter((arg) => !arg.startsWith('--'))
const quiet = args.includes('--quiet')

function shouldKeep(filePath) {
  if (!filePath.endsWith('.html')) return false
  if (filePath.includes(`${path.sep}vendor${path.sep}`)) return false
  if (filters.length === 0) return true
  return filters.some((needle) => filePath.toLowerCase().includes(needle.toLowerCase()))
}

function collectHtmlFiles() {
  return walkDir(PROJECT_ROOT, {
    filter: shouldKeep,
  })
}

function findMissingAssets(htmlFile, assetGraph) {
  const missing = []
  for (const asset of assetGraph) {
    const stat = statFile(asset.resolved)
    if (!stat || !stat.isFile()) {
      missing.push({ ref: asset.ref, kind: asset.kind })
    }
  }
  return missing
}

function inspect(htmlFile) {
  const html = readFileSafe(htmlFile)
  const score = summarize(htmlFile, html)
  const missingAssets = findMissingAssets(htmlFile, score.assets.assetGraph)
  return {
    file: htmlFile,
    missingAssets,
    score,
  }
}

function main() {
  const htmlFiles = collectHtmlFiles()
  if (htmlFiles.length === 0) {
    console.warn('No HTML files found for inspection')
    return
  }

  const results = htmlFiles.map((file) => inspect(file))
  results.sort((a, b) => a.file.localeCompare(b.file))

  const persisted = writeReport(results)
  if (!quiet) {
    printSummary(results)
    console.log('Report saved to:')
    console.log(`- ${relativeToRoot(persisted.jsonPath)}`)
    console.log(`- ${relativeToRoot(persisted.markdownPath)}`)
    console.log(`- ${relativeToRoot(persisted.htmlPath)}`)
  }
}

if (require.main === module) {
  main()
}
