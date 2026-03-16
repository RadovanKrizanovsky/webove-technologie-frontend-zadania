#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const {
  PROJECT_ROOT,
  walkDir,
  readFileSafe,
  relativeToRoot,
  ensureDir,
  writeJson,
} = require('./lib/fs-utils')
const { extractAssets } = require('./lib/html-inspector')

const REPORT_DIR = path.resolve(__dirname, 'reports')

function shouldKeep(filePath) {
  return filePath.endsWith('.html') && !filePath.includes(`${path.sep}vendor${path.sep}`)
}

function collectPages() {
  return walkDir(PROJECT_ROOT, { filter: shouldKeep })
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i)
  return match ? match[1].trim() : null
}

function classifyLink(link) {
  if (!link || /^javascript:/i.test(link)) return { type: 'invalid', target: link }
  if (/^https?:\/\//i.test(link)) return { type: 'external', target: link }
  if (link.startsWith('#')) return { type: 'fragment', target: link }
  return { type: 'internal', target: link }
}

function normalizeInternal(htmlFile, target) {
  const base = path.dirname(htmlFile)
  const normalized = target.split('#')[0]
  return path.normalize(path.resolve(base, normalized))
}

function buildGraph(htmlFile) {
  const html = readFileSafe(htmlFile)
  const assets = extractAssets(html)
  const title = extractTitle(html)
  const node = {
    file: htmlFile,
    title,
    anchors: [],
    external: [],
    fragments: [],
  }

  for (const link of assets.anchors) {
    const kind = classifyLink(link)
    if (kind.type === 'external') node.external.push(kind.target)
    if (kind.type === 'fragment') node.fragments.push(kind.target)
    if (kind.type === 'internal') {
      const resolved = normalizeInternal(htmlFile, kind.target)
      node.anchors.push(resolved)
    }
  }

  return node
}

function compileSiteMap(pages) {
  const nodes = pages.map((file) => buildGraph(file))
  const adjacency = {}
  for (const node of nodes) {
    const key = relativeToRoot(node.file)
    adjacency[key] = {
      title: node.title,
      links: node.anchors.map((target) => relativeToRoot(target)),
      external: [...new Set(node.external)].sort(),
      fragments: [...new Set(node.fragments)].sort(),
    }
  }
  return { nodes, adjacency }
}

function toMarkdown(adjacency) {
  const lines = ['# Site map', '', '| Page | Internal links | External |', '| --- | --- | --- |']
  for (const [page, data] of Object.entries(adjacency).sort()) {
    const internal = data.links.length ? data.links.join('<br>') : '—'
    const external = data.external.length ? data.external.join('<br>') : '—'
    lines.push(`| ${page} | ${internal} | ${external} |`)
  }
  return lines.join('\n')
}

function writeOutputs(result) {
  const payload = {
    generatedAt: new Date().toISOString(),
    pages: result.nodes.map((node) => ({
      file: relativeToRoot(node.file),
      title: node.title,
      internal: node.anchors.map((target) => relativeToRoot(target)),
      external: node.external,
      fragments: node.fragments,
    })),
    adjacency: Object.fromEntries(
      Object.entries(result.adjacency).map(([page, data]) => [page, data])
    ),
  }
  const jsonPath = path.join(REPORT_DIR, 'site-map.json')
  writeJson(jsonPath, payload)

  const markdown = toMarkdown(result.adjacency)
  const markdownPath = path.join(REPORT_DIR, 'site-map.md')
  ensureDir(REPORT_DIR)
  fs.writeFileSync(markdownPath, markdown, 'utf8')

  return { jsonPath, markdownPath }
}

function main() {
  const pages = collectPages()
  if (pages.length === 0) {
    console.warn('No HTML pages found for site map')
    return
  }
  const map = compileSiteMap(pages)
  const outputs = writeOutputs(map)
  console.log('Site map created:')
  console.log(`- ${relativeToRoot(outputs.jsonPath)}`)
  console.log(`- ${relativeToRoot(outputs.markdownPath)}`)
}

if (require.main === module) {
  main()
}
