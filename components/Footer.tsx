import Link from 'next/link'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'

export function Footer() {
  const s = getSettings()
  return (
    <footer className="bg-brown-900 text-page mt-20">
      <div
        className="h-2 bg-gradient-to-r from-terracotta-500 via-gold-500 to-water-900"
        aria-hidden
      />
      <div className="mx-auto max-w-content px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Image src="/images/design-system/bw_logo_sambel.svg" alt="Melukis Sambelia" width={180} height={54} />
          <p className="mt-3 text-sm text-page/70">KKN-PPM UGM Melukis Sambelia 2026</p>
          <p className="text-sm text-page/60">{s.contact.address}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Navigasi</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/profil-tim">Profil Tim</Link></li>
            <li><Link href="/peta">Peta</Link></li>
            <li><Link href="/pariwisata">Pariwisata</Link></li>
            <li><Link href="/cerita">Cerita</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Sosial</h3>
          {s.socials.instagram && <p><a href={`https://instagram.com/${s.socials.instagram}`} className="text-sm hover:underline">@{s.socials.instagram}</a></p>}
          {s.socials.tiktok && <p><a href={`https://tiktok.com/@${s.socials.tiktok}`} className="text-sm hover:underline">@{s.socials.tiktok}</a></p>}
          <p className="text-sm text-page/60 mt-2">{s.contact.email}</p>
          <div className="mt-4 flex gap-2">
            <Image src="/images/design-system/logo_kkn_ugm.svg" alt="KKN-PPM UGM" width={48} height={48} />
            <Image src="/images/design-system/logo_ugm_text.svg" alt="UGM" width={120} height={48} />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-page/50 py-4">© 2026 KKN-PPM UGM Melukis Sambelia</div>
    </footer>
  )
}