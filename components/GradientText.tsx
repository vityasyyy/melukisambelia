import { cn } from '@/lib/utils'

export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('text-gradient-gold shimmer-slow', className)}>{children}</span>
}