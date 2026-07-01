import { cn } from '@/lib/utils'

export function Pill({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'gold' | 'green' | 'water' | 'terracotta' | 'olive' | 'outline'
  className?: string
}) {
  const variants = {
    default: 'bg-gold-100 text-brown-900',
    gold: 'bg-goldSoft text-brownDark',
    green: 'bg-green-50 text-green-900',
    water: 'bg-water-50 text-water-900',
    terracotta: 'bg-terracotta-500/15 text-wine',
    olive: 'bg-cream-beige text-olive',
    outline: 'border border-tan-700/40 bg-page text-ink/80',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] font-beautique-condensed', variants[variant], className)}>
      {children}
    </span>
  )
}