export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-cream-beige ${className ?? ''}`} />
}

export function HeroSkeleton() {
  return (
    <section className="flex h-[100dvh] min-h-[600px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 px-4">
        <div className="animate-pulse rounded-lg bg-cream-beige/30 h-6 w-24" />
        <div className="animate-pulse rounded-lg bg-cream-beige/30 h-12 w-72" />
        <div className="animate-pulse rounded-lg bg-cream-beige/20 h-4 w-96 mt-4" />
      </div>
    </section>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card glass-accent-top overflow-hidden" style={{ '--accent-color': '#F0AC6D' } as React.CSSProperties}>
      <div className="relative aspect-video w-full animate-pulse bg-cream-beige" />
    </div>
  )
}

export function PetaCardSkeleton() {
  return (
    <div className="glass-card glass-accent-top overflow-hidden" style={{ '--accent-color': '#F0AC6D' } as React.CSSProperties}>
      <div className="aspect-[4/3] w-full animate-pulse bg-cream-beige" />
      <div className="p-4 space-y-2">
        <div className="animate-pulse h-5 w-3/4 rounded bg-cream-beige" />
        <div className="animate-pulse h-4 w-full rounded bg-cream-beige" />
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden p-6 space-y-3">
      <div className="animate-pulse h-6 w-3/4 rounded bg-cream-beige" />
      <div className="animate-pulse h-4 w-full rounded bg-cream-beige" />
      <div className="animate-pulse h-4 w-5/6 rounded bg-cream-beige" />
      <div className="animate-pulse h-3 w-24 rounded bg-cream-beige mt-4" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 p-6 flex flex-col items-center gap-2">
      <div className="animate-pulse h-8 w-16 rounded bg-cream-beige" />
      <div className="animate-pulse h-4 w-24 rounded bg-cream-beige" />
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/50 overflow-hidden">
      <div className="animate-pulse aspect-[4/3] w-full bg-cream-beige" />
    </div>
  )
}