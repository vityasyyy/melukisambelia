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
        'group relative h-full flex flex-col overflow-hidden rounded-2xl border border-tan-700/12 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-sambel hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      {children}
    </div>
  )
}