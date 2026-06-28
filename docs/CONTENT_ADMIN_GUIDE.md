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
  - [4. UMKM](#4-umkm)
  - [5. Festival](#5-festival)
  - [6. Cerita](#6-cerita)
  - [7. Air & Tanah](#7-air--tanah)
  - [8. Pengaturan Situs (Settings)](#8-pengaturan-situs-settings)
  - [9. Peta GIS](#9-peta-gis)
  - [10. Desa Binaan](#10-desa-binaan)
  - [11. Tentang Sambelia](#11-tentang-sambelia)
- [Cara Upload Gambar](#cara-upload-gambar)
- [Cara Edit File Langsung (tanpa CMS)](#cara-edit-file-langsung-tanpa-cms)
- [Alur: Edit → Publish → Live](#alur-edit--publish--live)
- [Verifikasi](#verifikasi)

---

## Cara Akses

### Mode Online (setelah deploy ke Vercel)

1. Buka `https://[domain-anda].vercel.app/admin`
2. Klik **Login with GitHub**
3. Authorize aplikasi (sekali saja)
4. Pilih koleksi (Pariwisata, UMKM, dll) → edit → **Save** → **Publish**
5. Perubahan otomatis commit ke GitHub dan Vercel rebuild website (±1-2 menit)

### Mode Lokal (di komputer tim, tanpa internet)

> **Penting:** Jalankan kedua perintah ini dari **root folder proyek** (`melukisambelia/`). Jika `decap-server` dijalankan dari subfolder, CMS akan menampilkan "No Entries" karena gateway tidak dapat menemukan folder `content/`.

```bash
# Terminal 1 — jalankan website
npm run dev

# Terminal 2 — jalankan CMS lokal (dari root folder proyek)
npm run cms
```

Buka `http://localhost:3000/admin` → klik **Login** (langkah ini adalah no-op di mode lokal, tidak benar-benar login GitHub) → CMS langsung jalan, edit tersimpan ke file lokal.

---

## Master Table: Halaman → Bagian → Sumber Konten

Tabel ini menunjukkan **bagian mana di setiap halaman** dikendalikan oleh koleksi mana.

| Halaman (route) | Bagian / Section | Sumber Konten | Koleksi CMS |
|---|---|---|---|
| `/` (Beranda) | Hero (gambar + tagline) | `content/_settings.md` | Pengaturan Situs → `heroImage`, `heroTagline` |
| `/` | Statistik (Luas, Penduduk, dst) | `content/_settings.md` → `stats` | Pengaturan Situs → `stats` |
| `/` | Grid "Jejaki Sambelia" (7 kartu) | Ambil 1 item pertama dari tiap koleksi | Pariwisata, Irigasi, Kesehatan, UMKM, Festival + 2 hardcoded (Air & Tanah, Lingkungan) |
| `/` | Section header 02-05 (kicker/judul/intro) | `content/_settings.md` → `homepageIntros` | Pengaturan Situs → `homepageIntros` |
| `/` | Kilas Sambelia | Hardcoded di `components/KilasSambelia.tsx` | *(butuh developer untuk ubah)* |
| `/pariwisata` | Hero banner | Hardcoded judul/intro di `components/PariwisataListClient.tsx` | — |
| `/pariwisata` | Grid kartu wisata | `content/pariwisata/*.mdx` | **Pariwisata** |
| `/pariwisata/[slug]` | Halaman detail wisata | `content/pariwisata/[slug].mdx` | **Pariwisata** |
| `/irigasi` | Hero + statistik + daftar akordion | `content/irigasi/*.md` | **Irigasi** |
| `/kesehatan` | Hero + statistik + grid kartu | `content/kesehatan/*.md` | **Kesehatan** |
| `/umkm` | Hero + filter kategori + grid kartu | `content/umkm/*.md` | **UMKM** |
| `/festival` | Hero + countdown + timeline | `content/festival/*.md` | **Festival** |
| `/cerita` | Hero + grid artikel | `content/cerita/*.mdx` | **Cerita** |
| `/cerita/[slug]` | Halaman artikel | `content/cerita/[slug].mdx` | **Cerita** |
| `/air-tanah` | Judul + deskripsi + grafik + data TMA/DHL | `content/air-tanah/air-tanah.md` | **Air & Tanah** (termasuk `measurements`) |
| `/lingkungan` | Hero + grid peta vegetasi | `public/gis/vegetasi/*` | **Peta GIS** (upload file) |
| `/peta` | Peta interaktif + daftar peta GIS | `public/gis/*` + layer peta | **Peta GIS** (upload file) |
| `/tentang-sambelia` | Hero + geografi + desa binaan + potensi desa | `content/_settings.md` (stats), `content/desa/*.md`, `content/_tentang.md` | Pengaturan Situs + **Desa Binaan** + **Tentang Sambelia** |
| Footer (semua halaman) | Sosial media, kontak | `content/_settings.md` → `socials`, `contact` | Pengaturan Situs → `socials`, `contact` |
| Favicon, OG image | Branding | `public/images/design-system/` | *(upload file manual)* |

> **Catatan:** Bagian yang ditandai "hardcoded" butuh developer ubah. Semua bagian dengan koleksi CMS bisa admin edit langsung.

---

## Koleksi Konten (field-by-field)

### 1. Pariwisata

**Folder:** `content/pariwisata/` · **Format:** `.mdx` · **Muncul di:** `/pariwisata` (grid) + `/pariwisata/[slug]` (detail)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Pantai Berandangan` | Judul destinasi |
| `category` | select | ✅ | `Pantai` | Salah satu: `Pantai`, `Budaya`, `Desa Wisata`, `Air`, `Trekking` |
| `village` | select | ✅ | `Sugian` | Salah satu: `Sugian`, `Labuhan Pandan`, `lainnya` |
| `cover` | image | ✅ | `/images/content/kondo.webp` | Gambar utama (rasio 16:9) |
| `gallery` | list<image> | ❌ | `[/images/a.jpg, /images/b.jpg]` | Galeri foto tambahan |
| `shortDesc` | string | ✅ | `Pantai pasir putih...` | Deskripsi singkat untuk kartu |
| `lat` | number | ✅ | `-8.3583` | Latitude (untuk peta) |
| `lng` | number | ✅ | `116.8417` | Longitude (untuk peta) |
| `facilities` | list<string> | ❌ | `[Parkir, Warung]` | Fasilitas tersedia |
| `accessNotes` | string | ❌ | `±30 menit dari pusat...` | Catatan akses jalan |
| `body` | markdown | ✅ | *(isi MDX)* | Deskripsi lengkap, tampil di halaman detail |

**Contoh file** (`content/pariwisata/pantai-berandangan.mdx`):

```mdx
---
title: Pantai Berandangan
category: Pantai
village: Sugian
cover: /images/content/kondo.webp
gallery: []
shortDesc: Pantai pasir putih dengan ombak tenang di Desa Sugian, cocok untuk wisata keluarga.
lat: -8.3583
lng: 116.8417
facilities:
  - Parkir
  - Warung
accessNotes: ±30 menit dari pusat Kecamatan Sambelia via jalan desa.
---

Pantai Berandangan adalah salah satu destinasi unggulan di Desa Sugian...
Tulis deskripsi lengkap di sini, boleh pakai **Markdown**.
```

---

### 2. Irigasi

**Folder:** `content/irigasi/` · **Format:** `.md` · **Muncul di:** `/irigasi` (akordion + modal detail)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Saluran Irigasi Sugian` | Nama saluran |
| `saluranType` | select | ✅ | `Primer` | Salah satu: `Primer`, `Sekunder`, `Tersier` |
| `village` | select | ✅ | `Sugian` | `Sugian`, `Labuhan Pandan`, `lainnya` |
| `condition` | select | ✅ | `Baik` | `Baik`, `Rusak Ringan`, `Rusak Berat` |
| `lengthM` | number | ✅ | `2500` | Panjang saluran dalam meter |
| `flowStatus` | select | ✅ | `Mengalir` | `Mengalir`, `Kering`, `Mengalir Sebagian` |
| `cover` | image | ✅ | `/images/content/irigasi-saluran.svg` | Gambar saluran |
| `lat` | number | ✅ | `-8.35` | Latitude |
| `lng` | number | ✅ | `116.84` | Longitude |
| `body` | markdown | ✅ | `Saluran irigasi primer...` | Deskripsi |

---

### 3. Kesehatan

**Folder:** `content/kesehatan/` · **Format:** `.md` · **Muncul di:** `/kesehatan` (grid + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `facilityName` | string | ✅ | `Puskesmas Sambelia` | Nama fasilitas |
| `type` | select | ✅ | `Puskesmas` | `Posyandu`, `Puskesmas`, `Bidan`, `Polides` |
| `village` | select | ✅ | `Sugian` | `Sugian`, `Labuhan Pandan`, `lainnya` |
| `cadresCount` | number | ✅ | `8` | Jumlah kader |
| `stuntingProgram` | boolean | ✅ | `true` | Ada program stunting? |
| `cover` | image | ✅ | `/images/content/kesehatan-fasilitas.svg` | Gambar fasilitas |
| `lat` | number | ✅ | `-8.35` | Latitude |
| `lng` | number | ✅ | `116.84` | Longitude |
| `body` | markdown | ✅ | `Puskesmas dengan...` | Deskripsi |

---

### 4. UMKM

**Folder:** `content/umkm/` · **Format:** `.md` · **Muncul di:** `/umkm` (grid + filter kategori + modal)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Peyek Mangrove Sambelia` | Nama UMKM |
| `owner` | string | ✅ | `Muadz — UMKM Lokal` | Pemilik/penanggung jawab |
| `kategori` | select | ✅ | `Kuliner` | `Kuliner`, `Jasa`, `Kerajinan`, `Pertanian`, `Perikanan`, `Lainnya` |
| `village` | select | ✅ | `Labuhan Pandan` | `Sugian`, `Labuhan Pandan`, `lainnya` |
| `contact` | string | ❌ | `0812-xxxx` | Kontak (WA/telepon). Kosongkan jika tidak ada |
| `cover` | image | ✅ | `/images/content/scuba.png` | Gambar produk |
| `gallery` | list<image> | ❌ | `[]` | Galeri foto produk |
| `lat` | number | ✅ | `-8.34` | Latitude |
| `lng` | number | ✅ | `116.86` | Longitude |
| `body` | markdown | ✅ | `Peyek mangrove adalah...` | Deskripsi produk |

> **Tip:** Field `kategori` dipakai oleh filter di halaman UMKM. Pastikan konsisten dengan opsi yang tersedia.

---

### 5. Festival

**Folder:** `content/festival/` · **Format:** `.md` · **Muncul di:** `/festival` (countdown + timeline)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `eventName` | string | ✅ | `Peresean Sambelia` | Nama acara |
| `schedule` | string | ✅ | `Juli–Agustus 2026` | Jadwal (teks bebas) |
| `venue` | string | ✅ | `Lapangan Sambelia` | Lokasi acara |
| `description` | string | ✅ | `Pertunjukan...` | Deskripsi singkat |
| `cover` | image | ✅ | `/images/content/festival-peresean.svg` | Gambar acara |
| `registrationUrl` | string (URL) | ❌ | `https://...` | Link pendaftaran (harus URL valid) |
| `body` | markdown | ❌ | `Peresean adalah...` | Detail acara |

> **Tip:** `schedule` dipakai oleh komponen countdown. Format bebas, tapi konsisten antar event.

---

### 6. Cerita

**Folder:** `content/cerita/` · **Format:** `.mdx` · **Muncul di:** `/cerita` (grid) + `/cerita/[slug]` (artikel)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Catatan Lapangan #1` | Judul artikel |
| `author` | string | ✅ | `Siti Aminah` | Nama penulis |
| `date` | datetime | ✅ | `2026-06-20` | Tanggal (ISO) |
| `cover` | image | ✅ | `/images/content/cerita-placeholder.svg` | Cover artikel |
| `excerpt` | string | ✅ | `Refleksi minggu pertama...` | Ringkasan untuk kartu |
| `body` | markdown | ✅ | *(isi MDX)* | Isi artikel, bisa pakai komponen MDX |

---

### 7. Air & Tanah

**Folder:** `content/air-tanah/air-tanah.md` · **Format:** `.md` (single file) · **Muncul di:** `/air-tanah`

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `title` | string | ✅ | `Air & Tanah` | Judul halaman |
| `description` | text | ❌ | `Data kualitas air...` | Deskripsi di atas grafik |
| `credit` | string | ❌ | `Cluster GIS Tim` | Kredit sumber data |
| `measurements` | list<object> | ❌ | *(lihat di bawah)* | Daftar pengukuran TMA & DHL |
| `measurements[].location` | string | ✅ | `Sumur Sugian 1` | Lokasi pengukuran |
| `measurements[].date` | datetime | ✅ | `2026-06-10` | Tanggal pengukuran |
| `measurements[].tmaMeters` | number (float) | ✅ | `2.3` | Tinggi Muka Airtanah (meter) |
| `measurements[].dhlMsiemens` | number (float) | ✅ | `450` | Daya Hantar Listrik (mS) |

> **Catatan:** Admin kini bisa mengedit seluruh data TMA & DHL langsung via CMS (termasuk menambah/menghapus baris pengukuran). Grafik dan tabel di halaman `/air-tanah` otomatis terupdate dari data ini.

---

### 8. Pengaturan Situs (Settings)

**File:** `content/_settings.md` · **Format:** `.md` (single file) · **Muncul di:** global (hero beranda, stats, footer)

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `heroImage` | image | ✅ | `/images/content/personstanding.webp` | Gambar hero beranda |
| `heroTagline` | string | ✅ | `Pemberdayaan pariwisata...` | Teks di bawah judul hero |
| `stats.luas` | string | ✅ | `±125 km²` | Statistik luas wilayah |
| `stats.penduduk` | string | ✅ | `±20.000 jiwa` | Statistik penduduk |
| `stats.desaBinaan` | string | ✅ | `2` | Jumlah desa binaan |
| `stats.tahunProgram` | string | ✅ | `2026` | Tahun program KKN |
| `festivalDates` | string | ✅ | `Juli–Agustus 2026` | Rentang tanggal festival |
| `socials.instagram` | string | ❌ | `melukis.sambelia` | Username IG (tanpa @) |
| `socials.tiktok` | string | ❌ | `melukis.sambelia` | Username TikTok (tanpa @) |
| `contact.email` | string | ✅ | `melukis.sambelia@ugm.ac.id` | Email kontak |
| `contact.phone` | string | ❌ | `0812-xxxx` | Nomor telepon |
| `contact.address` | string | ✅ | `Kecamatan Sambelia...` | Alamat |
| `homepageIntros.jejakiKicker` | string | ❌ | `02 — JEJAKI` | Label section 02 (Jejaki) di beranda |
| `homepageIntros.jejakiTitle` | string | ❌ | `Jejaki Sambelia` | Judul section 02 |
| `homepageIntros.jejakiIntro` | string | ❌ | *(kosong)* | Intro section 02 (opsional) |
| `homepageIntros.wisataKicker` | string | ❌ | `03 — WISATA UNGGULAN` | Label section 03 (Wisata Unggulan) |
| `homepageIntros.wisataTitle` | string | ❌ | `Destinasi Pilihan` | Judul section 03 |
| `homepageIntros.wisataIntro` | text | ❌ | `Destinasi wisata unggulan...` | Intro section 03 |
| `homepageIntros.festivalKicker` | string | ❌ | `04 — FESTIVAL` | Label section 04 (Festival) |
| `homepageIntros.festivalTitle` | string | ❌ | `Festival Pesona Sambelia` | Judul section 04 |
| `homepageIntros.festivalIntro` | text | ❌ | `Peresean, Pawai Dulangan...` | Intro section 04 |
| `homepageIntros.umkmKicker` | string | ❌ | `05 — UMKM` | Label section 05 (UMKM) |
| `homepageIntros.umkmTitle` | string | ❌ | `UMKM Spotlight` | Judul section 05 |
| `homepageIntros.umkmIntro` | text | ❌ | `Kerajinan, kuliner...` | Intro section 05 |

---

### 9. Peta GIS

**Bukan via CMS** — upload file langsung. **Muncul di:** `/peta`, `/lingkungan`

**Folder:** `public/gis/<kategori>/`

| Subfolder | Kategori | Contoh Isi |
|---|---|---|
| `public/gis/umum/` | Peta umum tim | Peta dasar, lokasi desa |
| `public/gis/air/` | Kualitas air, TMA, DHL | Peta iso-DHL, TMA |
| `public/gis/irigasi/` | Irigasi & rawan kekeringan | Jaringan saluran, titik kering |
| `public/gis/vegetasi/` | NDVI, erosi, blue carbon | Peta NDVI, erosi |

**Langkah upload peta:**

1. Letakkan file di subfolder sesuai kategori. Format yang didukung:
   - Gambar: `.jpg`, `.png`, `.webp`
   - Vektor: `.geojson`, `.pdf`
2. **(Opsional)** Buat file `.txt` dengan nama sama untuk deskripsi:
   - `peta-tma.jpg` → `peta-tma.txt` berisi deskripsi singkat
3. Jalankan manifest build (otomatis saat deploy, atau manual):
   ```bash
   node scripts/build-gis-manifest.mjs
   ```
4. Peta muncul otomatis di halaman `/peta` (tab kategori) dan `/lingkungan` (tab vegetasi).

---

### 10. Desa Binaan

**Folder:** `content/desa/` · **Format:** `.md` · **Muncul di:** `/tentang-sambelia` (section "Desa Binaan")

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `name` | string | ✅ | `Sugian` | Nama desa (dipakai sebagai judul kartu) |
| `description` | text | ✅ | `Desa binaan dengan...` | Deskripsi singkat desa |
| `image` | image | ✅ | `/images/content/sugian-group44.png` | Gambar desa (rasio 16:9) |

> **Tip:** Untuk menambah desa baru, klik **Tambah Desa Binaan** di CMS. Slug otomatis dibuat dari `name`.

---

### 11. Tentang Sambelia

**File:** `content/_tentang.md` · **Format:** `.md` (single file) · **Muncul di:** `/tentang-sambelia` (section "Letak Geografis" + "Potensi Desa")

| Field | Tipe | Wajib | Contoh | Penjelasan |
|---|---|---|---|---|
| `geographyProse` | text | ✅ | `Kecamatan Sambelia terletak...` | Paragraf prose di section "Letak Geografis" |
| `potensiDesa` | list<object> | ❌ | *(lihat di bawah)* | Kartu potensi desa di section "Potensi Desa" |
| `potensiDesa[].title` | string | ✅ | `Pariwisata Bahari & Budaya` | Judul kartu potensi |
| `potensiDesa[].description` | text | ✅ | `Pantai Berandangan...` | Deskripsi kartu potensi |

> **Tip:** Tambah/kurang kartu potensi desa via CMS — klik **Tambah** di list `potensiDesa`.

---

## Cara Upload Gambar

### Via CMS (Decap)

Saat edit field bertipe `image`:
1. Klik field image
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
- Nama file: lowercase, tanpa spasi (`pantai-berandangan.webp`, bukan `Pantai Berandangan.JPG`)

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

**Contoh menambah UMKM baru:**

Buat file baru `content/umkm/kerupuk-panggang.md`:

```md
---
name: Kerupuk Panggang Sambelia
owner: Pak Joko
kategori: Kuliner
village: Sugian
contact: '0812-3456-7890'
cover: /images/content/kerupuk-panggang.jpg
gallery: []
body: |
  Kerupuk panggang khas Sambelia yang terbuat dari ikan laut segar.
  Dipanggang tradisional dengan api kayu, menghasilkan rasa gurih khas.
lat: -8.355
lng: 116.845
---
```

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
# Cek semua referensi gambar ada (tidak ada 404)
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
- URL di `registrationUrl` format URL valid (`https://...`)

---

## FAQ

**Q: Saya upload gambar tapi tidak muncul.**
A: Pastikan path diawali `/images/` dan file benar-benar ada di `public/images/`. Jalankan `node scripts/check-images.mjs` untuk verifikasi.

**Q: Saya edit di CMS tapi website tidak berubah.**
A: Online — cek GitHub apakah commit masuk, lalu cek Vercel dashboard apakah build berhasil. Lokal — pastikan `npm run dev` jalan dan refresh browser (Ctrl+Shift+R).

**Q: Bisa tambah koleksi/field baru?**
A: Tambah/mengubah field butuh developer (ubah `lib/schemas.ts` + `public/admin/config.yml`). Hubungi tim teknis.

**Q: Bagaimana mengubah hero beranda?**
A: Edit di CMS → **Pengaturan Situs** → field `heroImage` dan `heroTagline`.

**Q: Bagaimana mengubah menu navigasi?**
A: Butuh developer — edit `components/Nav.tsx`. Bukan konten CMS.

**Q: Data peta GIS dari mana?**
A: Upload file ke `public/gis/<kategori>/` (lihat [Peta GIS](#9-peta-gis)). Bukan via CMS.