'use client'

import { usePathname } from 'next/navigation'

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  )
}