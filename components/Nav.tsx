'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

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

function isActivePath(href: string, pathname: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const ticking = useRef(false)

  const handleScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      setScrolled(y > 80)
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!open) setOpenGroup(null)
  }, [open])

  function isActive(href: string) {
    return isActivePath(href, pathname)
  }

  const activeLink = 'text-gold-bright after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-3/4 after:rounded-full after:bg-gold-500'
  const inactiveLink = 'text-white hover:bg-white/10'

  return (
    <header
      className={cn(
        'fixed z-[1000] transition-all duration-500 ease-sambel',
        open && 'hidden',
        scrolled
          ? 'left-4 right-4 top-3 sm:left-6 sm:right-6 sm:top-4 rounded-2xl bg-brown-950 shadow-[0_8px_32px_-8px_rgba(15,8,5,0.6)]'
          : 'left-0 right-0 top-0 bg-transparent'
      )}
    >
      {scrolled && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-2xl bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      )}
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Beranda Sambelia" className="flex items-center gap-2.5">
          <Logo className="h-10 w-auto brightness-0 invert transition-colors duration-300" />
          <span className="inline-block font-beautique text-lg text-white">Melukis Sambelia</span>
        </Link>

        <ul className={cn('hidden items-center gap-1 lg:flex text-white')}>
          {NAV_TOP_LEVEL.filter((l) => l.href !== '/').map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                  isActive(l.href) ? activeLink : inactiveLink
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
                    'flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                    groupActive ? activeLink : inactiveLink
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-focus-within:visible group-hover:opacity-100 group-focus-within:opacity-100 max-lg:left-0 max-lg:-translate-x-0">
                  <ul className="min-w-[200px] rounded-xl shadow-2xl border border-gold-500/25 bg-brown-950 overflow-hidden">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className={cn(
                            'block px-4 py-2.5 text-sm font-medium transition-colors',
                            isActive(item.href)
                              ? 'bg-gold-500/15 text-gold-soft'
                              : 'text-white hover:bg-white/10 hover:text-white'
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
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="border-l border-gold-500/20 bg-brown-950 text-cream-light w-[85vw] max-w-sm p-0">
          <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')", backgroundSize: '1200px auto', filter: 'sepia(0.5) hue-rotate(-10deg) saturate(1.8)' }} />
          <div aria-hidden className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-water-900 via-gold-bright to-terracotta-500 opacity-80" />
          <SheetHeader className="relative border-b border-gold-500/15 px-6 py-5">
            <SheetTitle className="flex items-center gap-3">
              <Logo className="h-9 w-auto brightness-0 invert" />
              <span className="font-beautique text-lg text-gold-soft">Melukis Sambelia</span>
            </SheetTitle>
            <SheetClose className="absolute right-4 top-4 rounded-lg h-12 w-12 inline-flex items-center justify-center text-cream-light transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-water-500">
              <X className="h-6 w-6" />
              <span className="sr-only">Tutup menu</span>
            </SheetClose>
          </SheetHeader>
          <nav className="relative overflow-y-auto px-3 py-3 max-h-[65vh]">
            <ul className="space-y-0.5">
              {NAV_TOP_LEVEL.map((l) => (
                <li key={l.href}>
                  <SheetClose asChild>
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[44px] items-center rounded-xl px-4 py-2.5 text-base font-medium transition-all duration-200',
                        isActive(l.href)
                          ? 'bg-gold-500/15 text-gold-soft border-l-2 border-gold-500'
                          : 'text-cream-light hover:bg-white/[0.06] hover:text-white'
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
              {NAV_GROUPS.map((group) => {
                const expanded = openGroup === group.label
                return (
                  <li key={group.label}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      className={cn(
                        'flex w-full min-h-[44px] items-center justify-between rounded-xl px-4 py-2.5 text-base font-medium transition-all duration-200',
                        expanded ? 'text-gold-soft bg-white/[0.04]' : 'text-cream-light hover:bg-white/[0.06] hover:text-white'
                      )}
                      onClick={() => setOpenGroup(expanded ? null : group.label)}
                    >
                      {group.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          expanded && 'rotate-180'
                        )}
                      />
                    </button>
                    {expanded && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-gold-500/25 pl-3 py-1">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <SheetClose asChild>
                              <Link
                                href={item.href}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                className={cn(
                                  'flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                  isActive(item.href)
                                    ? 'text-gold-soft bg-gold-500/10'
                                    : 'text-cream-light hover:bg-white/[0.06] hover:text-white'
                                )}
                              >
                                {item.label}
                              </Link>
                            </SheetClose>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="relative border-t border-gold-500/15 px-6 py-4">
            <p className="font-beautique-condensed text-[10px] tracking-[0.2em] uppercase text-gold-soft/50">KKN-PPM UGM &middot; Sambelia</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}