import { cn } from '@/lib/utils'

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
    <div
      className={cn(
        'glass-card glass-accent-top group relative h-full flex flex-col overflow-hidden',
        className
      )}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {children}
    </div>
  )
}