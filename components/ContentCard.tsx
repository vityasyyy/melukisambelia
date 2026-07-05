import { cn } from '@/lib/utils'
import { HoverableCard } from '@/components/HoverableCard'

export function ContentCard({
  className,
  children,
  accentColor = '#F0AC6D',
}: {
  className?: string
  children: React.ReactNode
  accentColor?: string
}) {
  return (
    <HoverableCard className={cn('h-full flex flex-col', className)} accentColor={accentColor}>
      {children}
    </HoverableCard>
  )
}