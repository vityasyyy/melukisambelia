'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative w-full max-w-lg rounded-[2rem] border border-tan-700/20 bg-cream-beige/60 p-10 shadow-terracotta">
        <h1 className="font-beautique text-5xl text-brown-900">Ups!</h1>
        <p className="mt-2 text-ink/70">Terjadi kesalahan saat memuat halaman.</p>
        <p className="mt-1 text-xs text-ink/60">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-water-900 px-6 py-3 font-medium text-page transition-colors hover:bg-water-500"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="rounded-full border border-tan-700/30 px-6 py-3 font-medium text-brown-900 transition-colors hover:bg-cream-beige"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  )
}