'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import { cn } from '@/lib/utils'
import { yearCardHoverVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/animation'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

const YEAR_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  '2026': { from: 'from-gold-700 via-terracotta-700 to-brown-900', to: 'to-brown-950', accent: '#F9E11F' },
  '2025': { from: 'from-water-900 via-water-700 to-brown-900', to: 'to-brown-950', accent: '#14A8E1' },
  '2024': { from: 'from-olive via-olive-dark to-brown-900', to: 'to-brown-950', accent: '#99BA57' },
}

const DEFAULT_YEAR_COLOR = { from: 'from-brown-900 via-brown-700 to-brown-950', to: 'to-brown-950', accent: '#F0AC6D' }

export function ProfilTimLandingClient({
  members,
  pageSettings,
}: {
  members: ProfilTimItem[]
  pageSettings: Record<string, string>
}) {
  const shouldReduce = useReducedMotion()

  const years = Array.from(new Set(members.map((m) => m.year || '2026'))).sort((a, b) => b.localeCompare(a))

  const yearData = years.map((year) => {
    const yearMembers = members.filter((m) => (m.year || '2026') === year)
    const leaders = yearMembers.filter((m) => m.isKormanit || m.isKormaSHE || m.isDosen)
    const clusters = Array.from(new Set(yearMembers.map((m) => m.cluster)))
    return { year, members: yearMembers, leaders, clusters }
  })

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'PROFIL TIM'}
        title={pageSettings.heroTitle ?? 'Tim Melukis Sambelia'}
        intro={pageSettings.heroIntro ?? 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.'}
        tone="gold"
      />

      <section className="relative overflow-hidden bg-page">
        <MotifFloater motif="bunga_sambel" position="top-right" size="md" color="gold" opacity={0.4} parallax />
        <MotifFloater motif="cincin_sambel" position="bottom-left" size="lg" color="terracotta" opacity={0.3} parallax />
        <div className="relative mx-auto max-w-content px-4 py-12 md:py-16">
          <FadeIn>
            <SectionHeader
              kicker="Periode KKN"
              title="Pilih Periode"
              intro="Lihat anggota tim berdasarkan tahun pelaksanaan KKN."
              tone="gold"
              centered
            />
          </FadeIn>

          {shouldReduce ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {yearData.map(({ year, members: yearMembers, clusters }) => (
                <Link key={year} href={`/profil-tim/${year}`} className="block">
                  <div
                    className={cn(
                      'glass-card glass-accent-top relative overflow-hidden p-8 text-center transition-transform hover:scale-[1.02]',
                    )}
                    style={{ '--accent-color': YEAR_COLORS[year]?.accent ?? DEFAULT_YEAR_COLOR.accent } as React.CSSProperties}
                  >
                    <p className="font-beautique text-5xl sm:text-6xl text-brown-900">{year}</p>
                    <div className="mt-2 mx-auto h-1 w-10 rounded-full bg-gold-500" />
                    <p className="mt-3 text-sm text-ink/70">
                      {yearMembers.length} anggota · {clusters.length} kluster
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {yearData.map(({ year, members: yearMembers, clusters }) => (
                <motion.div key={year} variants={staggerItemVariants}>
                  <Link href={`/profil-tim/${year}`} className="block">
                    <motion.div
                      className="glass-card glass-accent-top relative overflow-hidden p-8 text-center cursor-pointer"
                      style={{ '--accent-color': YEAR_COLORS[year]?.accent ?? DEFAULT_YEAR_COLOR.accent } as React.CSSProperties}
                      variants={yearCardHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <p className="font-beautique text-5xl sm:text-6xl text-brown-900">{year}</p>
                      <div className="mt-2 mx-auto h-1 w-10 rounded-full bg-gold-500" />
                      <p className="mt-3 text-sm text-ink/70">
                        {yearMembers.length} anggota · {clusters.length} kluster
                      </p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {members.length === 0 && (
            <div className="mt-10 text-center">
              <p className="text-ink/50">Belum ada data anggota tim. Data akan ditambahkan segera.</p>
            </div>
          )}
        </div>
        <MotifDivider />
      </section>
    </>
  )
}