import { z } from 'zod'

export const pariwisataSchema = z.object({
  title: z.string(),
  category: z.enum(['Pantai', 'Budaya', 'Desa Wisata', 'Air', 'Trekking']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  shortDesc: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  facilities: z.array(z.string()).default([]),
  accessNotes: z.string().default(''),
  googleMapsUrl: z.string().optional(),
  order: z.number().int().default(0),
})

export const irigasiSchema = z.object({
  name: z.string(),
  saluranType: z.enum(['Primer', 'Sekunder', 'Tersier']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']),
  condition: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat']),
  lengthM: z.number().nonnegative(),
  flowStatus: z.enum(['Mengalir', 'Kering', 'Mengalir Sebagian']),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  googleMapsUrl: z.string().optional(),
  order: z.number().int().default(0),
})

export const kesehatanSchema = z.object({
  facilityName: z.string(),
  type: z.enum(['Posyandu', 'Puskesmas', 'Bidan', 'Polides']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']),
  cadresCount: z.number().int().nonnegative().default(0),
  stuntingProgram: z.boolean().default(false),
  cover: z.string(),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  googleMapsUrl: z.string().optional(),
  order: z.number().int().default(0),
})

export const festivalSchema = z.object({
  eventName: z.string(),
  schedule: z.coerce.string(),
  venue: z.string(),
  description: z.string(),
  cover: z.string(),
  registrationUrl: z.string().optional(),
  body: z.string().default(''),
  order: z.number().int().default(0),
})

export const kegiatanSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.coerce.string(),
  cover: z.string(),
  excerpt: z.string(),
  body: z.string(),
  order: z.number().int().default(0),
})

export const umkmSchema = z.object({
  name: z.string(),
  owner: z.string(),
  kategori: z.enum(['Kuliner', 'Jasa', 'Kerajinan', 'Pertanian', 'Perikanan', 'Lainnya']),
  village: z.enum(['Sugian', 'Labuhan Pandan', 'Sambelia', 'Rarang', 'Sambelia Rarang Selatan', 'Tembayar', 'Paok Motong', 'lainnya']),
  contact: z.string(),
  cover: z.string(),
  gallery: z.array(z.string()).default([]),
  body: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  googleMapsUrl: z.string().optional(),
  order: z.number().int().default(0),
})

export const pageHeroSchema = z.object({
  heroKicker: z.string().default(''),
  heroTitle: z.string().default(''),
  heroIntro: z.string().default(''),
  seoTitle: z.string().default(''),
  seoDescription: z.string().default(''),
  sectionKicker: z.string().optional(),
  sectionTitle: z.string().optional(),
  sectionIntro: z.string().optional(),
})

export const tentangPageSchema = pageHeroSchema.extend({
  sectionGeografiKicker: z.string().default('01 — GEOGRAFI'),
  sectionGeografiTitle: z.string().default('Geografi & Demografi'),
  sectionGeografiIntro: z.string().default('Letak, luas, dan penduduk Kecamatan Sambelia.'),
  sectionGeografiFootnote: z.string().default('Data geografi berdasarkan profil Kecamatan Sambelia.'),
  sectionDesaKicker: z.string().default('02 — DESA & KELURAHAN'),
  sectionDesaTitle: z.string().default('Desa & Kelurahan'),
  sectionDesaIntro: z.string().default('Desa-desa dan kelurahan yang ada di Kecamatan Sambelia.'),
  sectionPotensiKicker: z.string().default('03 — POTENSI DESA'),
  sectionPotensiTitle: z.string().default('Potensi Desa'),
  sectionPotensiIntro: z.string().default('Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.'),
})

export const petaPageSchema = pageHeroSchema.extend({
  dataSectionTitle: z.string().default('Lokasi Titik Data'),
  gisSectionTitle: z.string().default('Peta Tematik GIS'),
})

export const lingkunganPageSchema = pageHeroSchema.extend({
  dataSectionTitle: z.string().default('Analisis Lingkungan'),
  linkToPeta: z.string().default('Lihat di Peta Interaktif →'),
  sectionKicker: z.string().optional(),
  sectionTitle: z.string().optional(),
  sectionIntro: z.string().optional(),
})

export const settingsSchema = z.object({
  heroImage: z.string(),
  heroTagline: z.string(),
  stats: z.object({
    luas: z.string(),
    penduduk: z.string(),
    desaKelurahan: z.string(),
    kabupaten: z.string(),
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
    aboutKicker: z.string().default('01 — TENTANG'),
    aboutTitle: z.string().default('Tentang Sambelia'),
    aboutIntro: z.string().default('Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.'),
    scrollPrompt: z.string().default('Gulir untuk menjelajah'),
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
  }).optional().default(() => ({
    aboutKicker: '01 — TENTANG',
    aboutTitle: 'Tentang Sambelia',
    aboutIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan.',
    scrollPrompt: 'Gulir untuk menjelajah',
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
  })),
  pages: z.object({
    home: pageHeroSchema.optional().default({
      heroKicker: '01 — TENTANG',
      heroTitle: 'Tentang Sambelia',
      heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — pariwisata, pertanian, dan warisan budaya Sasak.',
      seoTitle: 'Beranda',
      seoDescription: 'Portal informasi Kecamatan Sambelia: pariwisata, irigasi, kesehatan, UMKM, peta tematik, dan informasi desa.',
    }),
    tentang: tentangPageSchema.optional().default({
      heroKicker: 'TENTANG',
      heroTitle: 'Sambelia',
      heroIntro: 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pariwisata, pertanian, dan warisan budaya Sasak.',
      seoTitle: 'Tentang Sambelia',
      seoDescription: 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa, dan potensi daerah.',
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
    peta: petaPageSchema.optional().default({
      heroKicker: 'PETA',
      heroTitle: 'Peta Sambelia',
      heroIntro: 'Jelajahi titik wisata, irigasi, kesehatan, UMKM, serta peta tematik air, vegetasi, erosi, dan blue carbon.',
      seoTitle: 'Peta Sambelia',
      seoDescription: 'Peta interaktif wisata, irigasi, kesehatan, UMKM, dan peta tematik air, vegetasi, erosi, serta blue carbon Sambelia.',
      dataSectionTitle: 'Lokasi Titik Data',
      gisSectionTitle: 'Peta Tematik GIS',
    }),
    lingkungan: lingkunganPageSchema.optional().default({
      heroKicker: 'LINGKUNGAN',
      heroTitle: 'Vegetasi, Erosi & Blue Carbon',
      heroIntro: 'Analisis lingkungan Kecamatan Sambelia: indeks vegetasi, tingkat erosi, dan sebaran blue carbon di wilayah pesisir dan daratan.',
      seoTitle: 'Lingkungan',
      seoDescription: 'Peta indeks vegetasi, erosi, dan distribusi blue carbon di Kecamatan Sambelia.',
      dataSectionTitle: 'Analisis Lingkungan',
      linkToPeta: 'Lihat di Peta Interaktif →',
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
    kegiatan: pageHeroSchema.optional().default({
      heroKicker: 'KEGIATAN',
      heroTitle: 'Kegiatan Sambelia',
      heroIntro: 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.',
      seoTitle: 'Kegiatan Sambelia',
      seoDescription: 'Kegiatan, laporan, dan informasi terbaru dari Kecamatan Sambelia.',
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
    tagline: z.string().default('Portal Kecamatan Sambelia, Lombok Timur'),
    copyright: z.string().default('© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia'),
  }).optional().default({
    tagline: 'Portal Kecamatan Sambelia, Lombok Timur',
    copyright: '© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia',
  }),
  emptyStates: z.object({
    pariwisata: z.string().default('Belum ada data wisata. Data akan ditambahkan segera.'),
    irigasi: z.string().default('Belum ada data irigasi. Data akan ditambahkan segera.'),
    kesehatan: z.string().default('Belum ada data kesehatan. Data akan ditambahkan segera.'),
    umkm: z.string().default('Belum ada data UMKM. Data akan ditambahkan segera.'),
    kegiatan: z.string().default('Belum ada kegiatan. Informasi akan ditambahkan segera.'),
    festival: z.string().default('Belum ada data festival. Data akan ditambahkan segera.'),
    lingkungan: z.string().default('Data peta lingkungan akan diunggah.'),
    airTanah: z.string().default('Data TMA akan diunggah.'),
    petaDataEmpty: z.string().default('Belum ada data lokasi. Tim akan menambahkan segera.'),
    petaGisEmpty: z.string().default('Peta GIS belum tersedia.'),
    airTanahDataEmpty: z.string().default('Data TMA dari cluster air tanah akan diunggah.'),
  }).optional().default({
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
export type Kegiatan = z.infer<typeof kegiatanSchema>
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
  order: z.number().int().default(0),
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

export const lingkunganSchema = z.object({
  title: z.string(),
  category: z.enum(['Vegetasi', 'Erosi', 'Blue Carbon', 'Lainnya']),
  cover: z.string().default('/images/content/kegiatan-ekowisata.svg'),
  description: z.string(),
  body: z.string().default(''),
  order: z.number().int().default(0),
})

export type Lingkungan = z.infer<typeof lingkunganSchema>