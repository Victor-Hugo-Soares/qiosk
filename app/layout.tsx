import type { Metadata } from 'next'
import { Figtree, Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'QIOSK',
  description: 'Sistema de autoatendimento para hamburguerias',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'QIOSK' },
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-180.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#FFF0E6" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.getRegistrations().then(r=>r.forEach(s=>s.unregister()));navigator.serviceWorker.register('/sw-v2.js')})}` }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
