import { Resvg } from '@resvg/resvg-js'
import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'public', 'og.png')

const W = 1200
const H = 630

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFCF7"/>
      <stop offset="100%" stop-color="#FFDFC0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="#0873B9"/>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#E3795C"/>
  <text x="80" y="280" font-family="serif" font-size="72" font-weight="bold" fill="#742D1B">Melukis Sambelia</text>
  <text x="80" y="350" font-family="sans-serif" font-size="32" fill="#0873B9">KKN-PPM UGM · Sambelia, Lombok Timur</text>
  <text x="80" y="430" font-family="sans-serif" font-size="24" fill="#AF7E4F">Pariwisata berkelanjutan &amp; agropolitan</text>
</svg>`

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: W } })
const png = resvg.render().asPng()
fs.writeFileSync(OUT, png)
console.log(`Generated ${OUT} (${(png.length / 1024).toFixed(0)} KB)`)