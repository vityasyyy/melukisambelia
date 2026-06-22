# Panduan Konten CMS — Melukis Sambelia

Panduan untuk anggota tim non-teknis untuk menambah dan mengedit konten website Melukis Sambelia melalui Decap CMS.

## Cara Mengakses CMS

### Mode Lokal (di komputer tim)

1. Buka terminal di folder project
2. Jalankan: `npm run dev`
3. Buka terminal baru, jalankan: `npx decap-server`
4. Buka browser: `http://localhost:3000/admin`
5. CMS muncul tanpa perlu login — edit langsung, perubahan tersimpan di file lokal

### Mode Online (setelah deploy)

1. Buka `https://melukis-sambelia.vercel.app/admin` (atau domain custom)
2. Klik **Login with GitHub**
3. Authorize aplikasi
4. Pilih koleksi yang ingin di-edit
5. Setelah **Save** + **Publish**, perubahan commit ke GitHub dan situs auto-update

## Koleksi Konten

### Tim (Profil Tim)

Data anggota tim KKN.

| Field | Penjelasan | Contoh |
|-------|-----------|--------|
| Nama | Nama lengkap anggota | Siti Aminah |
| Peran | Jabatan dalam tim | Ketua Pelaksana |
| Divisi | Pilih dari daftar: Koor, Pariwisata, Irigasi, Kesehatan, Publikasi, Media, Dana, Logistik | Pariwisata |
| Foto | Upload foto (jpg/png, rasio 1:1 / kotak) | — |
| Bio | Deskripsi singkat | Lulusan Sosiologi UGM |
| Instagram | Username IG tanpa @ (opsional) | sitiii |
| Urutan | Nomor urutan tampil di halaman | 1 |

### Pariwisata

Destinasi wisata di Sambelia.

| Field | Penjelasan | Contoh |
|-------|-----------|--------|
| Judul | Nama destinasi | Pantai Berandangan |
| Kategori | Pantai, Budaya, Desa Wisata, Air, Trekking | Pantai |
| Desa | Sugian, Labuhan Pandan, atau lainnya | Sugian |
| Cover | Foto utama (jpg, rasio 16:9) | — |
| Galeri | Daftar foto tambahan | — |
| Deskripsi Singkat | Satu kalimat untuk card di beranda | Pantai pasir putih di Desa Sugian |
| Konten | Deskripsi lengkap (markdown) | — |
| Latitude | Garis lintang (untuk peta) | -8.3583 |
| Longitude | Garis bujur (untuk peta) | 116.8417 |
| Fasilitas | Daftar fasilitas (toilet, parkir, dll) | ["Toilet", "Parkir"] |
| Catatan Akses | Cara menuju lokasi | ±30 menit dari Sambelia |

**Cara menemukan Latitude/Longitude:**
1. Buka https://www.openstreetmap.org
2. Cari lokasi (klik kanan pada peta → "Show address")
3. Koordinat muncul dalam format `lat, lng` (misal: -8.3583, 116.8417)
4. Atau di Google Maps: klik kanan pada lokasi → koordinat muncul di atas

**Penting:** Setiap entri Pariwisata dengan lat/lng akan **otomatis muncul sebagai marker di halaman Peta**.

### Irigasi

Data saluran irigasi.

| Field | Penjelasan |
|-------|-----------|
| Nama Saluran | Nama saluran |
| Tipe | Primer, Sekunder, Tersier |
| Desa | Sugian, Labuhan Pandan, lainnya |
| Kondisi | Baik, Rusak Ringan, Rusak Berat |
| Panjang (m) | Panjang saluran dalam meter |
| Status Aliran | Mengalir, Kering, Mengalir Sebagian |
| Cover | Foto saluran |
| Konten | Deskripsi kondisi dan catatan |
| Latitude/Longitude | Lokasi saluran di peta |

### Kesehatan

Fasilitas dan program kesehatan.

| Field | Penjelasan |
|-------|-----------|
| Nama Fasilitas | Posyandu Sugian, Puskesmas Sambelia, dll |
| Tipe | Posyandu, Puskesmas, Bidan, Polides |
| Desa | — |
| Jumlah Kader | Jumlah kader posyandu |
| Program Stunting | Ya/Tidak (centang jika fasilitas ini ikut program stunting) |
| Cover | Foto fasilitas |
| Konten | Deskripsi layanan |
| Latitude/Longitude | Lokasi di peta |

### Festival

Acara Festival Pesona Sambelia.

| Field | Penjelasan |
|-------|-----------|
| Nama Acara | Peresean, Pawai Dulangan, Gendang Beleq, dll |
| Jadwal | Tanggal/jam (bebas teks) |
| Lokasi | Tempat penyelenggaraan |
| Deskripsi | Penjelasan singkat |
| Cover | Foto acara |
| URL Pendaftaran | Link pendaftaran jika ada (opsional) |
| Konten | Detail acara |

### Kegiatan

Program unggulan tim dengan roadmap milestone.

| Field | Penjelasan |
|-------|-----------|
| Judul | Nama program |
| Status | Aktif, Berkembang, Persiapan |
| Kategori | Ekowisata, Irigasi, Kesehatan, Pariwisata, Ekonomi |
| Cover | Foto program |
| Ringkasan | Satu kalimat |
| Konten | Deskripsi lengkap |
| Milestone | Daftar milestone dengan: Tanggal, Label, Selesai (centang jika sudah) |

### Cerita

Artikel/catatan lapangan tim.

| Field | Penjelasan |
|-------|-----------|
| Judul | Judul artikel |
| Penulis | Pilih dari daftar anggota tim |
| Tanggal | Tanggal publikasi |
| Cover | Foto cover artikel |
| Ringkasan | Excerpt untuk card di beranda |
| Konten | Isi artikel (markdown — bisa pakai format teks) |

### UMKM

Direktori UMKM lokal.

| Field | Penjelasan |
|-------|-----------|
| Nama UMKM | Nama usaha |
| Pemilik | Nama pemilik/kelompok |
| Produk | Kerajinan, Kuliner, Pertanian, Anyaman, lainnya |
| Desa | — |
| Kontak | Nomor HP / Instagram / WhatsApp (opsional) |
| Cover | Foto produk |
| Galeri | Foto produk tambahan |
| Konten | Deskripsi usaha |
| Latitude/Longitude | Lokasi (opsional — jika diisi, muncul di peta) |

### Mitra

Logo mitra/sponsor.

| Field | Penjelasan |
|-------|-----------|
| Nama | Nama mitra |
| Logo | Upload logo (PNG/SVG) |
| URL | Website mitra |
| Tingkat | Utama, Pendukung, Media |
| Urutan | Nomor urutan tampil |

### Pengaturan Situs

Konfigurasi global situs.

- **Gambar Hero:** gambar latar belakang halaman beranda
- **Tagline Hero:** teks di bawah judul beranda
- **Statistik:** angka-angka di section "Tentang Sambelia" (Luas, Penduduk, Desa Binaan, Tahun Program)
- **Tanggal Festival:** teks bebas
- **Sosial:** username Instagram & TikTok (tanpa @)
- **Kontak:** email, telepon, alamat

## Tips Upload Gambar

- **Format:** JPG untuk foto, PNG untuk logo, SVG untuk grafik
- **Ukuran maksimal:** sebaiknya < 500KB per gambar
- **Rasio:**
  - Cover Pariwisata/UMKM/Kegiatan: 16:9 (landscape)
  - Foto Tim: 1:1 (kotak)
  - Cover Cerita: 16:9
  - Logo Mitra: bebas (akan di-resize otomatis)
- **Cara kompres:** gunakan https://tinypng.com sebelum upload jika foto terlalu besar

## Tips Menulis Konten

- Gunakan bahasa Indonesia yang jelas dan ramah
- Untuk **Konten** field (markdown), Anda bisa pakai:
  - `**tebal**` untuk teks tebal
  - `*miring*` untuk teks miring
  - `- item` untuk daftar bullet
  - `# Judul` untuk heading
- Tulis deskripsi yang akurat — hindari spekulasi jika belum survei
- Tandai konten placeholder dengan: *Catatan: Deskripsi ini adalah placeholder.*