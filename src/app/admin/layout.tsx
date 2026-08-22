'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ShieldCheck,
  Package,
  Layers,
  Users,
  FileEdit,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingVerificationCount, setPendingVerificationCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadPending() {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const count = json.data.filter((o: any) => o.paymentStatus === 'proof_submitted').length;
          setPendingVerificationCount(count);
        }
      } catch (e) {
        console.error('Error loading pending count in admin layout:', e);
      }
    }
    loadPending();
    return () => { isMounted = false; };
  }, [pathname]);

  const adminNav = [
    { name: 'لوحة المؤشرات التنفيذية', href: '/admin', icon: LayoutDashboard },
    {
      name: 'طابور اعتماد الإيصالات',
      href: '/admin/orders/verification',
      icon: ShieldCheck,
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined
    },
    { name: 'إدارة الطلبات والشحن', href: '/admin/orders', icon: ShoppingBag },
    { name: 'المحاصيل وتشغيلات المختبر', href: '/admin/products', icon: Package },
    { name: 'حركة المخزون والتنبيهات', href: '/admin/inventory', icon: Layers },
    { name: 'سجل العملاء والنخبة (CRM)', href: '/admin/customers', icon: Users },
    { name: 'محرر المحتوى (CMS)', href: '/admin/cms', icon: FileEdit },
    { name: 'نظام رسائل Resend', href: '/admin/emails', icon: Mail },
    { name: 'سجل التدقيق الأمني', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row text-charcoal-900 font-arabic">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-72 bg-zaad-950 text-ivory-200 border-l border-zaad-800 flex flex-col shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zaad-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-400 bg-white p-0.5">
              <Image src="/images/zaad-logo.png" alt="ZAAD" fill className="object-contain" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-ivory-50 tracking-widest block">
                Z<span className="text-gold-400 font-normal">AA</span>D
              </span>
              <span className="text-[10px] text-gold-400 font-mono block">OPERATIONS CENTER</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-gold-400/80 tracking-wider uppercase">
            إدارة العمليات المركزية
          </div>

          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gold-500 text-zaad-950 font-bold shadow-md'
                    : 'text-ivory-300 hover:bg-zaad-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zaad-950' : 'text-gold-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse ${
                    isActive ? 'bg-zaad-950 text-gold-400' : 'bg-red-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zaad-800 text-xs text-ivory-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gold-400 font-semibold">المشرف: إدارة المطابقة</span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full bg-zaad-900 hover:bg-zaad-800 text-ivory-200 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للمتجر الرئيسي</span>
          </Link>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>

    </div>
  );
}
