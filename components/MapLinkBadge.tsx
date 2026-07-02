import Link from 'next/link'
import { MapPin } from 'lucide-react'

export function MapLinkBadge({
  href,
  label = 'Di peta',
  tone = 'water',
}: {
  href: string
  label?: string
  tone?: 'water' | 'green' | 'gold' | 'terracotta' | 'olive' | 'brown'
}) {
  const toneClasses: Record<string, string> = {
    water: 'bg-water-50 text-water-900 hover:bg-water-100',
    green: 'bg-green-50 text-green-900 hover:bg-green-100',
    gold: 'bg-gold-50 text-brown-900 hover:bg-gold-100',
    terracotta: 'bg-terracotta-50 text-terracotta-900 hover:bg-terracotta-100',
    olive: 'bg-olive/10 text-olive hover:bg-olive/20',
    brown: 'bg-brown-100 text-brown-900 hover:bg-brown-200',
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${toneClasses[tone] ?? toneClasses.water}`}
    >
      <MapPin className="h-3 w-3" />
      {label}
    </Link>
  )
}