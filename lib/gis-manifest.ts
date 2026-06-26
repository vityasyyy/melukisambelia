export type GisCategory = 'umum' | 'air' | 'irigasi' | 'vegetasi'

export type GisFile = {
  type: 'geojson' | 'image' | 'pdf'
  category: GisCategory
  name: string
  url: string
  description?: string
}

export type GisManifest = {
  title: string
  description: string
  credit: string
  files: GisFile[]
}

export const GIS_CATEGORY_LABELS: Record<GisCategory, string> = {
  umum: 'GIS Tim',
  air: 'Air & TMA',
  irigasi: 'Irigasi & Kekeringan',
  vegetasi: 'Vegetasi, Erosi & Blue Carbon',
}
