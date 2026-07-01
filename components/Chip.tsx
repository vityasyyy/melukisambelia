import { cn } from '@/lib/utils'

export type ChipTone = 'water' | 'green' | 'gold' | 'terracotta' | 'olive' | 'brown'

export type ChipData = { label: string; tone?: ChipTone }

const TONE_CLASS: Record<ChipTone, string> = {
  water: 'chip-water',
  green: 'chip-green',
  gold: 'chip-gold',
  terracotta: 'chip-terracotta',
  olive: 'chip-olive',
  brown: 'chip-brown',
}

const DEFAULT_TONE: ChipTone = 'gold'

export function Chip({ label, tone }: ChipData) {
  return <span className={cn('chip', TONE_CLASS[tone ?? DEFAULT_TONE])}>{label}</span>
}

export function ChipRow({ chips, className }: { chips: ChipData[]; className?: string }) {
  if (chips.length === 0) return null
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {chips.map((c) => (
        <Chip key={c.label} label={c.label} tone={c.tone} />
      ))}
    </div>
  )
}