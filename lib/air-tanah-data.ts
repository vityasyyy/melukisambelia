import { getCollection } from '@/lib/content'

export type TmaMeasurement = {
  location: string
  date: string
  tmaMeters: number
  dhlMsiemens: number
}

export type AirTanahData = {
  title: string
  description: string
  credit: string
  measurements: TmaMeasurement[]
}

export function getAirTanahData(): AirTanahData | null {
  const items = getCollection('airTanah')
  if (items.length === 0) return null
  const item = items[0]
  return {
    title: item.title,
    description: item.description,
    credit: item.credit,
    measurements: item.measurements,
  }
}