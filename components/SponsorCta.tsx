import Link from 'next/link'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'
import { FadeIn } from './FadeIn'

export function SponsorCta() {
  const s = getSettings()
  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-wine via-terracotta-500 to-gold-500 p-1 shadow-terracotta">
          <Image
            src="/images/design-system/ornament-gold.png"
            alt=""
            fill
            className="absolute inset-0 -z-10 object-contain object-right opacity-30"
            aria-hidden
          />
          <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
          <div className="relative rounded-[1.75rem] bg-page/95 px-6 py-10 text-center backdrop-blur-sm sm:px-12 sm:py-14">
            <h2 className="font-beautique text-display-lg text-brown-900">Dukung Kami</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">
              Jadilah bagian dari perjalanan Melukis Sambelia. Bersama mitra, kami mewujudkan dampak nyata di Kecamatan Sambelia.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/mitra"
                className="w-full rounded-full bg-water-900 px-6 py-3 font-medium text-page shadow-sm transition-all hover:bg-water-500 hover:shadow-lg sm:w-auto"
              >
                Lihat Mitra Kami
              </Link>
              <a
                href={`mailto:${s.contact.email}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-tan-700/40 bg-cream-beige px-6 py-3 font-medium text-brown-900 transition-colors hover:bg-gold-100 sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                {s.contact.email}
              </a>
            </div>
            {s.socials.instagram && (
              <a
                href={`https://instagram.com/${s.socials.instagram}`}
                className="mx-auto mt-4 inline-flex items-center gap-2 text-sm text-ink/70 hover:text-terracotta-500"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                @{s.socials.instagram}
              </a>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
