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
  { name: 'lingkungan', ext: '.md' },
]

const REQUIRED_FIELDS = {
  pariwisata: ['title', 'category', 'village', 'cover', 'shortDesc', 'lat', 'lng'],
  irigasi: ['name', 'saluranType', 'village', 'condition', 'lengthM', 'flowStatus', 'cover', 'lat', 'lng'],
  kesehatan: ['facilityName', 'type', 'village', 'cover', 'lat', 'lng'],
  festival: ['eventName', 'schedule', 'venue', 'description', 'cover'],
  kegiatan: ['title', 'author', 'date', 'cover', 'excerpt'],
  umkm: ['name', 'owner', 'kategori', 'village', 'contact', 'cover', 'lat', 'lng'],
  'air-tanah': ['title'],
  desa: ['name', 'description', 'image'],
  lingkungan: ['title', 'category', 'description'],
}

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
  const requiredFields = REQUIRED_FIELDS[col.name] ?? []
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
    const missingFields = requiredFields.filter(field => {
      const re = new RegExp(`^${field}:`, 'm')
      return !re.test(frontmatter)
    })
    if (missingFields.length > 0) {
      console.error(`❌ ${col.name}/${file}: missing required fields: ${missingFields.join(', ')}`)
      errors++
      continue
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

const gisManifest = path.join(CONTENT_DIR, '_gis_manifest.json')
if (fs.existsSync(gisManifest)) {
  console.log(`✅ _gis_manifest.json exists`)
} else {
  console.log(`⚠️  _gis_manifest.json not found (optional)`)
}

const changelogPath = path.join(CONTENT_DIR, 'changelog.json')
if (fs.existsSync(changelogPath)) {
  console.log(`✅ changelog.json exists`)
} else {
  console.log(`⚠️  changelog.json not found — run: node scripts/generate-changelog.mjs`)
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`)
if (errors > 0) process.exit(1)