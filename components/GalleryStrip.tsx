'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/components/Lightbox'

export function GalleryStrip({ images, altPrefix = 'Galeri' }: { images: string[]; altPrefix?: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (images.length === 0) return null

  const lightboxImages = images.map((src, i) => ({ src, alt: `${altPrefix} ${i + 1}` }))

  return (
    <>
      <div className="group/gallery relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((src, i) => (
            <button
              key={i}
              className="relative h-40 w-60 shrink-0 rounded-xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              onClick={() => {
                setLightboxIndex(i)
                setLightboxOpen(true)
              }}
            >
              <Image src={src} alt={`${altPrefix} ${i + 1}`} fill className="object-cover" sizes="240px" />
            </button>
          ))}
        </div>
        {images.length > 2 && (
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-page to-transparent opacity-0 transition-opacity group-hover/gallery:opacity-100" />
        )}
      </div>
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  )
}