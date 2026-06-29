import type { Metadata } from 'next'
import { getSettings, getDesa, getTentang, getPageSettings } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'

import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'
import { MotifFloater } from '@/components/MotifFloater'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const tentang = getPageSettings('tentang')
  return {
    title: tentang.seoTitle ?? 'Tentang Sambelia',
    description: tentang.seoDescription ?? 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa binaan, dan fokus program Melukis Sambelia.',
  }
}

export default function TentangSambeliaPage() {
  const s = getSettings()
  const desa = getDesa()
  const tentang = getTentang()
  const ps = getPageSettings('tentang')

  const geography = [
    { label: 'Luas Wilayah', value: s.stats.luas },
    { label: 'Penduduk', value: s.stats.penduduk },
    { label: 'Desa Binaan', value: s.stats.desaBinaan },
    { label: 'Tahun Program', value: s.stats.tahunProgram },
  ]

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'TENTANG'}
        title={ps.heroTitle ?? 'Sambelia'}
        intro={ps.heroIntro ?? 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pusat pengembangan pariwisata berkelanjutan dan kawasan agropolitan.'}
        tone="brown"
      />

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-16 scroll-mt-20">
        <MotifFloater motif="cincin_sambel" position="top-right" size="md" color="terracotta" />
        <FadeIn>
          <SectionHeader
            kicker={ps.sectionGeografiKicker ?? '01 — GEOGRAFI'}
            title={ps.sectionGeografiTitle ?? 'Geografi & Demografi'}
            intro={ps.sectionGeografiIntro ?? 'Letak, luas, dan penduduk Kecamatan Sambelia.'}
            tone="green"
          />
        </FadeIn>
        <StaggerContainer stagger={0.06} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {geography.map((g) => (
            <StaggerItem key={g.label}>
              <StatCard label={g.label} value={g.value} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="mt-8 rounded-2xl border border-tan-700/20 bg-cream-beige/40 p-6 shadow-terracotta">
          <h3 className="mb-2 font-semibold text-brown-900">Letak Geografis</h3>
          <p className="text-sm leading-relaxed text-ink/70">
            {tentang.geographyProse}
          </p>
          <p className="mt-3 text-xs text-ink/70">
            Data geografi diperbarui berdasarkan informasi desa binaan.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-12 scroll-mt-20">
        <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="gold" />
        <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="water" />
        <FadeIn>
          <SectionHeader
            kicker={ps.sectionDesaKicker ?? '02 — DESA BINAAN'}
            title={ps.sectionDesaTitle ?? 'Desa Binaan'}
            intro={ps.sectionDesaIntro ?? 'Desa-desa yang menjadi fokus program Melukis Sambelia.'}
            tone="water"
          />
        </FadeIn>
        <StaggerContainer stagger={0.1} className="grid gap-6 md:grid-cols-2">
          {desa.map((d) => (
            <StaggerItem key={d.slug}>
              <div className="group overflow-hidden rounded-2xl border border-tan-700/20 bg-cream-beige/50 shadow-terracotta transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-terracotta-hover">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-beautique text-2xl text-brown-900">{d.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{d.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="relative mx-auto max-w-content overflow-hidden px-4 py-12 scroll-mt-20">
        <MotifFloater motif="cincin_sambel" position="top-right" size="sm" color="olive" />
        <FadeIn>
          <SectionHeader
            kicker={ps.sectionPotensiKicker ?? '03 — POTENSI DESA'}
            title={ps.sectionPotensiTitle ?? 'Potensi Desa'}
            intro={ps.sectionPotensiIntro ?? 'Potensi unggulan Kecamatan Sambelia: wisata bahari, pertanian, dan kerajinan khas Sasak.'}
            tone="terracotta"
          />
        </FadeIn>
        <StaggerContainer stagger={0.1} className="grid gap-4 sm:grid-cols-2">
          {tentang.potensiDesa.map((p) => (
            <StaggerItem key={p.title}>
              <div className="h-full rounded-2xl border border-tan-700/20 bg-cream-warm/30 p-6 shadow-terracotta">
                <h3 className="font-semibold text-lg text-brown-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {p.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </>
  )
}