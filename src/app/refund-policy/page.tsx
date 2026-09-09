import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Calendar,
  ChevronLeft,
  FileText,
  Home,
  CheckCircle2
} from 'lucide-react';
import { getPolicyBySlug, getAllPolicies } from '@/lib/services/policyService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dynamic Next.js SEO Metadata Generator for Refund Policy
 */
export async function generateMetadata(): Promise<Metadata> {
  const policy = await getPolicyBySlug('refund-policy', false);

  const metaTitle = policy?.meta_title || 'الضمان الذهبي وسياسة الاسترجاع والاستبدال | زاد (ZAAD)';
  const metaDesc = policy?.meta_description || 'تفاصيل الضمان الذهبي الملكي وسياسة الاسترجاع والاستبدال المعتمدة لدى دار زاد لضمان أعلى درجات الرضا والأمان.';

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: 'https://www.zaadstore.com/refund-policy'
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: 'https://www.zaadstore.com/refund-policy',
      siteName: 'زاد (ZAAD)',
      locale: 'ar_SA',
      type: 'article',
      images: [
        {
          url: '/images/zaad-logo.png',
          width: 800,
          height: 800,
          alt: 'سياسة الاسترجاع - دار زاد'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: ['/images/zaad-logo.png']
    }
  };
}

/**
 * Format Arabic Date Helper
 */
function formatArabicDate(dateStr?: string) {
  if (!dateStr) return 'محدث مؤخراً';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  } catch {
    return dateStr.slice(0, 10);
  }
}

/**
 * Render Markdown content cleanly with luxury typography
 */
function renderPolicyContent(content: string) {
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-charcoal-800 leading-relaxed font-light text-sm sm:text-base">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <div key={idx} className="pt-6 pb-2 border-b border-gold-500/20 first:pt-0">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-zaad-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />
                <span>{trimmed.replace('## ', '')}</span>
              </h2>
            </div>
          );
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-serif text-lg font-bold text-zaad-900 pt-3 text-gold-700">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Blockquote / Alert
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="bg-gold-500/10 border-r-4 border-gold-500 p-4 rounded-xl text-zaad-950 font-medium text-xs sm:text-sm my-4"
            >
              {trimmed.replace(/^>\s*/, '')}
            </blockquote>
          );
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-2.5 my-3 pr-2">
              {items.map((item, i) => {
                const text = item.replace(/^[-*]\s*/, '');
                const parts = text.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-600 mt-2 shrink-0" />
                    <span className="leading-relaxed">
                      {parts.map((p, pIdx) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return (
                            <strong key={pIdx} className="font-bold text-zaad-950">
                              {p.slice(2, -2)}
                            </strong>
                          );
                        }
                        return p;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Divider
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-gold-500/20 my-6" />;
        }

        // Standard Paragraph with bold support
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="leading-relaxed">
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-zaad-950">
                    {p.slice(2, -2)}
                  </strong>
                );
              }
              return p;
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Direct /refund-policy Page
 */
export default async function DirectRefundPolicyPage() {
  const policy = await getPolicyBySlug('refund-policy', false);

  if (!policy) {
    notFound();
  }

  // Fetch all published policies to populate navigation sidebar
  const allPolicies = await getAllPolicies(false);

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-charcoal-900 font-arabic pt-8 pb-20 selection:bg-gold-500/30 selection:text-zaad-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Navigation */}
        <nav aria-label="مسار التنقل" className="mb-8 animate-fade-in">
          <ol className="flex items-center gap-2 text-xs text-charcoal-700/80">
            <li className="flex items-center gap-1.5 hover:text-gold-600 transition-colors">
              <Home className="w-3.5 h-3.5 text-gold-500" />
              <Link href="/">الرئيسية</Link>
            </li>
            <li>/</li>
            <li className="text-charcoal-500">السياسات واللوائح</li>
            <li>/</li>
            <li className="text-zaad-950 font-bold truncate max-w-xs sm:max-w-md">
              {policy.title}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="bg-gradient-to-br from-zaad-950 via-zaad-900 to-[#0c2417] text-ivory-100 rounded-3xl p-8 sm:p-12 shadow-2xl border border-gold-500/30 relative overflow-hidden mb-10 animate-fade-in">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/80 border border-gold-500/40 text-gold-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>ميثاق رسمي معتمد لدى دار زاد للنقاء الطبيعي</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory-50 leading-tight">
              {policy.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-ivory-300/80 font-light">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold-400/80" />
                <span>آخر تحديث: {formatArabicDate(policy.updated_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>سارية ومعتمدة لجميع الطلبات</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (Without any "Need help?" contact section) */}
          <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-sm space-y-6">
            <div className="prose prose-sm sm:prose-base max-w-none">
              {renderPolicyContent(policy.content)}
            </div>
          </main>

          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* All Policies Menu */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8E2D8] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
                <FileText className="w-4 h-4 text-gold-600" />
                <h3 className="font-serif font-bold text-sm text-zaad-950">
                  لوائح وسياسات دار زاد
                </h3>
              </div>

              <nav className="space-y-1.5">
                {allPolicies.map((item) => {
                  const isActive = item.slug === 'refund-policy';
                  const linkHref = item.slug === 'refund-policy' ? '/refund-policy' : `/policies/${item.slug}`;
                  return (
                    <Link
                      key={item.id}
                      href={linkHref}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-zaad-950 to-zaad-900 text-gold-400 font-bold shadow-sm'
                          : 'text-charcoal-700 hover:bg-ivory-50 hover:text-zaad-950'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <ChevronLeft className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gold-400' : 'text-charcoal-400'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Back to Store */}
            <div className="bg-gradient-to-br from-zaad-950 to-[#0e2a1b] text-ivory-100 rounded-3xl p-6 border border-gold-500/30 shadow-md space-y-3 text-center">
              <p className="text-xs text-gold-400 font-light">
                تصفح أرقى المحاصيل والأعسال الطبيعية النادرة
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zaad-950 text-xs font-bold shadow-lg transition-all"
              >
                <span>زيارة المتجر الملكي</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
