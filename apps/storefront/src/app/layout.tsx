import type { Metadata } from 'next'
import { Bebas_Neue, Barlow } from 'next/font/google'
import Script from 'next/script'
import { CartProvider } from '@/providers/cart-provider'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pp-machina',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-pp-montreal',
  display: 'swap',
})
import { AuthProvider } from '@/providers/auth-provider'
import { ToastProvider } from '@/providers/toast-provider'
import './globals.css'

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
const MIDTRANS_SNAP_URL = process.env.NODE_ENV === 'production'
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://draven.store'

export const metadata: Metadata = {
  title: {
    default: 'DRAVEN — Official Store',
    template: '%s | DRAVEN',
  },
  description:
    'Belanja online terpercaya di Indonesia. Produk berkualitas, harga terjangkau, pengiriman cepat ke seluruh Indonesia.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'DRAVEN Store',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'DRAVEN Store' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${barlow.variable}`}>
      <body className="font-sans bg-ink-950 text-ink-100 antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </AuthProvider>
        {MIDTRANS_CLIENT_KEY && (
          <Script
            src={MIDTRANS_SNAP_URL}
            data-client-key={MIDTRANS_CLIENT_KEY}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
