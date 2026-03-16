const fs = require('fs')
const path = require('path')
const { ensureDir, relativeToRoot } = require('./fs-utils')

const REPORT_DIR = path.resolve(__dirname, '..', 'reports')
const MARKS = { ok: '✔', warn: '!', fail: '✖' }

function formatRow({ file, missingAssets, score }) {
  const status = missingAssets.length === 0 ? MARKS.ok : MARKS.fail
  const accessibility = score.structure.missingAlt.length === 0 ? MARKS.ok : MARKS.warn
  return `${status} ${file} | assets:${missingAssets.length} | a11y:${accessibility}`
}

function printSummary(results) {
  const totals = {
    files: results.length,
    missingAssets: 0,
    missingAlt: 0,
  }

  for (const item of results) {
    totals.missingAssets += item.missingAssets.length
    totals.missingAlt += item.score.structure.missingAlt.length
  }

  console.log(`Checked ${totals.files} HTML files`)
  console.log(`Missing assets: ${totals.missingAssets}`)
  console.log(`Images without alt: ${totals.missingAlt}`)
  console.log('---')
  results.forEach((row) => console.log(formatRow(row)))
}

function writeReport(results) {
  ensureDir(REPORT_DIR)
  const timestamp = new Date().toISOString()
  const jsonPayload = {
    generatedAt: timestamp,
    totals: {
      files: results.length,
      missingAssets: results.reduce((sum, item) => sum + item.missingAssets.length, 0),
      missingAlt: results.reduce((sum, item) => sum + item.score.structure.missingAlt.length, 0),
    },
    results,
  }

  const jsonPath = path.join(REPORT_DIR, 'smoke-report.json')
  fs.writeFileSync(jsonPath, JSON.stringify(jsonPayload, null, 2), 'utf8')

  const markdown = [
    `# Smoke report (${timestamp})`,
    '',
    '| Status | File | Missing assets | Missing alt | Inline scripts |',
    '| --- | --- | --- | --- | --- |',
    ...results.map((item) => {
      const status = item.missingAssets.length === 0 ? MARKS.ok : MARKS.fail
      const missingAlt = item.score.structure.missingAlt.length
      const inlineScripts = item.score.assets.inlineScripts
      return `| ${status} | ${relativeToRoot(item.file)} | ${item.missingAssets.length} | ${missingAlt} | ${inlineScripts} |`
    }),
  ].join('\n')

  const markdownPath = path.join(REPORT_DIR, 'smoke-report.md')
  fs.writeFileSync(markdownPath, markdown, 'utf8')

  const htmlTemplate = buildHtmlReport(results, timestamp)
  const htmlPath = path.join(REPORT_DIR, 'smoke-report.html')
  fs.writeFileSync(htmlPath, htmlTemplate, 'utf8')

  return { jsonPath, markdownPath, htmlPath }
}

function buildHtmlReport(results, timestamp) {
  const rows = results
    .map((item) => {
      const status = item.missingAssets.length === 0 ? 'ok' : 'fail'
      const missingAlt = item.score.structure.missingAlt.length
      const inlineScripts = item.score.assets.inlineScripts
      return `<tr class="${status}"><td>${status}</td><td>${relativeToRoot(item.file)}</td><td>${item.missingAssets.length}</td><td>${missingAlt}</td><td>${inlineScripts}</td></tr>`
    })
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Smoke report</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; padding: 24px; background: #0f172a; color: #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 8px 10px; border-bottom: 1px solid #1e293b; text-align: left; }
    th { background: #1e293b; }
    tr.ok td { color: #a7f3d0; }
    tr.fail td { color: #fecdd3; }
  </style>
</head>
<body>
  <h1>Smoke report</h1>
  <p>Generated at ${timestamp}</p>
  <table>
    <thead>
      <tr><th>Status</th><th>File</th><th>Missing assets</th><th>Missing alt</th><th>Inline scripts</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`
}

module.exports = {
  REPORT_DIR,
  printSummary,
  writeReport,
}
