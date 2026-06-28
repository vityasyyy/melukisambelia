# Panduan Deploy — Melukis Sambelia

Panduan lengkah demi langkah men-deploy website Melukis Sambelia ke **Vercel** dan mengaktifkan Decap CMS dengan GitHub OAuth.

---

## TL;DR (Quick Start)

```bash
# 1. Push ke GitHub
git push origin main

# 2. Di Vercel: New Project → pilih repo melukisambelia → Deploy
#    (Framework: Next.js, Build: npm run build — terdeteksi otomatis)

# 3. Bikin GitHub OAuth App → set callback ke https://[domain]/api/auth

# 4. Set env vars di Vercel:
#    GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET

# 5. Redeploy → buka /admin → Login with GitHub
```

---

## Prasyarat

- Akun GitHub dengan repo `melukisambelia` (kode situs)
- Akun Vercel (gratis, daftar di https://vercel.com — bisa login dengan GitHub)
- Node.js 18+ terpasang lokal (untuk editing lokal)

---

## Langkah 1: Push kode ke GitHub

```bash
git push origin main
```

Pastikan semua kode terbaru ada di branch `main` di GitHub.

## Langkah 2: Import project ke Vercel

1. Buka https://vercel.com → klik **New Project**
2. Pilih repo `melukisambelia` dari daftar (atau **Import Git Repository** jika belum terhubung)
3. Vercel akan mendeteksi Next.js otomatis. Pengaturan yang benar:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
   - **Output Directory:** *(kosongkan — biarkan default, Next.js menangani)*
4. Klik **Deploy**

> **Penting:** Jangan set "Output Directory" ke `out/`. Project ini menggunakan Next.js standar (bukan static export) agar fungsi serverless `api/auth` untuk Decap CMS bisa berjalan.

Tunggu hingga build selesai. Vercel akan memberikan URL seperti `https://melukis-sambelia.vercel.app`.

## Langkah 3: Buat GitHub OAuth App

OAuth app dibutuhkan agar Decap CMS bisa login dengan GitHub dan commit perubahan konten ke repo.

1. Buka GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Isi:
   - **Application name:** `Melukis Sambelia CMS`
   - **Homepage URL:** `https://melukis-sambelia.vercel.app` (atau domain custom Anda)
   - **Authorization callback URL:** `https://melukis-sambelia.vercel.app/api/auth`
3. Klik **Register application**
4. Catat **Client ID**
5. Klik **Generate a new client secret** → catat **Client Secret** (hanya muncul sekali!)

> **Catatan:** Callback URL harus persis `https://[domain]/api/auth` (termasuk `https://`). Fungsi `api/auth.ts` berjalan sebagai Vercel Serverless Function otomatis (tidak perlu konfigurasi tambahan).

## Langkah 4: Set environment variables di Vercel

1. Buka project Melukis Sambelia di dashboard Vercel
2. **Settings** → **Environment Variables**
3. Tambahkan dua variabel:
   - `GITHUB_OAUTH_CLIENT_ID` = Client ID dari Langkah 3
   - `GITHUB_OAUTH_CLIENT_SECRET` = Client Secret dari Langkah 3
4. Klik **Save**
5. **Deployments** → klik **Redeploy** pada deploy terbaru (agar env vars aktif)

## Langkah 5: Verifikasi CMS

1. Buka `https://melukis-sambelia.vercel.app/admin`
2. Klik **Login with GitHub**
3. Authorize aplikasi (GitHub akan meminta izin untuk repo)
4. Anda akan melihat daftar koleksi: Pariwisata, Irigasi, Kesehatan, Festival, Cerita, UMKM, Air & Tanah, Pengaturan Situs, Peta GIS
5. Coba edit satu entri (misalnya, ubah tagline hero) → klik **Save** → **Publish**
6. Cek repo GitHub: harus ada commit baru dari Decap CMS
7. Vercel akan auto-redeploy dengan konten baru (±1-2 menit)

---

## Checklist Post-Deploy

Setelah deploy, verifikasi semua berfungsi:

- [ ] Buka `https://[domain]` — halaman beranda muncul dengan hero + gambar `personstanding.webp`
- [ ] Buka `/pariwisata`, `/irigasi`, `/kesehatan`, `/umkm`, `/festival`, `/cerita`, `/air-tanah`, `/lingkungan`, `/peta`, `/tentang-sambelia` — semua halaman 200 (tidak 404)
- [ ] Cek browser console — tidak ada error 404 untuk gambar
- [ ] Buka `/umkm` → klik filter kategori (Kuliner, Kerajinan, dll) — kartu muncul, tidak blank
- [ ] Buka `/admin` → Login with GitHub berhasil
- [ ] Edit satu entri di CMS → Publish → cek GitHub ada commit baru
- [ ] Vercel auto-redeploy setelah commit CMS
- [ ] Scroll di halaman mana pun — progress bar di atas + tombol "back to top" muncul
- [ ] Cek di mobile — layout responsive

---

## Domain Custom (Opsional)

1. Vercel dashboard → project → **Settings** → **Domains**
2. Tambahkan domain custom (misalnya `melukissambelia.id`)
3. Ikuti instruksi DNS dari Vercel (tambah CNAME/A record di domain registrar)
4. Update **Authorization callback URL** di GitHub OAuth App ke domain baru: `https://melukissambelia.id/api/auth`
5. Update juga **Homepage URL** di OAuth App ke domain baru
6. Update `metadataBase` di `app/layout.tsx` dan `app/robots.ts` / `app/sitemap.ts` ke domain baru

---

## Troubleshooting

**CMS login gagal / "Unable to authenticate":**
- Pastikan callback URL di GitHub OAuth App persis `https://[domain]/api/auth` (termasuk `https://`)
- Pastikan env vars `GITHUB_OAUTH_CLIENT_ID` & `GITHUB_OAUTH_CLIENT_SECRET` ter-set di Vercel
- Pastikan sudah **Redeploy** setelah set env vars
- Cek Vercel → Functions → logs untuk `api/auth` (lihat error spesifik)

**Build gagal di Vercel:**
- Cek apakah `npm run build` lulus lokal:
  ```bash
  npm run build
  ```
- Lihat build logs di Vercel untuk error spesifik
- Jika error "output: 'export'", pastikan `next.config.mjs` TIDAK punya baris `output: 'export'`

**Konten tidak update setelah edit CMS:**
- Cek GitHub: apakah commit masuk ke branch `main`?
- Cek Vercel: apakah auto-deploy berjalan? (lihat tab Deployments)
- Hard refresh browser (Ctrl+Shift+R) — mungkin cache

**Gambar 404:**
- Jalankan lokal: `node scripts/check-images.mjs` — akan list semua path gambar yang missing
- Pastikan path gambar diawali `/images/` dan file ada di `public/images/`

**Error "Module not found":**
- Jalankan `npm install` lokal lalu commit `package-lock.json`

**Fungsi `api/auth` tidak jalan:**
- Pastikan `next.config.mjs` TIDAK menggunakan `output: 'export'` (static export tidak mendukung serverless function)
- File `api/auth.ts` harus berada di root project (bukan di `app/api/`)
- Vercel otomatis deteksi file di folder `api/` sebagai Serverless Function

---

## Editing Lokal (tanpa deploy)

Anda bisa edit konten secara lokal tanpa GitHub OAuth:

```bash
# Terminal 1 — jalankan website
npm run dev

# Terminal 2 — jalankan CMS proxy lokal
npx decap-server
```

Buka `http://localhost:3000/admin` → CMS muncul tanpa login, edit file lokal langsung. Tidak perlu konfigurasi OAuth.

---

## Struktur Deployment

```
GitHub repo (main branch)
        ↓ push
   Vercel auto-build
        ↓
   npm run build (prebuild: GIS manifest + OG image + check-images)
        ↓
   Next.js build → Vercel CDN
        ↓
   Static pages + Serverless functions (api/auth)
        ↓
   Live at https://melukis-sambelia.vercel.app
```

**Yang berjalan di Vercel:**
- Halaman statis (semua route di `app/`) — di-cache di CDN
- Serverless function `api/auth` — untuk Decap CMS OAuth
- Image optimization: **disabled** (`images.unoptimized: true`) untuk kompatibilitas. Bisa diaktifkan nanti jika ingin image optimization Vercel (hapus `unoptimized: true` di `next.config.mjs`).

---

## Lihat Juga

- [`docs/CONTENT_ADMIN_GUIDE.md`](./CONTENT_ADMIN_GUIDE.md) — panduan lengkap konten untuk admin
- [`docs/cms-content-guide.md`](./cms-content-guide.md) — panduan singkat CMS
- [`docs/CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) — panduan teknis kontribusi konten
- [`docs/decap-oauth-setup.md`](./decap-oauth-setup.md) — detail setup OAuth