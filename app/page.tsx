import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'

export default function Beranda() {
  const s = getSettings()
  const pariwisata = getCollection('pariwisata').slice(0, 1)
  const irigasi = getCollection('irigasi').slice(0, 1)
  const kesehatan = getCollection('kesehatan').slice(0, 1)
  const festival = getCollection('festival').slice(0, 1)
  const kegiatan = getCollection('kegiatan').slice(0, 1)
  const umkm = getCollection('umkm').slice(0, 1)
  const mitra = getCollection('mitra').filter((m) => m.tier === 'Utama')

  const previews = [
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/placeholders/beach.svg', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/placeholders/irrigation.svg', title: 'Irigasi', desc: 'Data saluran irigasi.' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/placeholders/health.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/placeholders/festival.svg', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.' },
    { href: '/kegiatan', image: kegiatan[0]?.cover ?? '/images/placeholders/program.svg', title: 'Kegiatan', desc: 'Program unggulan tim.' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/placeholders/umkm.svg', title: 'UMKM', desc: 'UMKM lokal Sambelia.' },
  ]

  return (
    <>
      <section
        className="relative min-h-[60vh] sm:h-[70vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-brown-900 via-brown-900/80 to-terracotta-500/40"
      >
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')" }}
          aria-hidden
        />
        <div className="relative z-10 px-6 py-16 max-w-2xl">
          <h1 className="font-beautique text-4xl sm:text-5xl md:text-7xl text-page leading-tight">
            Melukis Sambelia
          </h1>
          <p className="mt-4 text-base sm:text-lg text-page/90 max-w-xl mx-auto">
            {s.heroTagline}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/peta" className="rounded-full bg-water-900 px-6 py-3 font-medium text-page hover:bg-water-500 transition-colors">
              Jelajahi Peta
            </Link>
            <Link href="/festival" className="rounded-full border border-page/60 px-6 py-3 font-medium text-page hover:bg-page/10 transition-colors">
              Festival Pesona
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 scroll-mt-20">
        <SectionHeader kicker="01 — TENTANG" title="Tentang Sambelia" intro="Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Luas" value={s.stats.luas} />
          <StatCard label="Penduduk" value={s.stats.penduduk} />
          <StatCard label="Desa Binaan" value={s.stats.desaBinaan} />
          <StatCard label="Tahun Program" value={s.stats.tahunProgram} />
        </div>
      </section>

      <MotifDivider className="my-8" />

      <section className="mx-auto max-w-content px-4 py-8 scroll-mt-20">
        <SectionHeader kicker="02 — JEJAKI" title="Jejaki Sambelia" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => <DataCard key={p.href} {...p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 scroll-mt-20">
        <SectionHeader kicker="03 — MITRA" title="Bersama Mitra Kami" />
        <div className="flex flex-wrap gap-8 items-center">
          {mitra.map((m) => (
            <Image key={m.slug} src={m.logo} alt={m.name} width={140} height={60} className="opacity-70" />
          ))}
        </div>
      </section>
    </>
  )
}