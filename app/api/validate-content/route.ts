import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import {
  pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, umkmSchema, airTanahSchema,
  desaSchema, lingkunganSchema, profilTimSchema,
} from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

const SCHEMAS: Record<string, { schema: z.ZodTypeAny; ext: string; dir?: string }> = {
  pariwisata: { schema: pariwisataSchema, ext: 'mdx' },
  irigasi: { schema: irigasiSchema, ext: 'md' },
  kesehatan: { schema: kesehatanSchema, ext: 'md' },
  festival: { schema: festivalSchema, ext: 'md' },
  kegiatan: { schema: kegiatanSchema, ext: 'mdx' },
  umkm: { schema: umkmSchema, ext: 'md' },
  airTanah: { schema: airTanahSchema, ext: 'md', dir: 'air-tanah' },
  desa: { schema: desaSchema, ext: 'md' },
  lingkungan: { schema: lingkunganSchema, ext: 'md' },
  profilTim: { schema: profilTimSchema, ext: 'md' },
}

export async function GET() {
  const results: Record<string, { valid: string[]; invalid: Array<{ file: string; errors: string[] }> }> = {}

  for (const [name, entry] of Object.entries(SCHEMAS)) {
    const dir = path.join(CONTENT_DIR, entry.dir ?? name)
    const result = { valid: [] as string[], invalid: [] as Array<{ file: string; errors: string[] }> }
    if (!fs.existsSync(dir)) {
      results[name] = result
      continue
    }
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(`.${entry.ext}`))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const parsed = entry.schema.safeParse({ ...data, body: content || data.body || '' })
      if (parsed.success) {
        result.valid.push(file)
      } else {
        result.invalid.push({
          file,
          errors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        })
      }
    }
    results[name] = result
  }

  const hasErrors = Object.values(results).some((r) => r.invalid.length > 0)
  return NextResponse.json({ ok: !hasErrors, collections: results }, { status: hasErrors ? 422 : 200 })
}