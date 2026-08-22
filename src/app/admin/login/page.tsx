'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error || !data.user) {
        setErrorMessage(error?.message === 'Invalid login credentials' ? 'بيانات الاعتماد غير صحيحة أو الحساب غير موجود.' : (error?.message || 'فشل تسجيل الدخول'));
        setLoading(false);
        return;
      }

      // Check admin privileges strictly
      const appRole = data.user.app_metadata?.role;
      const userRole = data.user.user_metadata?.role;
      const isAdmin = appRole === 'admin' || userRole === 'admin';

      if (!isAdmin) {
        // Sign out immediately if not admin
        await supabase.auth.signOut();
        setErrorMessage('غير مصرح لهذا الحساب بالوصول إلى لوحة التحكم التنفيذية (Admin Role Required).');
        setLoading(false);
        return;
      }

      setSuccessMessage('تم التحقق من الهوية المشفرة بنجاح. جاري نقلك إلى لوحة العمليات...');
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء محاولة تسجيل الدخول');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zaad-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-ivory-100 font-arabic relative overflow-hidden">
      
      {/* Decorative Gold Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 z-10">
        <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-gold-400 bg-white p-1 shadow-2xl">
          <Image src="/images/zaad-logo.png" alt="ZAAD" fill className="object-contain" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/80 border border-gold-500/30 text-gold-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>منظومة الحماية والعمليات المركزية (Fort Knox RBAC)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 tracking-wider">
          بوابة الإدارة التنفيذية
        </h2>
        <p className="text-xs text-ivory-300/70 max-w-xs mx-auto">
          الوصول مقصور فقط على مديري المنظومة ومسؤولي التدقيق المالي المعتمدين
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="bg-zaad-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-zaad-800 space-y-6">
          
          {errorMessage && (
            <div className="bg-red-950/70 border border-red-500/50 p-4 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-950/70 border border-green-500/50 p-4 rounded-2xl text-xs text-green-200 flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ivory-300 mb-1.5">
                البريد الإلكتروني المعتمد للمشرف
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zaad.sa"
                  className="w-full bg-zaad-950/80 border border-zaad-700 text-ivory-100 rounded-xl px-4 py-3 pl-10 text-xs focus:border-gold-400 focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-gold-400/60 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory-300 mb-1.5">
                كلمة المرور المشفرة
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full bg-zaad-950/80 border border-zaad-700 text-ivory-100 rounded-xl px-4 py-3 pl-10 text-xs focus:border-gold-400 focus:outline-none transition-colors"
                />
                <KeyRound className="w-4 h-4 text-gold-400/60 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zaad-950 font-bold py-3.5 px-4 rounded-xl text-xs shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-zaad-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري التحقق الأمني...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>دخول لوحة التحكم والعمليات</span>
                </span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zaad-800/80 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-[11px] text-ivory-400 hover:text-gold-400 flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>الرجوع إلى واجهة المتجر الرئيسية</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
