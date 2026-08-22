'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  FolderTree,
  Package,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Users,
  FileEdit,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  LogOut,
  Lock,
  Boxes
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [authChecking, setAuthChecking] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string>('');
  const [pendingVerificationCount, setPendingVerificationCount] = useState<number>(0);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    let isMounted = true;

    async function checkAdminAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !session.user) {
          if (isMounted) {
            setIsAdminAuthenticated(false);
            setAuthChecking(false);
            router.push('/admin/login');
          }
          return;
        }

        const appRole = session.user.app_metadata?.role;
        const userRole = session.user.user_metadata?.role;
        const isAdmin = appRole === 'admin' || userRole === 'admin';

        if (!isAdmin) {
          if (isMounted) {
            setIsAdminAuthenticated(false);
            setAuthChecking(false);
            await supabase.auth.signOut();
            router.push('/admin/login');
          }
          return;
        }

        if (isMounted) {
          setAdminUserEmail(session.user.email || 'admin@zaad.sa');
          setIsAdminAuthenticated(true);
          setAuthChecking(false);
        }
      } catch (err) {
        console.error('Error verifying admin authorization:', err);
        if (isMounted) {
          setIsAdminAuthenticated(false);
          setAuthChecking(false);
          router.push('/admin/login');
        }
      }
    }

    checkAdminAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAdminAuthenticated(false);
        if (!isLoginPage) {
          router.push('/admin/login');
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, isLoginPage, router]);

  // Load pending verification count for badge
  useEffect(() => {
    if (!isAdminAuthenticated || isLoginPage) return;

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
  }, [pathname, isAdminAuthenticated, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-zaad-950 flex flex-col items-center justify-center text-ivory-100 font-arabic space-y-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 bg-white p-1 shadow-2xl animate-pulse">
          <Image src="/images/zaad-logo.png" alt="ZAAD" fill className="object-contain" />
        </div>
        <div className="flex items-center gap-2 text-gold-400 text-xs font-bold">
          <Lock className="w-4 h-4" />
          <span>جاري التحقق من الصلاحيات الأمنية التنفيذية...</span>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  const navGroups = [
    {
      groupTitle: 'الرئيسية والمؤشرات المالية',
      items: [
        { name: 'لوحة المؤشرات العامة', href: '/admin', icon: LayoutDashboard },
        { name: 'تحليلات وهوامش الأرباح', href: '/admin/profit', icon: TrendingUp },
      ]
    },
    {
      groupTitle: 'إدارة الكتالوج والمنتجات',
      items: [
        { name: 'التصنيفات والفئات الفرعية', href: '/admin/categories', icon: FolderTree },
        { name: 'المنتجات والمحاصيل الملكية', href: '/admin/products', icon: Package },
      ]
    },
    {
      groupTitle: 'المستودعات والعمليات',
      items: [
        { name: 'حركة المخزون والتنبيهات', href: '/admin/inventory', icon: Layers },
        {
          name: 'طابور اعتماد الإيصالات',
          href: '/admin/orders/verification',
          icon: ShieldCheck,
          badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined
        },
        { name: 'إدارة الطلبات والشحن', href: '/admin/orders', icon: ShoppingBag },
      ]
    },
    {
      groupTitle: 'العملاء وإدارة المحتوى',
      items: [
        { name: 'سجل العملاء والنخبة (CRM)', href: '/admin/customers', icon: Users },
        { name: 'محرر المحتوى (CMS)', href: '/admin/cms', icon: FileEdit },
        { name: 'نظام رسائل Resend', href: '/admin/emails', icon: Mail },
        { name: 'سجل التدقيق الأمني', href: '/admin/audit-logs', icon: ShieldAlert },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row text-charcoal-900 font-arabic">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-72 bg-zaad-950 text-ivory-200 border-l border-zaad-800 flex flex-col shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-zaad-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-400 bg-white p-0.5 shadow-md">
              <Image src="/images/zaad-logo.png" alt="ZAAD" fill className="object-contain" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-ivory-50 tracking-widest block">
                Z<span className="text-gold-400 font-normal">AA</span>D
              </span>
              <span className="text-[10px] text-gold-400 font-mono block">BUSINESS OPERATIONS</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links Grouped */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-gold-400/80 tracking-wider uppercase">
                {group.groupTitle}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-zaad-800 text-xs text-ivory-400 space-y-2.5">
          <div className="bg-zaad-900 p-2.5 rounded-xl border border-zaad-800 flex items-center justify-between">
            <div className="truncate">
              <span className="text-[10px] text-gold-400 font-mono block">LOGGED IN ADMIN</span>
              <span className="text-[11px] text-ivory-200 font-semibold truncate block">{adminUserEmail}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1 bg-zaad-900 hover:bg-zaad-800 text-ivory-200 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>المتجر</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1 bg-red-950/60 hover:bg-red-900 text-red-200 py-2 rounded-lg text-xs font-medium border border-red-800/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
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
