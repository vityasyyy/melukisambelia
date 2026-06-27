'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang-sambelia', label: 'Tentang' },
  { href: '/peta', label: 'Peta' },
  { href: '/pariwisata', label: 'Pariwisata' },
  { href: '/irigasi', label: 'Irigasi' },
  { href: '/kesehatan', label: 'Kesehatan' },
  { href: '/umkm', label: 'UMKM' },
  { href: '/festival', label: 'Festival' },
  { href: '/cerita', label: 'Cerita' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-[1000] border-b border-tan-700/10 bg-page/90 backdrop-blur">
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo className="h-10 w-auto" />
        </Link>

        <ul className="hidden gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-gold-100 text-brown-900'
                      : 'text-ink hover:bg-cream-beige hover:text-water-900'
                  )}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          className="-mr-2 p-2 text-ink hover:text-water-900 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-tan-700/10 bg-page lg:hidden"
          >
            <ul className="mx-auto max-w-content space-y-1 px-4 py-4">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
