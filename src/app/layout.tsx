import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Alexandria, Amiri } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { getCmsSettings } from '@/lib/services/cmsService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-alexandria',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zaadstore.com'),
  title: {
    default: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
    template: '%s | زاد (ZAAD)',
  },
  description: 'زاد (ZAAD) ليست مجرد متجر لبيع العسل، بل دار أصيلة لتوثيق النقاء الملكي، وأندر أعسال السدر الدوعني والسمر الجبلي الموثقة مخبرياً بأعلى معايير الفخامة الهادئة.',
  keywords: ['عسل سدر دوعني', 'عسل فاخر', 'زاد', 'عسل طبيعي نقي', 'عسل سمر جبلي', 'فخامة هادئة', 'أعسال نادرة'],
  authors: [{ name: 'دار زاد للنقاء الطبيعي' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
    description: 'إرث من النقاء الطبيعي، مستخلص من أودية دوعن وجبال عسير العذراء وفق أرقى معايير الجودة العالمية.',
    url: 'https://www.zaadstore.com',
    siteName: 'زاد (ZAAD)',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/images/zaad-logo.png',
        width: 800,
        height: 800,
        alt: 'شعار زاد الملكي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
    description: 'إرث من النقاء الطبيعي، مستخلص من أودية دوعن وجبال عسير العذراء وفق أرقى معايير الجودة العالمية.',
    images: ['/images/zaad-logo.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cmsSettings = await getCmsSettings(false);

  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${alexandria.variable} ${amiri.variable}`}>
      <body className="bg-ivory-100 text-charcoal-900 selection:bg-gold-500 selection:text-white font-arabic antialiased flex flex-col min-h-screen">
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <Header
                initialAnnouncement={cmsSettings.announcementBar}
                initialNavigation={cmsSettings.navigation}
              />
              <main className="flex-grow">
                {children}
              </main>
              <Footer initialFooter={cmsSettings.footer} />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
