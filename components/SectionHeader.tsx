const TONE_COLORS: Record<string, string> = {
  water: 'text-water-900',
  green: 'text-green-900',
  terracotta: 'text-terracotta-500',
  brown: 'text-brown-900',
}

export function SectionHeader({
  kicker,
  title,
  intro,
  tone = 'water',
}: {
  kicker: string
  title: string
  intro?: string
  tone?: 'water' | 'green' | 'terracotta' | 'brown'
}) {
  return (
    <header className="mb-8">
      <p className={`text-xs font-semibold uppercase tracking-widest ${TONE_COLORS[tone]}`}>{kicker}</p>
      <h2 className="mt-1 font-beautique text-3xl sm:text-4xl md:text-5xl text-brown-900">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-ink/70 text-sm sm:text-base">{intro}</p>}
    </header>
  )
}