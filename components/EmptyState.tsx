import { FadeIn } from './FadeIn'
import { MotifDivider } from './MotifDivider'

export function EmptyState({ message }: { message: string }) {
  return (
    <FadeIn>
      <div className="py-16 text-center">
        <div className="flex justify-center mb-6 opacity-30">
          <MotifDivider motif="bunga_sambel" />
        </div>
        <p className="text-ink/70 text-sm sm:text-base">{message}</p>
        <p className="mt-2 text-xs text-ink/60">Tim Melukis Sambelia akan menambahkan data segera.</p>
      </div>
    </FadeIn>
  )
}