import fs from 'fs'
import path from 'path'

function svg({
  width = 1200,
  height = 675,
  palette = ['#FFFCF7', '#FFDFC0', '#F0AC6D'],
  motif = 'batik_sambel',
  label = '',
}) {
  const [bg, mid, accent] = palette
  const gradientId = `g-${Math.random().toString(36).slice(2, 8)}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label.replace(/"/g, '&quot;')}">
  <defs>
    <linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="55%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
    <pattern id="motif-${gradientId}" width="200" height="200" patternUnits="userSpaceOnUse">
      <image href="/images/design-system/${motif}.svg" width="200" height="200" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})"/>
  <rect width="100%" height="100%" fill="url(#motif-${gradientId})" opacity="0.08"/>
  <circle cx="85%" cy="15%" r="120" fill="${accent}" opacity="0.25"/>
  <circle cx="15%" cy="85%" r="90" fill="${mid}" opacity="0.35"/>
  <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Gontserrat, sans-serif" font-weight="700" font-size="72" fill="#742D1B" opacity="0.85">${label}</text>
</svg>`
}

const out = 'public/images/content'
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync('public/images/placeholders', { recursive: true })

const images = [
  { file: 'hero-sambelia.svg', palette: ['#FFFCF7', '#F2EBD8', '#E3795C'], label: 'Sambelia', motif: 'batik_sambel', width: 1920, height: 1080 },
  { file: 'pariwisata-beach.svg', palette: ['#FEFDD7', '#B3E7FB', '#14A8E1'], label: 'Pantai', motif: 'bunga_sambel' },
  { file: 'pariwisata-desa.svg', palette: ['#FEFDD7', '#DEF6AE', '#99BA57'], label: 'Desa Wisata', motif: 'cincin_sambel' },
  { file: 'pariwisata-budaya.svg', palette: ['#FEFDD7', '#FFE09A', '#E3795C'], label: 'Budaya', motif: 'batik_sambel' },
  { file: 'pariwisata-air.svg', palette: ['#FEFDD7', '#B3E7FB', '#0873B9'], label: 'Taman Air', motif: 'bunga_sambel' },
  { file: 'irigasi-saluran.svg', palette: ['#FFFCF7', '#DEF6AE', '#667F37'], label: 'Irigasi', motif: 'cincin_sambel' },
  { file: 'kesehatan-fasilitas.svg', palette: ['#FFFCF7', '#DEF6AE', '#68794A'], label: 'Kesehatan', motif: 'bunga_sambel' },
  { file: 'festival-peresean.svg', palette: ['#FEFDD7', '#FEDF9F', '#E3795C'], label: 'Peresean', motif: 'batik_sambel' },
  { file: 'festival-gendang.svg', palette: ['#FEFDD7', '#FCBB84', '#742D1B'], label: 'Gendang Beleq', motif: 'batik_sambel' },
  { file: 'festival-pawai.svg', palette: ['#FEFDD7', '#FFE09A', '#F0AC6D'], label: 'Pawai Dulangan', motif: 'batik_sambel' },
  { file: 'kegiatan-ekowisata.svg', palette: ['#FFFCF7', '#DEF6AE', '#99BA57'], label: 'Ekowisata', motif: 'cincin_sambel' },
  { file: 'kegiatan-program.svg', palette: ['#FFFCF7', '#FFE09A', '#F0AC6D'], label: 'Program', motif: 'bunga_sambel' },
  { file: 'umkm-kerajinan.svg', palette: ['#FEFDD7', '#FFE09A', '#AF7E4F'], label: 'Kerajinan', motif: 'cincin_sambel' },
  { file: 'umkm-kuliner.svg', palette: ['#FEFDD7', '#FCBB84', '#E3795C'], label: 'Kuliner', motif: 'bunga_sambel' },
  { file: 'umkm-pertanian.svg', palette: ['#FFFCF7', '#DEF6AE', '#667F37'], label: 'Pertanian', motif: 'cincin_sambel' },
  { file: 'cerita-placeholder.svg', palette: ['#FFFCF7', '#EFE3AB', '#AF7E4F'], label: 'Cerita', motif: 'batik_sambel' },
]

for (const img of images) {
  fs.writeFileSync(path.join(out, img.file), svg(img))
}

fs.writeFileSync(
  'public/images/placeholders/tim.svg',
  svg({ palette: ['#FFFCF7', '#F2EBD8', '#742D1B'], label: 'Tim', motif: 'bunga_sambel' })
)

console.log('placeholders created')
