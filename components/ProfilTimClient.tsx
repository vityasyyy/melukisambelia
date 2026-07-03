'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/SectionHeader'
import { FadeIn } from '@/components/FadeIn'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import { ChipRow } from '@/components/Chip'
import { cn } from '@/lib/utils'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }

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

type ViewMode = 'kluster' | 'subunit'

export function ProfilTimClient({
  members,
  pageSettings,
}: {
  members: ProfilTimItem[]
  pageSettings: Record<string, string>
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('kluster')
  const [selectedMember, setSelectedMember] = useState<ProfilTimItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const years = Array.from(new Set(members.map((m) => m.year || '2026'))).sort((a, b) => b.localeCompare(a))

  const openModal = (m: ProfilTimItem) => {
    setSelectedMember(m)
    setModalOpen(true)
  }

  const groupedByYearCluster = members.reduce<Record<string, Record<string, ProfilTimItem[]>>>((acc, m) => {
    const year = m.year || '2026'
    const cluster = m.cluster || 'Saintek'
    if (!acc[year]) acc[year] = {}
    if (!acc[year][cluster]) acc[year][cluster] = []
    acc[year][cluster].push(m)
    return acc
  }, {})

  const groupedByYearSubunit = members.reduce<Record<string, Record<string, ProfilTimItem[]>>>((acc, m) => {
    const year = m.year || '2026'
    const subunit = m.subunit || 'Lainnya'
    if (!acc[year]) acc[year] = {}
    if (!acc[year][subunit]) acc[year][subunit] = []
    acc[year][subunit].push(m)
    return acc
  }, {})

  const allSubunits = Array.from(new Set(members.map((m) => m.subunit || 'Lainnya'))).sort()

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'PROFIL TIM'}
        title={pageSettings.heroTitle ?? 'Tim Melukis Sambelia'}
        intro={pageSettings.heroIntro ?? 'Kenali tim KKN-PPM UGM yang melayani dan berkarya bersama masyarakat Sambelia.'}
        tone="gold"
      />

      {years.map((year, yearIdx) => {
        const yearMembers = members.filter((m) => (m.year || '2026') === year)
        const leaders = yearMembers.filter((m) => m.isKormanit || m.isKormaSHE || m.isDosen)

        return (
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

              {leaders.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em] text-gold-bright">
                    Koordinator & Pembimbing
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaders.map((m) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => openModal(m)}
                        className="text-left"
                      >
                        <LeaderCard m={m} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <div className="inline-flex items-center rounded-full bg-tan-700/10 p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setViewMode('kluster')}
                    className={cn(
                      'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                      viewMode === 'kluster'
                        ? 'bg-gold-bright text-brown-950 shadow-md'
                        : 'text-ink/50 hover:text-ink'
                    )}
                  >
                    Kluster
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('subunit')}
                    className={cn(
                      'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                      viewMode === 'subunit'
                        ? 'bg-gold-bright text-brown-950 shadow-md'
                        : 'text-ink/50 hover:text-ink'
                    )}
                  >
                    Subunit
                  </button>
                </div>

                {viewMode === 'kluster' ? (
                  <KlusterView
                    year={year}
                    grouped={groupedByYearCluster}
                    openModal={openModal}
                  />
                ) : (
                  <SubunitView
                    year={year}
                    grouped={groupedByYearSubunit}
                    allSubunits={allSubunits}
                    openModal={openModal}
                  />
                )}
              </div>
            </div>
            {yearIdx < years.length - 1 && <MotifDivider />}
          </section>
        )
      })}

      {members.length === 0 && (
        <section className="relative overflow-hidden bg-page">
          <div className="relative mx-auto max-w-content px-4 py-16 text-center">
            <p className="text-ink/50">Belum ada data anggota tim. Data akan ditambahkan segera.</p>
          </div>
        </section>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogPrimitive.Portal>
          <DialogOverlay />
          <DialogPrimitive.Content className="fixed z-[1101] inset-0 flex flex-col items-stretch sm:items-center sm:justify-center p-0 sm:p-4 focus:outline-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto w-full max-w-lg mt-auto sm:mt-0"
            >
              {selectedMember && (
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] border border-black/10">
                  <DialogPrimitive.Close className="absolute right-3 top-3 z-[1102] flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brown-950 backdrop-blur-sm border border-black/10 transition-all hover:bg-white hover:scale-105" aria-label="Tutup dialog">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Tutup</span>
                  </DialogPrimitive.Close>

                  <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-none">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-gold-700 to-terracotta-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full ring-4 ring-white/30">
                          <Image
                            src={selectedMember.photo || '/images/hero-placeholder.svg'}
                            alt={selectedMember.name}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <DialogTitle className="font-beautique text-xl sm:text-2xl text-white break-words" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
                          {selectedMember.name}
                        </DialogTitle>
                        {selectedMember.role && (
                          <DialogDescription className="mt-1 text-sm text-white/90" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                            {selectedMember.role}
                          </DialogDescription>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <ChipRow
                        chips={[
                          { label: CLUSTER_LABELS[selectedMember.cluster] || selectedMember.cluster, tone: 'gold' },
                          ...(selectedMember.subunit ? [{ label: selectedMember.subunit, tone: 'water' as const }] : []),
                          ...(selectedMember.divisiTeknis ? [{ label: selectedMember.divisiTeknis, tone: 'olive' as const }] : []),
                          ...(selectedMember.isKormanit ? [{ label: 'Kormanit', tone: 'terracotta' as const }] : []),
                          ...(selectedMember.isKormaSHE ? [{ label: 'KormaSHE', tone: 'green' as const }] : []),
                          ...(selectedMember.isDosen ? [{ label: 'Dosen Pembimbing', tone: 'brown' as const }] : []),
                        ]}
                      />

                      {selectedMember.studyProgram && (
                        <>
                          <Separator className="my-4 bg-tan-700/15" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">Program Studi</p>
                            <p className="mt-1 text-sm text-ink/80">{selectedMember.studyProgram}</p>
                          </div>
                        </>
                      )}

                      {selectedMember.instagram && (
                        <>
                          <Separator className="my-4 bg-tan-700/15" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">Instagram</p>
                            <a
                              href={`https://instagram.com/${selectedMember.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 text-sm text-terracotta-500 hover:text-terracotta-700 transition-colors"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="5.5" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                              </svg>
                              @{selectedMember.instagram}
                            </a>
                          </div>
                        </>
                      )}

                      {selectedMember.description && (
                        <>
                          <Separator className="my-4 bg-tan-700/15" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">Tentang</p>
                            <p className="mt-1 text-sm text-ink/70 leading-relaxed">{selectedMember.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </>
  )
}

function LeaderCard({ m }: { m: ProfilTimItem }) {
  const badges: string[] = []
  if (m.isKormanit) badges.push('Kormanit')
  if (m.isKormaSHE) badges.push('KormaSHE')
  if (m.isDosen) badges.push('Dosen Pembimbing')

  return (
    <div
      className="glass-card glass-accent-top group relative flex h-full flex-col overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      style={{ '--accent-color': '#D4A843' } as React.CSSProperties}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-bright/30">
          <Image
            src={m.photo || '/images/hero-placeholder.svg'}
            alt={m.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{m.name}</h4>
          {m.role && <p className="truncate text-sm font-medium text-gold-bright">{m.role}</p>}
          <div className="mt-1 flex flex-wrap gap-1">
            {badges.map((b) => (
              <span key={b} className="inline-block rounded-full bg-gold-bright/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gold-bright">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MemberCard({ m, accent, onClick }: { m: ProfilTimItem; accent: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full"
    >
      <div
        className="glass-card glass-accent-top group relative flex h-full flex-col overflow-hidden"
        style={{ '--accent-color': accent } as React.CSSProperties}
      >
        <div className="relative mx-auto mt-5 h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image
            src={m.photo || '/images/hero-placeholder.svg'}
            alt={m.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1 p-4 text-center">
          <h4 className="truncate font-semibold text-lg text-brown-900 group-hover:text-terracotta-500 transition-colors">{m.name}</h4>
          {m.role && <p className="mt-0.5 text-sm font-medium" style={{ color: accent }}>{m.role}</p>}
          {m.divisiTeknis && (
            <span className="mt-1 inline-block rounded-full bg-tan-700/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/50">
              {m.divisiTeknis}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function KlusterView({
  year,
  grouped,
  openModal,
}: {
  year: string
  grouped: Record<string, Record<string, ProfilTimItem[]>>
  openModal: (m: ProfilTimItem) => void
}) {
  return (
    <>
      {CLUSTER_ORDER.map((cluster) => {
        const clusterMembers = (grouped[year]?.[cluster] || []).filter(
          (m) => !m.isKormanit && !m.isKormaSHE && !m.isDosen
        )
        if (!clusterMembers.length) return null
        return (
          <div key={cluster} className="mt-6">
            <h3
              className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em]"
              style={{ color: CLUSTER_ACCENTS[cluster] }}
            >
              {CLUSTER_LABELS[cluster]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {clusterMembers.map((m) => (
                <MemberCard key={m.slug} m={m} accent={CLUSTER_ACCENTS[cluster]} onClick={() => openModal(m)} />
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}

function SubunitView({
  year,
  grouped,
  allSubunits,
  openModal,
}: {
  year: string
  grouped: Record<string, Record<string, ProfilTimItem[]>>
  allSubunits: string[]
  openModal: (m: ProfilTimItem) => void
}) {
  const subunitAccents = ['#14A8E1', '#99BA57', '#E3795C', '#3B82F6', '#D4A843', '#68794A']

  return (
    <>
      {allSubunits.map((subunit, si) => {
        const subunitMembers = (grouped[year]?.[subunit] || []).filter(
          (m) => !m.isKormanit && !m.isKormaSHE && !m.isDosen
        )
        if (!subunitMembers.length) return null
        const accent = subunitAccents[si % subunitAccents.length]
        return (
          <div key={subunit} className="mt-6">
            <h3
              className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em]"
              style={{ color: accent }}
            >
              {subunit}
            </h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 -mx-4 px-4">
              {subunitMembers.map((m) => (
                <div key={m.slug} className="snap-center shrink-0 w-[75vw] sm:w-[280px]">
                  <MemberCard m={m} accent={accent} onClick={() => openModal(m)} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs font-beautique-condensed uppercase tracking-[0.15em] text-ink/50">Geser horizontal untuk menjelajah →</p>
          </div>
        )
      })}
    </>
  )
}