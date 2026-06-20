'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: '/images/design-system/cincin_sambel.svg',
  iconSize: [24, 24],
})

export function MiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-64 w-full rounded-2xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Marker position={[lat, lng]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}