import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { settingsSchema, gisMapSchema, gisCategorySchema, tentangSchema, type Settings, type GisMap, type GisCategory, type Tentang, type Desa } from '@/lib/schemas'
import { getCollection } from '@/lib/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getSettings(): Settings {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, '_settings.md'), 'utf8')
  const { data } = matter(raw)
  return settingsSchema.parse(data)
}

type PageName = 'home' | 'tentang' | 'pariwisata' | 'irigasi' | 'kesehatan' | 'umkm' | 'peta' | 'lingkungan' | 'airTanah' | 'festival' | 'cerita'

export function getPageSettings(page: PageName) {
  const s = getSettings()
  const defaults: Record<PageName, Record<string, string>> = {
    home: { heroKicker: '01 — TENTANG', heroTitle: 'Tentang Sambelia', heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.', seoTitle: 'Beranda', seoDescription: 'Portal komunitas KKN-PPM UGM Melukis Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa binaan.' },
    tentang: { heroKicker: 'TENTANG', heroTitle: 'Sambelia', heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pusat pengembangan pariwisata berkelanjutan dan kawasan agropolitan.', seoTitle: 'Tentang Sambelia', seoDescription: 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa binaan, dan fokus program Melukis Sambelia.', sectionGeografiKicker: '01 — GEOGRAFI', sectionGeografiTitle: 'Geografi & Demografi', sectionGeografiIntro: 'Letak, luas, dan penduduk Kecamatan Sambelia.', sectionDesaKicker: '02 — DESA BINAAN', sectionDesaTitle: 'Desa Binaan', sectionDesaIntro: 'Desa-desa yang menjadi fokus program Melukis Sambelia.', sectionPotensiKicker: '03 — POTENSI DESA', sectionPotensiTitle: 'Potensi Desa', sectionPotensiIntro: 'Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.' },
    pariwisata: { heroKicker: 'PARIWISATA', heroTitle: 'Potensi Wisata Sambelia', heroIntro: 'Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan.', seoTitle: 'Pariwisata Sambelia', seoDescription: 'Destinasi wisata unggulan di Desa Sugian dan Desa Labuhan Pandan, Kecamatan Sambelia, Lombok Timur.' },
    irigasi: { heroKicker: 'IRIGASI', heroTitle: 'Data Saluran Irigasi', heroIntro: 'Saluran irigasi di Kecamatan Sambelia dan kondisinya.', seoTitle: 'Data Irigasi Sambelia', seoDescription: 'Data saluran irigasi, kondisi saluran, dan peta titik rawan kekeringan di Kecamatan Sambelia.' },
    kesehatan: { heroKicker: 'KESEHATAN', heroTitle: 'Fasilitas & Program Kesehatan', heroIntro: 'Posyandu, puskesmas, dan program stunting di Sambelia.', seoTitle: 'Kesehatan Sambelia', seoDescription: 'Fasilitas kesehatan, posyandu, puskesmas, bidan, dan program stunting di Kecamatan Sambelia.' },
    umkm: { heroKicker: 'UMKM', heroTitle: 'UMKM Lokal Sambelia', heroIntro: 'Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia.', seoTitle: 'UMKM Lokal Sambelia', seoDescription: 'Produk kerajinan, kuliner, pertanian, dan UMKM lokal Kecamatan Sambelia, termasuk peyek mangrove.' },
    peta: { heroKicker: 'PETA', heroTitle: 'Peta Sambelia', heroIntro: 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.', seoTitle: 'Peta Sambelia', seoDescription: 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.' },
    lingkungan: { heroKicker: 'LINGKUNGAN', heroTitle: 'Vegetasi, Erosi & Blue Carbon', heroIntro: 'Analisis lingkungan Kecamatan Sambelia: indeks vegetasi, tingkat erosi, dan sebaran blue carbon di wilayah pesisir dan daratan.', seoTitle: 'Lingkungan', seoDescription: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.' },
    airTanah: { heroKicker: 'AIR & TANAH', heroTitle: 'Tinggi Muka Airtanah', heroIntro: 'Data TMA dan DHL dari survei lapangan di Kecamatan Sambelia.', seoTitle: 'Air & Tanah', seoDescription: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.' },
    festival: { heroKicker: 'FESTIVAL', heroTitle: 'Festival Pesona Sambelia', heroIntro: 'Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.', seoTitle: 'Festival Pesona Sambelia', seoDescription: 'Jadwal dan informasi Festival Pesona Sambelia: Peresean, Pawai Dulangan, Gendang Beleq, dan warisan budaya Sasak lainnya.' },
    cerita: { heroKicker: 'CERITA', heroTitle: 'Cerita dari Sambelia', heroIntro: 'Catatan lapangan, refleksi, dan kisah tim Melukis Sambelia.', seoTitle: 'Cerita dari Sambelia', seoDescription: 'Catatan lapangan, refleksi, dan kisah tim KKN-PPM UGM Melukis Sambelia dari Desa Sugian dan Labuhan Pandan.' },
  }
  const pageData = s.pages?.[page] as Record<string, string> | undefined
  return { ...defaults[page], ...(pageData ?? {}) } as Record<string, string>
}

export function getFooter() {
  const s = getSettings()
  return {
    tagline: s.footer?.tagline ?? 'Profil Desa Sambelia — KKN-PPM UGM 2026',
    copyright: s.footer?.copyright ?? '© 2026 KKN-PPM UGM Melukis Sambelia',
  }
}

export function getEmptyStates() {
  const s = getSettings()
  const defaults = {
    pariwisata: 'Belum ada data wisata. Tim akan menambahkan segera.',
    irigasi: 'Belum ada data irigasi. Tim akan menambahkan segera.',
    kesehatan: 'Belum ada data kesehatan. Tim akan menambahkan segera.',
    umkm: 'Belum ada data UMKM. Tim akan menambahkan segera.',
    cerita: 'Belum ada cerita. Tim akan menambahkan segera.',
    festival: 'Belum ada data festival. Tim akan menambahkan segera.',
    lingkungan: 'Data peta lingkungan dari cluster GIS akan diunggah.',
    airTanah: 'Data TMA dari cluster air tanah akan diunggah.',
  }
  return { ...defaults, ...s.emptyStates }
}

export function getJejakiCards() {
  const s = getSettings()
  const defaults = [
    { href: '/pariwisata', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/air-tanah', title: 'Air & Tanah', desc: 'Data sumber daya air & tanah.', accent: '#3B82F6' },
    { href: '/lingkungan', title: 'Lingkungan', desc: 'Kelestarian lingkungan Sambelia.', accent: '#22C55E' },
    { href: '/festival', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/umkm', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]
  return s.jejakiCards ?? defaults
}

export function getGisCategory(category: string): GisCategory {
  const file = path.join(CONTENT_DIR, `_gis_${category}.md`)
  if (!fs.existsSync(file)) return { title: '', description: '', credit: '' }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return gisCategorySchema.parse(data)
}

export function getGisMap(): GisMap {
  const file = path.join(CONTENT_DIR, '_gismap.md')
  if (!fs.existsSync(file)) return { title: 'Peta GIS Tim', description: '', credit: '' }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return gisMapSchema.parse(data)
}

export function getTentang(): Tentang {
  const file = path.join(CONTENT_DIR, '_tentang.md')
  if (!fs.existsSync(file)) return { geographyProse: '', potensiDesa: [] }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return tentangSchema.parse(data)
}

export function getDesa(): (Desa & { slug: string })[] {
  return getCollection('desa')
}