'use client'

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
import { MiniMapClient } from '@/components/MiniMapClient'
import { cn } from '@/lib/utils'

export type Chip = { label: string; color?: string }

export type DetailModalData = {
  title: string
  image?: string
  chips?: Chip[]
  description?: string
  body?: React.ReactNode
  href?: string
  linkLabel?: string
  lat?: number
  lng?: number
  mapTitle?: string
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
  if (!data) return null
  const { title, image, chips, description, body, href, linkLabel, lat, lng, mapTitle } = data
  const hasMap = typeof lat === 'number' && typeof lng === 'number'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[1001] mx-4 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl focus:outline-none max-h-[80vh] overflow-hidden p-0 gap-0">
        {/* Image header with overlay */}
        {image ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 512px" />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light">{title}</DialogTitle>
              {description && <DialogDescription className="mt-1 text-sm text-cream-light/80 line-clamp-2">{description}</DialogDescription>}
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-terracotta-500 to-gold-500 px-4 pt-12 pb-4 sm:px-6 sm:pt-14 sm:pb-6">
            <DialogTitle className="font-beautique text-xl sm:text-2xl text-cream-light">{title}</DialogTitle>
            {description && <DialogDescription className="mt-1 text-sm text-cream-light/80">{description}</DialogDescription>}
          </div>
        )}

        {/* Close button - floating above image */}
        <DialogPrimitive.Close className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/90 backdrop-blur-sm text-brown-900 transition-colors hover:bg-cream-light" aria-label="Tutup dialog">
          <X className="h-5 w-5" />
          <span className="sr-only">Tutup</span>
        </DialogPrimitive.Close>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[35vh] p-4 sm:p-6">
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

          {body && <div className={cn('prose prose-sm mt-4 max-w-none text-ink/80 prose-headings:text-brown-900 prose-p:text-ink/70', !image && 'mt-2')}>{body}</div>}

          {hasMap && (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brown-900">
                <MapPin className="h-3.5 w-3.5" /> Lokasi
              </div>
              <MiniMapClient lat={lat} lng={lng} title={mapTitle ?? title} />
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
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}