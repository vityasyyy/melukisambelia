import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getAirTanahData } from '@/lib/air-tanah-data'
import { getPageSettings } from '@/lib/settings'
import { AirTanahClient } from './AirTanahClient'
import { PageHero } from '@/components/PageHero'

export async function generateMetadata(): Promise<Metadata> {
  const airTanah = getPageSettings('airTanah')
  return {
    title: airTanah.seoTitle ?? 'Air & Tanah',
    description: airTanah.seoDescription ?? 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.',
  }
}

export default function AirTanahPage() {
  const meta = getCollection('airTanah')[0] ?? null
  const data = getAirTanahData()
  const ps = getPageSettings('airTanah')
  return (
    <>
      <PageHero kicker={ps.heroKicker ?? 'AIR & TANAH'} title={ps.heroTitle ?? 'Tinggi Muka Airtanah'} intro={ps.heroIntro ?? 'Data TMA dan DHL dari survei lapangan di Kecamatan Sambelia.'} tone="water" />
      <AirTanahClient meta={meta} data={data} />
    </>
  )
}