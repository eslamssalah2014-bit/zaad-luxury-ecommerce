import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Alexandria, Amiri } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

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
  title: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
  description: 'زاد (ZAAD) ليست مجرد متجر لبيع العسل، بل دار أصيلة لتوثيق النقاء الملكي، وأندر أعسال السدر الدوعني والسمر الجبلي الموثقة مخبرياً بأعلى معايير الفخامة الهادئة.',
  keywords: ['عسل سدر دوعني', 'عسل فاخر', 'زاد', 'عسل طبيعي نقي', 'عسل سمر جبلي', 'فخامة هادئة', 'أعسال نادرة'],
  openGraph: {
    title: 'زاد | دار النقاء الملكي والمنتجات الطبيعية الفاخرة',
    description: 'إرث من النقاء الطبيعي، مستخلص من أودية دوعن وجبال عسير العذراء وفق أرقى معايير الجودة العالمية.',
    type: 'website',
    locale: 'ar_SA',
    images: ['/images/zaad-logo.png'],
  },
  icons: {
    icon: '/images/zaad-logo.png',
    apple: '/images/zaad-logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${alexandria.variable} ${amiri.variable}`}>
      <body className="bg-ivory-100 text-charcoal-900 selection:bg-gold-500 selection:text-white font-arabic antialiased flex flex-col min-h-screen">
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
