import { MotifDivider } from './MotifDivider'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center">
      <MotifDivider className="mb-4" />
      <p className="text-ink/60">{message}</p>
    </div>
  )
}