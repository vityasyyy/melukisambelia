import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import type { GisManifest } from '@/lib/gis-manifest'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const MANIFEST_FILE = path.join(CONTENT_DIR, '_gis_manifest.md')

const gisFileSchema = z.object({
  type: z.enum(['image', 'pdf', 'geojson']),
  category: z.enum(['umum', 'air', 'irigasi', 'vegetasi']),
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
})

const gisManifestSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  credit: z.string().default(''),
  files: z.array(gisFileSchema).default([]),
})

const EMPTY_MANIFEST: GisManifest = { title: 'Peta GIS Tim', description: '', credit: '', files: [] }

function isValidManifest(value: unknown): value is GisManifest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'files' in value &&
    Array.isArray((value as GisManifest).files)
  )
}

function readManifestFromMarkdown(): GisManifest | null {
  if (!fs.existsSync(MANIFEST_FILE)) return null
  try {
    const raw = fs.readFileSync(MANIFEST_FILE, 'utf8')
    const { data } = matter(raw)
    const parsed = gisManifestSchema.safeParse(data)
    if (!parsed.success) {
      console.error('[gis] Invalid manifest frontmatter:', parsed.error.toString())
      return null
    }
    const d = parsed.data
    return {
      title: d.title,
      description: d.description,
      credit: d.credit,
      files: d.files.map(f => ({
        type: f.type,
        category: f.category,
        name: f.name,
        url: f.url,
        description: f.description,
      })),
    }
  } catch {
    return null
  }
}

function readManifestFromJSON(): GisManifest | null {
  const jsonPath = path.join(process.cwd(), 'public', 'gis', 'manifest.json')
  if (!fs.existsSync(jsonPath)) return null
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8')
    const parsed = JSON.parse(raw)
    if (!isValidManifest(parsed)) return null
    return parsed as GisManifest
  } catch {
    return null
  }
}

export function getGisManifest(): GisManifest {
  return readManifestFromMarkdown() ?? readManifestFromJSON() ?? EMPTY_MANIFEST
}