import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
    short_name: 'زاد (ZAAD)',
    description: 'دار أصيلة لتوثيق النقاء الملكي وأندر أعسال السدر والسمر الطبيعية الموثقة مخبرياً.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07160c',
    theme_color: '#07160c',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
