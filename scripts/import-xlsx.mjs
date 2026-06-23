import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_DIR = path.join(process.cwd(), 'content')

function sheetToRows(sheet) {
  return XLSX.utils.sheet_to_json(sheet, { defval: '' })
}

function parseNumber(val) {
  if (typeof val === 'number') return val
  const cleaned = String(val).replace(/[^\d.-]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function importDemografi(rows) {
  const profilePath = path.join(CONTENT_DIR, '_sambelia-profile.md')
  let existing = {}
  if (fs.existsSync(profilePath)) {
    const raw = fs.readFileSync(profilePath, 'utf8')
    const match = raw.match(/^---\n([\s\S]*?)\n---/m)
    if (match) {
      const yaml = match[1]
      const lines = yaml.split('\n')
      for (const line of lines) {
        const m = line.match(/^(\w+):\s*(.*)$/)
        if (m) existing[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  }
  const totalPenduduk = rows.find((r) => String(r.Indikator || r.indikator || '').toLowerCase().includes('penduduk'))
  const luas = rows.find((r) => String(r.Indikator || r.indikator || '').toLowerCase().includes('luas'))
  const kepadatan = rows.find((r) => String(r.Indikator || r.indikator || '').toLowerCase().includes('kepadatan'))
  const frontmatter = {
    luas: luas ? String(luas.Nilai || luas.nilai || luas.Jumlah || '') : existing.luas || '±X km²',
    penduduk: totalPenduduk ? String(totalPenduduk.Nilai || totalPenduduk.nilai || totalPenduduk.Jumlah || '') : existing.penduduk || '±X jiwa',
    kepadatan: kepadatan ? String(kepadatan.Nilai || kepadatan.nilai || kepadatan.Jumlah || '') : existing.kepadatan || '±X/km²',
    desaBinaan: '2',
    tahunProgram: '2026',
    mataPencaharian: 'Pertanian, Perikanan, UMKM',
    iklim: 'Tropis',
    ketinggian: '±X mdpl',
  }
  let yaml = '---\n'
  for (const [k, v] of Object.entries(frontmatter)) {
    yaml += `${k}: "${v}"\n`
  }
  yaml += '---\n'
  yaml += '\nProfil Kecamatan Sambelia berdasarkan data BPS dan sekdes.\n'
  fs.writeFileSync(profilePath, yaml)
  console.log(`  Wrote _sambelia-profile.md`)
}

function importIrigasi(rows) {
  const dir = path.join(CONTENT_DIR, 'irigasi')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  let count = 0
  for (const row of rows) {
    const name = row.Nama || row.name || row.Saluran || `Saluran ${count + 1}`
    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const frontmatter = {
      name: String(name),
      saluranType: row.Tipe || row.tipe || row.SaluranType || 'Primer',
      village: row.Desa || row.desa || row.Village || 'lainnya',
      condition: row.Kondisi || row.kondisi || row.Condition || 'Baik',
      lengthM: parseNumber(row.Panjang || row.panjang || row.LengthM || 0),
      flowStatus: row.Status || row.status || row.FlowStatus || 'Mengalir',
      cover: '/images/content/nelayan.jpg',
      body: row.Keterangan || row.keterangan || row.Catatan || `Data saluran ${name}.`,
      lat: parseNumber(row.Lat || row.lat || -8.35),
      lng: parseNumber(row.Lng || row.lng || 116.84),
    }
    let md = '---\n'
    for (const [k, v] of Object.entries(frontmatter)) {
      md += `${k}: ${typeof v === 'string' ? `"${v}"` : v}\n`
    }
    md += '---\n'
    fs.writeFileSync(path.join(dir, `${slug}.md`), md)
    count++
  }
  console.log(`  Wrote ${count} irigasi entries`)
}

function importKesehatan(rows) {
  const dir = path.join(CONTENT_DIR, 'kesehatan')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  let count = 0
  for (const row of rows) {
    const name = row.Nama || row.name || row.Fasilitas || `Fasilitas ${count + 1}`
    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const frontmatter = {
      facilityName: String(name),
      type: row.Tipe || row.tipe || row.Type || 'Posyandu',
      village: row.Desa || row.desa || row.Village || 'lainnya',
      cadresCount: parseNumber(row.Kader || row.kader || row.CadresCount || 0),
      stuntingProgram: String(row.Stunting || row.stunting || '').toLowerCase().includes('ya') || String(row.Stunting || row.stunting || '').toLowerCase() === 'true',
      cover: '/images/content/imlek-1.jpg',
      body: row.Keterangan || row.keterangan || row.Catatan || `Data fasilitas ${name}.`,
      lat: parseNumber(row.Lat || row.lat || -8.35),
      lng: parseNumber(row.Lng || row.lng || 116.84),
    }
    let md = '---\n'
    for (const [k, v] of Object.entries(frontmatter)) {
      md += `${k}: ${typeof v === 'string' ? `"${v}"` : v}\n`
    }
    md += '---\n'
    fs.writeFileSync(path.join(dir, `${slug}.md`), md)
    count++
  }
  console.log(`  Wrote ${count} kesehatan entries`)
}

function importPariwisata(rows) {
  const dir = path.join(CONTENT_DIR, 'pariwisata')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  let count = 0
  for (const row of rows) {
    const title = row.Nama || row.name || row.Destinasi || `Destinasi ${count + 1}`
    const slug = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const frontmatter = {
      title: String(title),
      category: row.Kategori || row.kategori || row.Category || 'Pantai',
      village: row.Desa || row.desa || row.Village || 'lainnya',
      cover: row.Cover || '/images/content/nelayan-landscape.jpg',
      gallery: [],
      shortDesc: row.Deskripsi || row.deskripsi || row.ShortDesc || `Destinasi wisata ${title}.`,
      body: row.Konten || row.konten || row.Body || `Detail destinasi ${title}.`,
      lat: parseNumber(row.Lat || row.lat || -8.36),
      lng: parseNumber(row.Lng || row.lng || 116.85),
      facilities: String(row.Fasilitas || row.fasilitas || '').split(',').map((s) => s.trim()).filter(Boolean),
      accessNotes: String(row.Akses || row.akses || row.AccessNotes || ''),
    }
    let mdx = '---\n'
    for (const [k, v] of Object.entries(frontmatter)) {
      if (Array.isArray(v)) {
        mdx += `${k}:\n`
        for (const item of v) mdx += `  - "${item}"\n`
      } else {
        mdx += `${k}: ${typeof v === 'string' ? `"${v}"` : v}\n`
      }
    }
    mdx += '---\n'
    mdx += `\n${frontmatter.shortDesc}\n`
    fs.writeFileSync(path.join(dir, `${slug}.mdx`), mdx)
    count++
  }
  console.log(`  Wrote ${count} pariwisata entries`)
}

const SHEET_MAPPERS = {
  demografi: importDemografi,
  irigasi: importIrigasi,
  kesehatan: importKesehatan,
  pariwisata: importPariwisata,
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log('No data/ folder found. Create it and drop .xlsx files there.')
    console.log('Expected sheets: demografi, irigasi, kesehatan, pariwisata')
    process.exit(0)
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.xlsx') || f.endsWith('.xls'))
  if (files.length === 0) {
    console.log('No .xlsx files found in data/.')
    process.exit(0)
  }

  for (const file of files) {
    console.log(`\nProcessing ${file}...`)
    const wb = XLSX.readFile(path.join(DATA_DIR, file))
    for (const sheetName of wb.SheetNames) {
      const key = sheetName.toLowerCase().replace(/[^a-z]/g, '')
      const mapper = SHEET_MAPPERS[key]
      if (mapper) {
        console.log(`  Sheet: ${sheetName}`)
        const rows = sheetToRows(wb.Sheets[sheetName])
        mapper(rows)
      } else {
        console.log(`  Sheet: ${sheetName} (no mapper, skipping)`)
      }
    }
  }
  console.log('\nDone. Run `npm run build` to regenerate the site.')
}

main()