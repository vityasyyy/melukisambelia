# Panduan Konten Admin — Melukis Sambelia

Panduan lengkap untuk admin/tim menambah dan mengedit **semua konten** di website Melukis Sambelia. Cocok untuk anggota tim non-teknis.

Ada **dua cara** mengedit konten:
1. **Via CMS (Decap)** — antarmuka visual di `/admin` (paling mudah, direkomendasikan).
2. **Langsung edit file** Markdown/MDX di folder `content/` (lebih cepat untuk batch edit).

> Dokumen ini menjelaskan **field-by-field** setiap koleksi, persis seperti yang dilihat admin di CMS.

---

## Daftar Isi

- [Cara Akses](#cara-akses)
- [Master Table: Halaman → Bagian → Sumber Konten](#master-table-halaman--bagian--sumber-konten)
- [Koleksi Konten (field-by-field)](#koleksi-konten-field-by-field)
  - [1. Pariwisata](#1-pariwisata)
  - [2. Irigasi](#2-irigasi)
  - [3. Kesehatan](#3-kesehatan)
  - [4. Lingkungan](#4-lingkungan)
  - [5. UMKM](#5-umkm)
  - [6. Festival](#6-festival)
  - [7. Kegiatan](#7-kegiatan)
  - [8. Air & Tanah](#8-air--tanah)
  - [9. Pengaturan Situs (Settings)](#9-pengaturan-situs-settings)
  - [10. Peta GIS](#10-peta-gis)
  - [11. Desa & Kelurahan](#11-desa--kelurahan)
  - [12. Tentang Sambelia](#12-tentang-sambelia)
- [Halaman Changelog](#halaman-changelog)
- [Cara Upload Gambar](#cara-upload-gambar)
- [Cara Edit File Langsung (tanpa CMS)](#cara-edit-file-langsung-tanpa-cms)
- [Alur: Edit → Publish → Live](#alur-edit--publish--live)
- [Verifikasi](#verifikasi)

---

## Cara Akses

### Mode Online (setelah deploy ke Vercel)

1. Buka `https://melukis-sambelia.vercel.app/admin`
2. Klik **Login with GitHub**
3. Authorize aplikasi (sekali saja)
4. Pilih koleksi → edit → **Save** → **Publish**
5. Perubahan otomatis commit ke GitHub dan Vercel rebuild website (±1-2 menit)

### Mode Lokal (di komputer tim, tanpa internet)

> **Penting:** Jalankan kedua perintah ini dari **root folder proyek** (`melukisambelia/`). Jika `decap-server` dijalankan dari subfolder, CMS akan menampilkan "No Entries" karena gateway tidak dapat menemukan folder `content/`.

```bash
# Terminal 1 — jalankan website
npm run dev

# Terminal 2 — jalankan CMS lokal (dari root folder proyek)
npm run cms
```

Buka `http://localhost:3000/admin` → CMS langsung jalan, edit tersimpan ke file lokal.

---

## Master Table: Halaman → Bagian → Sumber Konten

| Halaman | Bagian | Sumber Konten | Koleksi CMS |
|---|---|---|---|
| `/` (Beranda) | Hero (gambar + tagline) | `content/_settings.md` | Pengaturan Situs → `heroImage`, `heroTagline` |
| `/` | Section header 01 (Tentang) | `content/_settings.md` → `homepageIntros.aboutKicker/Title/Intro, scrollPrompt` | Pengaturan Situs → `homepageIntros` |
| `/` | Statistik (Luas, Penduduk, dst) | `content/_settings.md` → `stats` | Pengaturan Situs → `stats` |
| `/` | Grid "Jejaki Sambelia" (7 kartu) | `content/_settings.md` → `jejakiCards` | Pengaturan Situs → `jejakiCards` |
| `/` | Section header 02-05 (kicker/judul/intro) | `content/_settings.md` → `homepageIntros` | Pengaturan Situs → `homepageIntros` |
| `/pariwisata` | Hero banner + SEO | `content/_settings.md` → `pages.pariwisata` | Pengaturan Situs → `pages` |
| `/pariwisata` | Grid kartu wisata | `content/pariwisata/*.mdx` | **Pariwisata** |
| `/irigasi` | Hero + SEO | `content/_settings.md` → `pages.irigasi` | Pengaturan Situs → `pages` |
| `/kesehatan` | Hero + SEO | `content/_settings.md` → `pages.kesehatan` | Pengaturan Situs → `pages` |
| `/lingkungan` | Hero + SEO | `content/_settings.md` → `pages.lingkungan` | Pengaturan Situs → `pages` |
| `/lingkungan` | Grid kartu lingkungan | `content/lingkungan/*.md` | **Lingkungan** |
| `/umkm` | Hero + SEO | `content/_settings.md` → `pages.umkm` | Pengaturan Situs → `pages` |
| `/festival` | Hero + SEO | `content/_settings.md` → `pages.festival` | Pengaturan Situs → `pages` |
| `/kegiatan` | Hero + SEO | `content/_settings.md` → `pages.kegiatan` | Pengaturan Situs → `pages` |
| `/air-tanah` | Hero + SEO | `content/_settings.md` → `pages.airTanah` | Pengaturan Situs → `pages` |
| `/peta` | Hero + SEO | `content/_settings.md` → `pages.peta` | Pengaturan Situs → `pages` |
| `/tentang-sambelia` | Hero + section headers + SEO | `content/_settings.md` → `pages.tentang` | Pengaturan Situs → `pages` |
| `/tentang-sambelia` | Geografi prose + potensi desa | `content/_tentang.md` | **Tentang Sambelia** |
| `/tentang-sambelia` | Desa & kelurahan | `content/desa/*.md` | **Desa & Kelurahan** |
| `/changelog` | Riwayat perubahan | Otomatis dari git history (`content/changelog.json`) | Tidak bisa diedit via CMS |
| Footer (semua halaman) | Tagline, copyright, sosial, kontak | `content/_settings.md` → `footer`, `socials`, `contact` | Pengaturan Situs |
| Semua halaman | Empty state messages | `content/_settings.md` → `emptyStates` | Pengaturan Situs → `emptyStates` |

> **Penting:** Semua teks yang dilihat pengguna sekarang bisa diedit via CMS. Tidak ada lagi konten yang "hardcoded" yang butuh developer untuk diubah.

> **Catatan redirect:** URL `/cerita` dan `/cerita/[slug]` otomatis redirect ke `/kegiatan` dan `/kegiatan/[slug]`. Koleksi "Cerita" sudah diganti menjadi "Kegiatan".

---

## Koleksi Konten (field-by-field)

### 1. Pariwisata

**Folder:** `content/pariwisata/` · **Format:** `.mdx` · **Muncul di:** `/pariwisata` (grid + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Pantai Berandangan` | Judul destinasi |
| `category` | select | ✅ | `Pantai` | Salah satu: `Pantai`, `Budaya`, `Desa Wisata`, `Air`, `Trekking` |
| `village` | select | ✅ | `Sugian` | Salah satu: `Sugian`, `Labuhan Pandan`, `Sambelia`, `Rarang`, `Sambelia Rarang Selatan`, `Tembayar`, `Paok Motong`, `lainnya` |
| `cover` | image | ✅ | `/images/content/kondo.webp` | Gambar utama (rasio 16:9) |
| `gallery` | list\<image\> | ❌ | `[/images/a.jpg]` | Galeri foto tambahan |
| `shortDesc` | string | ✅ | `Pantai pasir putih...` | Deskripsi singkat untuk kartu |
| `body` | markdown | ✅ | *(isi MDX)* | Deskripsi lengkap, tampil di modal |
| `lat` | number | ✅ | `-8.3583` | Latitude (untuk link Google Maps) |
| `lng` | number | ✅ | `116.8417` | Longitude (untuk link Google Maps) |
| `facilities` | list\<string\> | ❌ | `[Parkir, Warung]` | Fasilitas tersedia |
| `accessNotes` | string | ❌ | `±30 menit dari pusat...` | Catatan akses jalan |
| `googleMapsUrl` | string | ❌ | `https://maps.google.com/...` | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

---

### 2. Irigasi

**Folder:** `content/irigasi/` · **Format:** `.md` · **Muncul di:** `/irigasi` (akordion + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Saluran Irigasi Sugian` | Nama saluran |
| `saluranType` | select | ✅ | `Primer` | `Primer`, `Sekunder`, `Tersier` |
| `village` | select | ✅ | `Sugian` | `Sugian`, `Labuhan Pandan`, `Sambelia`, `Rarang`, `Sambelia Rarang Selatan`, `Tembayar`, `Paok Motong`, `lainnya` |
| `condition` | select | ✅ | `Baik` | `Baik`, `Rusak Ringan`, `Rusak Berat` |
| `lengthM` | number | ✅ | `2500` | Panjang saluran (meter) |
| `flowStatus` | select | ✅ | `Mengalir` | `Mengalir`, `Kering`, `Mengalir Sebagian` |
| `cover` | image | ✅ | `/images/content/irigasi-saluran.svg` | Gambar saluran |
| `body` | markdown | ✅ | `Saluran irigasi primer...` | Deskripsi |
| `lat` | number | ✅ | `-8.35` | Latitude |
| `lng` | number | ✅ | `116.84` | Longitude |
| `googleMapsUrl` | string | ❌ | `https://maps.google.com/...` | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

---

### 3. Kesehatan

**Folder:** `content/kesehatan/` · **Format:** `.md` · **Muncul di:** `/kesehatan` (grid + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `facilityName` | string | ✅ | `Puskesmas Sambelia` | Nama fasilitas |
| `type` | select | ✅ | `Puskesmas` | `Posyandu`, `Puskesmas`, `Bidan`, `Polides` |
| `village` | select | ✅ | `Sugian` | `Sugian`, `Labuhan Pandan`, `Sambelia`, `Rarang`, `Sambelia Rarang Selatan`, `Tembayar`, `Paok Motong`, `lainnya` |
| `cadresCount` | number | ✅ | `8` | Jumlah kader |
| `stuntingProgram` | boolean | ✅ | `true` | Ada program stunting? |
| `cover` | image | ✅ | `/images/content/kesehatan-fasilitas.svg` | Gambar fasilitas |
| `body` | markdown | ✅ | `Puskesmas dengan...` | Deskripsi |
| `lat` | number | ✅ | `-8.35` | Latitude |
| `lng` | number | ✅ | `116.84` | Longitude |
| `googleMapsUrl` | string | ❌ | `https://maps.google.com/...` | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

---

### 4. Lingkungan

**Folder:** `content/lingkungan/` · **Format:** `.md` · **Muncul di:** `/lingkungan` (grid)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Analisis Erosi Pesisir` | Judul item lingkungan |
| `category` | select | ✅ | `Erosi` | `Vegetasi`, `Erosi`, `Blue Carbon`, `Lainnya` |
| `cover` | image | ✅ | `/images/content/kegiatan-ekowisata.svg` | Gambar cover |
| `description` | string | ✅ | `Identifikasi zona erosi...` | Deskripsi singkat untuk kartu |
| `body` | markdown | ❌ | `Erosi pesisir merupakan...` | Deskripsi lengkap |
| `order` | number | ❌ | `2` | Angka lebih kecil tampil lebih dulu |

---

### 5. UMKM

**Folder:** `content/umkm/` · **Format:** `.md` · **Muncul di:** `/umkm` (grid + filter + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Peyek Mangrove Sambelia` | Nama UMKM |
| `owner` | string | ✅ | `Muadz — UMKM Lokal` | Pemilik |
| `kategori` | select | ✅ | `Kuliner` | `Kuliner`, `Jasa`, `Kerajinan`, `Pertanian`, `Perikanan`, `Lainnya` |
| `village` | select | ✅ | `Labuhan Pandan` | `Sugian`, `Labuhan Pandan`, `Sambelia`, `Rarang`, `Sambelia Rarang Selatan`, `Tembayar`, `Paok Motong`, `lainnya` |
| `contact` | string | ❌ | `0812-xxxx` | Kontak |
| `cover` | image | ✅ | `/images/content/scuba.png` | Gambar produk |
| `gallery` | list\<image\> | ❌ | `[]` | Galeri foto |
| `body` | markdown | ✅ | `Peyek mangrove adalah...` | Deskripsi |
| `lat` | number | ✅ | `-8.34` | Latitude |
| `lng` | number | ✅ | `116.86` | Longitude |
| `googleMapsUrl` | string | ❌ | `https://maps.google.com/...` | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

---

### 6. Festival

**Folder:** `content/festival/` · **Format:** `.md` · **Muncul di:** `/festival` (countdown + timeline)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `eventName` | string | ✅ | `Peresean Sambelia` | Nama acara |
| `schedule` | string (date) | ✅ | `2026-07-15` | Jadwal (tanggal) |
| `venue` | string | ✅ | `Lapangan Sambelia` | Lokasi acara |
| `description` | string | ✅ | `Pertunjukan...` | Deskripsi singkat |
| `cover` | image | ✅ | `/images/content/festival-peresean.svg` | Gambar acara |
| `registrationUrl` | string (URL) | ❌ | `https://...` | Link pendaftaran |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |
| `body` | markdown | ❌ | `Peresean adalah...` | Detail acara |

---

### 7. Kegiatan

**Folder:** `content/kegiatan/` · **Format:** `.mdx` · **Muncul di:** `/kegiatan` (grid) + `/kegiatan/[slug]` (artikel)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Catatan Lapangan #1` | Judul artikel |
| `author` | string | ✅ | `Siti Aminah` | Nama penulis |
| `date` | datetime | ✅ | `2026-06-20` | Tanggal (ISO) |
| `cover` | image | ✅ | `/images/content/cerita-placeholder.svg` | Cover artikel |
| `excerpt` | string | ✅ | `Refleksi minggu pertama...` | Ringkasan untuk kartu |
| `body` | markdown | ✅ | *(isi MDX)* | Isi artikel |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

> **Catatan:** Koleksi ini sebelumnya bernama "Cerita". URL `/cerita` dan `/cerita/[slug]` sekarang otomatis redirect ke `/kegiatan` dan `/kegiatan/[slug]`.

---

### 8. Air & Tanah

**File:** `content/air-tanah/air-tanah.md` · **Format:** `.md` (single file) · **Muncul di:** `/air-tanah`

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Air & Tanah` | Judul halaman |
| `description` | text | ❌ | `Data kualitas air...` | Deskripsi di atas grafik |
| `credit` | string | ❌ | `Cluster GIS Tim` | Kredit sumber data |
| `measurements` | list\<object\> | ❌ | *(lihat di bawah)* | Daftar pengukuran TMA & DHL |
| `measurements[].location` | string | ✅ | `Sumur Sugian 1` | Lokasi pengukuran |
| `measurements[].date` | datetime | ✅ | `2026-06-10` | Tanggal pengukuran |
| `measurements[].tmaMeters` | number (float) | ✅ | `2.3` | Tinggi Muka Airtanah (meter) |
| `measurements[].dhlMsiemens` | number (float) | ✅ | `450` | Daya Hantar Listrik (mS) |

---

### 9. Pengaturan Situs (Settings)

**File:** `content/_settings.md` · **Format:** `.md` (single file) · **Muncul di:** global (semua halaman)

#### Bagian Utama

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `heroImage` | image | ✅ | `/images/content/personstanding.webp` | Gambar hero beranda |
| `heroTagline` | string | ✅ | `Jelajahi Kecamatan Sambelia...` | Teks hero beranda |
| `stats.luas` | string | ✅ | `±125 km²` | Statistik luas wilayah |
| `stats.penduduk` | string | ✅ | `±20.000 jiwa` | Statistik penduduk |
| `stats.desaKelurahan` | string | ✅ | `7` | Jumlah desa/kelurahan |
| `stats.kabupaten` | string | ✅ | `Lombok Timur` | Kabupaten |
| `festivalDates` | string | ✅ | `Juli–Agustus 2026` | Rentang tanggal festival |
| `socials.instagram` | string | ❌ | `melukis.sambelia` | Username IG (tanpa @) |
| `socials.tiktok` | string | ❌ | `melukis.sambelia` | Username TikTok (tanpa @) |
| `contact.email` | string | ✅ | `melukis.sambelia@ugm.ac.id` | Email kontak |
| `contact.phone` | string | ❌ | `0812-xxxx` | Nomor telepon |
| `contact.address` | string | ✅ | `Kecamatan Sambelia...` | Alamat |

#### Section Headers Beranda (homepageIntros)

| Field | Contoh Default | Penjelasan |
|---|---|---|
| `aboutKicker` | `01 — TENTANG` | Label section Tentang di hero beranda |
| `aboutTitle` | `Tentang Sambelia` | Judul section Tentang di hero beranda |
| `aboutIntro` | `Kecamatan Sambelia, Kabupaten...` | Intro section Tentang di hero beranda |
| `scrollPrompt` | `Gulir untuk menjelajah` | Teks prompt scroll di hero beranda |
| `jejakiKicker` | `02 — JEJAKI` | Label section Jejaki |
| `jejakiTitle` | `Jejaki Sambelia` | Judul section Jejaki |
| `jejakiIntro` | *(kosong)* | Intro section Jejaki |
| `wisataKicker` | `03 — WISATA UNGGULAN` | Label section Wisata |
| `wisataTitle` | `Destinasi Pilihan` | Judul section Wisata |
| `wisataIntro` | `Destinasi wisata unggulan...` | Intro section Wisata |
| `festivalKicker` | `04 — FESTIVAL` | Label section Festival |
| `festivalTitle` | `Festival Pesona Sambelia` | Judul section Festival |
| `festivalIntro` | `Peresean, Pawai Dulangan...` | Intro section Festival |
| `umkmKicker` | `05 — UMKM` | Label section UMKM |
| `umkmTitle` | `UMKM Spotlight` | Judul section UMKM |
| `umkmIntro` | `Kerajinan, kuliner...` | Intro section UMKM |

#### Page-Specific Settings (pages)

Setiap halaman punya field berikut (opsional, ada default):

| Field per page | Contoh | Penjelasan |
|---|---|---|
| `heroKicker` | `PARIWISATA` | Label di banner hero |
| `heroTitle` | `Potensi Wisata Sambelia` | Judul besar di hero |
| `heroIntro` | `Destinasi unggulan...` | Deskripsi di hero |
| `seoTitle` | `Pariwisata Sambelia` | Title tag untuk SEO |
| `seoDescription` | `Destinasi wisata unggulan...` | Meta description untuk SEO |

Halaman yang tersedia: `home`, `tentang`, `pariwisata`, `irigasi`, `kesehatan`, `umkm`, `peta`, `lingkungan`, `airTanah`, `festival`, `kegiatan`.

Halaman `tentang` punya field tambahan: `sectionGeografiKicker`, `sectionGeografiTitle`, `sectionGeografiIntro`, `sectionDesaKicker`, `sectionDesaTitle`, `sectionDesaIntro`, `sectionPotensiKicker`, `sectionPotensiTitle`, `sectionPotensiIntro`.

Halaman `peta` punya field tambahan:

| Field | Default | Penjelasan |
|---|---|---|
| `dataSectionTitle` | `Lokasi Titik Data` | Judul section data peta |
| `gisSectionTitle` | `Peta Tematik GIS` | Judul section peta GIS |

Halaman `lingkungan` punya field tambahan:

| Field | Default | Penjelasan |
|---|---|---|
| `dataSectionTitle` | `Analisis Lingkungan` | Judul section data lingkungan |
| `linkToPeta` | `Lihat di Peta Interaktif →` | Teks link ke halaman peta |

#### Jejaki Cards (jejakiCards)

List 7 kartu yang tampil di section "Jejaki Sambelia" di beranda:

| Field per card | Contoh | Penjelasan |
|---|---|---|
| `href` | `/pariwisata` | Link tujuan |
| `title` | `Pariwisata` | Judul kartu |
| `desc` | `Destinasi unggulan Sambelia.` | Deskripsi singkat |
| `accent` | `#14A8E1` | Warna aksen (hex) |
| `image` | `/images/content/pariwisata-marine.webp` | Gambar fallback (opsional) |

#### Footer

| Field | Default | Penjelasan |
|---|---|---|
| `tagline` | `Portal Kecamatan Sambelia, Lombok Timur` | Teks di bawah logo footer |
| `copyright` | `© 2026 Kecamatan Sambelia — Dikembangkan oleh KKN-PPM UGM Melukis Sambelia` | Teks copyright di bawah footer |

#### Empty States (emptyStates)

Pesan yang tampil ketika koleksi kosong:

| Field | Default |
|---|---|
| `pariwisata` | `Belum ada data wisata. Data akan ditambahkan segera.` |
| `irigasi` | `Belum ada data irigasi. Data akan ditambahkan segera.` |
| `kesehatan` | `Belum ada data kesehatan. Data akan ditambahkan segera.` |
| `umkm` | `Belum ada data UMKM. Data akan ditambahkan segera.` |
| `kegiatan` | `Belum ada kegiatan. Informasi akan ditambahkan segera.` |
| `festival` | `Belum ada data festival. Data akan ditambahkan segera.` |
| `lingkungan` | `Data peta lingkungan akan diunggah.` |
| `airTanah` | `Data TMA akan diunggah.` |
| `petaDataEmpty` | `Belum ada data lokasi. Tim akan menambahkan segera.` |
| `petaGisEmpty` | `Peta GIS belum tersedia.` |
| `airTanahDataEmpty` | `Data TMA dari cluster air tanah akan diunggah.` |

---

### 10. Peta GIS

Admin dapat mengedit metadata untuk setiap kategori GIS via CMS, atau upload file langsung.

**Folder:** `public/gis/<kategori>/` + file metadata `content/_gis_<kategori>.md`

**CMS Collections:**

| Collection | File | Field |
|---|---|---|
| GIS Umum | `content/_gis_umum.md` | `title`, `description`, `credit` |
| GIS Air | `content/_gis_air.md` | `title`, `description`, `credit` |
| GIS Irigasi | `content/_gis_irigasi.md` | `title`, `description`, `credit` |
| GIS Vegetasi | `content/_gis_vegetasi.md` | `title`, `description`, `credit` |

**Upload file peta GIS:**

1. Letakkan file di subfolder sesuai kategori: `public/gis/umum/`, `air/`, `irigasi/`, `vegetasi/`
2. Format yang didukung: `.jpg`, `.png`, `.webp`, `.geojson`, `.pdf`
3. Jalankan manifest build (otomatis saat deploy, atau manual):
   ```bash
   node scripts/build-gis-manifest.mjs
   ```
4. Peta muncul otomatis di halaman `/peta` dan `/lingkungan`

---

### 11. Desa & Kelurahan

**Folder:** `content/desa/` · **Format:** `.md` · **Muncul di:** `/tentang-sambelia` (section "Desa & Kelurahan")

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Sugian` | Nama desa/kelurahan |
| `description` | text | ✅ | `Desa binaan dengan...` | Deskripsi singkat |
| `image` | image | ✅ | `/images/content/sugian-group44.png` | Gambar desa (16:9) |
| `order` | number | ❌ | `1` | Angka lebih kecil tampil lebih dulu |

---

### 12. Tentang Sambelia

**File:** `content/_tentang.md` · **Format:** `.md` (single file)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `geographyProse` | text | ✅ | `Kecamatan Sambelia terletak...` | Paragraf di section "Letak Geografis" |
| `potensiDesa` | list\<object\> | ❌ | *(lihat di bawah)* | Kartu potensi desa |
| `potensiDesa[].title` | string | ✅ | `Pariwisata Bahari & Budaya` | Judul kartu |
| `potensiDesa[].description` | text | ✅ | `Pantai Berandangan...` | Deskripsi kartu |

---

## Halaman Changelog

Halaman `/changelog` menampilkan **riwayat perubahan** website secara otomatis dari git history. Halaman ini:

- **Tidak bisa diedit via CMS** — datanya di-generate otomatis dari commit history
- File data: `content/changelog.json` (dibuat oleh `scripts/generate-changelog.mjs`)
- Dijalankan otomatis saat deploy, atau manual: `node scripts/generate-changelog.mjs`
- Terdaftar di sitemap

---

## Cara Upload Gambar

### Via CMS (Decap)

1. Klik field image di form CMS
2. Klik **Choose** → upload dari komputer, atau pilih dari media library
3. Gambar tersimpan di `public/images/` (otomatis)
4. Path referensi otomatis terisi: `/images/nama-file.jpg`

### Manual

1. Letakkan file di `public/images/content/` (atau subfolder)
2. Referensikan di frontmatter dengan path mulai `/images/`:
   ```yaml
   cover: /images/content/foto-baru.jpg
   ```

**Rekomendasi:**
- Format: `.webp` (terkecil) atau `.jpg`
- Ukuran cover: maksimal 1920px lebar, rasio 16:9
- Ukuran file: < 500KB per gambar (gunakan https://squoosh.app untuk kompres)
- Nama file: lowercase, tanpa spasi (`pantai-berandangan.webp`)

---

## Cara Edit File Langsung (tanpa CMS)

Setiap file konten terdiri dari dua bagian:

```
---
(frontmatter — metadata dalam format YAML)
---

(body — isi dalam format Markdown/MDX)
```

**Langkah:**

1. Buka file di koleksi yang sesuai (mis. `content/umkm/peyek-mangrove.md`)
2. Edit frontmatter (bagian atas, antara `---`) — ikuti skema field
3. Edit body (bagian bawah) — tulis deskripsi lengkap dalam Markdown
4. Simpan file
5. Jalankan verifikasi (lihat bawah)
6. Commit & push ke GitHub

---

## Alur: Edit → Publish → Live

### Via CMS (online)

```
Edit di /admin  →  Save  →  Publish  →  Commit ke GitHub  →  Vercel auto-build  →  Website update (±1-2 menit)
```

### Via CMS (lokal)

```
Edit di localhost:3000/admin  →  Save  →  File lokal berubah  →  git commit & push  →  Vercel auto-build
```

### Via file langsung

```
Edit file di content/  →  git commit & push  →  Vercel auto-build
```

---

## Verifikasi

Sebelum commit/publish, jalankan untuk memastikan konten valid:

```bash
# Cek semua referensi gambar ada
node scripts/check-images.mjs

# Cek frontmatter valid sesuai skema
npm run test

# Cek kode
npm run lint
npm run typecheck
```

Jika ada error frontmatter, periksa:
- Field wajib terisi semua
- Tipe data benar (number bukan string untuk `lat`/`lng`/`lengthM`/`cadresCount`)
- Enum value tepat (mis. `kategori` harus salah satu dari daftar, bukan teks bebas)
- URL di `registrationUrl` dan `googleMapsUrl` format URL valid (`https://...`)

---

## FAQ

**Q: Saya upload gambar tapi tidak muncul.**
A: Pastikan path diawali `/images/` dan file benar-benar ada di `public/images/`. Jalankan `node scripts/check-images.mjs` untuk verifikasi.

**Q: Saya edit di CMS tapi website tidak berubah.**
A: Online — cek GitHub apakah commit masuk, lalu cek Vercel dashboard apakah build berhasil. Lokal — pastikan `npm run dev` jalan dan refresh browser (Ctrl+Shift+R).

**Q: Bagaimana mengubah teks hero di halaman tertentu?**
A: Edit di CMS → **Pengaturan Situs** → section `pages` → pilih halaman → ubah `heroKicker`, `heroTitle`, `heroIntro`.

**Q: Bagaimana mengubah teks footer?**
A: Edit di CMS → **Pengaturan Situs** → section `footer` → ubah `tagline` dan `copyright`.

**Q: Bagaimana mengubah pesan "Belum ada data" di halaman kosong?**
A: Edit di CMS → **Pengaturan Situs** → section `emptyStates` → ubah pesan per koleksi.

**Q: Di mana halaman "Cerita"?**
A: Koleksi "Cerita" sudah diganti menjadi "Kegiatan". URL lama `/cerita` otomatis redirect ke `/kegiatan`.

**Q: Bisa tambah koleksi/field baru?**
A: Tambah/mengubah field butuh developer (ubah `lib/schemas.ts` + `public/admin/config.yml`). Hubungi tim teknis.

**Q: Bagaimana mengubah menu navigasi?**
A: Butuh developer — edit `components/Nav.tsx`. Bukan konten CMS.

**Q: Data peta GIS dari mana?**
A: Upload file ke `public/gis/<kategori>/`. Metadata (judul, deskripsi, kredit) bisa diedit via CMS (koleksi GIS Umum/Air/Irigasi/Vegetasi).

**Q: Mengapa peta sekarang pakai Google Maps embed, bukan peta interaktif Leaflet?**
A: Peta sekarang menggunakan embed Google Maps gratis (tanpa API key) untuk menampilkan lokasi umum Kecamatan Sambelia. Setiap titik data (pariwisata, irigasi, kesehatan, UMKM) memiliki link "Buka di Google Maps" yang membuka lokasi tepat di aplikasi Google Maps.

**Q: Apa itu halaman Changelog?**
A: Halaman `/changelog` menampilkan riwayat perubahan website yang di-generate otomatis dari git history. Tidak bisa diedit via CMS. Untuk memperbaruinya, jalankan `node scripts/generate-changelog.mjs`.