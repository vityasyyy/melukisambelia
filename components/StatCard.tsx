export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="h-full flex flex-col min-w-0 rounded-2xl border border-tan-700/20 bg-cream-beige/60 p-4 sm:p-6 text-center shadow-terracotta transition-transform hover:-translate-y-1 hover:shadow-terracotta-hover">
      <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
        {value}
        {unit && <span className="text-sm text-ink/70 ml-1">{unit}</span>}
      </div>
      <div className="mx-auto mt-2 h-0.5 w-10 bg-gold-500 rounded-full" />
      <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink/70">{label}</div>
    </div>
  )
}
