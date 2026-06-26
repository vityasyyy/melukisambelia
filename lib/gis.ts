import fs from 'fs'
import path from 'path'
import type { GisManifest } from '@/lib/gis-manifest'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'gis', 'manifest.json')

export function getGisManifest(): GisManifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { title: 'Peta GIS Tim', description: '', credit: '', files: [] }
  }
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8')
  return JSON.parse(raw) as GisManifest
}
