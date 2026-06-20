import Link from 'next/link'
import { Logo } from './Logo'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/profil-tim', label: 'Profil Tim' },
  { href: '/peta', label: 'Peta' },
  { href: '/pariwisata', label: 'Pariwisata' },
  { href: '/irigasi', label: 'Irigasi' },
  { href: '/kesehatan', label: 'Kesehatan' },
  { href: '/festival', label: 'Festival' },
  { href: '/cerita', label: 'Cerita' },
]

export function Nav() {
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
      </nav>
    </header>
  )
}