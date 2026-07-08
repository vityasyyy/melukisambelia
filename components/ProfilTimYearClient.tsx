'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PageHero } from '@/components/PageHero'
import { FadeIn } from '@/components/FadeIn'
import { MotifDivider } from '@/components/MotifDivider'
import { MotifFloater } from '@/components/MotifFloater'
import { ChipRow } from '@/components/Chip'
import { cn } from '@/lib/utils'
import {
  tabContentVariants,
  presetTabIndicator,
  modalVariants,
  staggerContainerVariants,
  staggerItemVariants,
  yearCardHoverVariants,
} from '@/lib/animation'
import type { ProfilTim } from '@/lib/schemas'

type ProfilTimItem = ProfilTim & { slug: string }
type ViewMode = 'kluster' | 'subunit'

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

const SUBUNIT_ACCENTS = ['#14A8E1', '#99BA57', '#E3795C', '#3B82F6', '#D4A843', '#68794A']

export function ProfilTimYearClient({
  year,
  members,
  years,
  pageSettings,
}: {
  year: string
  members: ProfilTimItem[]
  years: string[]
  pageSettings: Record<string, string>
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('kluster')
  const [selectedMember, setSelectedMember] = useState<ProfilTimItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [direction, setDirection] = useState(0)
  const shouldReduce = useReducedMotion()

  const leaders = members.filter((m) => m.isKormanit || m.isKormaSHE || m.isDosen)

  const groupedByCluster = members.reduce<Record<string, ProfilTimItem[]>>((acc, m) => {
    const cluster = m.cluster || 'Saintek'
    if (!acc[cluster]) acc[cluster] = []
    acc[cluster].push(m)
    return acc
  }, {})

  const groupedBySubunit = members.reduce<Record<string, ProfilTimItem[]>>((acc, m) => {
    const subunit = m.subunit || 'Lainnya'
    if (!acc[subunit]) acc[subunit] = []
    acc[subunit].push(m)
    return acc
  }, {})

  const allSubunits = Array.from(new Set(members.map((m) => m.subunit || 'Lainnya'))).sort()

  const openModal = useCallback((m: ProfilTimItem) => {
    setSelectedMember(m)
    setModalOpen(true)
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setDirection(mode === 'kluster' ? -1 : 1)
    setViewMode(mode)
  }, [])

  return (
    <>
      <PageHero
        kicker={pageSettings.heroKicker ?? 'PROFIL TIM'}
        title={`Tim ${year}`}
        intro={pageSettings.heroIntro ?? `Anggota KKN-PPM UGM Melukis Sambelia ${year}.`}
        tone="gold"
      />

      <section className="relative overflow-hidden bg-page">
        <MotifFloater motif="bunga_sambel" position="top-right" size="sm" color="gold" opacity={0.4} parallax />
        <MotifFloater motif="bunga_sambel" position="bottom-left" size="md" color="terracotta" opacity={0.4} parallax />
        <div className="relative mx-auto max-w-content px-4 py-8 md:py-10 scroll-mt-20">

          {/* Year tabs */}
          {years.length > 1 && (
            <FadeIn className="mb-6">
              <div className="inline-flex items-center gap-2 flex-wrap">
                {years.map((y) => (
                  <Link
                    key={y}
                    href={`/profil-tim/${y}`}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                      y === year
                        ? 'bg-gold-bright text-brown-950 shadow-md'
                        : 'text-ink/50 hover:text-ink hover:bg-tan-700/10'
                    )}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Leaders */}
          {leaders.length > 0 && (
            <div className="mt-6">
              <FadeIn>
                <h3 className="mb-4 font-beautique-condensed text-sm font-semibold uppercase tracking-[0.15em] text-gold-bright">
                  Koordinator & Pembimbing
                </h3>
              </FadeIn>
              {shouldReduce ? (
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
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {leaders.map((m) => (
                    <motion.div key={m.slug} variants={staggerItemVariants}>
                      <button
                        type="button"
                        onClick={() => openModal(m)}
                        className="text-left w-full"
                      >
                        <LeaderCard m={m} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* Kluster / Subunit toggle */}
          <div className="mt-8">
            <FadeIn>
              <div className="relative inline-flex items-center rounded-full bg-tan-700/10 p-1 mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    className="absolute h-[calc(100%-8px)] rounded-full bg-gold-bright shadow-md"
                    initial={false}
                    layoutId="viewModeIndicator"
                    transition={presetTabIndicator}
                    style={{ width: 'auto' }}
                  />
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => handleViewModeChange('kluster')}
                  className={cn(
                    'relative z-10 px-5 py-2 rounded-full text-sm font-semibold transition-colors',
                    viewMode === 'kluster' ? 'text-brown-950' : 'text-ink/50 hover:text-ink'
                  )}
                >
                  Kluster
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange('subunit')}
                  className={cn(
                    'relative z-10 px-5 py-2 rounded-full text-sm font-semibold transition-colors',
                    viewMode === 'subunit' ? 'text-brown-950' : 'text-ink/50 hover:text-ink'
                  )}
                >
                  Subunit
                </button>
              </div>
            </FadeIn>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={viewMode}
                custom={direction}
                variants={shouldReduce ? undefined : tabContentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {viewMode === 'kluster' ? (
                  <KlusterView
                    grouped={groupedByCluster}
                    openModal={openModal}
                    photoField="photo"
                  />
                ) : (
                  <SubunitView
                    allSubunits={allSubunits}
                    grouped={groupedBySubunit}
                    openModal={openModal}
                    photoField="photoSubunit"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <MotifDivider />
      </section>

      {/* Member detail modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogPrimitive.Portal>
          <DialogOverlay />
          <DialogPrimitive.Content className="fixed z-[1101] inset-0 flex flex-col items-stretch sm:items-center sm:justify-center p-0 sm:p-4 focus:outline-none">
            <AnimatePresence>
              {selectedMember && (
                <motion.div
                  key="modal-content"
                  variants={shouldReduce ? undefined : modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mx-auto w-full max-w-lg mt-auto sm:mt-0"
                >
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] border border-black/10">
                    <DialogPrimitive.Close className="absolute right-3 top-3 z-[1102] flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brown-950 backdrop-blur-sm border border-black/10 transition-all hover:bg-white hover:scale-105" aria-label="Tutup dialog">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Tutup</span>
                    </DialogPrimitive.Close>

                    <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-none">
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={(viewMode === 'kluster' ? selectedMember.photo : selectedMember.photoSubunit) || '/images/hero-placeholder.svg'}
                          alt={selectedMember.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 560px"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <DialogTitle className="font-beautique text-xl sm:text-2xl text-white break-words" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                            {selectedMember.name}
                          </DialogTitle>
                          {selectedMember.role && (
                            <DialogDescription className="mt-1 text-sm text-white/90" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
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

                        {(selectedMember.instagram || selectedMember.linkedin) && (
                          <>
                            <Separator className="my-4 bg-tan-700/15" />
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                              {selectedMember.instagram && (
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">Instagram</p>
                                  <a
                                    href={`https://instagram.com/${selectedMember.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-terracotta-500 hover:text-terracotta-700 transition-colors"
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                      <circle cx="12" cy="12" r="5.5" />
                                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                    @{selectedMember.instagram.replace('@', '')}
                                  </a>
                                </div>
                              )}
                              {selectedMember.linkedin && (
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">LinkedIn</p>
                                  <a
                                    href={selectedMember.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.065 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    LinkedIn
                                  </a>
                                </div>
                              )}
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
                </motion.div>
              )}
            </AnimatePresence>
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

function MemberCard({ m, accent, onClick, photoField }: { m: ProfilTimItem; accent: string; onClick: () => void; photoField: 'photo' | 'photoSubunit' }) {
  const shouldReduce = useReducedMotion()
  const photoSrc = m[photoField] || '/images/hero-placeholder.svg'

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full"
    >
      <motion.div
        className="glass-card glass-accent-top group relative flex h-full flex-col overflow-hidden"
        style={{ '--accent-color': accent } as React.CSSProperties}
        variants={shouldReduce ? undefined : yearCardHoverVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <div className="relative mx-auto mt-5 h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image
            src={photoSrc}
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
      </motion.div>
    </button>
  )
}

function KlusterView({
  grouped,
  openModal,
  photoField,
}: {
  grouped: Record<string, ProfilTimItem[]>
  openModal: (m: ProfilTimItem) => void
  photoField: 'photo' | 'photoSubunit'
}) {
  const shouldReduce = useReducedMotion()

  return (
    <>
      {CLUSTER_ORDER.map((cluster) => {
        const clusterMembers = (grouped[cluster] || []).filter(
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
            {shouldReduce ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {clusterMembers.map((m) => (
                  <MemberCard key={m.slug} m={m} accent={CLUSTER_ACCENTS[cluster]} onClick={() => openModal(m)} photoField={photoField} />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {clusterMembers.map((m) => (
                  <motion.div key={m.slug} variants={staggerItemVariants}>
                    <MemberCard m={m} accent={CLUSTER_ACCENTS[cluster]} onClick={() => openModal(m)} photoField={photoField} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )
      })}
    </>
  )
}

function SubunitView({
  allSubunits,
  grouped,
  openModal,
  photoField,
}: {
  allSubunits: string[]
  grouped: Record<string, ProfilTimItem[]>
  openModal: (m: ProfilTimItem) => void
  photoField: 'photo' | 'photoSubunit'
}) {
  return (
    <>
      {allSubunits.map((subunit, si) => {
        const subunitMembers = (grouped[subunit] || []).filter(
          (m) => !m.isKormanit && !m.isKormaSHE && !m.isDosen
        )
        if (!subunitMembers.length) return null
        const accent = SUBUNIT_ACCENTS[si % SUBUNIT_ACCENTS.length]
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
                  <MemberCard m={m} accent={accent} onClick={() => openModal(m)} photoField={photoField} />
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