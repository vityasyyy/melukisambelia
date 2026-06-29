'use client'

import Link from 'next/link'

export default function KesehatanError(props: { error: Error & { digest?: string }; reset: () => void }) {
  void props.error
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-beautique text-4xl text-brown-900">Terjadi Kesalahan</h1>
      <p className="mt-2 text-ink/70">Maaf, terjadi kesalahan saat memuat halaman kesehatan.</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={props.reset}
          className="rounded-full bg-olive px-6 py-3 font-medium text-page transition-colors hover:bg-olive-dark"
        >
          Coba Lagi
        </button>
        <Link
          href="/kesehatan"
          className="rounded-full border border-tan-700/30 px-6 py-3 font-medium text-brown-900 transition-colors hover:bg-cream-beige"
        >
          Kembali ke Kesehatan
        </Link>
      </div>
    </section>
  )
}