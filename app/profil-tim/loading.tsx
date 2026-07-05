import { SectionHeader } from '@/components/SectionHeader'

export default function Loading() {
  return (
    <>
      <div className="relative bg-gradient-to-b from-brown-950 to-brown-900 pt-32 pb-16 text-center">
        <div className="mx-auto max-w-content px-4">
          <div className="skeleton-shimmer rounded h-6 w-24 mx-auto mb-4" />
          <div className="skeleton-shimmer rounded h-10 w-64 mx-auto mb-4" />
          <div className="skeleton-shimmer rounded h-5 w-96 mx-auto" />
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-12 md:py-16">
        <SectionHeader kicker="Periode KKN" title="Pilih Periode" intro="" tone="gold" centered />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card skeleton-shimmer h-44" />
          ))}
        </div>
      </div>
    </>
  )
}