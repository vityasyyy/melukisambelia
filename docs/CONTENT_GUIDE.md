# Panduan Kontribusi Konten — Melukis Sambelia

Dokumen ini menjelaskan cara menambah dan mengubah konten pada website Melukis Sambelia tanpa perlu mengubah kode.

## Prinsip Dasar

- Konten utama disimpan sebagai file **Markdown** (`.md`) atau **MDX** (`.mdx`) di folder `content/`.
- Setiap file memiliki **frontmatter** di bagian atas (di antara tanda `---`) yang berisi metadata.
- Isi setelah frontmatter akan ditampilkan sebagai deskripsi/body di halaman detail atau modal.
- Gambar disimpan di folder `public/images/` dan direferensikan dengan path `/images/...`.

## Daftar Koleksi Konten

| Koleksi | Folder | File | Contoh File | Penjelasan Singkat |
|---|---|---|---|---|
| Pariwisata | `content/pariwisata/` | `.mdx` | `desa-wisata-sugian.mdx` | Destinasi wisata, budaya, pantai, desa wisata |
| Irigasi | `content/irigasi/` | `.md` | `saluran-sugian.md` | Data saluran irigasi dan kondisinya |
| Kesehatan | `content/kesehatan/` | `.md` | `puskesmas-sambelia.md` | Fasilitas kesehatan, posyandu, bidan |
| UMKM | `content/umkm/` | `.md` | `peyek-mangrove.md` | Produk dan pelaku UMKM lokal |
| Kegiatan | `content/kegiatan/` | `.mdx` | `survei-irigasi.mdx` | Program unggulan dengan roadmap |
| Festival | `content/festival/` | `.md` | `gendang-beleq.md` | Acara Festival Pesona Sambelia |
| Desa | `content/desa/` | `.md` | `sambelia.md` | Profil desa/kelurahan |
| Lingkungan | `content/lingkungan/` | `.md` | `peta-ndvi.md` | Analisis vegetasi, erosi, blue carbon |
| Air Tanah | `content/air-tanah/` | `.md` | `air-tanah.md` | Data TMA dan kualitas air |

> **Catatan:** Koleksi lama `cerita` sudah digabungkan ke **Kegiatan** (`content/kegiatan/`). Jika ada file lama di `content/cerita/`, pindahkan ke `content/kegiatan/` dan sesuaikan frontmatter-nya.

## Skema Frontmatter per Koleksi

### Pariwisata (`content/pariwisata/*.mdx`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | ✅ | Nama destinasi |
| `category` | enum | ✅ | `Pantai`, `Budaya`, `Desa Wisata`, `Air`, `Trekking` |
| `village` | enum | ✅ | Nama desa atau `lainnya` |
| `cover` | string | ✅ | Path gambar cover, mis. `/images/content/hero.png` |
| `shortDesc` | string | ✅ | Deskripsi singkat |
| `body` | string | ✅ | Isi artikel (MDX body) |
| `lat` | number | ✅ | Lintang (-90 s.d. 90) |
| `lng` | number | ✅ | Bujur (-180 s.d. 180) |
| `facilities` | string[] | ❌ | Daftar fasilitas, default `[]` |
| `accessNotes` | string | ❌ | Catatan akses, default `''` |
| `gallery` | string[] | ❌ | Daftar path gambar, default `[]` |
| `googleMapsUrl` | string | ❌ | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Irigasi (`content/irigasi/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `name` | string | ✅ | Nama saluran |
| `saluranType` | enum | ✅ | `Primer`, `Sekunder`, `Tersier` |
| `village` | enum | ✅ | Nama desa atau `lainnya` |
| `condition` | enum | ✅ | `Baik`, `Rusak Ringan`, `Rusak Berat` |
| `lengthM` | number | ✅ | Panjang saluran (meter, ≥ 0) |
| `flowStatus` | enum | ✅ | `Mengalir`, `Kering`, `Mengalir Sebagian` |
| `cover` | string | ✅ | Path gambar cover |
| `body` | string | ✅ | Isi artikel |
| `lat` | number | ✅ | Lintang |
| `lng` | number | ✅ | Bujur |
| `googleMapsUrl` | string | ❌ | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Kesehatan (`content/kesehatan/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `facilityName` | string | ✅ | Nama fasilitas |
| `type` | enum | ✅ | `Posyandu`, `Puskesmas`, `Bidan`, `Polides` |
| `village` | enum | ✅ | Nama desa atau `lainnya` |
| `cadresCount` | number | ❌ | Jumlah kader, default `0` |
| `stuntingProgram` | boolean | ❌ | Apakah ada program stunting, default `false` |
| `cover` | string | ✅ | Path gambar cover |
| `body` | string | ✅ | Isi artikel |
| `lat` | number | ✅ | Lintang |
| `lng` | number | ✅ | Bujur |
| `googleMapsUrl` | string | ❌ | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | Urutan tampil, default `0` |

### UMKM (`content/umkm/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `name` | string | ✅ | Nama UMKM/produk |
| `owner` | string | ✅ | Nama pemilik |
| `kategori` | enum | ✅ | `Kuliner`, `Jasa`, `Kerajinan`, `Pertanian`, `Perikanan`, `Lainnya` |
| `village` | enum | ✅ | Nama desa atau `lainnya` |
| `contact` | string | ✅ | Info kontak |
| `cover` | string | ✅ | Path gambar cover |
| `body` | string | ✅ | Isi artikel |
| `lat` | number | ✅ | Lintang |
| `lng` | number | ✅ | Bujur |
| `gallery` | string[] | ❌ | Daftar path gambar, default `[]` |
| `googleMapsUrl` | string | ❌ | Link Google Maps jika lokasi tidak tepat di koordinat |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Kegiatan (`content/kegiatan/*.mdx`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | ✅ | Judul kegiatan/catatan |
| `author` | string | ✅ | Penulis/divisi |
| `date` | string | ✅ | Tanggal (wrap dalam tanda kutip, mis. `'2026-07-01'`) |
| `cover` | string | ✅ | Path gambar cover |
| `excerpt` | string | ✅ | Ringkasan singkat |
| `body` | string | ✅ | Isi artikel (MDX body) |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Festival (`content/festival/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `eventName` | string | ✅ | Nama acara |
| `schedule` | string | ✅ | Jadwal acara (wrap dalam tanda kutip) |
| `venue` | string | ✅ | Lokasi acara |
| `description` | string | ✅ | Deskripsi singkat |
| `cover` | string | ✅ | Path gambar cover |
| `registrationUrl` | string | ❌ | Link pendaftaran |
| `body` | string | ❌ | Isi artikel, default `''` |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Desa (`content/desa/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `name` | string | ✅ | Nama desa/kelurahan |
| `description` | string | ✅ | Deskripsi singkat |
| `image` | string | ✅ | Path gambar desa |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Lingkungan (`content/lingkungan/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | ✅ | Judul analisis/peta |
| `category` | enum | ✅ | `Vegetasi`, `Erosi`, `Blue Carbon`, `Lainnya` |
| `cover` | string | ❌ | Path gambar cover, default `/images/content/kegiatan-ekowisata.svg` |
| `description` | string | ✅ | Deskripsi singkat |
| `body` | string | ❌ | Isi artikel, default `''` |
| `order` | number | ❌ | Urutan tampil, default `0` |

### Air Tanah (`content/air-tanah/*.md`)

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | ✅ | Judul data |
| `description` | string | ❌ | Deskripsi, default `''` |
| `credit` | string | ❌ | Sumber/kredit, default `''` |
| `measurements` | array | ❌ | Data TMA/DHL, default `[]` |

## Cara Menambah Konten Baru

1. **Salin file contoh** dari koleksi yang sesuai.
2. **Ubah nama file** menjadi slug yang deskriptif, misalnya `pantai-baru.mdx`.
3. **Isi frontmatter** sesuai skema koleksi (lihat tabel di atas).
4. **Tulis body** di bawah tanda `---` kedua.
5. **Simpan file** dan jalankan verifikasi.

## Menambah Gambar

1. Letakkan gambar di `public/images/content/` (atau subfolder sesuai jenis, misalnya `public/images/festival/`).
2. Referensikan gambar di frontmatter atau body dengan path mulai dari `/images/`, contoh:

```yaml
cover: /images/content/hero-sambelia.png
```

## Menambah Peta / GIS

Website membaca peta tematik dari folder `public/gis/` yang dikelompokkan berdasarkan kategori:

- `public/gis/umum/` — peta GIS umum tim (GeoJSON, gambar, atau PDF)
- `public/gis/air/` — peta kualitas air, TMA, iso-DHL
- `public/gis/irigasi/` — peta irigasi dan titik rawan kekeringan
- `public/gis/vegetasi/` — peta indeks vegetasi, kerawanan erosi, blue carbon

Langkah:

1. Masukkan file ke folder yang sesuai (format: `.geojson`, `.jpg`, `.png`, `.webp`, `.pdf`).
2. (Opsional) Tambahkan deskripsi singkat dengan membuat file `.txt` bernama sama, misalnya `peta-tma.txt` untuk `peta-tma.jpg`.
3. Jalankan `node scripts/build-gis-manifest.mjs` untuk memperbarui daftar peta.
4. Halaman **Peta** akan menampilkan file tersebut sesuai tab kategorinya.

## Verifikasi Sebelum Commit

Jalankan perintah berikut untuk memastikan konten valid:

```bash
npm run validate
# atau: node scripts/validate-content.mjs
```

Skrip ini memeriksa **field wajib** setiap koleksi sesuai skema. Jika ada field yang hilang, akan muncul pesan error. Selain itu, jalankan juga:

```bash
npm run lint
npm run typecheck
npm run test
```

Jika ada pesan error terkait frontmatter, periksa kembali penulisan metadata sesuai tabel skema di atas.

## SEO

Jika menambah halaman baru di `app/`, tambahkan juga metadata singkat di file `page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Judul Halaman',
  description: 'Deskripsi singkat halaman.',
}
```

## Butuh Bantuan?

Jika ada koleksi atau skema baru yang ingin ditambahkan, diskusikan dengan tim pengembang untuk menyesuaikan `lib/schemas.ts` dan komponen tampilannya.