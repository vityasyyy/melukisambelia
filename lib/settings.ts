import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { settingsSchema, gisMapSchema, tentangSchema, type Settings, type GisMap, type Tentang, type Desa } from '@/lib/schemas'
import { getCollection } from '@/lib/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getSettings(): Settings {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, '_settings.md'), 'utf8')
  const { data } = matter(raw)
  return settingsSchema.parse(data)
}

export function getGisMap(): GisMap {
  const file = path.join(CONTENT_DIR, '_gismap.md')
  if (!fs.existsSync(file)) return { title: 'Peta GIS Tim', description: '', credit: '' }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return gisMapSchema.parse(data)
}

export function getTentang(): Tentang {
  const file = path.join(CONTENT_DIR, '_tentang.md')
  if (!fs.existsSync(file)) return { geographyProse: '', potensiDesa: [] }
  const raw = fs.readFileSync(file, 'utf8')
  const { data } = matter(raw)
  return tentangSchema.parse(data)
}

export function getDesa(): (Desa & { slug: string })[] {
  return getCollection('desa')
}