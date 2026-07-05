import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings } from '@/lib/settings'
import { ProfilTimYearClient } from '@/components/ProfilTimYearClient'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

export const revalidate = REVALIDATE_SECONDS

export async function generateStaticParams() {
  const members = getCollection('profilTim') as ProfilTimItem[]
  const years = Array.from(new Set(members.map((m) => m.year || '2026')))
  return years.map((year) => ({ year }))
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params
  const ps = getPageSettings('profilTim')
  return {
    title: `Profil Tim ${year} — ${ps.seoTitle ?? 'Profil Tim'}`,
    description: ps.seoDescription ?? `Tim KKN-PPM UGM Melukis Sambelia ${year}.`,
  }
}

export default async function ProfilTimYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params
  const ps = getPageSettings('profilTim')
  const allMembers = getCollection('profilTim') as ProfilTimItem[]
  const members = allMembers.filter((m) => (m.year || '2026') === year)

  if (members.length === 0) {
    notFound()
  }

  const years = Array.from(new Set(allMembers.map((m) => m.year || '2026'))).sort((a, b) => b.localeCompare(a))

  return (
    <ProfilTimYearClient
      year={year}
      members={members}
      years={years}
      pageSettings={{
        heroKicker: ps.heroKicker ?? '',
        heroTitle: ps.heroTitle ?? '',
        heroIntro: ps.heroIntro ?? '',
      }}
    />
  )
}