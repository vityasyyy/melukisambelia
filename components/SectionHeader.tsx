import { cn } from '@/lib/utils'

type Tone = 'water' | 'green' | 'terracotta' | 'gold' | 'olive' | 'brown'

const KICKER_CLASSES: Record<Tone, string> = {
  water: 'bg-gradient-to-r from-water-900 to-water-700 text-white',
  green: 'bg-gradient-to-r from-green-500 to-green-900 text-white',
  terracotta: 'bg-gradient-to-r from-terracotta-500 to-terracotta-700 text-white',
  gold: 'bg-gradient-to-r from-gold-500 to-gold-700 text-white',
  olive: 'bg-gradient-to-r from-olive to-olive-dark text-white',
  brown: 'bg-gradient-to-r from-brown-700 to-brown-950 text-white',
}

const BAR_CLASSES: Record<Tone, string> = {
  water: 'bg-gradient-to-r from-water-500 to-water-700',
  green: 'bg-gradient-to-r from-green-500 to-green-900',
  terracotta: 'bg-gradient-to-r from-terracotta-500 to-terracotta-700',
  gold: 'bg-gradient-to-r from-gold-500 to-gold-700',
  olive: 'bg-gradient-to-r from-olive to-olive-dark',
  brown: 'bg-gradient-to-r from-brown-700 to-brown-950',
}

export function SectionHeader({
  kicker,
  title,
  intro,
  tone = 'water',
  centered = false,
  className,
}: {
  kicker: string
  title: string
  intro?: string
  tone?: Tone
  centered?: boolean
  className?: string
}) {
  return (
    <header className={cn('mb-6', centered && 'text-center', className)}>
      <span className={cn(
        'mb-2 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
        centered && 'mx-auto',
        KICKER_CLASSES[tone === 'brown' ? 'brown' : tone]
      )}>
        {kicker}
      </span>
      <h2 className="font-beautique text-display-lg text-brown-900 text-balance">{title}</h2>
      <div aria-hidden className={cn('mt-2 h-1 w-14 rounded-full', centered && 'mx-auto', BAR_CLASSES[tone === 'brown' ? 'brown' : tone])} />
      {intro && <p className={cn('mt-3 max-w-2xl text-sm text-ink/80 leading-relaxed', centered && 'mx-auto')}>{intro}</p>}
    </header>
  )
}