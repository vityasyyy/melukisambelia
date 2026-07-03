'use client'

import { ReactNode } from 'react'

type CardGroup =
  | { type: 'single'; item: unknown; index: number; featured: boolean }
  | { type: 'pair'; items: [unknown, unknown]; indices: [number, number]; featured: [boolean, boolean] }
  | { type: 'trio'; featured: unknown; featuredIndex: number; smalls: { item: unknown; index: number }[]; featuredFirst: boolean }

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

  const groups = buildGroups(items)

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {groups.map((group, gi) => {
        if (group.type === 'single') {
          return (
            <div key={gi}>
              {renderItem(group.item, group.index, group.featured)}
            </div>
          )
        }

        if (group.type === 'pair') {
          return (
            <div key={gi} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.items.map((item, i) => (
                <div key={group.indices[i]}>
                  {renderItem(item, group.indices[i], group.featured[i])}
                </div>
              ))}
            </div>
          )
        }

        return (
          <div key={gi} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.featuredFirst ? (
              <>
                <div className="sm:col-span-2 lg:col-span-2">
                  {renderItem(group.featured, group.featuredIndex, true)}
                </div>
                <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
                  {group.smalls.map((s) => (
                    <div key={s.index} className="flex-1 min-h-0">
                      {renderItem(s.item, s.index, false)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
                  {group.smalls.map((s) => (
                    <div key={s.index} className="flex-1 min-h-0">
                      {renderItem(s.item, s.index, false)}
                    </div>
                  ))}
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
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

function buildGroups(items: unknown[]): CardGroup[] {
  const groups: CardGroup[] = []
  let idx = 0
  let groupIndex = 0

  while (idx < items.length) {
    const remaining = items.length - idx

    if (remaining === 1) {
      groups.push({ type: 'single', item: items[idx], index: idx, featured: true })
      idx += 1
    } else if (remaining === 2) {
      groups.push({
        type: 'pair',
        items: [items[idx], items[idx + 1]],
        indices: [idx, idx + 1],
        featured: [true, true],
      })
      idx += 2
    } else if (remaining === 4) {
      const featuredFirst = groupIndex % 2 === 0
      groups.push({
        type: 'trio',
        featured: items[idx],
        featuredIndex: idx,
        smalls: [
          { item: items[idx + 1], index: idx + 1 },
          { item: items[idx + 2], index: idx + 2 },
        ],
        featuredFirst,
      })
      groups.push({ type: 'single', item: items[idx + 3], index: idx + 3, featured: true })
      idx += 4
    } else {
      const featuredFirst = groupIndex % 2 === 0
      groups.push({
        type: 'trio',
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

    groupIndex += 1
  }

  return groups
}