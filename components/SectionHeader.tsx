import { Pill } from './Pill'
import { cn } from '@/lib/utils'

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
  tone?: 'water' | 'green' | 'terracotta' | 'gold' | 'olive' | 'brown'
  centered?: boolean
  className?: string
}) {
  return (
    <header className={cn('mb-6', centered && 'text-center', className)}>
      <Pill variant={tone === 'brown' ? 'terracotta' : tone} className={cn('mb-2 font-beautique-condensed tracking-[0.2em]', centered && 'mx-auto')}>
        {kicker}
      </Pill>
      <h2 className="font-beautique text-display-lg text-brown-900 text-balance">{title}</h2>
      <div aria-hidden className={cn('mt-2 h-0.5 w-12 rounded-full', centered && 'mx-auto', {
        'bg-water-500': tone === 'water',
        'bg-green-500': tone === 'green',
        'bg-terracotta-500': tone === 'terracotta',
        'bg-gold-500': tone === 'gold',
        'bg-olive': tone === 'olive',
        'bg-brown-700': tone === 'brown',
      })} />
      {intro && <p className={cn('mt-3 max-w-2xl text-sm text-ink/80 leading-relaxed', centered && 'mx-auto')}>{intro}</p>}
    </header>
  )
}