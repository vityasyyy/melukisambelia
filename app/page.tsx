import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import { getCollection } from '@/lib/content'
import { StatCard } from '@/components/StatCard'
import { DataCard } from '@/components/DataCard'
import { SectionHeader } from '@/components/SectionHeader'
import { MotifDivider } from '@/components/MotifDivider'
import { GradientText } from '@/components/GradientText'
import { KilasSambelia } from '@/components/KilasSambelia'
import { SponsorCta } from '@/components/SponsorCta'

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
    { href: '/pariwisata', image: pariwisata[0]?.cover ?? '/images/content/pariwisata-beach.svg', title: 'Pariwisata', desc: 'Destinasi unggulan Sambelia.', accent: '#14A8E1' },
    { href: '/irigasi', image: irigasi[0]?.cover ?? '/images/content/irigasi-saluran.svg', title: 'Irigasi', desc: 'Data saluran irigasi.', accent: '#99BA57' },
    { href: '/kesehatan', image: kesehatan[0]?.cover ?? '/images/content/kesehatan-fasilitas.svg', title: 'Kesehatan', desc: 'Fasilitas & program kesehatan.', accent: '#667F37' },
    { href: '/festival', image: festival[0]?.cover ?? '/images/content/festival-peresean.svg', title: 'Festival Pesona', desc: 'Peresean, Pawai Dulangan, Gendang Beleq.', accent: '#E3795C' },
    { href: '/kegiatan', image: kegiatan[0]?.cover ?? '/images/content/kegiatan-program.svg', title: 'Kegiatan', desc: 'Program unggulan tim.', accent: '#742D1B' },
    { href: '/umkm', image: umkm[0]?.cover ?? '/images/content/umkm-kerajinan.svg', title: 'UMKM', desc: 'UMKM lokal Sambelia.', accent: '#F0AC6D' },
  ]

  return (
    <>
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden text-center sm:min-h-[75vh]">
        <Image src={s.heroImage} alt="Sambelia" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative z-10 max-w-3xl px-6 py-20">
          <h1
            className="font-beautique text-display-xl text-cream-light text-balance"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}
          >
            <GradientText className="text-cream-light">Melukis</GradientText>{' '}
            <span className="text-cream-light">Sambelia</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream-light/90 sm:text-lg">
            {s.heroTagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/peta"
              className="rounded-full bg-water-900 px-6 py-3 font-medium text-page shadow-sm transition-colors hover:bg-water-500"
            >
              Jelajahi Peta
            </Link>
            <Link
              href="/festival"
              className="rounded-full border border-cream-light/60 px-6 py-3 font-medium text-cream-light backdrop-blur-sm transition-colors hover:bg-cream-light/10"
            >
              Festival Pesona
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-content px-4 py-16">
        <div className="absolute inset-0 -z-10 section-watermark" aria-hidden />
        <SectionHeader
          kicker="01 — TENTANG"
          title="Tentang Sambelia"
          intro="Kecamatan Sambelia, Kabupaten Lombok Timur, NTB — fokus pemberdayaan pariwisata berkelanjutan dan kawasan agropolitan."
          tone="terracotta"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Luas" value={s.stats.luas} />
          <StatCard label="Penduduk" value={s.stats.penduduk} />
          <StatCard label="Desa Binaan" value={s.stats.desaBinaan} />
          <StatCard label="Tahun Program" value={s.stats.tahunProgram} />
        </div>
      </section>

      <MotifDivider motif="cincin_sambel" />

      <section className="mx-auto max-w-content px-4 py-8">
        <SectionHeader kicker="02 — JEJAKI" title="Jejaki Sambelia" tone="gold" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((p) => <DataCard key={p.href} {...p} />)}
        </div>
      </section>

      <KilasSambelia />

      <SponsorCta />

      <section className="mx-auto max-w-content px-4 py-12">
        <SectionHeader kicker="04 — MITRA" title="Bersama Mitra Kami" tone="olive" centered />
        <div className="flex flex-wrap items-center justify-center gap-8">
          {mitra.map((m) => (
            <Image
              key={m.slug}
              src={m.logo}
              alt={m.name}
              width={140}
              height={60}
              className="opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>
      </section>
    </>
  )
}
