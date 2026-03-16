const path = require('path')
const { resolveAsset } = require('./fs-utils')

function collectAttributes(html, tag, attribute) {
  const results = []
  const regex = new RegExp(`<${tag}[^>]*${attribute}=["']([^"']+)["'][^>]*>`, 'gi')
  let match
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1])
  }
  return results
}

function extractAssets(html) {
  const scripts = collectAttributes(html, 'script', 'src')
  const stylesheets = collectAttributes(html, 'link', 'href')
  const images = collectAttributes(html, 'img', 'src')
  const sources = collectAttributes(html, 'source', 'srcset')
  const anchors = collectAttributes(html, 'a', 'href')
  const inlineScripts = (html.match(/<script(?![^>]*src)[^>]*>/gi) || []).length
  const media = [...collectAttributes(html, 'audio', 'src'), ...collectAttributes(html, 'video', 'src')]

  return {
    scripts,
    stylesheets,
    images,
    sources,
    anchors,
    media,
    inlineScripts,
  }
}

function findMissingAlt(html) {
  const results = []
  const regex = /<img([^>]+?)>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const chunk = match[1]
    const srcMatch = chunk.match(/src=["']([^"']+)["']/i)
    const altMatch = chunk.match(/alt=["']([^"']*)["']/i)
    if (srcMatch && !altMatch) {
      results.push(srcMatch[1])
    }
  }
  return results
}

function scoreStructure(html) {
  const hasTitle = /<title>[^<]+<\/title>/i.test(html)
  const hasMetaCharset = /<meta[^>]+charset=/i.test(html)
  const hasMetaViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  const hasH1 = /<h1[^>]*>/i.test(html)
  const hasNav = /<nav[^>]*>/i.test(html)
  const hasMain = /<main[^>]*>|role=["']main["']/i.test(html)
  const missingAlt = findMissingAlt(html)

  return {
    hasTitle,
    hasMetaCharset,
    hasMetaViewport,
    hasH1,
    hasNav,
    hasMain,
    missingAlt,
  }
}

function computeAssetGraph(htmlFile, html) {
  const assets = extractAssets(html)
  const assetGraph = []
  const buckets = [
    ...assets.scripts.map((ref) => ({ kind: 'script', ref })),
    ...assets.stylesheets.map((ref) => ({ kind: 'style', ref })),
    ...assets.images.map((ref) => ({ kind: 'image', ref })),
    ...assets.sources.map((ref) => ({ kind: 'source', ref })),
    ...assets.media.map((ref) => ({ kind: 'media', ref })),
  ]

  for (const item of buckets) {
    const resolved = resolveAsset(htmlFile, item.ref)
    if (!resolved) continue
    assetGraph.push({ ...item, resolved })
  }

  return { ...assets, assetGraph }
}

function summarize(htmlFile, html) {
  const structure = scoreStructure(html)
  const assets = computeAssetGraph(htmlFile, html)
  return {
    structure,
    assets,
  }
}

module.exports = {
  collectAttributes,
  extractAssets,
  findMissingAlt,
  scoreStructure,
  computeAssetGraph,
  summarize,
}
