import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'عروضكم - متجر حكيم',
    short_name: 'عروضكم',
    description: 'متجر حكيم - مؤسسة محسن لخدمات الأعمال',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFCF6',
    theme_color: '#7A5A16',
    categories: ['shopping'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      },
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
