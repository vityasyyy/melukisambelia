#!/usr/bin/env node
/**
 * Scans content/ frontmatter and app/ source for image references (paths starting
 * with /images/) and verifies each resolves to a file under public/.
 *
 * Run standalone: node scripts/check-images.mjs
 * Exits non-zero if any referenced image is missing.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const contentDir = path.join(root, 'content')
const appDir = path.join(root, 'app')
const componentsDir = path.join(root, 'components')

const IMG_RE = /["'`](\/images\/[^"'`)\s$]+\.(?:png|jpe?g|webp|svg|gif))/gi

function walk(dir, exts) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, exts))
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full)
  }
  return out
}

function collectFromFile(file) {
  const txt = fs.readFileSync(file, 'utf8')
  const refs = new Set()
  for (const m of txt.matchAll(IMG_RE)) refs.add(m[1])
  return [...refs]
}

const refs = []
const mdFiles = walk(contentDir, ['.md', '.mdx'])
for (const f of mdFiles) {
  for (const r of collectFromFile(f)) refs.push({ ref: r, source: path.relative(root, f) })
}
for (const f of [...walk(appDir, ['.tsx', '.ts']), ...walk(componentsDir, ['.tsx', '.ts'])]) {
  for (const r of collectFromFile(f)) refs.push({ ref: r, source: path.relative(root, f) })
}

const missing = refs.filter(({ ref }) => {
  const fsPath = path.join(publicDir, ref.replace(/^\//, ''))
  return !fs.existsSync(fsPath)
})

if (missing.length === 0) {
  console.log(`[check-images] OK — ${refs.length} image references all resolve.`)
  process.exit(0)
}

console.error(`[check-images] FAIL — ${missing.length} missing image(s):`)
for (const { ref, source } of missing) {
  console.error(`  ${ref}  (referenced in ${source})`)
}
process.exit(1)