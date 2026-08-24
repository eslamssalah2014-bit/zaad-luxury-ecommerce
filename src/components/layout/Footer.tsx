import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Sparkles, Truck, Lock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zaad-950 text-ivory-200 pt-16 pb-12 border-t-2 border-gold-600/40 relative overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Quality Badges Tier */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zaad-800 text-center sm:text-right">
          
          <div className="flex items-center gap-3.5 bg-zaad-900/60 p-4 rounded-lg border border-gold-500/20">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ivory-100">نقاء دوعني موثق 100%</h4>
              <p className="text-[11px] text-ivory-400 mt-0.5">فحص مخبري أوروبي لكل تشغيلة</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zaad-900/60 p-4 rounded-lg border border-gold-500/20">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ivory-100">إنزيمات حية كاملة</h4>
              <p className="text-[11px] text-ivory-400 mt-0.5">بدون أي بسترة أو تسخين حراري</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zaad-900/60 p-4 rounded-lg border border-gold-500/20">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ivory-100">شحن مبرد فاخر</h4>
              <p className="text-[11px] text-ivory-400 mt-0.5">سيارات مكيفة للحفاظ على الخواص</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-zaad-900/60 p-4 rounded-lg border border-gold-500/20">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ivory-100">مطابقة مالية فورية</h4>
              <p className="text-[11px] text-ivory-400 mt-0.5">تحقق آمن وفوري لإيصالات التحويل</p>
            </div>
          </div>

        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-zaad-800/80">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400/50 bg-white p-0.5">
                <Image
                  src="/images/zaad-logo.png"
                  alt="زاد | دار النقاء"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-ivory-50">
                  Z<span className="text-gold-400 font-normal">AA</span>D
                </span>
                <p className="text-[10px] text-gold-400 tracking-wider">زَاد | دَارُ النَّقَاءِ الطَّبِيعِي</p>
              </div>
            </div>
            <p className="text-xs text-ivory-300/80 leading-relaxed max-w-md">
              زاد ليست مجرد متجر للمنتجات الطبيعية؛ زاد هي عهد أصيل بحفظ التراث الطبيعي للأعسال النادرة، وتوثيق أعلى مستويات النقاء المخبري بعيداً عن المعالجات التجارية، لتصلكم خيرات الأرض كما أرادتها الطبيعة.
            </p>
            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-xs text-gold-400 hover:text-gold-300 font-medium group"
              >
                <span>اكتشف ميثاق النقاء وقصة الحصاد الطبيعي</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-sm font-bold text-gold-300 mb-4 border-r-2 border-gold-500 pr-2">المحصول الملكي</h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">عسل سدر دوعني ملكي</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">عسل سمر بري جبلي</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">عسل المروج البيضاء</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">صناديق الإهداء الملكي</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">غذاء الملكات والعكبر النقي</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-sm font-bold text-gold-300 mb-4 border-r-2 border-gold-500 pr-2">خدمات النخبة</h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li><Link href="/story" className="hover:text-gold-300 transition-colors">ميثاق النقاء والأصالة</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">المحصول الملكي الحصري</Link></li>
              <li><Link href="/checkout" className="hover:text-gold-300 transition-colors">طرق التحويل والاعتماد</Link></li>
              <li><Link href="/story" className="hover:text-gold-300 transition-colors">الشحن المبرد الفاخر</Link></li>
              <li><Link href="/story" className="hover:text-gold-300 transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Quality Assurance & Purity Standards */}
          <div>
            <h4 className="text-sm font-bold text-gold-300 mb-4 border-r-2 border-gold-500 pr-2">الضمان والأصالة</h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/story" className="text-gold-400 hover:text-gold-200 font-semibold flex items-center gap-1.5 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ميثاق الجودة والنقاء الطبيعي</span>
                </Link>
              </li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">كتالوج المحاصيل النادرة</Link></li>
              <li><Link href="/checkout" className="hover:text-gold-300 transition-colors">الشحن المبرد وضمان الوصول</Link></li>
              <li><Link href="/checkout" className="hover:text-gold-300 transition-colors">خيارات الدفع والتحويل البنكي</Link></li>
              <li><Link href="/shop" className="hover:text-gold-300 transition-colors">باقات الهدايا الفاخرة</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Security */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-400 gap-4">
          <div className="flex items-center gap-2">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} لدار زاد للنقاء (ZAAD Luxury)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-ivory-400">
            <span>مدفوعات آمنة: تحويل بنكي فوري • إنستاباي • مدى • فودافون كاش</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
