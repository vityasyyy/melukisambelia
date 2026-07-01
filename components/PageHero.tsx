import { GradientText } from '@/components/GradientText'
import { FadeIn } from '@/components/FadeIn'
import { cn } from '@/lib/utils'

type Tone = 'water' | 'terracotta' | 'green' | 'gold' | 'olive' | 'brown'

const GRADIENTS: Record<Tone, string> = {
  water: 'from-water-900 via-water-700 to-brown-900',
  terracotta: 'from-terracotta-900 via-terracotta-700 to-brown-900',
  green: 'from-green-900 via-olive to-brown-900',
  gold: 'from-gold-700 via-terracotta-700 to-brown-900',
  olive: 'from-olive via-olive-dark to-brown-900',
  brown: 'from-brown-900 via-brown-700 to-brown-950',
}

export function PageHero({
  kicker,
  title,
  intro,
  tone = 'terracotta',
  className,
}: {
  kicker: string
  title: string
  intro?: string
  tone?: Tone
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative -mt-[63px] overflow-hidden bg-gradient-to-br py-20 md:py-28 text-center text-white',
        GRADIENTS[tone],
        className
      )}
    >
      <div className="absolute inset-0 section-watermark" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 -80px 120px -30px rgba(26,17,13,0.6)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" aria-hidden />
      <FadeIn className="relative z-10 mx-auto max-w-content px-4">
        <p className="font-beautique-condensed text-xs font-semibold uppercase tracking-[0.2em] text-white/80" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{kicker}</p>
        <h1
          className="mt-2 font-beautique text-display-lg break-words"
          style={{ textShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.2)' }}
        >
          <GradientText className="text-white">{title}</GradientText>
        </h1>
        {intro && (
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{intro}</p>
        )}
      </FadeIn>
    </section>
  )
}