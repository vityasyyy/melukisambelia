import { Breadcrumb } from '@/components/Breadcrumb'
import { FadeIn } from '@/components/FadeIn'
import changelog from '@/content/changelog.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Riwayat perubahan dan pembaruan situs Kecamatan Sambelia.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatMonth(key: string) {
  const [y, m] = key.split('-')
  const d = new Date(Number(y), Number(m) - 1)
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

export default function ChangelogPage() {

  return (
    <>
      <Breadcrumb items={[{ label: 'Beranda', href: '/' }, { label: 'Changelog' }]} />
      <section className="mx-auto max-w-content px-4 py-10">
        <FadeIn>
          <h1 className="font-beautique text-4xl text-brown-900">Changelog</h1>
          <p className="mt-2 text-ink/70">Riwayat perubahan dan pembaruan situs.</p>
        </FadeIn>
        <div className="mt-10 space-y-10">
          {changelog.map((group) => (
            <div key={group.month}>
              <h2 className="font-beautique text-xl text-brown-900 border-b border-tan-700/20 pb-2">
                {formatMonth(group.month)}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.entries.map((entry) => (
                  <li key={entry.hash} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-water-500" />
                    <div>
                      <p className="text-sm text-ink/90">{entry.subject}</p>
                      <p className="text-xs text-ink/60">{formatDate(entry.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}