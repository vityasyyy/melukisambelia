'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InteractiveMap } from './InteractiveMap'
import { GisMap } from './GisMap'
import { PetaSection } from './PetaSection'
import type { MapMarker } from '@/lib/map'
import type { GisFile, GisCategory } from '@/lib/gis-manifest'
import { GIS_CATEGORY_LABELS } from '@/lib/gis-manifest'

const THEME_TABS: GisCategory[] = ['umum', 'air', 'irigasi', 'vegetasi']

export function MapPanel({
  markers,
  gis,
  gisFiles,
}: {
  markers: MapMarker[]
  gis: { title: string; description: string; credit: string }
  gisFiles: GisFile[]
}) {
  const [activeTab, setActiveTab] = useState('interaktif')
  const filesByCategory = (category: GisCategory) => gisFiles.filter((f) => f.category === category)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="relative isolate rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-4 shadow-terracotta">
      <TabsList className="mb-4 flex flex-wrap gap-1">
        <TabsTrigger value="interaktif">Peta Interaktif</TabsTrigger>
        {THEME_TABS.map((c) => (
          <TabsTrigger key={c} value={c}>{GIS_CATEGORY_LABELS[c]}</TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="interaktif">
        <InteractiveMap markers={markers} />
      </TabsContent>
      {THEME_TABS.map((c) => (
        <TabsContent key={c} value={c}>
          {c === 'umum' ? (
            <GisMap {...gis} files={filesByCategory('umum')} />
          ) : (
            <PetaSection files={filesByCategory(c)} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
