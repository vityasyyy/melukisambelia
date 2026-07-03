import { SectionHeader } from '@/components/SectionHeader'

export default function Loading() {
  return (
    <>
      <div className="relative bg-gradient-to-b from-brown-950 to-brown-900 pt-32 pb-16 text-center">
        <div className="mx-auto max-w-content px-4">
          <div className="h-6 w-24 mx-auto mb-4 animate-pulse rounded bg-brown-800" />
          <div className="h-10 w-64 mx-auto mb-4 animate-pulse rounded bg-brown-800" />
          <div className="h-5 w-96 mx-auto animate-pulse rounded bg-brown-800" />
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-8">
        <SectionHeader kicker="..." title="..." intro="" tone="gold" />
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-28" />
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[280px] glass-card animate-pulse h-64" />
          ))}
        </div>
      </div>
    </>
  )
}