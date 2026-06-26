# Panduan Geotagging — Melukis Sambelia

Panduan untuk tim GIS/metadata agar hasil pengumpulan koordinat lapangan langsung tampil di peta website. Ada tiga jalur yang didukung — pilih salah satu sesuai alat yang dipakai.

## Opsi A — GeoJSON (paling direkomendasikan)

Cocok untuk output dari QGIS, MAPS.ME export, atau aplikasi survei yang menulis GeoJSON.

1. Simpan file sebagai `.geojson` (atau `.json`) di folder:
   ```
   public/gis/<nama-layer>.geojson
   ```
2. Jalankan (otomatis juga jalan saat `npm run build`):
   ```bash
   node scripts/build-gis-manifest.mjs
   ```
3. File akan otomatis muncul di tab **Peta GIS Tim** pada halaman `/peta`, lengkap dengan tombol pilih layer di sidebar.

**Struktur yang disarankan:** `FeatureCollection` berisi `Point`, `LineString` (untuk saluran irigasi), atau `Polygon`. Properti `name`/`title` akan dipakai sebagai label di sidebar.

**Untuk UMKM:** tambahkan koordinat langsung di frontmatter file `content/umkm/<slug>.md` (lihat Opsi C), agar muncul juga di tab **Peta Interaktif** bersama layer pariwisata/irigasi/kesehatan.

## Opsi B — GPX / KML (dari aplikasi GPS handheld)

Format ini belum punya converter otomatis di repo. Jalur termudah:

1. Buka file di [QGIS](https://qgis.org) atau [geojson.io](https://geojson.io).
2. Export sebagai `.geojson`.
3. Lanjutkan ke **Opsi A** langkah 1.

Jika tim ingin script converter otomatis (`scripts/gpx-to-geojson.mjs`), minta ke tim dev setelah format final diputuskan.

## Opsi C — Spreadsheet CSV/XLSX (bulk UMKM / pariwisata)

Cocok jika kader mengumpulkan data via Google Sheets / Excel lapangan.

1. Buat file di folder `data/` (mis. `data/umkm-lapangan.xlsx`).
2. Pastikan ada kolom `lat` dan `lng` (angka desimal, contoh `-8.355`, `116.845`).
3. Jalankan:
   ```bash
   npm run import-data
   ```
4. Script `scripts/import-xlsx.mjs` akan menulis file `content/<koleksi>/<slug>.md` dengan frontmatter berisi `lat`/`lng`.

**Tips mencari lat/lng akurat:** buka [openstreetmap.org](https://www.openstreetmap.org), klik kanan pada titik lokasi → "Show address" → koordinat muncul dalam format `lat, lng`.

## Opsi D — Manual (satu per satu, untuk edit cepat)

1. Buka file markdown koleksi yang ingin diberi koordinat, contoh `content/umkm/kerajinan-anyaman.md`.
2. Tambahkan dua baris di blok frontmatter (bagian `---` paling atas):
   ```yaml
   ---
   name: Kerajinan Anyaman Sambelia
   lat: -8.355
   lng: 116.845
   ---
   ```
3. Simpan. Lokasi akan muncul di peta setelah rebuild (atau langsung via Decap CMS di `/admin`).

## Validasi

- Koordinat Sambelia berkisar: **lat -8.30 sampai -8.45**, **lng 116.50 sampai 116.90**. Angka di luar rentang itu kemungkinan salah input.
- UMKM tanpa `lat`/`lng` tetap muncul di direktori `/umkm`, tapi **tidak** muncul sebagai marker di `/peta` (sengaja — skema `lat`/`lng` opsional).
- Pariwisata, irigasi, dan kesehatan **wajib** punya `lat`/`lng` (sudah diatur di `lib/schemas.ts`).

## Bekerja via CMS (non-teknis)

Buka `/admin` → pilih koleksi (UMKM/Pariwisata/dll) → ada field **Latitude** dan **Longitude**. Isi dengan angka desimal, save + publish. Tidak perlu sentuh file markdown langsung.