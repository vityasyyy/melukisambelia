#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

const REQUIRED_FIELDS = {
  pariwisata: ['title', 'category', 'village', 'cover', 'shortDesc', 'lat', 'lng'],
  irigasi: ['name', 'saluranType', 'village', 'condition', 'lengthM', 'flowStatus', 'cover', 'lat', 'lng'],
  kesehatan: ['facilityName', 'type', 'village', 'cover', 'lat', 'lng'],
  festival: ['eventName', 'schedule', 'venue', 'description', 'cover'],
  kegiatan: ['title', 'author', 'date', 'cover', 'excerpt'],
  umkm: ['name', 'owner', 'kategori', 'village', 'contact', 'cover', 'lat', 'lng'],
  lingkungan: ['title', 'category', 'description'],
  'air-tanah': ['title'],
  desa: ['name', 'description', 'image'],
  'profil-tim': ['name', 'cluster', 'year'],
}

let hasErrors = false
let totalFiles = 0
let totalErrors = 0

for (const [collection, fields] of Object.entries(REQUIRED_FIELDS)) {
  const dir = path.join(CONTENT_DIR, collection)
  if (!fs.existsSync(dir)) {
    console.warn(`⚠ Collection directory "${collection}" not found`)
    continue
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
  console.log(`\n📁 ${collection}/ (${files.length} files)`)

  for (const file of files) {
    totalFiles++
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!match) {
      console.error(`  ✗ ${file}: missing frontmatter`)
      hasErrors = true
      totalErrors++
      continue
    }

    const frontmatter = match[1]
    const missing = []
    for (const field of fields) {
      if (!frontmatter.includes(`${field}:`) && !frontmatter.includes(`${field} :`)) {
        missing.push(field)
      }
    }

    if (missing.length > 0) {
      console.error(`  ✗ ${file}: missing ${missing.join(', ')}`)
      hasErrors = true
      totalErrors += missing.length
    } else {
      console.log(`  ✓ ${file}`)
    }
  }
}

console.log(`\n${'='.repeat(50)}`)
console.log(`Total: ${totalFiles} files, ${totalErrors} errors`)

if (hasErrors) {
  console.error('\n❌ Content validation failed. Fix the errors above before deploying.')
  process.exit(1)
} else {
  console.log('\n✅ All content files have required fields.')
}