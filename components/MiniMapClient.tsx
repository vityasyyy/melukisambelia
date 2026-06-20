'use client'
import dynamic from 'next/dynamic'

const MiniMap = dynamic(() => import('./MiniMap').then((m) => m.MiniMap), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-2xl bg-gold-100/40" />,
})

export function MiniMapClient({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return <MiniMap lat={lat} lng={lng} title={title} />
}