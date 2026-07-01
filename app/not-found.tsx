import Link from 'next/link'
import Image from 'next/image'
import { MotifDivider } from '@/components/MotifDivider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang dicari tidak ditemukan.',
}

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brown-950 via-wine to-terracotta-900" />
      <div aria-hidden className="absolute inset-0 section-watermark" style={{ opacity: 0.08 }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(100% 70% at 50% 40%, rgba(244,232,208,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/images/design-system/bw_logo_sambel.svg"
          alt="Sambelia"
          width={140}
          height={42}
          className="brightness-0 invert opacity-90"
        />
        <MotifDivider className="my-6" animate={false} />
        <h1 className="font-beautique text-6xl sm:text-7xl text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>404</h1>
        <p className="mt-3 text-lg text-white/80">Kayaknya tersesat di Sambelia nih.</p>
        <p className="mt-1 text-sm text-white/60">Halaman yang kamu cari tidak ditemukan.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-brown-950 shadow-lg transition-all hover:bg-cream-warm hover:shadow-xl hover:scale-[1.02]"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}