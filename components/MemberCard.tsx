import Image from 'next/image'
import type { Tim } from '@/lib/schemas'

export function MemberCard({ member }: { member: Tim & { slug: string } }) {
  return (
    <div className="rounded-2xl border border-tan-700/30 bg-white overflow-hidden">
      <div className="relative aspect-square">
        <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brown-900">{member.name}</h3>
        <p className="text-sm text-ink/70">{member.role}</p>
        <span className="mt-2 inline-block rounded-full bg-water-50 px-2 py-0.5 text-xs text-water-900">{member.division}</span>
        {member.instagram && (
          <a href={`https://instagram.com/${member.instagram}`} className="mt-2 block text-xs text-ink/60 hover:text-terracotta-500">@{member.instagram}</a>
        )}
      </div>
    </div>
  )
}