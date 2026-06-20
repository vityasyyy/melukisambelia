import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { settingsSchema, gisMapSchema, type Settings, type GisMap } from '@/lib/schemas'

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