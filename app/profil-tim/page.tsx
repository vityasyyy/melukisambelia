import type { Metadata } from 'next'
import { REVALIDATE_SECONDS } from '@/lib/config'
import { getCollection } from '@/lib/content'
import { getPageSettings } from '@/lib/settings'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import Image from 'next/image'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

export const revalidate = REVALIDATE_SECONDS

export async function generateMetadata(): Promise<Metadata> {
  const ps = getPageSettings('profilTim')
  return {
    title: ps.seoTitle ?? 'Profil Tim',
    description: ps.seoDescription ?? 'Tim KKN-PPM UGM Melukis Sambelia.',
  }
}

const CLUSTER_ORDER = ['Saintek', 'Soshum', 'Agro', 'Medika'] as const
const CLUSTER_ACCENTS: Record<string, string> = {
  Saintek: '#3B82F6',
  Soshum: '#E3795C',
  Agro: '#99BA57',
  Medika: '#14A8E1',
}
const CLUSTER_LABELS: Record<string, string> = {
  Saintek: 'Sains & Teknologi',
  Soshum: 'Sosial & Humaniora',
  Agro: 'Agrokultur',
  Medika: 'Kesehatan',
}

export default function ProfilTimPage() {
  const ps = getPageSettings('profilTim')
  const members = getCollection('profilTim') as ProfilTimItem[]

  const grouped = members.reduce<Record<string, Record<string, ProfilTimItem[]>>>((acc, m) => {
    const year = m.year || '2026'
    const cluster = m.cluster || 'Saintek'
    if (!acc[year]) acc[year] = {}
    if (!acc[year][cluster]) acc[year][cluster] = []
    acc[year][cluster].push(m)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <PageHero
        kicker={ps.heroKicker ?? 'PROFIL TIM'}
        title={ps.heroTitle ?? 'Tim Melukis Sambelia'}
        intro={ps.heroIntro ?? 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.'}
        tone="gold"
      />

      {years.map((year, yearIdx) => (
        <section key={year} className="relative overflow-hidden bg-page">
          <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" opacity={0.4} />
          <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.4} />
          <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">
            <FadeIn>
              <SectionHeader
                kicker={`KKN ${year}`}
                title={`Tim ${year}`}
                intro={`Anggota KKN-PPM UGM Melukis Sambelia ${year}.`}
                tone="gold"
              />
            </FadeIn>

            {CLUSTER_ORDER.map((cluster) => {
              const clusterMembers = grouped[year]?.[cluster]
              if (!clusterMembers?.length) return null
              return (
                <div key={cluster} className="mt-8">
                  <h3
                    className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em]"
                    style={{ color: CLUSTER_ACCENTS[cluster] }}
                  >
                    {CLUSTER_LABELS[cluster]}
                  </h3>
                  <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
                    {clusterMembers.map((m) => (
                      <div key={m.slug} className="snap-center shrink-0 w-[75vw] sm:w-[280px]">
                        <div
                          className="glass-card glass-accent-top group relative h-full flex flex-col overflow-hidden"
                          style={{ '--accent-color': CLUSTER_ACCENTS[cluster] } as React.CSSProperties}
                        >
                          <div className="relative mx-auto mt-5 h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
                            <Image
                              src={m.photo}
                              alt={m.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="96px"
                            />
                          </div>
                          <div className="min-w-0 flex-1 p-4 text-center">
                            <h4 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{m.name}</h4>
                            {m.role && <p className="mt-0.5 text-sm font-medium" style={{ color: CLUSTER_ACCENTS[cluster] }}>{m.role}</p>}
                            {m.description && <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-3">{m.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
                </div>
              )
            })}
          </div>
          {yearIdx < years.length - 1 && <MotifDivider />}
        </section>
      ))}

      {members.length === 0 && (
        <section className="relative overflow-hidden bg-page">
          <div className="relative mx-auto max-w-content px-4 py-16 text-center">
            <p className="text-ink/50">Belum ada data anggota tim. Data akan ditambahkan segera.</p>
          </div>
        </section>
      )}
    </>
  )
}