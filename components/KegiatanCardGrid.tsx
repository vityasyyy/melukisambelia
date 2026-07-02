'use client'

import { DataCard } from '@/components/DataCard'
import { AlternatingCardGrid } from '@/components/AlternatingCardGrid'

type KegiatanItem = {
  slug: string
  cover: string
  title: string
  author: string
  date: string
  excerpt: string
}

export function KegiatanCardGrid({ items }: { items: KegiatanItem[] }) {
  return (
    <AlternatingCardGrid
      items={items}
      renderItem={(c: unknown, _i: number, featured: boolean) => {
        const item = c as KegiatanItem
        return (
          <DataCard
            href={`/kegiatan/${item.slug}`}
            image={item.cover}
            title={item.title}
            chips={[
              { label: item.author, tone: 'brown' },
              { label: item.date, tone: 'gold' },
            ]}
            desc={item.excerpt}
            featured={featured}
            accent="#5A3A28"
          />
        )
      }}
    />
  )
}