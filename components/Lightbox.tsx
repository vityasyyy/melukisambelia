'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Dialog,
  DialogOverlay,
} from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'

type LightboxProps = {
  images: { src: string; alt: string }[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Lightbox({ images, initialIndex = 0, open, onOpenChange }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (open) setIndex(initialIndex)
  }, [open, initialIndex])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, goNext, goPrev])

  if (images.length === 0) return null

  const current = images[index]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="bg-black/90" />
        <DialogPrimitive.Content
          className="group fixed inset-0 z-[1001] flex items-center justify-center focus:outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Close button */}
          <DialogPrimitive.Close
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-cream-light transition-colors hover:bg-white/20"
            aria-label="Tutup lightbox"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          {/* Navigation arrows - visible on hover */}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-cream-light transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/20"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-cream-light transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/20"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-cream-light">
              {index + 1}/{images.length}
            </div>
          )}

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="relative h-[85vh] w-[90vw]"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}