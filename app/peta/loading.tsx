import { MapSkeleton } from '@/components/Skeleton'

export default function PetaLoading() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-water-900 via-water-700 to-brown-900 py-12 md:py-20 text-center text-cream-light">
        <div className="flex flex-col items-center gap-3 px-4">
          <div className="animate-pulse rounded bg-cream-beige/30 h-4 w-20" />
          <div className="animate-pulse rounded bg-cream-beige/30 h-10 w-64" />
          <div className="animate-pulse rounded bg-cream-beige/20 h-4 w-80 mt-2" />
        </div>
      </section>
      <div className="mx-auto max-w-content px-4 py-16">
        <MapSkeleton />
      </div>
    </>
  )
}