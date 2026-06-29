import { z } from 'zod'

export const pariwisataSchema = z.object({
  title: z.string(),
  category: z.enum(['Pantai', 'Budaya', 'Desa Wisata', 'Air', 'Trekking']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  shortDesc: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  facilities: z.array(z.string()).default([]),
  accessNotes: z.string().default(''),
})

export const irigasiSchema = z.object({
  name: z.string(),
  saluranType: z.enum(['Primer', 'Sekunder', 'Tersier']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  condition: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat']),
  lengthM: z.number().nonnegative(),
  flowStatus: z.enum(['Mengalir', 'Kering', 'Mengalir Sebagian']),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const kesehatanSchema = z.object({
  facilityName: z.string(),
  type: z.enum(['Posyandu', 'Puskesmas', 'Bidan', 'Polides']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  cadresCount: z.number().int().nonnegative().default(0),
  stuntingProgram: z.boolean().default(false),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const festivalSchema = z.object({
  eventName: z.string(),
  schedule: z.string(),
  venue: z.string(),
  description: z.string(),
  cover: z.string(),
  registrationUrl: z.string().url().optional(),
  body: z.string().default(''),
})

export const ceritaSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  cover: z.string(),
  excerpt: z.string(),
  body: z.string(),
})

export const umkmSchema = z.object({
  name: z.string(),
  owner: z.string(),
  kategori: z.enum(['Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'lainnya']),
  contact: z.string(),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const pageHeroSchema = z.object({
  heroKicker: z.string().default(''),
  heroTitle: z.string().default(''),
  heroIntro: z.string().default(''),
  seoTitle: z.string().default(''),
  seoDescription: z.string().default(''),
})

export const tentangPageSchema = pageHeroSchema.extend({
  sectionGeografiKicker: z.string().default('01 — GEOGRAFI'),
  sectionGeografiTitle: z.string().default('Geografi & Demografi'),
  sectionGeografiIntro: z.string().default('Letak, luas, dan penduduk Kecamatan Sambelia.'),
  sectionDesaKicker: z.string().default('02 — DESA BINAAN'),
  sectionDesaTitle: z.string().default('Desa Binaan'),
  sectionDesaIntro: z.string().default('Desa-desa yang menjadi fokus program Melukis Sambelia.'),
  sectionPotensiKicker: z.string().default('03 — POTENSI DESA'),
  sectionPotensiTitle: z.string().default('Potensi Desa'),
  sectionPotensiIntro: z.string().default('Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.'),
})

export const settingsSchema = z.object({
  heroImage: z.string(),
  heroTagline: z.string(),
  stats: z.object({
    luas: z.string(),
    penduduk: z.string(),
    desaBinaan: z.string(),
    tahunProgram: z.string(),
  }),
  festivalDates: z.string(),
  socials: z.object({
    instagram: z.string().optional().default(''),
    tiktok: z.string().optional().default(''),
  }),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
  homepageIntros: z.object({
    jejakiKicker: z.string().default('02 — JEJAKI'),
    jejakiTitle: z.string().default('Jejaki Sambelia'),
    jejakiIntro: z.string().default(''),
    wisataKicker: z.string().default('03 — WISATA UNGGULAN'),
    wisataTitle: z.string().default('Destinasi Pilihan'),
    wisataIntro: z.string().default('Destinasi wisata unggulan di Desa Sugian dan Labuhan Pandan.'),
    festivalKicker: z.string().default('04 — FESTIVAL'),
    festivalTitle: z.string().default('Festival Pesona Sambelia'),
    festivalIntro: z.string().default('Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.'),
    umkmKicker: z.string().default('05 — UMKM'),
    umkmTitle: z.string().default('UMKM Spotlight'),
    umkmIntro: z.string().default('Kerajinan, kuliner, dan produk lokal andalan masyarakat Sambelia.'),
  }).optional().default({
    jejakiKicker: '02 — JEJAKI',
    jejakiTitle: 'Jejaki Sambelia',
    jejakiIntro: '',
    wisataKicker: '03 — WISATA UNGGULAN',
    wisataTitle: 'Destinasi Pilihan',
    wisataIntro: 'Destinasi wisata unggulan di Desa Sugian dan Labuhan Pandan.',
    festivalKicker: '04 — FESTIVAL',
    festivalTitle: 'Festival Pesona Sambelia',
    festivalIntro: 'Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.',
    umkmKicker: '05 — UMKM',
    umkmTitle: 'UMKM Spotlight',
    umkmIntro: 'Kerajinan, kuliner, dan produk lokal andalan masyarakat Sambelia.',
  }),
  pages: z.object({
    home: pageHeroSchema.optional().default({
      heroKicker: '01 — TENTANG',
      heroTitle: 'Tentang Sambelia',
      heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.',
      seoTitle: 'Beranda',
      seoDescription: 'Portal komunitas KKN-PPM UGM Melukis Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa binaan.',
    }),
    tentang: tentangPageSchema.optional().default({
      heroKicker: 'TENTANG',
      heroTitle: 'Sambelia',
      heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pusat pengembangan pariwisata berkelanjutan dan kawasan agropolitan.',
      seoTitle: 'Tentang Sambelia',
      seoDescription: 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa binaan, dan fokus program Melukis Sambelia.',
      sectionGeografiKicker: '01 — GEOGRAFI',
      sectionGeografiTitle: 'Geografi & Demografi',
      sectionGeografiIntro: 'Letak, luas, dan penduduk Kecamatan Sambelia.',
      sectionDesaKicker: '02 — DESA BINAAN',
      sectionDesaTitle: 'Desa Binaan',
      sectionDesaIntro: 'Desa-desa yang menjadi fokus program Melukis Sambelia.',
      sectionPotensiKicker: '03 — POTENSI DESA',
      sectionPotensiTitle: 'Potensi Desa',
      sectionPotensiIntro: 'Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.',
    }),
    pariwisata: pageHeroSchema.optional().default({
      heroKicker: 'PARIWISATA',
      heroTitle: 'Potensi Wisata Sambelia',
      heroIntro: 'Destinasi unggulan di Desa Sugian dan Desa Labuhan Pandan.',
      seoTitle: 'Pariwisata Sambelia',
      seoDescription: 'Destinasi wisata unggulan di Desa Sugian dan Desa Labuhan Pandan, Kecamatan Sambelia, Lombok Timur.',
    }),
    irigasi: pageHeroSchema.optional().default({
      heroKicker: 'IRIGASI',
      heroTitle: 'Data Saluran Irigasi',
      heroIntro: 'Saluran irigasi di Kecamatan Sambelia dan kondisinya.',
      seoTitle: 'Data Irigasi Sambelia',
      seoDescription: 'Data saluran irigasi, kondisi saluran, dan peta titik rawan kekeringan di Kecamatan Sambelia.',
    }),
    kesehatan: pageHeroSchema.optional().default({
      heroKicker: 'KESEHATAN',
      heroTitle: 'Fasilitas & Program Kesehatan',
      heroIntro: 'Posyandu, puskesmas, dan program stunting di Sambelia.',
      seoTitle: 'Kesehatan Sambelia',
      seoDescription: 'Fasilitas kesehatan, posyandu, puskesmas, bidan, dan program stunting di Kecamatan Sambelia.',
    }),
    umkm: pageHeroSchema.optional().default({
      heroKicker: 'UMKM',
      heroTitle: 'UMKM Lokal Sambelia',
      heroIntro: 'Kerajinan, kuliner, dan produk lokal yang menjadi andalan masyarakat Sambelia.',
      seoTitle: 'UMKM Lokal Sambelia',
      seoDescription: 'Produk kerajinan, kuliner, pertanian, dan UMKM lokal Kecamatan Sambelia, termasuk peyek mangrove.',
    }),
    peta: pageHeroSchema.optional().default({
      heroKicker: 'PETA',
      heroTitle: 'Peta Sambelia',
      heroIntro: 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.',
      seoTitle: 'Peta Sambelia',
      seoDescription: 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.',
    }),
    lingkungan: pageHeroSchema.optional().default({
      heroKicker: 'LINGKUNGAN',
      heroTitle: 'Vegetasi, Erosi & Blue Carbon',
      heroIntro: 'Analisis lingkungan Kecamatan Sambelia: indeks vegetasi, tingkat erosi, dan sebaran blue carbon di wilayah pesisir dan daratan.',
      seoTitle: 'Lingkungan',
      seoDescription: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.',
    }),
    airTanah: pageHeroSchema.optional().default({
      heroKicker: 'AIR & TANAH',
      heroTitle: 'Tinggi Muka Airtanah',
      heroIntro: 'Data TMA dan DHL dari survei lapangan di Kecamatan Sambelia.',
      seoTitle: 'Air & Tanah',
      seoDescription: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.',
    }),
    festival: pageHeroSchema.optional().default({
      heroKicker: 'FESTIVAL',
      heroTitle: 'Festival Pesona Sambelia',
      heroIntro: 'Peresean, Pawai Dulangan, dan Gendang Beleq — warisan budaya Sasak yang hidup di Sambelia.',
      seoTitle: 'Festival Pesona Sambelia',
      seoDescription: 'Jadwal dan informasi Festival Pesona Sambelia: Peresean, Pawai Dulangan, Gendang Beleq, dan warisan budaya Sasak lainnya.',
    }),
    cerita: pageHeroSchema.optional().default({
      heroKicker: 'CERITA',
      heroTitle: 'Cerita dari Sambelia',
      heroIntro: 'Catatan lapangan, refleksi, dan kisah tim Melukis Sambelia.',
      seoTitle: 'Cerita dari Sambelia',
      seoDescription: 'Catatan lapangan, refleksi, dan kisah tim KKN-PPM UGM Melukis Sambelia dari Desa Sugian dan Labuhan Pandan.',
    }),
  }).optional(),
  jejakiCards: z.array(z.object({
    href: z.string(),
    title: z.string(),
    desc: z.string(),
    accent: z.string(),
    image: z.string().optional(),
  })).optional().default([
    { href: '/pariwisata', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/air-tanah', title: 'Air & Tanah', desc: 'Data sumber daya air & tanah.', accent: '#3B82F6' },
    { href: '/lingkungan', title: 'Lingkungan', desc: 'Kelestarian lingkungan Sambelia.', accent: '#22C55E' },
    { href: '/festival', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/umkm', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]),
  footer: z.object({
    tagline: z.string().default('Profil Desa Sambelia — KKN-PPM UGM 2026'),
    copyright: z.string().default('© 2026 KKN-PPM UGM Melukis Sambelia'),
  }).optional().default({
    tagline: 'Profil Desa Sambelia — KKN-PPM UGM 2026',
    copyright: '© 2026 KKN-PPM UGM Melukis Sambelia',
  }),
  emptyStates: z.object({
    pariwisata: z.string().default('Belum ada data wisata. Tim akan menambahkan segera.'),
    irigasi: z.string().default('Belum ada data irigasi. Tim akan menambahkan segera.'),
    kesehatan: z.string().default('Belum ada data kesehatan. Tim akan menambahkan segera.'),
    umkm: z.string().default('Belum ada data UMKM. Tim akan menambahkan segera.'),
    cerita: z.string().default('Belum ada cerita. Tim akan menambahkan segera.'),
    festival: z.string().default('Belum ada data festival. Tim akan menambahkan segera.'),
    lingkungan: z.string().default('Data peta lingkungan dari cluster GIS akan diunggah.'),
    airTanah: z.string().default('Data TMA dari cluster air tanah akan diunggah.'),
  }).optional().default({
    pariwisata: 'Belum ada data wisata. Tim akan menambahkan segera.',
    irigasi: 'Belum ada data irigasi. Tim akan menambahkan segera.',
    kesehatan: 'Belum ada data kesehatan. Tim akan menambahkan segera.',
    umkm: 'Belum ada data UMKM. Tim akan menambahkan segera.',
    cerita: 'Belum ada cerita. Tim akan menambahkan segera.',
    festival: 'Belum ada data festival. Tim akan menambahkan segera.',
    lingkungan: 'Data peta lingkungan dari cluster GIS akan diunggah.',
    airTanah: 'Data TMA dari cluster air tanah akan diunggah.',
  }),
})

export const gisCategorySchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  credit: z.string().default(''),
})

export const gisMapSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
})

export type Pariwisata = z.infer<typeof pariwisataSchema>
export type Irigasi = z.infer<typeof irigasiSchema>
export type Kesehatan = z.infer<typeof kesehatanSchema>
export type Festival = z.infer<typeof festivalSchema>
export type Cerita = z.infer<typeof ceritaSchema>
export type Umkm = z.infer<typeof umkmSchema>
export type Settings = z.infer<typeof settingsSchema>
export type GisMap = z.infer<typeof gisMapSchema>
export type GisCategory = z.infer<typeof gisCategorySchema>

export const airTanahMeasurementSchema = z.object({
  location: z.string(),
  date: z.string(),
  tmaMeters: z.number(),
  dhlMsiemens: z.number(),
})

export const airTanahSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
  measurements: z.array(airTanahMeasurementSchema).optional().default([]),
})

export type AirTanah = z.infer<typeof airTanahSchema>
export type AirTanahMeasurement = z.infer<typeof airTanahMeasurementSchema>

export const desaSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
})

export const tentangSchema = z.object({
  geographyProse: z.string(),
  potensiDesa: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional().default([]),
})

export type Desa = z.infer<typeof desaSchema>
export type Tentang = z.infer<typeof tentangSchema>