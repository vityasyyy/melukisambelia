import fs from 'fs'
import path from 'path'

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
  const filePath = path.join(process.cwd(), 'public', 'data', 'air-tanah.json')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as AirTanahData
}