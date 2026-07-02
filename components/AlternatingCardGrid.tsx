'use client'

import { ReactNode } from 'react'

export function AlternatingCardGrid({
  items,
  renderItem,
  className = '',
}: {
  items: unknown[]
  renderItem: (item: unknown, index: number, featured: boolean) => ReactNode
  className?: string
}) {
  if (items.length === 0) return null

  if (items.length <= 2) {
    return (
      <div className={`grid gap-5 sm:grid-cols-2 ${className}`}>
        {items.map((item, i) => (
          <div key={i} className={i === 0 ? 'sm:col-span-2' : undefined}>
            {renderItem(item, i, i === 0)}
          </div>
        ))}
      </div>
    )
  }

  const groups: { featured: unknown; featuredIndex: number; smalls: { item: unknown; index: number }[]; featuredFirst: boolean }[] = []
  let idx = 0
  while (idx < items.length) {
    const remaining = items.length - idx
    if (remaining === 1) {
      groups.push({ featured: items[idx], featuredIndex: idx, smalls: [], featuredFirst: true })
      idx += 1
    } else if (remaining === 2) {
      groups.push({ featured: items[idx], featuredIndex: idx, smalls: [{ item: items[idx + 1], index: idx + 1 }], featuredFirst: true })
      idx += 2
    } else if (remaining === 4) {
      groups.push({ featured: items[idx], featuredIndex: idx, smalls: [{ item: items[idx + 1], index: idx + 1 }, { item: items[idx + 2], index: idx + 2 }], featuredFirst: groups.length % 2 === 0 })
      groups.push({ featured: items[idx + 3], featuredIndex: idx + 3, smalls: [], featuredFirst: groups.length % 2 === 0 })
      idx += 4
    } else {
      const featuredFirst = groups.length % 2 === 0
      groups.push({
        featured: items[idx],
        featuredIndex: idx,
        smalls: [
          { item: items[idx + 1], index: idx + 1 },
          { item: items[idx + 2], index: idx + 2 },
        ],
        featuredFirst,
      })
      idx += 3
    }
  }

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {groups.map((group, gi) => {
        if (group.smalls.length === 0) {
          return (
            <div key={gi}>
              {renderItem(group.featured, group.featuredIndex, true)}
            </div>
          )
        }

        return (
          <div key={gi} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {group.featuredFirst ? (
              <>
                <div className="sm:col-span-2 lg:col-span-3">
                  {renderItem(group.featured, group.featuredIndex, true)}
                </div>
                <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-5">
                  {group.smalls.map((s) => (
                    <div key={s.index}>
                      {renderItem(s.item, s.index, false)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-5">
                  {group.smalls.map((s) => (
                    <div key={s.index}>
                      {renderItem(s.item, s.index, false)}
                    </div>
                  ))}
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  {renderItem(group.featured, group.featuredIndex, true)}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}