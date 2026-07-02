import Link from 'next/link'
import Image from 'next/image'
import { Mail, ExternalLink } from 'lucide-react'
import { getSettings, getFooter } from '@/lib/settings'

export function Footer() {
  const s = getSettings()
  const footer = getFooter()
  return (
    <footer className="relative overflow-hidden bg-wine text-cream-light">
      <div
        className="relative h-[3px] bg-gradient-to-r from-water-900 via-gold-bright to-terracotta-500 opacity-90"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-4 py-10 md:py-14">
        <div className="grid gap-6 md:gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/images/design-system/bw_logo_sambel.svg"
              alt="Sambelia"
              width={180}
              height={54}
              className="brightness-110"
              style={{ height: 'auto', width: 'auto' }}
            />
            <p className="mt-4 text-sm text-cream-light/85">{footer.tagline}</p>
            <p className="mt-2 text-sm text-cream-light/75">{s.contact.address}</p>
          </div>
          <nav aria-label="Navigasi footer">
            <h2 className="mb-4 font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-goldSoft">Navigasi</h2>
            <ul className="space-y-2 text-sm text-cream-light/85">
              <li><Link href="/tentang-sambelia" className="transition-colors hover:text-goldSoft">Tentang Sambelia</Link></li>
              <li><Link href="/kegiatan" className="transition-colors hover:text-goldSoft">Kegiatan</Link></li>
              <li><Link href="/peta" className="transition-colors hover:text-goldSoft">Peta</Link></li>
              <li><Link href="/pariwisata" className="transition-colors hover:text-goldSoft">Pariwisata</Link></li>
              <li><Link href="/irigasi" className="transition-colors hover:text-goldSoft">Irigasi</Link></li>
              <li><Link href="/kesehatan" className="transition-colors hover:text-goldSoft">Kesehatan</Link></li>
              <li><Link href="/air-tanah" className="transition-colors hover:text-goldSoft">Air & Tanah</Link></li>
              <li><Link href="/lingkungan" className="transition-colors hover:text-goldSoft">Lingkungan</Link></li>
              <li><Link href="/umkm" className="transition-colors hover:text-goldSoft">UMKM</Link></li>
              <li><Link href="/festival" className="transition-colors hover:text-goldSoft">Festival</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-goldSoft">Kontak & Sosial</h2>
            <div className="space-y-3">
              {s.socials.instagram && (
                <a
                  href={`https://instagram.com/${s.socials.instagram}`}
                  className="flex items-center gap-2 text-sm text-cream-light/85 transition-colors hover:text-goldSoft"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  @{s.socials.instagram}
                </a>
              )}
              {s.socials.tiktok && (
                <a
                  href={`https://tiktok.com/@${s.socials.tiktok}`}
                  className="flex items-center gap-2 text-sm text-cream-light/85 transition-colors hover:text-goldSoft"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  @{s.socials.tiktok}
                </a>
              )}
              {s.contact.email && (
                <a
                  href={`mailto:${s.contact.email}`}
                  className="flex items-center gap-2 text-sm text-cream-light/85 transition-colors hover:text-goldSoft"
                >
                  <Mail className="h-4 w-4" />
                  {s.contact.email}
                </a>
              )}
            </div>
            <div className="mt-5 flex items-center gap-3">
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
        <div className="relative mt-8 md:mt-12 border-t border-cream-light/20 pt-6 text-center text-xs text-cream-light/75">
          {footer.copyright}
        </div>
      </div>
    </footer>
  )
}