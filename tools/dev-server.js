#!/usr/bin/env node
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const zlib = require('zlib')
const { PROJECT_ROOT, relativeToRoot } = require('./lib/fs-utils')

const args = process.argv.slice(2)
const portArg = args.find((value) => /^--port=/.test(value))
const dirArg = args.find((value) => /^--dir=/.test(value))
const spa = args.includes('--spa')

const PORT = portArg ? Number(portArg.split('=')[1]) : 4173
const ROOT = dirArg ? path.resolve(process.cwd(), dirArg.split('=')[1]) : PROJECT_ROOT

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

function negotiateCompression(req, res) {
  const acceptEncoding = req.headers['accept-encoding'] || ''
  if (acceptEncoding.includes('br')) return 'br'
  if (acceptEncoding.includes('gzip')) return 'gzip'
  return null
}

function sendCompressed(res, stream, encoding) {
  if (encoding === 'br') {
    stream.pipe(zlib.createBrotliCompress()).pipe(res)
  } else if (encoding === 'gzip') {
    stream.pipe(zlib.createGzip()).pipe(res)
  } else {
    stream.pipe(res)
  }
}

function serveFile(filePath, req, res) {
  const stat = fs.statSync(filePath)
  if (stat.isDirectory()) {
    return serveDirectory(filePath, req, res)
  }

  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'application/octet-stream'
  const encoding = negotiateCompression(req, res)
  const headers = { 'Content-Type': contentType }
  if (encoding) headers['Content-Encoding'] = encoding
  res.writeHead(200, headers)
  const stream = fs.createReadStream(filePath)
  sendCompressed(res, stream, encoding)
}

function serveDirectory(dirPath, req, res) {
  const indexPath = path.join(dirPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    return serveFile(indexPath, req, res)
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  const links = entries
    .map((entry) => {
      const suffix = entry.isDirectory() ? '/' : ''
      const name = entry.name + suffix
      return `<li><a href="${name}">${name}</a></li>`
    })
    .join('')
  res.end(`<h1>Index of ${relativeToRoot(dirPath)}</h1><ul>${links}</ul>`)
}

function notFound(res, message = 'Not found') {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(message)
}

function handleRequest(req, res) {
  const parsed = url.parse(req.url)
  const safePath = parsed.pathname.replace(/\.\./g, '')
  let candidate = path.join(ROOT, safePath)

  if (!fs.existsSync(candidate)) {
    if (spa) {
      const fallback = path.join(ROOT, 'index.html')
      if (fs.existsSync(fallback)) {
        return serveFile(fallback, req, res)
      }
    }
    return notFound(res)
  }

  serveFile(candidate, req, res)
}

function start() {
  const server = http.createServer(handleRequest)
  server.listen(PORT, () => {
    console.log(`Dev server ready on http://localhost:${PORT}`)
    console.log(`Serving from ${ROOT}`)
  })
}

if (require.main === module) {
  start()
}
