import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const gontserrat = localFont({
  src: [
    { path: '../public/fonts/gontserrat/Gontserrat-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../public/fonts/gontserrat/Gontserrat-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Black.ttf', weight: '900', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/gontserrat/Gontserrat-Thin.ttf', weight: '100', style: 'normal' },
  ],
  variable: '--font-gontserrat',
  display: 'swap',
})

const beautique = localFont({
  src: [
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Italic.otf', weight: '400', style: 'italic' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplay-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-beautique',
  display: 'swap',
})

const beautiqueCondensed = localFont({
  src: [
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/beautique-display/BeautiqueDisplayCondensed-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-beautique-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Melukis Sambelia — KKN-PPM UGM',
  description: 'Pemberdayaan pariwisata berkelanjutan dan pengembangan kawasan agropolitan di Kecamatan Sambelia, Kabupaten Lombok Timur, NTB.',
  metadataBase: new URL('https://melukis-sambelia.vercel.app'),
}

export const viewport: Viewport = {
  themeColor: '#0873B9',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${gontserrat.variable} ${beautique.variable} ${beautiqueCondensed.variable}`}>
      <body className="font-gontserrat bg-[#FFFCF7] text-ink antialiased">
        {children}
      </body>
    </html>
  )
}