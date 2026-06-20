import Link from 'next/link'
import { MotifDivider } from '@/components/MotifDivider'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center">
      <h1 className="font-beautique text-6xl text-brown-900">404</h1>
      <p className="mt-4 text-ink/70">Halaman tidak ditemukan.</p>
      <MotifDivider className="my-6" />
      <Link href="/" className="rounded-full bg-water-900 px-6 py-3 text-page">Kembali ke Beranda</Link>
    </div>
  )
}