import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  timSchema, pariwisataSchema, irigasiSchema, kesehatanSchema,
  festivalSchema, kegiatanSchema, ceritaSchema, umkmSchema, mitraSchema,
  type Tim, type Pariwisata, type Irigasi, type Kesehatan,
  type Festival, type Kegiatan, type Cerita, type Umkm, type Mitra,
} from '@/lib/schemas'

const CONTENT_DIR = path.join(process.cwd(), 'content')

type SchemaMap = {
  tim: { schema: typeof timSchema; ext: string }
  pariwisata: { schema: typeof pariwisataSchema; ext: string }
  irigasi: { schema: typeof irigasiSchema; ext: string }
  kesehatan: { schema: typeof kesehatanSchema; ext: string }
  festival: { schema: typeof festivalSchema; ext: string }
  kegiatan: { schema: typeof kegiatanSchema; ext: string }
  cerita: { schema: typeof ceritaSchema; ext: string }
  umkm: { schema: typeof umkmSchema; ext: string }
  mitra: { schema: typeof mitraSchema; ext: string }
}

const SCHEMAS: SchemaMap = {
  tim: { schema: timSchema, ext: 'md' },
  pariwisata: { schema: pariwisataSchema, ext: 'mdx' },
  irigasi: { schema: irigasiSchema, ext: 'md' },
  kesehatan: { schema: kesehatanSchema, ext: 'md' },
  festival: { schema: festivalSchema, ext: 'md' },
  kegiatan: { schema: kegiatanSchema, ext: 'md' },
  cerita: { schema: ceritaSchema, ext: 'mdx' },
  umkm: { schema: umkmSchema, ext: 'md' },
  mitra: { schema: mitraSchema, ext: 'md' },
}

export type CollectionName = keyof SchemaMap
export type CollectionItem<C extends CollectionName> =
  C extends 'tim' ? Tim & { slug: string } :
  C extends 'pariwisata' ? Pariwisata & { slug: string } :
  C extends 'irigasi' ? Irigasi & { slug: string } :
  C extends 'kesehatan' ? Kesehatan & { slug: string } :
  C extends 'festival' ? Festival & { slug: string } :
  C extends 'kegiatan' ? Kegiatan & { slug: string } :
  C extends 'cerita' ? Cerita & { slug: string } :
  C extends 'umkm' ? Umkm & { slug: string } :
  C extends 'mitra' ? Mitra & { slug: string } :
  never

export function getCollection<C extends CollectionName>(name: C): CollectionItem<C>[] {
  const dir = path.join(CONTENT_DIR, name)
  if (!fs.existsSync(dir)) return [] as CollectionItem<C>[]
  const { schema, ext } = SCHEMAS[name]
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(`.${ext}`))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      const parsed = schema.safeParse({ ...data, body: content })
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in ${name}/${file}:\n${parsed.error.toString()}`)
      }
      const slug = file.replace(/\.(md|mdx)$/, '')
      return { ...parsed.data, slug } as CollectionItem<C>
    })
    .sort((a, b) => {
      const ao = (a as unknown as { order?: number }).order ?? 0
      const bo = (b as unknown as { order?: number }).order ?? 0
      return ao - bo
    })
}

export function getEntry<C extends CollectionName>(name: C, slug: string): CollectionItem<C> | null {
  const items = getCollection(name)
  return items.find((i) => i.slug === slug) ?? null
}