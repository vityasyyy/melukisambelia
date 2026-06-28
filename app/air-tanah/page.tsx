import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getAirTanahData } from '@/lib/air-tanah-data'
import { AirTanahClient } from './AirTanahClient'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Air & Tanah',
  description: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.',
}

export default function AirTanahPage() {
  const meta = getCollection('airTanah')[0] ?? null
  const data = getAirTanahData()
  return (
    <>
      <PageHero kicker="AIR & TANAH" title="Tinggi Muka Airtanah" intro="Data TMA dan DHL dari survei lapangan di Kecamatan Sambelia." tone="water" />
      <AirTanahClient meta={meta} data={data} />
    </>
  )
}