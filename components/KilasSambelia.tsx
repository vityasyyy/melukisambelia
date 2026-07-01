import Image from 'next/image'
import { getCollection } from '@/lib/content'
import { FadeIn } from './FadeIn'
import { StaggerContainer, StaggerItem } from './Stagger'

export function KilasSambelia() {
  const pariwisata = getCollection('pariwisata')
  const umkm = getCollection('umkm')

  const items = [
    ...pariwisata.flatMap((p) =>
      p.gallery.length > 0
        ? p.gallery.map((src) => ({ src, alt: p.title, href: `/pariwisata/${p.slug}` }))
        : [{ src: p.cover, alt: p.title, href: `/pariwisata/${p.slug}` }]
    ),
    ...umkm.flatMap((u) =>
      u.gallery.length > 0
        ? u.gallery.map((src) => ({ src, alt: u.name, href: `/umkm` }))
        : [{ src: u.cover, alt: u.name, href: `/umkm` }]
    ),
  ].filter((i) =>
    !i.src.includes('gallery-') &&
    !i.src.includes('imlek') &&
    !i.src.includes('ramadhan') &&
    !i.src.includes('nelayan')
  )

  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <FadeIn>
        <h2 className="mb-8 text-center font-beautique text-display-lg text-brown-900">Kilas Sambelia</h2>
      </FadeIn>
      <StaggerContainer stagger={0.06} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.slice(0, 9).map((item, idx) => (
          <StaggerItem key={`${item.src}-${idx}`} className="mb-4 block break-inside-avoid">
            <a
              href={item.href}
              className="group block rounded-2xl border border-tan-700/12 bg-white p-1 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
