export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-white p-6 text-center">
      <div className="font-beautique text-3xl text-water-900">{value}<span className="text-sm text-ink/60 ml-1">{unit}</span></div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink/60">{label}</div>
    </div>
  )
}