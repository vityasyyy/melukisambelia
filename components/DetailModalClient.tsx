'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        {image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
            <div className="absolute inset-0 hero-vignette" />
          </div>
        )}
        <div className="p-6 pt-4">
          <DialogHeader className="text-left">
            <DialogTitle className="font-beautique text-2xl text-brown-900">{title}</DialogTitle>
            {description && <DialogDescription className="text-sm text-ink/70">{description}</DialogDescription>}
          </DialogHeader>

          {chips && chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
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

          {body && <div className={cn('prose prose-sm mt-4 max-w-none text-ink/80', !image && 'mt-2')}>{body}</div>}

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
      </DialogContent>
    </Dialog>
  )
}
