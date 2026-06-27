'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

type NavGroup = {
  label: string
  items: { href: string; label: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Profil',
    items: [
      { href: '/tentang-sambelia', label: 'Tentang Sambelia' },
      { href: '/cerita', label: 'Cerita' },
    ],
  },
  {
    label: 'Data & Analisis',
    items: [
      { href: '/pariwisata', label: 'Pariwisata' },
      { href: '/irigasi', label: 'Irigasi' },
      { href: '/kesehatan', label: 'Kesehatan' },
      { href: '/air-tanah', label: 'Air & Tanah' },
      { href: '/lingkungan', label: 'Lingkungan' },
    ],
  },
]

const NAV_TOP_LEVEL = [
  { href: '/', label: 'Beranda' },
  { href: '/peta', label: 'Peta' },
  { href: '/umkm', label: 'UMKM' },
  { href: '/festival', label: 'Festival' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) setOpenGroup(null)
  }, [open])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-[1000] border-b border-tan-700/10 bg-page/90 backdrop-blur">
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo className="h-10 w-auto" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_TOP_LEVEL.filter((l) => l.href !== '/').map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive(l.href)
                    ? 'bg-gold-100 text-brown-900'
                    : 'text-ink hover:bg-cream-beige hover:text-water-900'
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {NAV_GROUPS.map((group) => {
            const groupActive = group.items.some((item) => isActive(item.href))
            return (
              <li key={group.label} className="group relative">
                <button
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    groupActive
                      ? 'bg-gold-100 text-brown-900'
                      : 'text-ink hover:bg-cream-beige hover:text-water-900'
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-[180px] rounded-xl border border-tan-700/10 bg-page shadow-lg">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            isActive(item.href)
                              ? 'bg-gold-100 text-brown-900'
                              : 'text-ink hover:bg-cream-beige hover:text-water-900'
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
              {NAV_TOP_LEVEL.map((l, i) => {
                if (l.href === '/') {
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={l.href}
                        className="block rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                        onClick={() => { setOpen(false); setOpenGroup(null) }}
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  )
                }
                return (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      className="block rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                      onClick={() => { setOpen(false); setOpenGroup(null) }}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                )
              })}
              {NAV_GROUPS.map((group, gi) => {
                const expanded = openGroup === group.label
                return (
                  <motion.li
                    key={group.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (NAV_TOP_LEVEL.length + gi) * 0.04 }}
                  >
                    <button
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                      onClick={() => setOpenGroup(expanded ? null : group.label)}
                    >
                      {group.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          expanded && 'rotate-180'
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {expanded && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="block rounded-lg pl-6 pr-3 py-2 text-sm font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                                onClick={() => { setOpen(false); setOpenGroup(null) }}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}