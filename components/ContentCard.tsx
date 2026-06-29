import { cn } from '@/lib/utils'

export function ContentCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-sambel hover:-translate-y-1 hover:shadow-terracotta-hover',
        className
      )}
    >
      {children}
    </div>
  )
}