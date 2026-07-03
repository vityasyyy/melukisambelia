import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, umkmSchema, airTanahSchema,
  desaSchema, tentangSchema, lingkunganSchema, profilTimSchema,
  type Pariwisata, type Irigasi, type Kesehatan,
  type Festival, type Kegiatan, type Umkm, type AirTanah,
  type Desa, type Tentang, type Lingkungan, type ProfilTim,
} from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

let validationErrors: string[] = []

export function getValidationErrors(): string[] {
  return [...validationErrors]
}

export function clearValidationErrors(): void {
  validationErrors = []
}

type SchemaMap = {
  pariwisata: { schema: typeof pariwisataSchema; ext: string; dir?: string }
  irigasi: { schema: typeof irigasiSchema; ext: string; dir?: string }
  kesehatan: { schema: typeof kesehatanSchema; ext: string; dir?: string }
  festival: { schema: typeof festivalSchema; ext: string; dir?: string }
  kegiatan: { schema: typeof kegiatanSchema; ext: string; dir?: string }
  umkm: { schema: typeof umkmSchema; ext: string; dir?: string }
  airTanah: { schema: typeof airTanahSchema; ext: string; dir?: string }
  desa: { schema: typeof desaSchema; ext: string; dir?: string }
  tentang: { schema: typeof tentangSchema; ext: string; dir?: string }
  lingkungan: { schema: typeof lingkunganSchema; ext: string; dir?: string }
  profilTim: { schema: typeof profilTimSchema; ext: string; dir?: string }
}

const SCHEMAS: SchemaMap = {
  pariwisata: { schema: pariwisataSchema, ext: 'mdx' },
  irigasi: { schema: irigasiSchema, ext: 'md' },
  kesehatan: { schema: kesehatanSchema, ext: 'md' },
  festival: { schema: festivalSchema, ext: 'md' },
  kegiatan: { schema: kegiatanSchema, ext: 'mdx' },
  umkm: { schema: umkmSchema, ext: 'md' },
  airTanah: { schema: airTanahSchema, ext: 'md', dir: 'air-tanah' },
  desa: { schema: desaSchema, ext: 'md' },
  tentang: { schema: tentangSchema, ext: 'md' },
  lingkungan: { schema: lingkunganSchema, ext: 'md' },
  profilTim: { schema: profilTimSchema, ext: 'md', dir: 'profil-tim' },
}

export type CollectionName = keyof SchemaMap
export type CollectionItem<C extends CollectionName> =
  C extends 'pariwisata' ? Pariwisata & { slug: string } :
  C extends 'irigasi' ? Irigasi & { slug: string } :
  C extends 'kesehatan' ? Kesehatan & { slug: string } :
  C extends 'festival' ? Festival & { slug: string } :
  C extends 'kegiatan' ? Kegiatan & { slug: string } :
  C extends 'umkm' ? Umkm & { slug: string } :
  C extends 'airTanah' ? AirTanah & { slug: string } :
  C extends 'desa' ? Desa & { slug: string } :
  C extends 'tentang' ? Tentang & { slug: string } :
  C extends 'lingkungan' ? Lingkungan & { slug: string } :
  C extends 'profilTim' ? ProfilTim & { slug: string } :
  never

export function getCollection<C extends CollectionName>(name: C): CollectionItem<C>[] {
  const entry = SCHEMAS[name]
  if (!entry) return [] as CollectionItem<C>[]
  const dir = path.join(CONTENT_DIR, entry.dir ?? name)
  if (!fs.existsSync(dir)) return [] as CollectionItem<C>[]
  const { schema, ext } = entry
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(`.${ext}`))
  const items: CollectionItem<C>[] = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data, content } = matter(raw)
    const parsed = schema.safeParse({ ...data, body: content || data.body || '' })
    if (!parsed.success) {
      const formatted = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')
      const msg = `[content] ${name}/${file}:\n${formatted}`
      validationErrors.push(msg)
      console.error(msg)
      continue
    }
    const slug = file.replace(/\.(md|mdx)$/, '')
    items.push({ ...parsed.data, slug } as CollectionItem<C>)
  }
  return items.sort((a, b) => {
    const ao = (a as unknown as { order?: number }).order ?? 0
    const bo = (b as unknown as { order?: number }).order ?? 0
    if (ao !== bo) return ao - bo
    return a.slug.localeCompare(b.slug)
  })
}

export function getEntry<C extends CollectionName>(name: C, slug: string): CollectionItem<C> | null {
  const items = getCollection(name)
  return items.find((i) => i.slug === slug) ?? null
}