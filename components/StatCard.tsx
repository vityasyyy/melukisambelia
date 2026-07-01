export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="group relative h-full flex flex-col items-center justify-center min-w-0 rounded-2xl border border-tan-700/12 border-l-[3px] border-l-gold-500 bg-white p-3 sm:p-5 text-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-sambel hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
        {value}
        {unit && <span className="ml-1 text-sm font-beautique-condensed text-ink/80">{unit}</span>}
      </div>
      <div className="mx-auto mt-1.5 h-0.5 w-8 bg-gold-500 rounded-full" />
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] font-beautique-condensed text-ink/80">{label}</div>
    </div>
  )
}