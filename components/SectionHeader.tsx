export function SectionHeader({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <header className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-water-900">{kicker}</p>
      <h2 className="mt-1 font-beautique text-4xl md:text-5xl text-brown-900">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-ink/70">{intro}</p>}
    </header>
  )
}