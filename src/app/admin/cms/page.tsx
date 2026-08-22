'use client';

import React, { useState, useEffect } from 'react';
import { FileEdit, CheckCircle2, Sparkles, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CmsSection } from '@/types';

export default function AdminCmsPage() {
  const [cmsSections, setCmsSections] = useState<CmsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('hero_banner');
  const [successMsg, setSuccessMsg] = useState('');

  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [ctaText, setCtaText] = useState('');

  const loadCms = React.useCallback(async () => {
    try {
      const { data, error } = await supabase.from('cms_blocks').select('*');
      if (!error && data && data.length > 0) {
        const mapped: CmsSection[] = data.map((d: any) => ({
          id: String(d.id ?? ''),
          key: String(d.key ?? ''),
          titleAr: String(d.title_ar ?? ''),
          subtitleAr: String(d.subtitle_ar ?? ''),
          headlineAr: String(d.headline_ar ?? ''),
          bodyAr: String(d.body_ar ?? ''),
          ctaTextAr: d.cta_text_ar ? String(d.cta_text_ar) : undefined,
          ctaLink: d.cta_link ? String(d.cta_link) : undefined,
          imageUrl: d.image_url ? String(d.image_url) : undefined,
          isActive: Boolean(d.is_active),
          updatedAt: String(d.updated_at ?? new Date().toISOString())
        }));
        setCmsSections(mapped);
        const current = mapped.find(c => c.key === selectedKey) || mapped[0];
        if (current) {
          setSelectedKey(current.key);
          setHeadline(current.headlineAr);
          setBody(current.bodyAr);
          setCtaText(current.ctaTextAr || '');
        }
      }
      setLoading(false);
    } catch (e) {
      console.error('Error loading CMS blocks from Supabase:', e);
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    loadCms();
  }, [loadCms]);

  const handleSelectSection = (key: string) => {
    setSelectedKey(key);
    const sec = cmsSections.find(c => c.key === key);
    if (sec) {
      setHeadline(sec.headlineAr);
      setBody(sec.bodyAr);
      setCtaText(sec.ctaTextAr || '');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase
        .from('cms_blocks')
        .update({
          headline_ar: headline,
          body_ar: body,
          cta_text_ar: ctaText,
          updated_at: new Date().toISOString()
        })
        .eq('key', selectedKey);

      await loadCms();
      setSuccessMsg('تم حفظ وتحديث محتوى الواجهة بنجاح في Supabase.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating CMS in Supabase:', err);
    }
  };

  const activeSection = cmsSections.find(c => c.key === selectedKey) || cmsSections[0];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <FileEdit className="w-3.5 h-3.5" />
          <span>إدارة المحتوى الرقمي المباشر (Supabase CMS)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          محرر نصوص وهوية دار زاد
        </h1>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Section Tabs */}
      {loading ? (
        <div className="p-8 text-center text-zaad-900 font-serif">جاري تحميل أقسام المحتوى من Supabase...</div>
      ) : (
        <>
          <div className="flex items-center gap-3 border-b border-ivory-300 pb-3">
            {cmsSections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => handleSelectSection(sec.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedKey === sec.key
                    ? 'bg-zaad-800 text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-ivory-300 hover:bg-ivory-200'
                }`}
              >
                {sec.titleAr}
              </button>
            ))}
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 max-w-3xl">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zaad-900 mb-1">العنوان الرئيسي الفاخر (Headline):</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">النص الوصفي والبيان الأدبي (Body):</label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none leading-relaxed"
                />
              </div>

              {activeSection?.ctaTextAr !== undefined && (
                <div>
                  <label className="block font-bold text-zaad-900 mb-1">نص زر الإجراء (CTA Text):</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-zaad-800 hover:bg-zaad-700 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-gold-300" />
                  <span>حفظ وتحديث المتجر فورياً في Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
