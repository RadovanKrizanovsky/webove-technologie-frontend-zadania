const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_EXCLUDES = new Set(['node_modules', '.git', '.idea', '.vscode', '__MACOSX'])

function walkDir(dir, opts = {}) {
  const { filter = () => true, excludes = DEFAULT_EXCLUDES } = opts
  const queue = [dir]
  const files = []

  while (queue.length) {
    const current = queue.pop()
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      if (excludes.has(entry.name)) continue
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        queue.push(fullPath)
      } else if (filter(fullPath)) {
        files.push(fullPath)
      }
    }
  }

  return files
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    return ''
  }
}

function resolveAsset(htmlFile, assetPath) {
  if (/^https?:\/\//i.test(assetPath)) return null
  const base = path.dirname(htmlFile)
  const cleaned = assetPath.split('?')[0].split('#')[0]
  return path.resolve(base, cleaned)
}

function relativeToRoot(filePath) {
  return path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/')
}

function statFile(filePath) {
  try {
    return fs.statSync(filePath)
  } catch (error) {
    return null
  }
}

function hashFile(filePath, algorithm = 'sha256') {
  const crypto = require('crypto')
  try {
    const buffer = fs.readFileSync(filePath)
    return crypto.createHash(algorithm).update(buffer).digest('hex')
  } catch (error) {
    return null
  }
}

function readJson(filePath) {
  const raw = readFileSafe(filePath)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

module.exports = {
  PROJECT_ROOT,
  DEFAULT_EXCLUDES,
  ensureDir,
  walkDir,
  readFileSafe,
  resolveAsset,
  relativeToRoot,
  statFile,
  hashFile,
  readJson,
  writeJson,
}
