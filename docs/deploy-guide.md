# Panduan Deploy — Melukis Sambelia

Panduan langkah demi langkah untuk men-deploy website Melukis Sambelia ke Vercel dan mengaktifkan Decap CMS dengan GitHub OAuth.

## Prasyarat

- Akun GitHub dengan repo `melukisambelia` (kode situs)
- Akun Vercel (gratis, daftar di https://vercel.com — bisa login dengan GitHub)

## Langkah 1: Push kode ke GitHub

Jika belum push:

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
   - **Output Directory:** `out` (dibuat otomatis oleh static export)
   - **Install Command:** `npm install`
4. Klik **Deploy**

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
4. Anda akan melihat daftar koleksi: Tim, Pariwisata, Irigasi, Kesehatan, Festival, Kegiatan, Cerita, UMKM, Mitra, Pengaturan Situs
5. Coba edit satu entri (misalnya, ubah nama anggota tim) → klik **Save** → **Publish**
6. Cek repo GitHub: harus ada commit baru dari Decap CMS
7. Vercel akan auto-redeploy dengan konten baru

## Domain Custom (Opsional)

1. Vercel dashboard → project → **Settings** → **Domains**
2. Tambahkan domain custom (misalnya `melukissambelia.id`)
3. Ikuti instruksi DNS dari Vercel (tambah CNAME/A record di domain registrar)
4. Update **Authorization callback URL** di GitHub OAuth App ke domain baru: `https://melukissambelia.id/api/auth`
5. Update `metadataBase` di `app/layout.tsx` dan `app/robots.ts` / `app/sitemap.ts` ke domain baru

## Troubleshooting

**CMS login gagal:**
- Pastikan callback URL persis `https://[domain]/api/auth` (termasuk `https://`)
- Pastikan env vars ter-set dan Vercel sudah redeploy
- Cek Vercel → Functions → logs untuk `api/auth`

**Build gagal di Vercel:**
- Cek apakah `npm run build` lulus lokal
- Lihat build logs di Vercel untuk error spesifik

**Konten tidak update setelah edit CMS:**
- Cek GitHub: apakah commit masuk?
- Cek Vercel: apakah auto-deploy berjalan?
- Hard refresh browser (Ctrl+Shift+R) — mungkin cache

## Editing Lokal (tanpa deploy)

Anda bisa edit konten secara lokal tanpa GitHub OAuth:

```bash
# Terminal 1
npm run dev

# Terminal 2
npx decap-server
```

Buka `http://localhost:3000/admin` → CMS muncul dan edit file lokal langsung. Tidak perlu login GitHub.