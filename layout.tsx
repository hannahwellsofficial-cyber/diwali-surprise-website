import type { Metadata, Viewport } from 'next'
import { Caveat, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'A Little Diwali Surprise for Miss Verma',
  description: 'A little light, made for you. A personal Diwali surprise for Miss Verma, with a diya, a letter and a few warm wishes.',
  openGraph: {
    title: 'A Little Diwali Surprise',
    description: 'For Miss Verma, with a little extra sparkle this Diwali.',
    images: ['/images/diwali-hero.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#fdf5e8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
