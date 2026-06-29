import { StatSkeleton } from '@/components/Skeleton'

export default function TentangSambeliaLoading() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brown-900 via-brown-700 to-brown-950 py-12 md:py-20 text-center text-cream-light">
        <div className="flex flex-col items-center gap-3 px-4">
          <div className="animate-pulse rounded bg-cream-beige/30 h-4 w-20" />
          <div className="animate-pulse rounded bg-cream-beige/30 h-10 w-64" />
          <div className="animate-pulse rounded bg-cream-beige/20 h-4 w-80 mt-2" />
        </div>
      </section>
      <div className="mx-auto max-w-content px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      </div>
    </>
  )
}