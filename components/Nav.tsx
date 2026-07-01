'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown } from 'lucide-react'
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
      setScrolled(y > 40)
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

  const isHome = pathname === '/'

  const navBg = scrolled
    ? 'bg-brown-950/90 shadow-lg backdrop-blur-xl'
    : isHome
      ? 'bg-transparent'
      : 'bg-brown-950/60 backdrop-blur-xl'

  const navRounded = scrolled ? 'rounded-2xl' : ''
  const navInset = scrolled ? 'left-3 right-3 sm:left-6 sm:right-6' : 'inset-x-0'

  const textColor = (!scrolled && isHome) ? 'text-white' : 'text-white'
  const activeBg = (scrolled || !isHome)
    ? 'bg-white/20 text-white'
    : 'bg-white/20 text-white'
  const inactiveHover = (!scrolled && isHome)
    ? 'text-white/80 hover:bg-white/10 hover:text-white'
    : 'text-white/80 hover:bg-white/10 hover:text-white'

  return (
    <header
      className={cn(
        'fixed top-0 z-[1000] transition-all duration-500 ease-sambel',
        navInset,
        navRounded,
        navBg,
      )}
    >
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Beranda Sambelia">
          <Logo className="h-10 w-auto brightness-0 invert transition-colors duration-300" />
        </Link>

        <ul className={cn('hidden items-center gap-1 lg:flex transition-colors duration-300', textColor)}>
          {NAV_TOP_LEVEL.filter((l) => l.href !== '/').map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive(l.href) ? activeBg : inactiveHover
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
                    groupActive ? activeBg : inactiveHover
                  )}
                >
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-focus-within:visible group-hover:opacity-100 group-focus-within:opacity-100 max-lg:left-0 max-lg:-translate-x-0">
                  <ul className="min-w-[180px] rounded-xl shadow-lg border border-white/10 bg-brown-950/95 backdrop-blur-xl">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          className={cn(
                            'block rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            isActive(item.href)
                              ? 'bg-white/20 text-white'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
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
        <SheetContent side="right" className="border-l border-white/10 bg-brown-950/95 backdrop-blur-xl text-cream-light w-[85vw] max-w-sm p-0">
          <SheetHeader className="border-b border-white/10 px-6 py-4">
            <SheetTitle className="text-cream-light">
              <Logo className="h-8 w-auto brightness-0 invert" />
            </SheetTitle>
          </SheetHeader>
          <nav className="overflow-y-auto px-4 py-4 max-h-[70vh]">
            <ul className="space-y-1">
              {NAV_TOP_LEVEL.map((l) => (
                <li key={l.href}>
                  <SheetClose asChild>
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                        isActive(l.href)
                          ? 'bg-white/15 text-white'
                          : 'text-cream-light/85 hover:bg-white/10 hover:text-white'
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
                      className="flex w-full min-h-[44px] items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-cream-light/85 hover:bg-white/10 hover:text-white"
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
                    {expanded && (
                      <ul className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <SheetClose asChild>
                              <Link
                                href={item.href}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                                className={cn(
                                  'flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                  isActive(item.href)
                                    ? 'bg-white/15 text-white'
                                    : 'text-cream-light/75 hover:bg-white/10 hover:text-white'
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
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-xs text-cream-light/60">KKN-PPM UGM &middot; Sambelia</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}