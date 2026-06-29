import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'content')

const COLLECTIONS = [
  { name: 'pariwisata', ext: '.mdx' },
  { name: 'irigasi', ext: '.md' },
  { name: 'kesehatan', ext: '.md' },
  { name: 'festival', ext: '.md' },
  { name: 'kegiatan', ext: '.mdx' },
  { name: 'umkm', ext: '.md' },
  { name: 'air-tanah', ext: '.md', dir: 'air-tanah' },
  { name: 'desa', ext: '.md' },
]

let errors = 0
let warnings = 0

for (const col of COLLECTIONS) {
  const dir = path.join(CONTENT_DIR, col.dir ?? col.name)
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  ${col.name}: directory not found, skipping`)
    warnings++
    continue
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith(col.ext))
  if (files.length === 0) {
    console.log(`⚠️  ${col.name}: no ${col.ext} files found`)
    warnings++
    continue
  }
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    if (!raw.trim().startsWith('---')) {
      console.error(`❌ ${col.name}/${file}: missing frontmatter delimiter`)
      errors++
      continue
    }
    const endMatch = raw.indexOf('---', 3)
    if (endMatch === -1) {
      console.error(`❌ ${col.name}/${file}: unclosed frontmatter`)
      errors++
      continue
    }
    const frontmatter = raw.slice(3, endMatch).trim()
    const dateLineMatch = frontmatter.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)
    if (dateLineMatch) {
      console.warn(`⚠️  ${col.name}/${file}: date value may be unquoted — wrap in quotes: date: '${dateLineMatch[1]}'`)
      warnings++
    }
    const dateTimeMatch = frontmatter.match(/^date:\s*\d{4}-\d{2}-\d{2}T/m)
    if (dateTimeMatch) {
      console.warn(`⚠️  ${col.name}/${file}: datetime value may be unquoted — wrap in quotes`)
      warnings++
    }
    console.log(`✅ ${col.name}/${file}`)
  }
}

const settingsPath = path.join(CONTENT_DIR, '_settings.md')
if (fs.existsSync(settingsPath)) {
  console.log(`✅ settings/_settings.md exists`)
} else {
  console.error(`❌ _settings.md not found`)
  errors++
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`)
if (errors > 0) process.exit(1)