import Image from 'next/image'
import { getCollection } from '@/lib/content'

export function KilasSambelia() {
  const pariwisata = getCollection('pariwisata')
  const umkm = getCollection('umkm')

  const items = [
    ...pariwisata.flatMap((p) => p.gallery.map((src) => ({ src, alt: p.title, href: `/pariwisata/${p.slug}` }))),
    ...umkm.flatMap((u) => u.gallery.map((src) => ({ src, alt: u.name, href: `/umkm` }))),
  ].filter((i) =>
    !i.src.includes('gallery-') &&
    !i.src.includes('imlek') &&
    !i.src.includes('ramadhan') &&
    !i.src.includes('nelayan')
  )

  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-content px-4 py-16">
      <h2 className="mb-8 text-center font-beautique text-display-lg text-brown-900">Kilas Sambelia</h2>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.slice(0, 9).map((item, idx) => (
          <a
            key={`${item.src}-${idx}`}
            href={item.href}
            className="group mb-4 block break-inside-avoid rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-1 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover"
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
        ))}
      </div>
    </section>
  )
}
