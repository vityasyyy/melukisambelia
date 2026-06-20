import Image from 'next/image'

export function MotifDivider({ motif = 'cincin_sambel', className }: { motif?: 'batik_sambel' | 'cincin_sambel' | 'bunga_sambel'; className?: string }) {
  return (
    <div className={`flex justify-center opacity-20 ${className}`}>
      <Image src={`/images/design-system/${motif}.svg`} alt="" width={120} height={40} aria-hidden />
    </div>
  )
}