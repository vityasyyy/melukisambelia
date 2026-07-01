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
      <div className="relative w-full max-w-lg rounded-[2rem] border-l-[3px] border-l-terracotta-500 bg-white p-10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <h1 className="font-beautique text-5xl text-brown-900">Ups!</h1>
        <p className="mt-2 text-ink/60">Terjadi kesalahan saat memuat halaman.</p>
        <p className="mt-1 text-xs text-ink/60">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-brown-950 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02]"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="rounded-full border-2 border-brown-950/20 bg-brown-950/5 px-6 py-3 font-semibold text-brown-900 transition-all hover:bg-brown-950/10 hover:border-brown-950/30 hover:scale-[1.02]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  )
}