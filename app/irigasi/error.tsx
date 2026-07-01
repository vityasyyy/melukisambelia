'use client'

import Link from 'next/link'

export default function IrigasiError(props: { error: Error & { digest?: string }; reset: () => void }) {
  void props.error
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="font-beautique text-4xl text-brown-900">Terjadi Kesalahan</h1>
      <p className="mt-2 text-ink/70">Maaf, terjadi kesalahan saat memuat halaman irigasi.</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={props.reset}
          className="rounded-full bg-brown-950 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl hover:scale-[1.02]"
        >
          Coba Lagi
        </button>
        <Link
          href="/irigasi"
          className="rounded-full border-2 border-brown-950/20 bg-brown-950/5 px-6 py-3 font-semibold text-brown-900 transition-all hover:bg-brown-950/10 hover:border-brown-950/30 hover:scale-[1.02]"
        >
          Kembali ke Irigasi
        </Link>
      </div>
    </section>
  )
}