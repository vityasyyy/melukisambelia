import Link from 'next/link'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'

export function Footer() {
  const s = getSettings()
  return (
    <footer className="relative mt-20 overflow-hidden bg-wine text-cream-light">
      <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
      <div
        className="relative h-2 bg-gradient-to-r from-terracotta-500 via-gold-500 to-water-900"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/images/design-system/bw_logo_sambel.svg"
              alt="Melukis Sambelia"
              width={180}
              height={54}
              className="brightness-110"
            />
            <p className="mt-4 text-sm text-cream-light/80">KKN-PPM UGM Melukis Sambelia 2026</p>
            <p className="text-sm text-cream-light/60">{s.contact.address}</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-goldSoft">Navigasi</h3>
            <ul className="space-y-2 text-sm text-cream-light/80">
              <li>
                <Link href="/" className="transition-colors hover:text-goldSoft">Beranda</Link>
              </li>
              <li>
                <Link href="/tentang-sambelia" className="transition-colors hover:text-goldSoft">Tentang Sambelia</Link>
              </li>
              <li>
                <Link href="/peta" className="transition-colors hover:text-goldSoft">Peta</Link>
              </li>
              <li>
                <Link href="/pariwisata" className="transition-colors hover:text-goldSoft">Pariwisata</Link>
              </li>
              <li>
                <Link href="/umkm" className="transition-colors hover:text-goldSoft">UMKM</Link>
              </li>
<li>
                <Link href="/cerita" className="transition-colors hover:text-goldSoft">Cerita</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-goldSoft">Sosial</h3>
            {s.socials.instagram && (
              <p>
                <a
                  href={`https://instagram.com/${s.socials.instagram}`}
                  className="text-sm text-cream-light/80 transition-colors hover:text-goldSoft"
                >
                  @{s.socials.instagram}
                </a>
              </p>
            )}
            {s.socials.tiktok && (
              <p>
                <a
                  href={`https://tiktok.com/@${s.socials.tiktok}`}
                  className="text-sm text-cream-light/80 transition-colors hover:text-goldSoft"
                >
                  @{s.socials.tiktok}
                </a>
              </p>
            )}
            <p className="mt-2 text-sm text-cream-light/60">{s.contact.email}</p>
            <div className="mt-5 flex gap-3">
              <Image
                src="/images/design-system/logo_kkn_ugm.svg"
                alt="KKN-PPM UGM"
                width={48}
                height={48}
                className="brightness-110"
              />
            </div>
          </div>
        </div>
        <div className="relative mt-12 border-t border-cream-light/20 pt-6 text-center text-xs text-cream-light/50">
          © 2026 KKN-PPM UGM Melukis Sambelia
        </div>
      </div>
    </footer>
  )
}
