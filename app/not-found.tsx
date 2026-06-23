import Link from 'next/link'
import Image from 'next/image'
import { MotifDivider } from '@/components/MotifDivider'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative w-full max-w-lg rounded-[2rem] border border-tan-700/20 bg-cream-beige/60 p-10 shadow-terracotta">
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
        <Image
          src="/images/design-system/bw_logo_sambel.svg"
          alt="Melukis Sambelia"
          width={160}
          height={48}
          className="mx-auto"
        />
        <MotifDivider className="my-6" animate={false} />
        <h1 className="font-beautique text-5xl text-brown-900">404</h1>
        <p className="mt-2 text-ink/70">Halaman tidak ditemukan.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-water-900 px-6 py-3 font-medium text-page transition-colors hover:bg-water-500"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
