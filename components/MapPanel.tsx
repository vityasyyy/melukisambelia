'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InteractiveMap } from './InteractiveMap'
import { GisMap } from './GisMap'
import type { MapMarker } from '@/lib/map'

export function MapPanel({ markers, gis }: { markers: MapMarker[]; gis: { title: string; description: string; credit: string } }) {
  return (
    <Tabs defaultValue="interaktif">
      <TabsList>
        <TabsTrigger value="interaktif">Peta Interaktif</TabsTrigger>
        <TabsTrigger value="gis">Peta GIS Tim</TabsTrigger>
      </TabsList>
      <TabsContent value="interaktif"><InteractiveMap markers={markers} /></TabsContent>
      <TabsContent value="gis"><GisMap {...gis} /></TabsContent>
    </Tabs>
  )
}