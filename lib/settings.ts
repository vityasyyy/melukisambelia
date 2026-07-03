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

type PageName = 'home' | 'tentang' | 'pariwisata' | 'irigasi' | 'kesehatan' | 'umkm' | 'peta' | 'lingkungan' | 'airTanah' | 'festival' | 'kegiatan' | 'profilTim'

const PAGE_EXTRA_DEFAULTS: Record<string, Record<string, string>> = {
  tentang: {
    sectionGeografiKicker: '01 — GEOGRAFI',
    sectionGeografiTitle: 'Geografi & Demografi',
    sectionGeografiIntro: 'Letak, luas, dan penduduk Kecamatan Sambelia.',
    sectionGeografiFootnote: 'Data geografi berdasarkan profil Kecamatan Sambelia.',
    sectionDesaKicker: '02 — DESA & KELURAHAN',
    sectionDesaTitle: 'Desa & Kelurahan',
    sectionDesaIntro: 'Desa-desa dan kelurahan yang ada di Kecamatan Sambelia.',
    sectionPotensiKicker: '03 — POTENSI DESA',
    sectionPotensiTitle: 'Potensi Desa',
    sectionPotensiIntro: 'Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.',
  },
  peta: {
    dataSectionTitle: 'Lokasi Titik Data',
    gisSectionTitle: 'Peta Tematik GIS',
  },
  lingkungan: {
    dataSectionTitle: 'Analisis Lingkungan',
    linkToPeta: 'Lihat di Peta Interaktif →',
  },
}

export function getPageSettings(page: PageName) {
  const s = getSettings()
  const defaults: Record<PageName, Record<string, string>> = {
    home: { heroKicker: '01 — TENTANG', heroTitle: 'Tentang Sambelia', heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — pariwisata, pertanian, dan warisan budaya Sasak.', seoTitle: 'Beranda', seoDescription: 'Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa.' },
    tentang: { heroKicker: 'TENTANG', heroTitle: 'Sambelia', heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pariwisata, pertanian, dan warisan budaya Sasak.', seoTitle: 'Tentang Sambelia', seoDescription: 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa, dan potensi daerah.', sectionGeografiKicker: '01 — GEOGRAFI', sectionGeografiTitle: 'Geografi & Demografi', sectionGeografiIntro: 'Letak, luas, dan penduduk Kecamatan Sambelia.', sectionDesaKicker: '02 — DESA & KELURAHAN', sectionDesaTitle: 'Desa & Kelurahan', sectionDesaIntro: 'Desa-desa dan kelurahan yang ada di Kecamatan Sambelia.', sectionPotensiKicker: '03 — POTENSI DESA', sectionPotensiTitle: 'Potensi Desa', sectionPotensiIntro: 'Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.' },
    pariwisata: { heroKicker: 'PESONA PESISIR', heroTitle: 'Pesona Pesisir & Perbukitan', heroIntro: 'Temukan keindahan tersembunyi di ujung timur Lombok.', seoTitle: 'Pariwisata Sambelia', seoDescription: 'Destinasi wisata unggulan di Kecamatan Sambelia, Lombok Timur.', sectionKicker: 'WISATA', sectionTitle: 'Destinasi Wisata', sectionIntro: 'Jelajahi destinasi wisata unggulan di Kecamatan Sambelia.' },
    irigasi: { heroKicker: 'AIR MENGALIR', heroTitle: 'Air Mengalir, Sawah Menghijau', heroIntro: 'Saluran irigasi yang menjadi nadi pertanian Sambelia.', seoTitle: 'Data Irigasi Sambelia', seoDescription: 'Data saluran irigasi, kondisi saluran, dan peta titik rawan kekeringan di Kecamatan Sambelia.', sectionKicker: 'IRIGASI', sectionTitle: 'Data Saluran Irigasi', sectionIntro: 'Saluran irigasi di Kecamatan Sambelia dan kondisinya.' },
    kesehatan: { heroKicker: 'SEHAT BERSAMA', heroTitle: 'Sehat Bersama, Kuat Bersama', heroIntro: 'Layanan kesehatan yang menjangkau setiap desa.', seoTitle: 'Kesehatan Sambelia', seoDescription: 'Fasilitas kesehatan, posyandu, puskesmas, bidan, dan program stunting di Kecamatan Sambelia.', sectionKicker: 'KESEHATAN', sectionTitle: 'Fasilitas & Program Kesehatan', sectionIntro: 'Posyandu, puskesmas, dan program stunting di Sambelia.' },
    umkm: { heroKicker: 'DARI DAPUR KE DUNIA', heroTitle: 'Dari Dapur ke Dunia', heroIntro: 'Rasa dan karya lokal Sambelia yang menembus pasar.', seoTitle: 'UMKM Lokal Sambelia', seoDescription: 'Produk kerajinan, kuliner, pertanian, dan UMKM lokal Kecamatan Sambelia.', sectionKicker: 'UMKM', sectionTitle: 'UMKM Lokal Sambelia', sectionIntro: 'Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia.' },
    peta: { heroKicker: 'PETA', heroTitle: 'Peta Sambelia', heroIntro: 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.', seoTitle: 'Peta Sambelia', seoDescription: 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.' },
    lingkungan: { heroKicker: 'HIJAU, BIRU, LESTARI', heroTitle: 'Hijau, Biru, Lestari', heroIntro: 'Menjaga keseimbangan alam untuk generasi mendatang.', seoTitle: 'Lingkungan', seoDescription: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.', sectionKicker: 'LINGKUNGAN', sectionTitle: 'Analisis Lingkungan', sectionIntro: 'Data analisis lingkungan dan peta tematik Kecamatan Sambelia.' },
    airTanah: { heroKicker: 'AIR & TANAH', heroTitle: 'Tinggi Muka Airtanah', heroIntro: 'Data TMA dan DHL dari survei lapangan di Kecamatan Sambelia.', seoTitle: 'Air & Tanah', seoDescription: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.' },
    festival: { heroKicker: 'FESTIVAL', heroTitle: 'Festival Pesona Sambelia', heroIntro: 'Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.', seoTitle: 'Festival Pesona Sambelia', seoDescription: 'Jadwal dan informasi Festival Pesona Sambelia: Peresean, Pawai Dulangan, Gendang Beleq, dan warisan budaya Sasak lainnya.' },
    kegiatan: { heroKicker: 'JEJAK LANGKAH', heroTitle: 'Jejak Langkah Kita', heroIntro: 'Catatan perjalanan dan kerja bersama masyarakat.', seoTitle: 'Kegiatan Sambelia', seoDescription: 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.', sectionKicker: 'KEGIATAN', sectionTitle: 'Kegiatan Sambelia', sectionIntro: 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.' },
    profilTim: { heroKicker: 'PROFIL TIM', heroTitle: 'Tim Melukis Sambelia', heroIntro: 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.', seoTitle: 'Profil Tim', seoDescription: 'Tim KKN-PPM UGM Melukis Sambelia — anggota, peran, dan cerita di balik layanan.', sectionKicker: 'TIM', sectionTitle: 'Anggota Tim', sectionIntro: 'Kenali wajah-wajah di balik KKN-PPM UGM Melukis Sambelia.' },
  }
  const pageData = s.pages?.[page] as Record<string, string> | undefined
  const extra = PAGE_EXTRA_DEFAULTS[page] ?? {}
  return { ...defaults[page], ...extra, ...(pageData ?? {}) } as Record<string, string>
}

export function getFooter() {
  const s = getSettings()
  return {
    tagline: s.footer?.tagline ?? 'Portal Kecamatan Sambelia, Lombok Timur',
    copyright: s.footer?.copyright ?? '© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia',
  }
}

export function getEmptyStates() {
  const s = getSettings()
  const defaults = {
    pariwisata: 'Belum ada data wisata. Data akan ditambahkan segera.',
    irigasi: 'Belum ada data irigasi. Data akan ditambahkan segera.',
    kesehatan: 'Belum ada data kesehatan. Data akan ditambahkan segera.',
    umkm: 'Belum ada data UMKM. Data akan ditambahkan segera.',
    kegiatan: 'Belum ada kegiatan. Informasi akan ditambahkan segera.',
    festival: 'Belum ada data festival. Data akan ditambahkan segera.',
    lingkungan: 'Data peta lingkungan akan diunggah.',
    airTanah: 'Data TMA akan diunggah.',
    petaDataEmpty: 'Belum ada data lokasi. Tim akan menambahkan segera.',
    petaGisEmpty: 'Peta GIS belum tersedia.',
    airTanahDataEmpty: 'Data TMA dari cluster air tanah akan diunggah.',
    profilTim: 'Belum ada data anggota tim. Data akan ditambahkan segera.',
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