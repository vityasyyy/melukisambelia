'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

function MapReady() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => { map.invalidateSize() }, 200)
    return () => clearTimeout(t)
  }, [map])
  return null
}

export function MiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} minZoom={10} scrollWheelZoom={false} aria-label={`Peta lokasi ${title}`} className="h-48 w-full rounded-2xl">
      <MapReady />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Marker position={[lat, lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}