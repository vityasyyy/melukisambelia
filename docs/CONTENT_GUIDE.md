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
| Kegiatan | `content/kegiatan/` | `.md` | `program-stunting.md` | Program unggulan dengan roadmap |
| Festival | `content/festival/` | `.md` | `gendang-beleq.md` | Acara Festival Pesona Sambelia |
| Cerita | `content/cerita/` | `.mdx` | `catatan-lapangan-1.mdx` | Artikel/catatan lapangan tim |
| Mitra | `content/mitra/` | `.md` | `ugm.md` | Logo dan tautan mitra |
| Tim | `content/tim/` | `.md` | `koordinator.md` | Profil anggota tim |

## Cara Menambah Konten Baru

1. **Salin file contoh** dari koleksi yang sesuai.
2. **Ubah nama file** menjadi slug yang deskriptif, misalnya `pantai-baru.mdx`.
3. **Isi frontmatter** sesuai skema koleksi (lihat contoh yang sudah ada).
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
pnpm run test
pnpm run lint
pnpm run typecheck
```

Jika ada pesan error terkait frontmatter, periksa kembali penulisan metadata sesuai contoh yang sudah ada.

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
