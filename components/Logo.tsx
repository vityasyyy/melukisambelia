import Image from 'next/image'

export function Logo({ variant = 'color', className }: { variant?: 'color' | 'bw'; className?: string }) {
  const src = variant === 'bw' ? '/images/design-system/bw_logo_sambel.svg' : '/images/design-system/color_logo_sambel.svg'
  return (
    <Image
      src={src}
      alt="Melukis Sambelia"
      width={160}
      height={48}
      className={className}
      style={{ width: 'auto', height: 'auto' }}
      priority
    />
  )
}