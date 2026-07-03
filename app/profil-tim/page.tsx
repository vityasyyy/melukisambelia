import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings } from '@/lib/settings'
import { ProfilTimClient } from '@/components/ProfilTimClient'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const ps = getPageSettings('profilTim')
  return {
    title: ps.seoTitle ?? 'Profil Tim',
    description: ps.seoDescription ?? 'Tim KKN-PPM UGM Melukis Sambelia.',
  }
}

export default function ProfilTimPage() {
  const ps = getPageSettings('profilTim')
  const members = getCollection('profilTim') as ProfilTimItem[]

  return (
    <ProfilTimClient
      members={members}
      pageSettings={{
        heroKicker: ps.heroKicker ?? '',
        heroTitle: ps.heroTitle ?? '',
        heroIntro: ps.heroIntro ?? '',
      }}
    />
  )
}