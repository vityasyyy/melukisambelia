import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const gontserrat = localFont({
  src: [
    { path: '../public/fonts/gontserrat/Gontserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-gontserrat',
  display: 'swap',
})

const beautique = localFont({
  src: [
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-beautique',
  display: 'swap',
})

const beautiqueCondensed = localFont({
  src: [
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-beautique-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Melukis Sambelia — KKN-PPM UGM',
    template: '%s — Melukis Sambelia',
  },
  description: 'Profil desa Kecamatan Sambelia — pariwisata, data kesehatan, irigasi, UMKM, dan peta tematik.',
  metadataBase: new URL('https://melukis-sambelia.vercel.app'),
  openGraph: {
    title: 'Melukis Sambelia — KKN-PPM UGM',
    description: 'Pemberdayaan pariwisata berkelanjutan dan agropolitan Sambelia.',
    type: 'website',
    locale: 'id_ID',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/images/design-system/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/design-system/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/design-system/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0873B9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${gontserrat.variable} ${beautique.variable} ${beautiqueCondensed.variable}`}>
      <body className="font-gontserrat bg-page text-ink antialiased min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}