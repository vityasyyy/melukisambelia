export function StatusBadge({ status }: { status: 'Aktif' | 'Berkembang' | 'Persiapan' }) {
  const map = {
    Aktif: 'bg-status-aktif/20 text-status-aktif',
    Berkembang: 'bg-status-berkembang/20 text-status-berkembang',
    Persiapan: 'bg-gray-500/15 text-gray-700',
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>{status}</span>
}