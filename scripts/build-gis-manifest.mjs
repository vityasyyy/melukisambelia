import fs from 'fs'
import path from 'path'

const GIS_DIR = path.join(process.cwd(), 'public', 'gis')
const OUT_FILE = path.join(GIS_DIR, 'manifest.json')

const CATEGORIES = ['umum', 'air', 'irigasi', 'vegetasi']

function classifyFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.geojson' || ext === '.json') return 'geojson'
  if (ext === '.pdf') return 'pdf'
  if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) return 'image'
  return null
}

function readDescription(dir, baseName) {
  const descPath = path.join(dir, `${baseName}.txt`)
  if (fs.existsSync(descPath)) return fs.readFileSync(descPath, 'utf8').trim()
  return ''
}

function collectFiles() {
  const files = []
  for (const category of CATEGORIES) {
    const dir = path.join(GIS_DIR, category)
    if (!fs.existsSync(dir)) continue
    const entries = fs.readdirSync(dir)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      if (!stat.isFile()) continue
      const type = classifyFile(fullPath)
      if (!type) continue
      const baseName = path.basename(entry, path.extname(entry))
      const description = readDescription(dir, baseName)
      files.push({
        type,
        category,
        name: baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        url: `/gis/${category}/${entry}`,
        description,
      })
    }
  }
  return files
}

const files = collectFiles()
const manifest = {
  title: 'Peta GIS Tim Melukis Sambelia',
  description: 'Peta tematik hasil kerja tim Melukis Sambelia.',
  credit: 'Tim GIS Melukis Sambelia',
  files,
}

fs.mkdirSync(GIS_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, JSON.stringify(manifest, null, 2))
console.log(`GIS manifest written with ${files.length} files.`)
