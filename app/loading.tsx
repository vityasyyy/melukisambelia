import { HeroSkeleton, StatSkeleton, CardSkeleton, PetaCardSkeleton } from '@/components/Skeleton'

export default function HomeLoading() {
  return (
    <>
      <HeroSkeleton />

      <section className="relative z-10 scroll-mt-16 overflow-hidden bg-page">
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <div className="animate-pulse h-8 w-48 rounded bg-cream-beige mx-auto" />
          <div className="animate-pulse h-6 w-72 rounded bg-cream-beige mx-auto mt-3" />
          <div className="animate-pulse h-4 w-96 rounded bg-cream-beige mx-auto mt-2" />
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream-beige">
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <div className="animate-pulse h-8 w-48 rounded bg-cream-beige mx-auto" />
          <div className="mt-4 flex gap-4 overflow-hidden">
            <PetaCardSkeleton />
            <PetaCardSkeleton />
            <PetaCardSkeleton />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-page">
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <div className="animate-pulse h-8 w-48 rounded bg-cream-beige mx-auto" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden" style={{ backgroundColor: '#FEF5F1' }}>
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <div className="animate-pulse h-8 w-48 rounded bg-cream-beige mx-auto" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream-beige">
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <div className="animate-pulse h-8 w-48 rounded bg-cream-beige mx-auto" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </section>
    </>
  )
}