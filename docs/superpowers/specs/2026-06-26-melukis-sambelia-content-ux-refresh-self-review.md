# Self-Review: Melukis Sambelia Content & UX Refresh

Tanggal: 2026-06-26
Cabang: `feature/content-ux-refresh`

## Status

Implementasi Approach B selesai. Semua verifikasi otomatis lulus:

- `pnpm run test` — 12 passed
- `pnpm run lint` — no warnings/errors
- `pnpm run typecheck` — clean
- `pnpm run build` — 25 halaman berhasil di-static export
- HTTP smoke test — semua route utama 200
- Dev log — tidak ada error `marker-icon-2x.png` / `marker-shadow.png`

## Temuan dan Tindakan

### 1. Server/Client Split untuk Listing Pages

**Temuan:** Saat pertama kali membuat listing page menjadi client component agar bisa pakai `useState` untuk modal, build gagal karena `lib/content.ts` mengimpor `fs` (Node-only). Client component tidak boleh mengakses modul Node.

**Tindakan:** Refactor setiap listing page menjadi:
- Server page (`app/.../page.tsx`) yang memanggil `getCollection()` dan meneruskan data ke client component.
- Client list component (`components/*ListClient.tsx`) yang menangani state modal, tanpa menyentuh `fs`.

Hasil: build kembali berhasil dan halaman tetap prerender secara static.

### 2. Leaflet Marker 500 Error

**Temuan:** `MiniMap.tsx` menggunakan `L.Icon.Default.mergeOptions` yang masih memicu request ke `marker-icon-2x.png` dan `marker-shadow.png`, menyebabkan 500 error di route dinamis `/pariwisata/[slug]`.

**Tindakan:** Mengganti dengan `L.icon({...})` eksplisit untuk setiap `Marker`. Tidak ada lagi request asset default Leaflet.

### 3. Peta Page Reorganization

**Temuan:** `GisMap.tsx` sebelumnya fetch manifest di client dan memiliki tipe internal sendiri.

**Tindakan:**
- Membuat `lib/gis-manifest.ts` dengan tipe terpusat (`GisCategory`, `GisFile`, `GisManifest`).
- Membuat `lib/gis.ts` untuk load manifest di server.
- Mengupdate `scripts/build-gis-manifest.mjs` agar membaca subfolder `public/gis/{umum,air,irigasi,vegetasi}` dan menyertakan `category`.
- Menambahkan `PetaSection.tsx` untuk menampilkan grid asset image/PDF per kategori.
- Mengupdate `MapPanel.tsx` menjadi tab: Interaktif, GIS Tim, Air & TMA, Irigasi & Kekeringan, Vegetasi/Erosi/Blue Carbon.

### 4. Cross-Linking

**Temuan:** Belum ada cara mudah untuk menghubungkan konten ke peta.

**Tindakan:** Membuat `lib/links.ts` dengan `petaLink({ tab, layer, lat, lng })`, dan memperbarui `InteractiveMap.tsx` agar membaca query string `layer`, `lat`, `lng` untuk memfilter/fokus peta saat halaman dibuka dari link.

### 5. Placeholder Images dan Text

**Temuan:** Hero image, cover pariwisata, cover kesehatan, cover irigasi, cover kegiatan, dan beberapa deskripsi masih menggunakan placeholder SVG/text.

**Tindakan:**
- Hero: `hero-sambelia.png` dari foto alam `labuanpandan.png`.
- Pariwisata: cover diganti dengan foto alam (kondo, rilistema, sugian, peopleplaying, dance).
- Kesehatan & Irigasi: cover diganti dengan foto alam.
- Kegiatan: cover diganti dengan foto alam.
- Deskripsi body diperkaya dan dihapus catatan placeholder eksplisit.
- `_settings.md`: luas/penduduk diisi angka perkiraan, festivalDates diisi rentang.

**Sisa placeholder (diterima untuk sementara):**
- `content/cerita/*` masih pakai cover placeholder dan catatan placeholder — menunggu konten nyata.
- `content/tim/*` masih pakai photo placeholder — menunggu foto anggota tim.
- Festival `schedule` masih TBD — menunggu jadwal final.

### 6. SEO Metadata

**Temuan:** Hanya layout default yang punya metadata; halaman lain belum punya title/deskripsi spesifik.

**Tindakan:** Menambahkan `generateMetadata` / `metadata` export di:
- `app/layout.tsx` — title template `%s — Melukis Sambelia`.
- `app/page.tsx`, `app/tentang-sambelia/page.tsx`, `app/cerita/page.tsx`, `app/cerita/[slug]/page.tsx`, `app/festival/page.tsx`, `app/mitra/page.tsx`, `app/peta/page.tsx`, `app/kegiatan/page.tsx`.
- Listing pages (pariwisata, irigasi, kesehatan, umkm) memakai metadata di server page.

### 7. Content Guide

**Tindakan:** Menulis `docs/CONTENT_GUIDE.md` yang menjelaskan koleksi konten, cara menambah gambar, cara menambah peta/GIS, dan verifikasi sebelum commit.

## Rekomendasi ke Approach C (Future Work)

1. **Data Hub `/data`** — halaman indeks yang mengelompokkan semua tema data dalam satu tampilan navigasi.
2. **Dedicated Pages untuk Air/TMA dan Vegetasi/Erosi/Blue Carbon** — promosi dari tab Peta menjadi halaman first-class dengan deskripsi ilmiah dan daftar peta yang lebih kaya.
3. **Search/Filter** — fitur pencarian lintas koleksi.
4. **Schema.org JSON-LD** — untuk organisasi, tempat, dan acara.
5. **Tim/Cerita Content Completion** — ganti placeholder foto dan cerita setelah material lapangan tersedia.
6. **Festival Schedule Finalization** — update jadwal setelah tanggal pasti ditentukan.
7. **Real Geography Stats** — ganti angka perkiraan luas/penduduk dengan data resmi BPS/sekdes.

## Kesimpulan

Tidak ada critical fix yang harus dilakukan segera. Build, test, lint, dan smoke test semua lulus. Temuan minor berupa sisa placeholder sudah didokumentasikan sebagai future work yang masuk akal karena bergantung pada material lapangan/jadwal final tim.
