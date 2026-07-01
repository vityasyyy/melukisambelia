import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/config'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/ScrollProgress'
import { BackToTop } from '@/components/BackToTop'

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
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — Portal Kecamatan Sambelia`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'id_ID',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Portal Kecamatan Sambelia`,
    description: SITE_DESCRIPTION,
    images: ['/og.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/design-system/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/design-system/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/images/design-system/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Sambelia',
  },
}

export const viewport: Viewport = {
  themeColor: '#0873B9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${gontserrat.variable} ${beautique.variable} ${beautiqueCondensed.variable}`}>
      <body className="font-gontserrat bg-page text-ink antialiased min-h-screen flex flex-col">
        <div aria-hidden className="fixed top-0 inset-x-0 z-[1001] h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-80" />
        <a
          href="#main"
          className="skip-link sr-only rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brown-900 shadow-lg focus:not-sr-only focus:z-50"
        >
          Lewati ke konten
        </a>
        <ScrollProgress />
        <Nav />
        <main id="main" className="flex-1 pt-[63px]">{children}</main>
        <Footer />
        <BackToTop />
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              publisher: {
                '@type': 'GovernmentOrganization',
                name: 'Kecamatan Sambelia',
                url: SITE_URL,
              },
            }),
          }}
        />
      </body>
    </html>
  )
}