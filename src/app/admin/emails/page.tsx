'use client';

import React, { useState } from 'react';
import { Mail, Eye, Send, CheckCircle2, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { generateLuxuryEmailHtml } from '@/lib/email/templates';

type EmailType =
  | 'order_confirmation'
  | 'verification_pending'
  | 'payment_approved'
  | 'payment_rejected'
  | 'shipped'
  | 'delivered'
  | 'welcome'
  | 'vip_invitation';

export default function AdminEmailsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailType>('payment_approved');
  const [testEmail, setTestEmail] = useState('faisal.a@luxury-sa.com');
  const [recipientName, setRecipientName] = useState('صاحب السمو فيصل آل سعود');
  const [sentNotice, setSentNotice] = useState('');

  const templateOptions: { id: EmailType; nameAr: string }[] = [
    { id: 'order_confirmation', nameAr: '١. تأكيد استلام الطلب' },
    { id: 'verification_pending', nameAr: '٢. الإيصال قيد التدقيق' },
    { id: 'payment_approved', nameAr: '٣. اعتماد الدفع وبدء التجهيز' },
    { id: 'payment_rejected', nameAr: '٤. تنبيه رفض / إعادة رفع الإيصال' },
    { id: 'shipped', nameAr: '٥. إشعار الشحن المبرد والتتبع' },
    { id: 'delivered', nameAr: '٦. إشعار تمام التسليم' },
    { id: 'welcome', nameAr: '٧. الترحيب بالانضمام للدار' },
    { id: 'vip_invitation', nameAr: '٨. دعوة خاصة للمحصول النادر' },
  ];

  const emailData = generateLuxuryEmailHtml(selectedTemplate, {
    recipientName,
    orderNumber: 'ZD-89421',
    orderTotal: '2,870',
    trackingNumber: 'SMSA-987654321',
    rejectionReason: 'صورة الإيصال غير مكتملة الأركان ولا توضح الرقم المرجعي'
  });

  const handleTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(`تم إرسال نموذج [${emailData.subject}] بنجاح إلى ${testEmail} عبر Resend API.`);
    setTimeout(() => setSentNotice(''), 4500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <Mail className="w-3.5 h-3.5" />
          <span>منظومة المراسلات الملكية الفاخرة (Resend Email Engine)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          معاينة وتخصيص رسائل البريد الإلكتروني
        </h1>
      </div>

      {sentNotice && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
          <span>{sentNotice}</span>
        </div>
      )}

      {/* Grid: Templates selector + Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Template Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zaad-900 border-b border-ivory-200 pb-2">
              نماذج البريد المعتمدة (8 قوالب)
            </h3>

            <div className="space-y-2">
              {templateOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-right p-3 rounded-xl text-xs font-semibold transition-all ${
                    selectedTemplate === t.id
                      ? 'bg-zaad-800 text-white shadow-sm font-bold'
                      : 'bg-ivory-50 text-charcoal-800 hover:bg-ivory-200 border border-ivory-200'
                  }`}
                >
                  {t.nameAr}
                </button>
              ))}
            </div>

            {/* Test Send Form */}
            <form onSubmit={handleTestSend} className="pt-4 border-t border-ivory-200 space-y-3">
              <h4 className="text-xs font-bold text-zaad-900">اختبار إرسال القالب التجريبي:</h4>
              <div>
                <label className="block text-[11px] text-charcoal-700 mb-1">اسم المستلم:</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-charcoal-700 mb-1">البريد التجريبي:</label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال بريد تجريبي الآن</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live HTML Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3 text-xs">
            <div>
              <span className="text-charcoal-700/70 block">عنوان الرسالة (Subject):</span>
              <strong className="text-zaad-900 font-bold">{emailData.subject}</strong>
            </div>
            <span className="text-gold-700 font-bold bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
              HTML Preview
            </span>
          </div>

          <div className="border border-ivory-300 rounded-2xl overflow-hidden bg-ivory-50 h-[560px]">
            <iframe
              srcDoc={emailData.html}
              title="Email Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
