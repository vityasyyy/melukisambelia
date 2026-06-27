import fs from 'fs'
import path from 'path'
import type { GisManifest } from '@/lib/gis-manifest'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'gis', 'manifest.json')

const EMPTY_MANIFEST: GisManifest = { title: 'Peta GIS Tim', description: '', credit: '', files: [] }

function isValidManifest(value: unknown): value is GisManifest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'files' in value &&
    Array.isArray((value as GisManifest).files)
  )
}

export function getGisManifest(): GisManifest {
  if (!fs.existsSync(MANIFEST_PATH)) return EMPTY_MANIFEST
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return isValidManifest(parsed) ? parsed : EMPTY_MANIFEST
  } catch {
    return EMPTY_MANIFEST
  }
}
