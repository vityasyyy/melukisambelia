export function StatCard({ label, value, unit, accentColor = '#F0AC6D' }: { label: string; value: string; unit?: string; accentColor?: string }) {
  return (
    <div
      className="glass-card glass-accent-top relative h-full flex flex-col items-center justify-center min-w-0 p-3 sm:p-5 text-center"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="font-beautique text-2xl sm:text-3xl md:text-4xl text-water-900 break-words">
        {value}
        {unit && <span className="ml-1 text-sm font-beautique-condensed text-ink/80">{unit}</span>}
      </div>
      <div className="mx-auto mt-1.5 h-0.5 w-8 bg-gold-500 rounded-full" />
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] font-beautique-condensed text-ink/80">{label}</div>
    </div>
  )
}