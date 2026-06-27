import type { Metadata } from 'next'
import { getCollection } from '@/lib/content'
import { getAirTanahData } from '@/lib/air-tanah-data'
import { AirTanahClient } from './AirTanahClient'

export const metadata: Metadata = {
  title: 'Air & Tanah',
  description: 'Data Tinggi Muka Airtanah (TMA) dan kualitas air Kecamatan Sambelia.',
}

export default function AirTanahPage() {
  const meta = getCollection('airTanah')[0] ?? null
  const data = getAirTanahData()
  return <AirTanahClient meta={meta} data={data} />
}