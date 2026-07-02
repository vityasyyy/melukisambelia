import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getSettings, getDesa, getTentang, getPageSettings } from '@/lib/settings'
import { SectionHeader } from '@/components/SectionHeader'
import { CountUpStat } from '@/components/CountUpStat'
import { FadeIn } from '@/components/FadeIn'
import { PageHero } from '@/components/PageHero'
import { StaggerContainer, StaggerItem } from '@/components/Stagger'

import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import Image from 'next/image'

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const tentang = getPageSettings('tentang')
  return {
    title: tentang.seoTitle ?? 'Tentang Sambelia',
    description: tentang.seoDescription ?? 'Profil Kecamatan Sambelia, Kabupaten Lombok Timur: geografi, demografi, desa, dan potensi daerah.',
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
    { label: 'Desa/Kelurahan', value: s.stats.desaKelurahan },
    { label: 'Kabupaten', value: s.stats.kabupaten },
  ]

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'TENTANG'}
        title={ps.heroTitle ?? 'Sambelia'}
        intro={ps.heroIntro ?? 'Kecamatan Sambelia, Kabupaten Lombok Timur, Nusa Tenggara Barat — pusat pengembangan pariwisata berkelanjutan dan kawasan agropolitan.'}
        tone="brown"
      />

      <section className="relative overflow-hidden bg-page scroll-mt-20">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="olive" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10">
          <FadeIn>
            <SectionHeader
              kicker={ps.sectionGeografiKicker ?? '01 — GEOGRAFI'}
              title={ps.sectionGeografiTitle ?? 'Geografi & Demografi'}
              intro={ps.sectionGeografiIntro ?? 'Letak, luas, dan penduduk Kecamatan Sambelia.'}
              tone="green"
            />
          </FadeIn>
          <StaggerContainer stagger={0.06} className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {geography.map((g) => (
              <StaggerItem key={g.label}>
                <CountUpStat label={g.label} value={g.value} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="group glass-card glass-accent-left mt-6 p-5" style={{ '--accent-color': '#99BA57' } as React.CSSProperties}>
            <h3 className="mb-2 font-beautique text-lg text-brown-900">Letak Geografis</h3>
            <p className="text-sm leading-relaxed text-ink/60">
              {tentang.geographyProse}
            </p>
            <p className="mt-3 text-xs text-ink/60">
              Data geografi berdasarkan profil Kecamatan Sambelia.
            </p>
          </div>
        </div>
      </section>

      <MotifDivider />

      <section className="relative overflow-hidden bg-cream-warm/30">
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="water" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">

          <FadeIn>
            <SectionHeader
              kicker={ps.sectionDesaKicker ?? '02 — DESA BINAAN'}
              title={ps.sectionDesaTitle ?? 'Desa Binaan'}
              intro={ps.sectionDesaIntro ?? 'Desa-desa dan kelurahan yang ada di Kecamatan Sambelia.'}
              tone="water"
            />
          </FadeIn>
          <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
            {desa.map((d, i) => (
              <div key={d.slug} className="snap-center shrink-0 w-[80vw] sm:w-[420px]">
                <div className="glass-card glass-accent-top group relative overflow-hidden h-full" style={{ '--accent-color': '#99BA57' } as React.CSSProperties}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, 420px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-brown-950/20 to-transparent" />
                    <div aria-hidden className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brown-950/60 font-beautique-condensed text-sm font-bold text-gold-bright ring-1 ring-white/15 backdrop-blur-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="absolute bottom-3 left-4 right-4 z-10 font-beautique text-2xl text-white group-hover:text-gold-bright transition-colors" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>{d.name}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm leading-relaxed text-ink/60">{d.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
        </div>
      </section>

      <MotifDivider />

      <section className="relative overflow-hidden bg-page">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="terracotta" opacity={0.5} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="olive" opacity={0.5} />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">

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
                  <div className="glass-card glass-accent-top group h-full p-6" style={{ '--accent-color': '#E3795C' } as React.CSSProperties}>
                    <h3 className="font-beautique text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {p.description}
                    </p>
                  </div>
                </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}