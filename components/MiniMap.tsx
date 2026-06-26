'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = L.icon({
  iconUrl: '/images/design-system/cincin_sambel.svg',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
})

export function MiniMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-64 w-full rounded-2xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  )
}
