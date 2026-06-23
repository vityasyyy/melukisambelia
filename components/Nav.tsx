'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang-sambelia', label: 'Tentang Sambelia' },
  { href: '/peta', label: 'Peta' },
  { href: '/pariwisata', label: 'Pariwisata' },
  { href: '/irigasi', label: 'Irigasi' },
  { href: '/kesehatan', label: 'Kesehatan' },
  { href: '/festival', label: 'Festival' },
  { href: '/cerita', label: 'Cerita' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur border-b border-tan-700/20">
      <nav className="mx-auto flex max-w-content items-center justify-between px-4 py-3">
        <Link href="/"><Logo className="h-10 w-auto" /></Link>
        <ul className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-ink hover:text-water-900 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden p-2 -mr-2 text-ink hover:text-water-900"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-tan-700/20 bg-page">
          <ul className="mx-auto max-w-content px-4 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-2 text-base font-medium text-ink hover:text-water-900 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}