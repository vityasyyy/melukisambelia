'use client'

import { MessageCircle, Share2, Link2 } from 'lucide-react'
import { toast } from 'sonner'

type ShareButtonsProps = {
  title: string
  url?: string
  className?: string
}

export function ShareButtons({ title, url, className }: ShareButtonsProps) {
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(shareUrl)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Tautan berhasil disalin!')
    } catch {
      toast.error('Gagal menyalin tautan')
    }
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ''}`}>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#128C7E]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#1DA1F2] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0C85D0]"
      >
        <Share2 className="h-4 w-4" />
        Twitter
      </a>
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-1.5 rounded-full border border-tan-700/30 bg-cream-beige px-4 py-2.5 text-sm font-medium text-brown-900 transition-colors hover:bg-cream-warm"
      >
        <Link2 className="h-4 w-4" />
        Salin Tautan
      </button>
    </div>
  )
}