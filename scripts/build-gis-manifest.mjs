import fs from 'fs'
import path from 'path'

const GIS_DIR = path.join(process.cwd(), 'public', 'gis')
const manifest = []

if (fs.existsSync(GIS_DIR)) {
  for (const file of fs.readdirSync(GIS_DIR)) {
    if (file === 'manifest.json') continue
    const ext = path.extname(file).slice(1).toLowerCase()
    const type = ext === 'geojson' || ext === 'json' ? 'geojson' : ext === 'pdf' ? 'pdf' : 'image'
    manifest.push({ type, name: file.replace(/\.[^.]+$/, ''), url: `/gis/${file}` })
  }
}

if (!fs.existsSync(GIS_DIR)) fs.mkdirSync(GIS_DIR, { recursive: true })
fs.writeFileSync(path.join(GIS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`Wrote gis manifest: ${manifest.length} files`)