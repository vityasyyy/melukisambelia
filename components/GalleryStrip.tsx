import Image from 'next/image'

export function GalleryStrip({ images, altPrefix = 'Galeri' }: { images: string[]; altPrefix?: string }) {
  if (images.length === 0) return null
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {images.map((src, i) => (
        <div key={i} className="relative h-40 w-60 shrink-0 rounded-xl overflow-hidden">
          <Image src={src} alt={`${altPrefix} ${i + 1}`} fill className="object-cover" sizes="240px" />
        </div>
      ))}
    </div>
  )
}