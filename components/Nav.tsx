'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
      { href: '/kegiatan', label: 'Kegiatan' },
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
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pathname = usePathname()
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (!open) setOpenGroup(null)
  }, [open])

  const handleScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      setScrolled(y > 40)
      if (y > 200 && y > lastScrollY.current + 5) {
        setHidden(true)
      } else if (y < lastScrollY.current - 5) {
        setHidden(true)
        requestAnimationFrame(() => setHidden(false))
      }
      if (y < 40) {
        setHidden(false)
      }
      lastScrollY.current = y
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isHome = pathname === '/'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[1000] transition-all duration-300',
        hidden && !open ? '-translate-y-full' : 'translate-y-0',
        scrolled
          ? 'border-b border-white/10 bg-brown-950/90 shadow-lg shadow-black/10 backdrop-blur-xl'
          : isHome
            ? 'bg-transparent'
            : 'border-b border-tan-700/10 bg-page/80 backdrop-blur-md'
      )}
    >
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Beranda Sambelia">
          <Logo className={cn('h-10 w-auto transition-colors duration-300', !scrolled && isHome ? 'brightness-0 invert' : 'brightness-0 invert sm:brightness-0 sm:invert')} />
        </Link>

        <ul className={cn('hidden items-center gap-1 lg:flex transition-colors duration-300', !scrolled && isHome ? 'text-white/90' : 'text-ink')}>
          {NAV_TOP_LEVEL.filter((l) => l.href !== '/').map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive(l.href)
                    ? (scrolled || !isHome ? 'bg-gold-100 text-brown-900' : 'bg-white/20 text-white')
                    : (scrolled || !isHome ? 'text-ink hover:bg-cream-beige hover:text-water-900' : 'text-white/80 hover:bg-white/10 hover:text-white')
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
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={groupActive}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    groupActive
                      ? (scrolled || !isHome ? 'bg-gold-100 text-brown-900' : 'bg-white/20 text-white')
                      : (scrolled || !isHome ? 'text-ink hover:bg-cream-beige hover:text-water-900' : 'text-white/80 hover:bg-white/10 hover:text-white')
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-focus-within:visible group-hover:opacity-100 group-focus-within:opacity-100 max-lg:left-0 max-lg:-translate-x-0">
                  <ul className={cn(
                    'min-w-[180px] rounded-xl shadow-lg',
                    scrolled || !isHome
                      ? 'border border-tan-700/10 bg-page'
                      : 'border border-white/10 bg-brown-950/95 backdrop-blur-xl'
                  )}>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className={cn(
                            'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            isActive(item.href)
                              ? (scrolled || !isHome ? 'bg-gold-100 text-brown-900' : 'bg-white/20 text-white')
                              : (scrolled || !isHome ? 'text-ink hover:bg-cream-beige hover:text-water-900' : 'text-white/80 hover:bg-white/10 hover:text-white')
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
          type="button"
          className={cn(
            '-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors lg:hidden',
            !scrolled && isHome ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-cream-beige hover:text-water-900'
          )}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-tan-700/10 bg-page lg:hidden"
          >
            <ul className="mx-auto max-w-content space-y-1 overflow-y-auto px-4 py-4 max-h-[70vh]">
              {NAV_TOP_LEVEL.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? 'page' : undefined}
                    className="flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
                    onClick={() => { setOpen(false); setOpenGroup(null) }}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
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
                      type="button"
                      aria-expanded={expanded}
                      className="flex w-full min-h-[44px] items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-cream-beige hover:text-water-900"
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
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                className="flex min-h-[44px] items-center rounded-lg pl-6 pr-3 py-2.5 text-sm font-medium text-ink hover:bg-cream-beige hover:text-water-900"
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
          </>
        )}
      </AnimatePresence>
    </header>
  )
}