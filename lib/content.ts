import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, ceritaSchema, umkmSchema, airTanahSchema,
  desaSchema, tentangSchema,
  type Pariwisata, type Irigasi, type Kesehatan,
  type Festival, type Cerita, type Umkm, type AirTanah,
  type Desa, type Tentang,
} from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

type SchemaMap = {
  pariwisata: { schema: typeof pariwisataSchema; ext: string; dir?: string }
  irigasi: { schema: typeof irigasiSchema; ext: string; dir?: string }
  kesehatan: { schema: typeof kesehatanSchema; ext: string; dir?: string }
  festival: { schema: typeof festivalSchema; ext: string; dir?: string }
  cerita: { schema: typeof ceritaSchema; ext: string; dir?: string }
  umkm: { schema: typeof umkmSchema; ext: string; dir?: string }
  airTanah: { schema: typeof airTanahSchema; ext: string; dir?: string }
  desa: { schema: typeof desaSchema; ext: string; dir?: string }
  tentang: { schema: typeof tentangSchema; ext: string; dir?: string }
}

const SCHEMAS: SchemaMap = {
  pariwisata: { schema: pariwisataSchema, ext: 'mdx' },
  irigasi: { schema: irigasiSchema, ext: 'md' },
  kesehatan: { schema: kesehatanSchema, ext: 'md' },
  festival: { schema: festivalSchema, ext: 'md' },
  cerita: { schema: ceritaSchema, ext: 'mdx' },
  umkm: { schema: umkmSchema, ext: 'md' },
  airTanah: { schema: airTanahSchema, ext: 'md', dir: 'air-tanah' },
  desa: { schema: desaSchema, ext: 'md' },
  tentang: { schema: tentangSchema, ext: 'md' },
}

export type CollectionName = keyof SchemaMap
export type CollectionItem<C extends CollectionName> =
  C extends 'pariwisata' ? Pariwisata & { slug: string } :
  C extends 'irigasi' ? Irigasi & { slug: string } :
  C extends 'kesehatan' ? Kesehatan & { slug: string } :
  C extends 'festival' ? Festival & { slug: string } :
  C extends 'cerita' ? Cerita & { slug: string } :
  C extends 'umkm' ? Umkm & { slug: string } :
  C extends 'airTanah' ? AirTanah & { slug: string } :
  C extends 'desa' ? Desa & { slug: string } :
  C extends 'tentang' ? Tentang & { slug: string } :
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
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[content] Invalid frontmatter in ${name}/${file} — skipping entry:\n${parsed.error.toString()}`)
      }
      continue
    }
    const slug = file.replace(/\.(md|mdx)$/, '')
    items.push({ ...parsed.data, slug } as CollectionItem<C>)
  }
  return items.sort((a, b) => {
    const ao = (a as unknown as { order?: number }).order ?? 0
    const bo = (b as unknown as { order?: number }).order ?? 0
    return ao - bo
  })
}

export function getEntry<C extends CollectionName>(name: C, slug: string): CollectionItem<C> | null {
  const items = getCollection(name)
  return items.find((i) => i.slug === slug) ?? null
}