export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-tan-700/20 bg-cream-beige/60 p-6 text-center shadow-terracotta transition-transform hover:-translate-y-1 hover:shadow-terracotta-hover">
      <div className="font-beautique text-3xl md:text-4xl text-water-900">
        {value}
        {unit && <span className="text-sm text-ink/60 ml-1">{unit}</span>}
      </div>
      <div className="mx-auto mt-2 h-0.5 w-10 bg-gold-500 rounded-full" />
      <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink/60">{label}</div>
    </div>
  )
}
