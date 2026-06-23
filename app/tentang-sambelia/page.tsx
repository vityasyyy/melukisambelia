import { getSettings } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { MotifDivider } from '@/components/MotifDivider'
import Image from 'next/image'

export default function TentangSambeliaPage() {
  const s = getSettings()

  const geography = [
    { label: 'Luas Wilayah', value: s.stats.luas },
    { label: 'Penduduk', value: s.stats.penduduk },
    { label: 'Desa Binaan', value: s.stats.desaBinaan },
    { label: 'Tahun Program', value: s.stats.tahunProgram },
  ]

  const desa = [
    { name: 'Sugian', desc: 'Desa binaan dengan potensi wisata bahari dan pertanian.' },
    { name: 'Labuhan Pandan', desc: 'Desa pesisir dengan wisata bahari dan budaya Sasak.' },
  ]

  return (
    <>
      <section
        className="relative overflow-hidden bg-gradient-to-br from-brown-900 via-wine to-terracotta-500/60"
      >
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/design-system/batik_sambel.svg')" }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-content px-4 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-page/70">TENTANG</p>
          <h1
            className="mt-2 font-beautique-condensed text-4xl sm:text-5xl md:text-6xl text-page"
            style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
          >
            Sambelia
          </h1>
          <p className="mt-4 text-page/80 max-w-xl mx-auto text-sm sm:text-base">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {geography.map((g) => (
            <StatCard key={g.label} label={g.label} value={g.value} />
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-tan-700/30 bg-cream-beige/40 p-6">
          <h3 className="font-semibold text-brown-900 mb-2">Letak Geografis</h3>
          <p className="text-sm text-ink/70">
            Kecamatan Sambelia terletak di Kabupaten Lombok Timur, Provinsi Nusa Tenggara Barat.
            Wilayahnya mencakup area pesisir dengan potensi wisata bahari serta kawasan pertanian
            yang subur. Batas administrasi mencakup area desa Sugian dan Labuhan Pandan sebagai
            desa binaan program KKN-PPM UGM Melukis Sambelia.
          </p>
          <p className="mt-3 text-xs text-ink/40">
            *Data geografi akan dilengkapi dari BPS dan sekdes.
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
            <div key={d.name} className="rounded-2xl border border-tan-700/30 bg-white overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src="/images/content/nelayan-landscape.jpg"
                  alt={d.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-beautique-condensed text-2xl text-brown-900">{d.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{d.desc}</p>
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
          <div className="rounded-2xl border border-tan-700/30 bg-cream-warm/30 p-6">
            <h3 className="font-semibold text-lg text-brown-900">Pariwisata Berkelanjutan</h3>
            <p className="mt-2 text-sm text-ink/70">
              Pengembangan desa wisata di Sugian dan Labuhan Pandan, promosi destinasi unggulan
              seperti Pantai Berandangan dan Taman Wisata Air Kramat Suci, serta festival budaya
              Sasak (Peresean, Pawai Dulangan, Gendang Beleq).
            </p>
          </div>
          <div className="rounded-2xl border border-tan-700/30 bg-cream-warm/30 p-6">
            <h3 className="font-semibold text-lg text-brown-900">Kawasan Agropolitan</h3>
            <p className="mt-2 text-sm text-ink/70">
              Pengembangan kawasan agropolitan melalui pendampingan irigasi, pertanian, UMKM lokal,
              serta program kesehatan terintegrasi (stunting, posyandu).
            </p>
          </div>
        </div>
      </section>
    </>
  )
}