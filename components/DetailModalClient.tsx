'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, X } from 'lucide-react'
import { motion } from 'framer-motion'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Lightbox } from '@/components/Lightbox'
import { ChipRow, type ChipData, type ChipTone } from '@/components/Chip'
import { useReducedMotion } from 'framer-motion'

export type Chip = ChipData
export type { ChipTone }

export type DetailModalData = {
  title: string
  image?: string
  gallery?: { src: string; alt: string }[]
  chips?: ChipData[]
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
  const reduce = useReducedMotion()

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
          className="fixed z-[1101] inset-0 flex flex-col items-stretch sm:items-center sm:justify-center p-0 sm:p-4 focus:outline-none"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-lightbox-trigger]')) return
          }}
        >
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto w-full max-w-lg mt-auto sm:mt-0"
          >
            <div
              ref={modalRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] transition-transform border border-black/10"
            >
              <DialogPrimitive.Close className="absolute right-3 top-3 z-[1102] flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brown-950 backdrop-blur-sm border border-black/10 transition-all hover:bg-white hover:scale-105" aria-label="Tutup dialog">
                <X className="h-4 w-4" />
                <span className="sr-only">Tutup</span>
              </DialogPrimitive.Close>

            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-none">
              {image ? (
                <button
                  type="button"
                  onClick={() => lightboxImages.length > 0 && setLightboxOpen(true)}
                  className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer block"
                  data-lightbox-trigger
                >
                  <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <DialogTitle className="font-beautique text-xl sm:text-2xl text-white break-words" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>{title}</DialogTitle>
                    {description && <DialogDescription className="mt-1 text-sm text-white/90 line-clamp-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{description}</DialogDescription>}
                  </div>
                </button>
              ) : (
                <div className="px-4 pt-12 pb-4 sm:px-6 sm:pt-14 sm:pb-6">
                  <DialogTitle className="font-beautique text-xl sm:text-2xl text-brown-900 break-words">{title}</DialogTitle>
                  {description && <DialogDescription className="mt-1 text-sm text-ink/60">{description}</DialogDescription>}
                </div>
              )}

              <div className="p-4 sm:p-6">
                {chips && chips.length > 0 && (
                  <ChipRow chips={chips} />
                )}

                {body && (
                  <>
                    {chips && chips.length > 0 && <Separator className="my-4 bg-tan-700/15" />}
                    <div className={cn('prose prose-sm max-w-none text-ink/80 prose-headings:text-brown-900 prose-headings:font-semibold prose-p:text-ink/70 break-words', !image && !chips?.length && 'mt-0', image && !chips?.length && 'mt-4')}>{body}</div>
                  </>
                )}

                {hasMap && (
                  <>
                    <Separator className="my-5 bg-tan-700/15" />
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brown-900">
                        <MapPin className="h-3.5 w-3.5" /> Lokasi
                      </div>
                      <a
                         href={mapsLink}
                         target="_blank"
                         rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-brown-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02]"
                       >
                         <MapPin className="h-4 w-4" />
                          Lihat di Google Maps
                       </a>
                    </div>
                  </>
                )}

                {href && (
                  <>
                    <Separator className="my-5 bg-tan-700/15" />
                    <div className="flex justify-end">
                      <Link
                        href={href}
                         className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-700 hover:scale-[1.02]"
                     >
                        {linkLabel ?? 'Lihat halaman lengkap →'}
                     </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
    </>
  )
}