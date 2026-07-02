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

  const groups: { big: unknown; bigIndex: number; smalls: { item: unknown; index: number }[]; bigFirst: boolean }[] = []
  for (let i = 0; i < items.length; i += 3) {
    const chunk = items.slice(i, i + 3)
    const groupIndex = Math.floor(i / 3)
    const bigFirst = groupIndex % 2 === 0
    groups.push({
      big: chunk[0],
      bigIndex: i,
      smalls: chunk.slice(1).map((item, si) => ({ item, index: i + 1 + si })),
      bigFirst,
    })
  }

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {groups.map((group, gi) => (
        <div key={gi} className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {group.bigFirst ? (
            <>
              <div className="lg:col-span-3">
                {renderItem(group.big, group.bigIndex, true)}
              </div>
              <div className="lg:col-span-2 flex flex-col gap-5">
                {group.smalls.map((s) => (
                  <div key={s.index}>
                    {renderItem(s.item, s.index, false)}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-2 flex flex-col gap-5">
                {group.smalls.map((s) => (
                  <div key={s.index}>
                    {renderItem(s.item, s.index, false)}
                  </div>
                ))}
              </div>
              <div className="lg:col-span-3">
                {renderItem(group.big, group.bigIndex, true)}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}