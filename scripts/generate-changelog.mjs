import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../content/changelog.json')

function getLog() {
  try {
    const raw = execSync('git log --pretty=format:"%H|||%s|||%ai" --no-merges', { encoding: 'utf8' })
    return raw.trim().split('\n').filter(Boolean).map((line) => {
      const [hash, subject, date] = line.split('|||')
      return { hash, subject, date }
    })
  } catch {
    return []
  }
}

function groupByMonth(entries) {
  const groups = {}
  for (const e of entries) {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!groups[key]) groups[key] = []
    groups[key].push({ hash: e.hash, subject: e.subject, date: e.date })
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, entries]) => ({ month, entries }))
}

const entries = getLog()
const changelog = groupByMonth(entries)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(changelog, null, 2))
console.log(`Wrote ${entries.length} entries to ${OUT}`)