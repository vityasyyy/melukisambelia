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
    <header className={cn('mb-10', centered && 'text-center', className)}>
      <Pill variant={tone === 'brown' ? 'terracotta' : tone} className={cn('mb-3', centered && 'mx-auto')}>
        {kicker}
      </Pill>
      <h2 className="font-beautique text-display-lg text-brown-900 break-words">{title}</h2>
      {intro && <p className={cn('mt-3 max-w-2xl text-ink/70 leading-relaxed', centered && 'mx-auto')}>{intro}</p>}
    </header>
  )
}
