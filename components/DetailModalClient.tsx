'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Lightbox } from '@/components/Lightbox'

export type Chip = { label: string; color?: string }

export type DetailModalData = {
  title: string
  image?: string
  gallery?: { src: string; alt: string }[]
  chips?: Chip[]
  description?: string
  body?: React.ReactNode
  href?: string
  linkLabel?: string
  lat?: number
  lng?: number
  mapTitle?: string
  googleMapsUrl?: string
}

export function DetailModalClient({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: DetailModalData | null
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartY = useRef(0)
  const touchCurrentY = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)

  if (!data) return null
  const { title, image, gallery, chips, description, body, href, linkLabel, lat, lng, googleMapsUrl } = data
  const hasMap = typeof lat === 'number' && typeof lng === 'number'
  const mapsLink = googleMapsUrl || (hasMap ? `https://www.google.com/maps?q=${lat},${lng}` : undefined)

  const lightboxImages = gallery ?? (image ? [{ src: image, alt: title }] : [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY
    const diff = touchCurrentY.current - touchStartY.current
    if (diff > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${diff}px)`
    }
  }

  const handleTouchEnd = () => {
    const diff = touchCurrentY.current - touchStartY.current
    if (diff > 100) {
      onOpenChange(false)
    }
    if (modalRef.current) {
      modalRef.current.style.transform = ''
    }
    touchStartY.current = 0
    touchCurrentY.current = 0
  }

  return (
    <>
    <Lightbox
      images={lightboxImages}
      initialIndex={0}
      open={lightboxOpen}
      onOpenChange={setLightboxOpen}
    />
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed z-[1001] inset-0 flex flex-col items-stretch sm:items-center sm:justify-center p-0 sm:p-4 focus:outline-none"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-lightbox-trigger]')) return
          }}
        >
          <div
            ref={modalRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative mx-auto w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl max-h-[85dvh] overflow-hidden mt-auto sm:mt-0 transition-transform"
          >
            <DialogPrimitive.Close className="absolute right-2 top-2 z-[1002] flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/90 backdrop-blur-sm text-brown-900 transition-colors hover:bg-cream-light" aria-label="Tutup dialog">
              <X className="h-5 w-5" />
              <span className="sr-only">Tutup</span>
            </DialogPrimitive.Close>

            <div className="max-h-[85dvh] overflow-y-auto overflow-x-hidden">
              {image ? (
                <button
                  type="button"
                  onClick={() => lightboxImages.length > 0 && setLightboxOpen(true)}
                  className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer block"
                >
                  <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light break-words" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{title}</DialogTitle>
                    {description && <DialogDescription className="mt-1 text-sm text-cream-light/85 line-clamp-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{description}</DialogDescription>}
                  </div>
                </button>
              ) : (
                <div className="relative bg-gradient-to-r from-terracotta-500 to-gold-500 px-4 pt-12 pb-4 sm:px-6 sm:pt-14 sm:pb-6">
                  <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light break-words">{title}</DialogTitle>
                  {description && <DialogDescription className="mt-1 text-sm text-cream-light/85">{description}</DialogDescription>}
                </div>
              )}

              <div className="p-4 sm:p-6">
                {chips && chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <span
                        key={c.label}
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={
                          c.color
                            ? { backgroundColor: c.color + '18', color: c.color, border: `1px solid ${c.color}30` }
                            : undefined
                        }
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                )}

                {body && <div className={cn('prose prose-sm mt-4 max-w-none text-ink/80 prose-headings:text-brown-900 prose-p:text-ink/70 break-words', !image && 'mt-2')}>{body}</div>}

                {hasMap && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brown-900">
                      <MapPin className="h-3.5 w-3.5" /> Lokasi
                    </div>
                    <a
                       href={mapsLink}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 rounded-full bg-water-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-water-700"
                     >
                       <MapPin className="h-4 w-4" />
                       Lihat di Peta
                     </a>
                  </div>
                )}

                {href && (
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={href}
                      className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-medium text-page transition-colors hover:bg-wine"
                    >
                      {linkLabel ?? 'Lihat halaman lengkap →'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
    </>
  )
}