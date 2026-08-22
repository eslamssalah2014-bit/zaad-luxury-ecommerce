'use client';

import React, { useState } from 'react';
import { Sparkles, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VipNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 bg-zaad-950 text-ivory-100 relative overflow-hidden border-t border-gold-500/20">
      
      {/* Decorative Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 bg-zaad-900 border border-gold-500/30 px-4 py-1 rounded-full text-gold-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>الدائرة الخاصة لنخبة مقتني زاد (VIP Private Circle)</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50 mb-4">
          دعوة للانضمام إلى نادي النقاء الملكي
        </h2>

        <p className="text-xs sm:text-sm text-ivory-300 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          سجل بريدك لتصلك أولوية الحجز في مواسم القطاف النادرة قبل طرحها العام، والاطلاع على تقارير المختبرات وإصدارات المحصول المحدود.
        </p>

        {isSubmitted ? (
          <div className="bg-zaad-900/90 border border-gold-500/50 p-6 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 text-gold-300 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-gold-400 shrink-0" />
            <div className="text-right">
              <h4 className="text-sm font-bold text-ivory-100">أهلاً بكم في دار زاد</h4>
              <p className="text-xs text-ivory-300 mt-0.5">تم تسجيل بريدكم في قائمة الحجز الملكي الخاص.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="أدخل بريدك الإلكتروني المعتمد..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-zaad-900/90 border border-zaad-700 rounded-full px-5 py-3 text-ivory-100 placeholder:text-ivory-400/60 focus:border-gold-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gold-400 absolute left-4 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-all shadow-md hover:shadow-gold-glow shrink-0 gold-shimmer-btn"
              >
                طلب الانضمام
              </button>
            </div>
            <p className="text-[11px] text-ivory-400/70 flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
              <span>خصوصيتكم مصونة بالكامل وفق أرقى معايير الأمان</span>
            </p>
          </form>
        )}

      </div>
    </section>
  );
}
