import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://melukisambelia.id${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-content px-4 pt-4 pb-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center">
            {i > 0 && (
              <ChevronRight className="mr-1 h-3 w-3 text-ink/40" aria-hidden />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm text-ink/60 transition-colors hover:text-terracotta-500"
              >
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[200px] truncate text-sm font-medium text-ink" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}