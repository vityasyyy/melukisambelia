import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { MotifDivider } from '@/components/MotifDivider'
import { GradientText } from '@/components/GradientText'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Tentang Sambelia',
  description: 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa binaan, dan fokus program Melukis Sambelia.',
}

export default function TentangSambeliaPage() {
  const s = getSettings()

  const geography = [
    { label: 'Luas Wilayah', value: s.stats.luas },
    { label: 'Penduduk', value: s.stats.penduduk },
    { label: 'Desa Binaan', value: s.stats.desaBinaan },
    { label: 'Tahun Program', value: s.stats.tahunProgram },
  ]

  const desa = [
    { name: 'Sugian', desc: 'Desa binaan dengan potensi wisata bahari, pertanian, dan kerajinan tangan khas Sasak.', image: '/images/content/sugian-group44.png' },
    { name: 'Labuhan Pandan', desc: 'Desa pesisir dengan wisata bahari, budaya Sasak, dan ekowisata mangrove.', image: '/images/content/peopleplaying.png' },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brown-900 via-wine to-terracotta-500/60 py-20 text-center text-cream-light"
      >
        <div className="absolute inset-0 section-watermark" aria-hidden />
        <div className="relative z-10 mx-auto max-w-content px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-cream-light/70">TENTANG</p>
          <h1
            className="mt-2 font-beautique text-display-lg"
            style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          >
            <GradientText className="text-cream-light">Sambelia</GradientText>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-cream-light/80 sm:text-base">
            Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat —
            pusat pengembangan pariwisata berkelanjutan dan kawasan agropolitan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 scroll-mt-20">
        <SectionHeader
          kicker="01 — GEOGRAFI"
          title="Geografi & Demografi"
          intro="Letak, luas, dan penduduk Kecamatan Sambelia."
          tone="green"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {geography.map((g) => (
            <StatCard key={g.label} label={g.label} value={g.value} />
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-6 shadow-terracotta">
          <h3 className="mb-2 font-semibold text-brown-900">Letak Geografis</h3>
          <p className="text-sm leading-relaxed text-ink/70">
            Kecamatan Sambelia terletak di Kabupaten Lombok Timur, Provinsi Nusa Tenggara Barat.
            Wilayahnya mencakup area pesisir dengan potensi wisata bahari serta kawasan pertanian
            yang subur. Batas administrasi mencakup area desa Sugian dan Labuhan Pandan sebagai
            desa binaan program KKN-PPM UGM Melukis Sambelia.
          </p>
          <p className="mt-3 text-xs text-ink/40">
            Data geografi diperbarui berdasarkan informasi desa binaan.
          </p>
        </div>
      </section>

      <MotifDivider className="my-4" />

      <section className="mx-auto max-w-content px-4 py-12 scroll-mt-20">
        <SectionHeader
          kicker="02 — DESA BINAAN"
          title="Desa Binaan"
          intro="Desa-desa yang menjadi fokus program Melukis Sambelia."
          tone="water"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {desa.map((d) => (
            <div key={d.name} className="overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all hover:-translate-y-1 hover:shadow-terracotta-hover">
              <div className="relative aspect-video">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-beautique text-2xl text-brown-900">{d.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MotifDivider className="my-4" />

      <section className="mx-auto max-w-content px-4 py-12 scroll-mt-20">
        <SectionHeader
          kicker="03 — PROGRAM"
          title="Fokus Program"
          intro="Penguatan kemandirian masyarakat berbasis pariwisata berkelanjutan dan pengembangan kawasan agropolitan."
          tone="terracotta"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-tan-700/20 bg-cream-warm/30 p-6 shadow-terracotta">
            <h3 className="font-semibold text-lg text-brown-900">Pariwisata Berkelanjutan</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Pengembangan desa wisata di Sugian dan Labuhan Pandan, promosi destinasi unggulan
              seperti Pantai Berandangan dan Taman Wisata Air Kramat Suci, serta festival budaya
              Sasak (Peresean, Pawai Dulangan, Gendang Beleq).
            </p>
          </div>
          <div className="rounded-2xl border border-tan-700/20 bg-cream-warm/30 p-6 shadow-terracotta">
            <h3 className="font-semibold text-lg text-brown-900">Kawasan Agropolitan</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Pengembangan kawasan agropolitan melalui pendampingan irigasi, pertanian, UMKM lokal,
              serta program kesehatan terintegrasi (stunting, posyandu).
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
