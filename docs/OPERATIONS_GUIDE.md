# Panduan Operasional — Melukis Sambelia

Panduan praktis untuk mengelola dan mengoperasikan website Melukis Sambelia sehari-hari.

---

## Daftar Isi

- [Konfigurasi Pusat](#konfigurasi-pusat)
- [Menjalankan Lokal](#menjalankan-lokal)
- [Mengedit Konten via CMS (Lokal)](#mengedit-konten-via-cms-lokal)
- [Mengedit Konten via CMS (Online/Produksi)](#mengedit-konten-via-cms-onlineproduksi)
- [Operasi Umum](#operasi-umum)
  - [Mengganti Gambar Hero](#mengganti-gambar-hero)
  - [Menambah UMKM](#menambah-umkm)
  - [Menambah Acara Festival](#menambah-acara-festival)
  - [Mengupload Peta GIS](#mengupload-peta-gis)
  - [Mengubah Data Air Tanah](#mengubah-data-air-tanah)
  - [Menghasilkan Changelog](#menghasilkan-changelog)
- [Halaman Situs](#halaman-situs)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Troubleshooting](#troubleshooting)

---

## Konfigurasi Pusat

Nilai konfigurasi situs terpusat di `lib/config.ts`:

| Konstanta | Default | Kegunaan |
|-----------|---------|----------|
| `SITE_URL` | `https://melukis-sambelia.vercel.app` | Base URL untuk metadata, sitemap, OG images |
| `SITE_NAME` | `Sambelia` | Nama situs di metadata dan CMS |
| `SITE_DESCRIPTION` | Portal informasi Kec. Sambelia… | Meta description default |
| `REVALIDATE_SECONDS` | `300` | Interval revalidasi ISR (dalam detik) |

Jika mengganti domain, update `SITE_URL` di `lib/config.ts` (atau set env `NEXT_PUBLIC_SITE_URL`) — ini menggantikan hard-coded URL di beberapa file.

---

## Menjalankan Lokal

```bash
# Install dependencies (sekali saja)
npm install

# Jalankan development server
npm run dev
```

Website tersedia di `http://localhost:3000`.

## Mengedit Konten via CMS (Lokal)

Cara paling mudah mengedit konten — tanpa perlu login GitHub.

```bash
# Terminal 1: website
npm run dev

# Terminal 2: CMS proxy lokal
npx decap-server
```

Buka `http://localhost:3000/admin` → CMS muncul tanpa login. Edit konten → perubahan tersimpan langsung ke file lokal.

> **Penting:** `npx decap-server` HARUS berjalan bersamaan dengan `npm run dev`. Tanpa proxy ini, CMS akan error "Cannot connect to backend".

## Mengedit Konten via CMS (Online/Produksi)

Setelah deploy ke Vercel:

1. Buka `https://[domain-anda].vercel.app/admin`
2. Klik **Login with GitHub**
3. Pilih koleksi (Pariwisata, UMKM, dll) → edit → **Save** → **Publish**
4. Perubahan otomatis commit ke GitHub → Vercel rebuild (~1-2 menit)

> **Jika CMS tidak load config.yml:** Pastikan `base_url` di `public/admin/config.yml` mengarah ke domain yang benar. Untuk lokal, pastikan `npx decap-server` berjalan.

## Operasi Umum

### Mengganti Gambar Hero

1. Siapkan gambar baru (rasio ~16:9, format `.webp` atau `.jpg`, ukuran < 500KB)
2. Upload ke `public/images/content/` (atau via CMS: Pengaturan Situs → Gambar Hero)
3. Jika via CMS: buka **Pengaturan Situs** → ubah **Gambar Hero** → Save → Publish
4. Jika manual: edit `content/_settings.md`, ubah `heroImage: /images/content/nama-file.webp`

### Menambah UMKM

**Via CMS:** Buka koleksi UMKM → klik **Tambah UMKM** → isi field → Save → Publish

**Manual:** Buat file `content/umkm/nama-umkm.md`:

```md
---
name: Nama UMKM
owner: Nama Pemilik
kategori: Kuliner
village: Sugian
contact: '0812-xxxx'
cover: /images/content/nama-foto.webp
gallery: []
body: Deskripsi lengkap UMKM.
lat: -8.355
lng: 116.845
---
```

Pastikan `cover` merujuk ke file yang ada di `public/images/`.

### Menambah Acara Festival

**Via CMS:** Buka koleksi Festival → **Tambah** → isi field → Save → Publish

> **Penting untuk Countdown:** Field `schedule` harus berisi tanggal yang bisa diparse (format `YYYY-MM-DD`, misalnya `2026-07-15`). Jika diisi teks bebas (misalnya "TBD"), countdown akan menampilkan pesan "Segera diumumkan" sebagai fallback.

### Mengupload Peta GIS

1. Letakkan file di `public/gis/<kategori>/` (format: `.geojson`, `.jpg`, `.png`, `.webp`, `.pdf`)
2. Kategori: `umum/`, `air/`, `irigasi/`, `vegetasi/`
3. Jalankan: `node scripts/build-gis-manifest.mjs`
4. File akan muncul otomatis di halaman `/peta` dan `/lingkungan`

### Mengubah Data Air Tanah

File data ada di `public/data/air-tanah.json`. Edit langsung atau ganti file-nya dengan data survei baru (format JSON, lihat struktur yang ada).

### Menghasilkan Changelog

Sebelum build atau deploy, jalankan script changelog untuk memperbarui halaman `/changelog`:

```bash
node scripts/generate-changelog.mjs
```

Script ini membaca riwayat git commit dan menghasilkan `content/changelog.json`, yang ditampilkan di halaman `/changelog`. Jalankan setiap kali ada perubahan yang ingin tercatat di changelog situs.

> **Penting:** Jalankan sebelum `npm run build` atau push ke Vercel agar changelog selalu terbaru.

---

## Halaman Situs

| Route | Keterangan |
|-------|------------|
| `/` | Beranda — hero, highlight pariwisata & UMKM |
| `/pariwisata/[slug]` | Detail tempat wisata |
| `/irigasi/[slug]` | Detail infrastruktur irigasi |
| `/kesehatan/[slug]` | Detail fasilitas kesehatan |
| `/umkm/[slug]` | Detail UMKM |
| `/festival` | Halaman festival & countdown |
| `/kegiatan/[slug]` | Artikel kegiatan |
| `/peta` | Peta interaktif — query params (`?layer=`, `?lat=`, `?lng=`), embed Google Maps, filter layer, tab switching |
| `/lingkungan` | Informasi lingkungan & peta tematik |
| `/changelog` | Riwayat perubahan situs (dari git log) |
| `/desa/[slug]` | Profil desa |
| `/air-tanah` | Data air tanah |
| `/admin` | Decap CMS admin |

---

## Deploy ke Vercel

```bash
# Hasilkan changelog terbaru (opsional tapi disarankan)
node scripts/generate-changelog.mjs

# Verifikasi lokal sebelum push
npm run lint
npm run typecheck
npm run test
npm run validate
node scripts/check-images.mjs
npm run build

# Commit dan push
git add .
git commit -m "deskripsi perubahan"
git push origin main
```

Vercel akan otomatis build dan deploy. Atau buka dashboard Vercel → klik **Redeploy**.

> **Catatan:** `npm run validate` sama dengan `node scripts/validate-content.mjs` — memeriksa frontmatter, required fields, dan file penting di folder `content/`.

### Error Boundary

Aplikasi memiliki error boundary di `app/error.tsx` yang menyediakan UI pemulihan error bergaya: menampilkan pesan error, tombol **Coba Lagi**, dan link **Kembali ke Beranda**. Jika halaman crash saat runtime, pengguna tetap mendapat tampilan yang rapi, bukan layar kosong.

## Troubleshooting

### CMS tidak load config.yml

- **Lokal:** Pastikan `npx decap-server` berjalan bersamaan dengan `npm run dev`
- **Produksi:** Pastikan `base_url` di `public/admin/config.yml` mengarah ke domain yang benar (misal `https://melukis-sambelia.vercel.app`)
- **Produksi:** Pastikan env vars `GITHUB_OAUTH_CLIENT_ID` dan `GITHUB_OAUTH_CLIENT_SECRET` sudah di-set di Vercel
- **Produksi:** Pastikan GitHub OAuth App callback URL adalah `https://[domain]/api/auth`

### Peta kosong / biru saja

- Pastikan ada koneksi internet (peta memuat tile dari OpenStreetMap)
- Jika peta tidak muncul sama sekali, coba hard refresh (Ctrl+Shift+R)
- Marker harus muncul dalam beberapa detik setelah halaman load
- Jika tetap bermasalah, cek browser console (F12) untuk error
- Peta mendukung query params untuk deep-linking: `/peta?layer=pariwisata&lat=-8.35&lng=116.84`

### Gambar 404

Jalankan `node scripts/check-images.mjs` untuk memverifikasi semua referensi gambar.

### Build gagal di Vercel

1. Jalankan `npm run build` lokal — pastikan lulus
2. Jalankan `npm run validate` untuk memastikan konten valid
3. Cek apakah ada perubahan di `next.config.mjs` yang perlu penyesuaian
4. Cek Vercel dashboard → Build Logs untuk error spesifik

### Countdown festival tidak muncul

Pastikan field `schedule` di file festival berisi tanggal format `YYYY-MM-DD`, bukan teks bebas. Jika menggunakan teks bebas, countdown akan menampilkan fallback "Segera diumumkan".

### Data Air Tanah kosong

File `public/data/air-tanah.json` harus ada dan berformat benar. Lihat struktur yang sudah ada sebagai template. Jika file kosong atau hilang, halaman Air Tanah menampilkan pesan "Data akan diunggah".

### Changelog kosong

Jalankan `node scripts/generate-changelog.mjs` untuk menghasilkan `content/changelog.json` dari riwayat git. Pastikan ada commit di repo sebelum menjalankan script.

### Search tidak berfungsi

Search menggunakan data yang di-build saat build time. Jika konten baru tidak muncul di search:
1. Jalankan `npm run build` (atau push ke Vercel untuk trigger rebuild)
2. Search akan otomatis include konten terbaru

### Mengubah domain

Jika mengganti domain (misal dari `melukis-sambelia.vercel.app` ke `melukissambelia.id`):

1. Set env `NEXT_PUBLIC_SITE_URL` di Vercel (atau ubah default di `lib/config.ts`)
2. Update `base_url` di `public/admin/config.yml`
3. Update callback URL di GitHub OAuth App
4. Set ulang domain di Vercel dashboard → Settings → Domains
5. Redeploy

---

## Lihat Juga

- [`docs/CONTENT_ADMIN_GUIDE.md`](./CONTENT_ADMIN_GUIDE.md) — referensi lengkap field-by-field untuk setiap koleksi CMS
- [`docs/deploy-guide.md`](./deploy-guide.md) — panduan deploy langkah demi langkah ke Vercel
- [`docs/cms-content-guide.md`](./cms-content-guide.md) — panduan singkat CMS (legacy, silakan gunakan CONTENT_ADMIN_GUIDE sebagai referensi utama)