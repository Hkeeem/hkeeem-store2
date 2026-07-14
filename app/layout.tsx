import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hakeem.store'),
  title: {
    default: 'متجر حكيم | عطور ومحافظ فاخرة - جدة',
    template: '%s | متجر حكيم',
  },
  description:
    'عطر حكيم الملكي 100مل ومحافظ جلد أصلية - توصيل سريع لكل السعودية والدفع عند الاستلام. تواصل: info@hakeem.store',
  keywords: ['متجر حكيم', 'عطر حكيم', 'عطور جدة', 'hakeem.store'],
  authors: [{ name: 'متجر حكيم' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://hakeem.store',
    siteName: 'متجر حكيم',
    title: 'متجر حكيم - عطور فاخرة',
    description: 'عطر حكيم الملكي مع محفظة فاخرة - عرض خاص 399 ر.س',
    images: ['/icons/icon-512.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجر حكيم',
    description: 'عطور ومحافظ فاخرة',
    images: ['/icons/icon-512.png'],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#6D28D9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
