'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FileEdit,
  Save,
  Send,
  Eye,
  RotateCcw,
  Sparkles,
  LayoutTemplate,
  BookOpen,
  Megaphone,
  Menu as MenuIcon,
  ImageIcon,
  Palette,
  Search as SearchIcon,
  Footprints,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Sliders,
  Check,
  Folder
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  CmsSettingsDocument,
  HomepageSection,
  StoryChapter,
  NavItem,
  CmsSectionType,
  MediaFolder
} from '@/types/cms';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import MediaLibraryModal from '@/components/admin/cms/MediaLibraryModal';
import LivePreviewModal from '@/components/admin/cms/LivePreviewModal';

type CmsTab =
  | 'home'
  | 'story'
  | 'announcement'
  | 'navigation'
  | 'media'
  | 'builder'
  | 'design'
  | 'seo'
  | 'footer';

const TABS: { id: CmsTab; labelAr: string; icon: any; descAr: string }[] = [
  { id: 'home', labelAr: 'الرئيسية (Hero & Trust)', icon: LayoutTemplate, descAr: 'إدارة الهيرو، البانر الرئيسي، ومؤشرات الثقة' },
  { id: 'builder', labelAr: 'منشئ الأقسام (Page Builder)', icon: Layers, descAr: 'بناء وإعادة ترتيب أقسام الصفحة الرئيسية' },
  { id: 'story', labelAr: 'القصة والتراث (Story)', icon: BookOpen, descAr: 'إدارة فصول ومحطات قصة دار زاد التراثية' },
  { id: 'announcement', labelAr: 'شريط الإعلانات (Top Bar)', icon: Megaphone, descAr: 'إدارة شريط الإعلانات العلوي والعروض' },
  { id: 'navigation', labelAr: 'القائمة العلوية (Navigation)', icon: MenuIcon, descAr: 'إدارة روابط القائمة الرئيسية والشعار' },
  { id: 'media', labelAr: 'مكتبة الوسائط (Media Library)', icon: ImageIcon, descAr: 'رفع وإدارة صور المتجر وملفات الوسائط' },
  { id: 'design', labelAr: 'الهوية والتصميم (Design)', icon: Palette, descAr: 'الألوان، الخطوط، ونمط الأزرار الحية' },
  { id: 'seo', labelAr: 'محركات البحث (SEO)', icon: SearchIcon, descAr: 'عناوين ووصف صفحات المتجر للظهور في Google' },
  { id: 'footer', labelAr: 'تذييل المتجر (Footer)', icon: Footprints, descAr: 'بيانات التواصل، الروابط، وأوسمة الجودة' },
];

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<CmsTab>('home');
  const [settings, setSettings] = useState<CmsSettingsDocument>(DEFAULT_CMS_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [mediaPickerFolder, setMediaPickerFolder] = useState<MediaFolder>('general');

  // Load CMS Data
  const loadCmsData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/cms/content?draft=true', { cache: 'no-store', headers });
      const json = await res.json();

      if (json.success && json.data) {
        setSettings(json.data);
      } else {
        setSettings(DEFAULT_CMS_SETTINGS);
      }
    } catch (e) {
      console.error('Error loading CMS data:', e);
      setSettings(DEFAULT_CMS_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCmsData();
  }, [loadCmsData]);

  // Open Media Picker Helper
  const openMediaPicker = (onSelect: (url: string) => void, folder: MediaFolder = 'general') => {
    setMediaPickerCallback(() => onSelect);
    setMediaPickerFolder(folder);
    setMediaPickerOpen(true);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      setErrorMsg('');
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'save_draft', settings })
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'فشل حفظ المسودة');

      setSuccessMsg('تم حفظ التعديلات كمسودة بنجاح.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ المسودة');
    } finally {
      setSavingDraft(false);
    }
  };

  // Publish Live
  const handlePublish = async () => {
    if (!confirm('هل أنت متأكد من نشر التعديلات؟ ستنعكس فوراً على المتجر الحي أمام جميع الزوار.')) return;
    try {
      setPublishing(true);
      setErrorMsg('');
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'publish', settings })
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'فشل نشر التعديلات');

      setSuccessMsg('تم نشر التعديلات بنجاح! المتجر المباشر يعكس التغييرات الآن.');
      setPreviewOpen(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء النشر');
    } finally {
      setPublishing(false);
    }
  };

  // Reset to Default
  const handleResetToDefault = async () => {
    if (!confirm('⚠️ تحذير: هل ترغب حقاً باستعادة إعدادات المتجر الافتراضية الفاخرة؟ سيتم استبدال التعديلات الحالية.')) return;
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'reset_default' })
      });

      const json = await res.json();
      if (json.success) {
        setSettings(DEFAULT_CMS_SETTINGS);
        setSuccessMsg('تمت استعادة الإعدادات الافتراضية بنجاح.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء استعادة الافتراضي');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
        <span className="font-serif text-sm font-bold text-zaad-900">جاري تحميل نظام إدارة محتوى دار زاد (CMS)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-arabic pb-16">
      
      {/* Top Header & Master Action Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-gold-700 font-bold bg-gold-50 px-3.5 py-1 rounded-full border border-gold-300 mb-2">
            <FileEdit className="w-3.5 h-3.5" />
            <span>نظام إدارة المحتوى الشامل (ZAAD Visual CMS)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            إدارة وتخصيص محتوى الموقع بدون كود
          </h1>
          <p className="text-xs text-charcoal-700/70 mt-1">
            عدّل النصوص، الصور، القوائم، ألوان الهوية، وتنسيقات الأقسام وتنعكس فوراً على المتجر الحي في Supabase.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 border border-ivory-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="استعادة الإعدادات الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2.5 bg-zaad-900 hover:bg-zaad-800 text-gold-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4 text-gold-400" />
            <span>معاينة حية (Live Preview)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="px-4 py-2.5 bg-white border border-gold-500/50 hover:bg-gold-50 text-zaad-900 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {savingDraft ? <Loader2 className="w-4 h-4 animate-spin text-gold-600" /> : <Save className="w-4 h-4 text-gold-600" />}
            <span>حفظ كمسودة</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-gold-glow disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin text-zaad-950" /> : <Send className="w-4 h-4 text-zaad-950" />}
            <span>نشر التعديلات الحية</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-ivory-300">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-zaad-900 text-gold-300 shadow-md ring-2 ring-gold-500/40'
                  : 'bg-white text-charcoal-700 border border-ivory-300 hover:bg-ivory-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-charcoal-700'}`} />
              <span>{tab.labelAr}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: HOMEPAGE & HERO MANAGER
      ========================================================================= */}
      {activeTab === 'home' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-8 animate-fade-in">
          <div>
            <h2 className="font-serif text-xl font-bold text-zaad-900">الواجهة الرئيسية وقسم الصدارة (Hero Section)</h2>
            <p className="text-xs text-charcoal-700/70">تخصيص العناوين، الشارات، الصورة الخلفية، وأزرار الدعوة للإجراء</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title & Highlight */}
            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">العنوان الرئيسي الأول (Headline):</label>
              <input
                type="text"
                value={settings.hero.headlineAr}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, headlineAr: e.target.value }
                })}
                className="w-full text-xs sm:text-sm bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">النص المميز الملون (Gold Highlight):</label>
              <input
                type="text"
                value={settings.hero.headlineHighlightAr}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, headlineHighlightAr: e.target.value }
                })}
                className="w-full text-xs sm:text-sm bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none text-gold-700 font-serif"
              />
            </div>

            {/* Badge Text */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">نص الشارة العلوية الفاخرة (Hero Badge):</label>
              <input
                type="text"
                value={settings.hero.badgeTextAr}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, badgeTextAr: e.target.value }
                })}
                className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">الوصف والبيان الأدبي (Description):</label>
              <textarea
                rows={3}
                value={settings.hero.descriptionAr}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, descriptionAr: e.target.value }
                })}
                className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Hero Image */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-zaad-900">صورة خلفية الهيرو (Hero Background Image):</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-ivory-50 p-4 rounded-2xl border border-ivory-300">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-gold-500/30 bg-zaad-950 shrink-0">
                  <Image
                    src={settings.hero.backgroundImageUrl || '/images/zaad-nature-honey-clover.jpg'}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1 w-full">
                  <input
                    type="text"
                    value={settings.hero.backgroundImageUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      hero: { ...settings.hero, backgroundImageUrl: e.target.value }
                    })}
                    className="w-full text-xs bg-white border border-ivory-300 rounded-lg p-2 font-mono text-charcoal-700"
                    placeholder="/images/..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, backgroundImageUrl: url }
                  }), 'homepage')}
                  className="px-4 py-2 bg-zaad-900 hover:bg-zaad-800 text-gold-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span>اختر من المكتبة / ارفع صورة</span>
                </button>
              </div>
            </div>

            {/* CTA 1 */}
            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">نص الزر الرئيسي (Primary CTA):</label>
              <input
                type="text"
                value={settings.hero.primaryCtaTextAr}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, primaryCtaTextAr: e.target.value }
                })}
                className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1.5">رابط الزر الرئيسي (Link URL):</label>
              <input
                type="text"
                value={settings.hero.primaryCtaLink}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, primaryCtaLink: e.target.value }
                })}
                className="w-full text-xs bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono text-left"
              />
            </div>

          </div>

          {/* Trust Pillars */}
          <div className="pt-6 border-t border-ivory-200 space-y-4">
            <h3 className="font-serif text-sm font-bold text-zaad-900">مؤشرات الثقة الأربعة (Trust Pillars):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.hero.trustPillars.map((pillar, idx) => (
                <div key={pillar.id} className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 space-y-2">
                  <span className="text-[10px] font-bold text-gold-700">المؤشر #{idx + 1}</span>
                  <input
                    type="text"
                    value={pillar.value}
                    onChange={(e) => {
                      const updated = [...settings.hero.trustPillars];
                      updated[idx].value = e.target.value;
                      setSettings({ ...settings, hero: { ...settings.hero, trustPillars: updated } });
                    }}
                    placeholder="القيمة مثل +40"
                    className="w-full text-xs font-bold bg-white border border-ivory-300 rounded-lg p-2 text-center"
                  />
                  <input
                    type="text"
                    value={pillar.labelAr}
                    onChange={(e) => {
                      const updated = [...settings.hero.trustPillars];
                      updated[idx].labelAr = e.target.value;
                      setSettings({ ...settings, hero: { ...settings.hero, trustPillars: updated } });
                    }}
                    placeholder="العنوان"
                    className="w-full text-xs bg-white border border-ivory-300 rounded-lg p-2 text-center"
                  />
                  <input
                    type="text"
                    value={pillar.sublabelAr || ''}
                    onChange={(e) => {
                      const updated = [...settings.hero.trustPillars];
                      updated[idx].sublabelAr = e.target.value;
                      setSettings({ ...settings, hero: { ...settings.hero, trustPillars: updated } });
                    }}
                    placeholder="الوصف الفرعي"
                    className="w-full text-[11px] bg-white border border-ivory-300 rounded-lg p-1.5 text-center text-charcoal-700/70"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: HOMEPAGE SECTION BUILDER
      ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-zaad-900">منشئ أقسام الصفحة الرئيسية (Section Builder)</h2>
              <p className="text-xs text-charcoal-700/70">أضف، عدل، أعد ترتيب أو أخفِ الأقسام الرئيسية بسهولة</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newSec: HomepageSection = {
                  id: `sec-${Date.now()}`,
                  type: 'image_text',
                  titleAr: 'قسم فاخر جديد',
                  subtitleAr: 'ميثاق الجودة',
                  headlineAr: 'عنوان القسم الجديد',
                  bodyAr: 'أدخل النص الوصفي هنا ليظهر في الصفحة الرئيسية.',
                  imageUrl: '/images/zaad-nature-honey-clover.jpg',
                  imagePosition: 'left',
                  backgroundColor: '#07160c',
                  textColor: '#fbf8f1',
                  isVisible: true,
                  order: settings.homepageSections.length + 1
                };
                setSettings({
                  ...settings,
                  homepageSections: [...settings.homepageSections, newSec]
                });
              }}
              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {settings.homepageSections.map((sec, idx) => (
              <div key={sec.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
                
                {/* Section Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ivory-200">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gold-100 text-gold-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-zaad-900">{sec.titleAr || 'قسم بدون عنوان'}</h3>
                      <span className="text-[10px] text-charcoal-700/60 font-mono">النوع: {sec.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...settings.homepageSections];
                        updated[idx].isVisible = !updated[idx].isVisible;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        sec.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sec.isVisible ? 'ظاهر للزوار' : 'مخفي'}
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...settings.homepageSections];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="p-2 bg-ivory-100 hover:bg-ivory-200 rounded-xl text-charcoal-700 disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === settings.homepageSections.length - 1}
                      onClick={() => {
                        if (idx === settings.homepageSections.length - 1) return;
                        const updated = [...settings.homepageSections];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="p-2 bg-ivory-100 hover:bg-ivory-200 rounded-xl text-charcoal-700 disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Section */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm(`هل أنت متأكد من حذف قسم "${sec.titleAr}"؟`)) return;
                        const updated = settings.homepageSections.filter((_, i) => i !== idx);
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl"
                      title="حذف القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">عنوان القسم (Title):</label>
                    <input
                      type="text"
                      value={sec.titleAr}
                      onChange={(e) => {
                        const updated = [...settings.homepageSections];
                        updated[idx].titleAr = e.target.value;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-serif"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">الشارة الفرعية (Badge / Subtitle):</label>
                    <input
                      type="text"
                      value={sec.subtitleAr || ''}
                      onChange={(e) => {
                        const updated = [...settings.homepageSections];
                        updated[idx].subtitleAr = e.target.value;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-zaad-900 mb-1">النص الوصفي (Body Paragraph):</label>
                    <textarea
                      rows={3}
                      value={sec.bodyAr || ''}
                      onChange={(e) => {
                        const updated = [...settings.homepageSections];
                        updated[idx].bodyAr = e.target.value;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">اقتباس أو عبارة مميزة (Quote):</label>
                    <input
                      type="text"
                      value={sec.quoteAr || ''}
                      onChange={(e) => {
                        const updated = [...settings.homepageSections];
                        updated[idx].quoteAr = e.target.value;
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
                    />
                  </div>

                  {/* Image Picker */}
                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">صورة القسم:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sec.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...settings.homepageSections];
                          updated[idx].imageUrl = e.target.value;
                          setSettings({ ...settings, homepageSections: updated });
                        }}
                        className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker((url) => {
                          const updated = [...settings.homepageSections];
                          updated[idx].imageUrl = url;
                          setSettings({ ...settings, homepageSections: updated });
                        }, 'homepage')}
                        className="px-3 py-2.5 bg-zaad-900 hover:bg-zaad-800 text-gold-300 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>اختر صورة</span>
                      </button>
                    </div>
                  </div>

                  {/* Color Controls */}
                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">لون الخلفية (Hex):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={sec.backgroundColor || '#07160c'}
                        onChange={(e) => {
                          const updated = [...settings.homepageSections];
                          updated[idx].backgroundColor = e.target.value;
                          setSettings({ ...settings, homepageSections: updated });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-ivory-300"
                      />
                      <input
                        type="text"
                        value={sec.backgroundColor || '#07160c'}
                        onChange={(e) => {
                          const updated = [...settings.homepageSections];
                          updated[idx].backgroundColor = e.target.value;
                          setSettings({ ...settings, homepageSections: updated });
                        }}
                        className="w-28 bg-ivory-50 border border-ivory-300 rounded-xl p-2 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">موضع الصورة:</label>
                    <select
                      value={sec.imagePosition || 'left'}
                      onChange={(e) => {
                        const updated = [...settings.homepageSections];
                        updated[idx].imagePosition = e.target.value as 'left' | 'right';
                        setSettings({ ...settings, homepageSections: updated });
                      }}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
                    >
                      <option value="left">يسار (في العرض العربي)</option>
                      <option value="right">يمين (في العرض العربي)</option>
                    </select>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: STORY & HERITAGE MANAGER
      ========================================================================= */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-zaad-900">إدارة صفحة القصة والتراث (Story & Heritage)</h2>
              <p className="text-xs text-charcoal-700/70">تخصيص فصول القصة التراثية، صور الأجداد، والجدول الزمني</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newCh: StoryChapter = {
                  id: `ch-${Date.now()}`,
                  periodTagAr: 'محطة جديدة',
                  titleAr: 'عنوان المحطة الجديدة',
                  descriptionParagraphs: ['أدخل تفاصيل هذه المحطة من قصة زاد هنا.'],
                  imageUrl: '/images/zaad-heritage-beekeepers.jpg',
                  imageCaptionAr: 'صورة توثيقية',
                  order: settings.storyPage.chapters.length + 1,
                  isVisible: true
                };
                setSettings({
                  ...settings,
                  storyPage: {
                    ...settings.storyPage,
                    chapters: [...settings.storyPage.chapters, newCh]
                  }
                });
              }}
              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فصل / محطة جديدة</span>
            </button>
          </div>

          {/* Main Story Header Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-ivory-50 rounded-2xl border border-ivory-300">
            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1">الشارة العلوية (Badge):</label>
              <input
                type="text"
                value={settings.storyPage.metaBadgeAr}
                onChange={(e) => setSettings({
                  ...settings,
                  storyPage: { ...settings.storyPage, metaBadgeAr: e.target.value }
                })}
                className="w-full text-xs bg-white border border-ivory-300 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zaad-900 mb-1">عنوان الصفحة الرئيسي:</label>
              <input
                type="text"
                value={settings.storyPage.mainTitleAr}
                onChange={(e) => setSettings({
                  ...settings,
                  storyPage: { ...settings.storyPage, mainTitleAr: e.target.value }
                })}
                className="w-full text-xs bg-white border border-ivory-300 rounded-xl p-2.5 font-serif"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zaad-900 mb-1">الوصف التمهيدي للقصة:</label>
              <textarea
                rows={2}
                value={settings.storyPage.mainSubtitleAr}
                onChange={(e) => setSettings({
                  ...settings,
                  storyPage: { ...settings.storyPage, mainSubtitleAr: e.target.value }
                })}
                className="w-full text-xs bg-white border border-ivory-300 rounded-xl p-2.5"
              />
            </div>
          </div>

          {/* Chapters List */}
          <div className="space-y-6 pt-4">
            <h3 className="font-serif text-base font-bold text-zaad-900">فصول القصة والمحطات الزمنية:</h3>
            {settings.storyPage.chapters.map((ch, idx) => (
              <div key={ch.id} className="p-5 bg-ivory-50/70 rounded-2xl border border-ivory-300 space-y-4">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                  <span className="text-xs font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full">
                    الفصل #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...settings.storyPage.chapters];
                        updated[idx].isVisible = !updated[idx].isVisible;
                        setSettings({
                          ...settings,
                          storyPage: { ...settings.storyPage, chapters: updated }
                        });
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${ch.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {ch.isVisible ? 'ظاهر' : 'مخفي'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm('حذف هذا الفصل؟')) return;
                        const updated = settings.storyPage.chapters.filter((_, i) => i !== idx);
                        setSettings({
                          ...settings,
                          storyPage: { ...settings.storyPage, chapters: updated }
                        });
                      }}
                      className="p-1.5 bg-red-50 text-red-700 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">الوسم الزمني (Period Tag):</label>
                    <input
                      type="text"
                      value={ch.periodTagAr}
                      onChange={(e) => {
                        const updated = [...settings.storyPage.chapters];
                        updated[idx].periodTagAr = e.target.value;
                        setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">عنوان الفصل (Chapter Title):</label>
                    <input
                      type="text"
                      value={ch.titleAr}
                      onChange={(e) => {
                        const updated = [...settings.storyPage.chapters];
                        updated[idx].titleAr = e.target.value;
                        setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-serif"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-zaad-900 mb-1">نصوص وفقرات الفصل:</label>
                    <textarea
                      rows={4}
                      value={ch.descriptionParagraphs.join('\n\n')}
                      onChange={(e) => {
                        const updated = [...settings.storyPage.chapters];
                        updated[idx].descriptionParagraphs = e.target.value.split('\n\n').filter(Boolean);
                        setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 leading-relaxed font-light"
                      placeholder="افصل بين كل فقرة وأخرى بسطر فارغ..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">صورة الفصل التراثية:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ch.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...settings.storyPage.chapters];
                          updated[idx].imageUrl = e.target.value;
                          setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                        }}
                        className="flex-1 bg-white border border-ivory-300 rounded-xl p-2.5 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker((url) => {
                          const updated = [...settings.storyPage.chapters];
                          updated[idx].imageUrl = url;
                          setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                        }, 'story')}
                        className="px-3 py-2.5 bg-zaad-900 text-gold-300 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>اختر صورة</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">تعليق الصورة (Caption):</label>
                    <input
                      type="text"
                      value={ch.imageCaptionAr || ''}
                      onChange={(e) => {
                        const updated = [...settings.storyPage.chapters];
                        updated[idx].imageCaptionAr = e.target.value;
                        setSettings({ ...settings, storyPage: { ...settings.storyPage, chapters: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANNOUNCEMENT BAR MANAGER
      ========================================================================= */}
      {activeTab === 'announcement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in max-w-3xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-zaad-900">شريط الإعلانات العلوي (Announcement Bar)</h2>
            <p className="text-xs text-charcoal-700/70">التحكم في نص الإعلان العلوي، العروض الترويجية، والألوان</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-ivory-50 rounded-2xl border border-ivory-300">
            <div>
              <span className="text-xs font-bold text-zaad-900 block">تفعيل شريط الإعلانات:</span>
              <span className="text-[11px] text-charcoal-700/70">إظهار أو إخفاء الشريط في أعلى جميع صفحات المتجر</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({
                ...settings,
                announcementBar: {
                  ...settings.announcementBar,
                  isEnabled: !settings.announcementBar.isEnabled
                }
              })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                settings.announcementBar.isEnabled ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {settings.announcementBar.isEnabled ? 'مفعل (نشط)' : 'معطل (مخفي)'}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zaad-900 mb-1">نص الإعلان الرئيسي:</label>
              <input
                type="text"
                value={settings.announcementBar.messageTextAr}
                onChange={(e) => setSettings({
                  ...settings,
                  announcementBar: { ...settings.announcementBar, messageTextAr: e.target.value }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                placeholder="مثال: نقاء موثق مخبرياً بنسبة 100% | شحن مجاني لكافة الطلبات"
              />
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">النص الفرعي / الرابط السريع (اختياري):</label>
              <input
                type="text"
                value={settings.announcementBar.secondaryTextAr || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  announcementBar: { ...settings.announcementBar, secondaryTextAr: e.target.value }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                placeholder="مثال: ميثاق النقاء الملكي"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zaad-900 mb-1">لون الخلفية (Background):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.announcementBar.backgroundColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, backgroundColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-ivory-300"
                  />
                  <input
                    type="text"
                    value={settings.announcementBar.backgroundColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, backgroundColor: e.target.value }
                    })}
                    className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">لون النص (Text Color):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.announcementBar.textColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, textColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-ivory-300"
                  />
                  <input
                    type="text"
                    value={settings.announcementBar.textColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      announcementBar: { ...settings.announcementBar, textColor: e.target.value }
                    })}
                    className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: NAVIGATION MENU MANAGER
      ========================================================================= */}
      {activeTab === 'navigation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-zaad-900">إدارة القائمة العلوية والشعار (Navigation)</h2>
              <p className="text-xs text-charcoal-700/70">أضف، أعد ترتيب، أو أخفِ صفحات من القائمة الرئيسية دون تعديل الكود</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: NavItem = {
                  id: `nav-${Date.now()}`,
                  nameAr: 'صفحة جديدة',
                  href: '/shop',
                  order: settings.navigation.items.length + 1,
                  isVisible: true
                };
                setSettings({
                  ...settings,
                  navigation: {
                    ...settings.navigation,
                    items: [...settings.navigation.items, newItem]
                  }
                });
              }}
              className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رابط جديد</span>
            </button>
          </div>

          {/* Links List */}
          <div className="space-y-3">
            {settings.navigation.items.map((item, idx) => (
              <div key={item.id} className="p-4 bg-ivory-50 rounded-2xl border border-ivory-300 flex flex-col sm:flex-row items-center gap-3">
                <span className="text-xs font-bold text-zaad-900 w-6 text-center">{idx + 1}</span>
                
                <input
                  type="text"
                  value={item.nameAr}
                  onChange={(e) => {
                    const updated = [...settings.navigation.items];
                    updated[idx].nameAr = e.target.value;
                    setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                  }}
                  className="flex-1 bg-white border border-ivory-300 rounded-xl p-2.5 text-xs font-bold"
                  placeholder="اسم الرابط"
                />

                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const updated = [...settings.navigation.items];
                    updated[idx].href = e.target.value;
                    setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                  }}
                  className="w-full sm:w-48 bg-white border border-ivory-300 rounded-xl p-2.5 text-xs font-mono text-left"
                  placeholder="/page-url"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...settings.navigation.items];
                      updated[idx].isVisible = !updated[idx].isVisible;
                      setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {item.isVisible ? 'ظاهر' : 'مخفي'}
                  </button>

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const updated = [...settings.navigation.items];
                      const temp = updated[idx];
                      updated[idx] = updated[idx - 1];
                      updated[idx - 1] = temp;
                      setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                    }}
                    className="p-2 bg-white hover:bg-ivory-200 border border-ivory-300 rounded-xl text-charcoal-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === settings.navigation.items.length - 1}
                    onClick={() => {
                      if (idx === settings.navigation.items.length - 1) return;
                      const updated = [...settings.navigation.items];
                      const temp = updated[idx];
                      updated[idx] = updated[idx + 1];
                      updated[idx + 1] = temp;
                      setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                    }}
                    className="p-2 bg-white hover:bg-ivory-200 border border-ivory-300 rounded-xl text-charcoal-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = settings.navigation.items.filter((_, i) => i !== idx);
                      setSettings({ ...settings, navigation: { ...settings.navigation, items: updated } });
                    }}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: MEDIA LIBRARY DIRECT ACCESS
      ========================================================================= */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-zaad-900">مكتبة الوسائط والصور (Media Library)</h2>
              <p className="text-xs text-charcoal-700/70">رفع وإدارة جميع أصول دار زاد البصرية من صور محاصيل، بانرات، وشعارات</p>
            </div>
            <button
              type="button"
              onClick={() => openMediaPicker(() => {}, 'general')}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-zaad-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>فتح مدير الوسائط والرفع</span>
            </button>
          </div>

          <div className="p-8 bg-ivory-50 rounded-2xl border border-dashed border-gold-500/40 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-gold-600/40 mx-auto" />
            <p className="text-sm font-bold text-zaad-900">مدير الوسائط المتكامل</p>
            <p className="text-xs text-charcoal-700/70 max-w-md mx-auto">
              يمكنك رفع الصور مباشرة من جهازك (JPG, PNG, WEBP, SVG) وتصنيفها حسب المجلدات واستخدامها في أي قسم من أقسام الموقع بنقرة زر واحدة.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: DESIGN & THEME MANAGER
      ========================================================================= */}
      {activeTab === 'design' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in max-w-3xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-zaad-900">الهوية البصرية والألوان (Design Tokens)</h2>
            <p className="text-xs text-charcoal-700/70">تخصيص ألوان الهوية الملكية، الخطوط، ونمط الأزرار الحية</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zaad-900 mb-1">اللون الأخضر الرئيسي (Primary Green):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.design.primaryGreen}
                  onChange={(e) => setSettings({
                    ...settings,
                    design: { ...settings.design, primaryGreen: e.target.value }
                  })}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.design.primaryGreen}
                  onChange={(e) => setSettings({
                    ...settings,
                    design: { ...settings.design, primaryGreen: e.target.value }
                  })}
                  className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">اللون الذهبي الملكي (Accent Gold):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.design.accentGold}
                  onChange={(e) => setSettings({
                    ...settings,
                    design: { ...settings.design, accentGold: e.target.value }
                  })}
                  className="w-8 h-8 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.design.accentGold}
                  onChange={(e) => setSettings({
                    ...settings,
                    design: { ...settings.design, accentGold: e.target.value }
                  })}
                  className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">الخط العربي الرئيسي (Font Family):</label>
              <select
                value={settings.design.fontFamily}
                onChange={(e) => setSettings({
                  ...settings,
                  design: { ...settings.design, fontFamily: e.target.value as any }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
              >
                <option value="Amiri">Amiri (الأميري - خط تراثي ملكي فاخر)</option>
                <option value="Cairo">Cairo (القاهرة - خط حديث عصري)</option>
                <option value="Tajawal">Tajawal (تجوال - خط هندسي واضح)</option>
                <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic (عصري تقني)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">نمط انحناء الأزرار (Button Radius):</label>
              <select
                value={settings.design.buttonRadius}
                onChange={(e) => setSettings({
                  ...settings,
                  design: { ...settings.design, buttonRadius: e.target.value as any }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
              >
                <option value="pill">دائري كامل (Pill Rounded - الافتراضي الفاخر)</option>
                <option value="rounded">منحني متوسط (Rounded 12px)</option>
                <option value="sharp">حواف حادة كلاسيكية (Sharp)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: SEO MANAGER
      ========================================================================= */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in max-w-4xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-zaad-900">إدارة محركات البحث والـ SEO</h2>
            <p className="text-xs text-charcoal-700/70">تخصيص عناوين صفحات المتجر، الوصف، والكلمات المفتاحية في Google</p>
          </div>

          <div className="space-y-6">
            {settings.seo.pages.map((page, idx) => (
              <div key={page.pagePath} className="p-5 bg-ivory-50 rounded-2xl border border-ivory-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zaad-900">{page.pageNameAr} ({page.pagePath})</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">عنوان الصفحة في نتائج البحث (Meta Title):</label>
                    <input
                      type="text"
                      value={page.metaTitle}
                      onChange={(e) => {
                        const updated = [...settings.seo.pages];
                        updated[idx].metaTitle = e.target.value;
                        setSettings({ ...settings, seo: { ...settings.seo, pages: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-serif"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">الوصف المختصر لنتائج البحث (Meta Description):</label>
                    <textarea
                      rows={2}
                      value={page.metaDescription}
                      onChange={(e) => {
                        const updated = [...settings.seo.pages];
                        updated[idx].metaDescription = e.target.value;
                        setSettings({ ...settings, seo: { ...settings.seo, pages: updated } });
                      }}
                      className="w-full bg-white border border-ivory-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: FOOTER MANAGER
      ========================================================================= */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6 animate-fade-in max-w-4xl">
          <div>
            <h2 className="font-serif text-xl font-bold text-zaad-900">إدارة تذييل المتجر (Footer & Socials)</h2>
            <p className="text-xs text-charcoal-700/70">تخصيص نصوص الفوتر، وسائل التواصل، أرقام الواتساب، وبيانات السجل التجاري</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-zaad-900 mb-1">شعار الفوتر (Slogan):</label>
              <input
                type="text"
                value={settings.footer.brandSloganAr}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, brandSloganAr: e.target.value }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-zaad-900 mb-1">نبذة عن دار زاد في الفوتر:</label>
              <textarea
                rows={3}
                value={settings.footer.aboutTextAr}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, aboutTextAr: e.target.value }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">رقم الواتساب المباشر:</label>
              <input
                type="text"
                value={settings.footer.contact.whatsappNumber}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    contact: { ...settings.footer.contact, whatsappNumber: e.target.value }
                  }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">بريد خدمة العملاء والنخبة:</label>
              <input
                type="email"
                value={settings.footer.contact.customerSupportEmail}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    contact: { ...settings.footer.contact, customerSupportEmail: e.target.value }
                  }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">رابط إنستجرام:</label>
              <input
                type="text"
                value={settings.footer.social.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    social: { ...settings.footer.social, instagram: e.target.value }
                  }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block font-bold text-zaad-900 mb-1">حقوق الملكية ورقم السجل الضريبي:</label>
              <input
                type="text"
                value={settings.footer.vatOrCrNumberAr}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, vatOrCrNumberAr: e.target.value }
                })}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reusable Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        defaultFolder={mediaPickerFolder}
        onSelectImage={(url) => {
          if (mediaPickerCallback) mediaPickerCallback(url);
          setMediaPickerOpen(false);
        }}
      />

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        settings={settings}
        onPublish={handlePublish}
        isPublishing={publishing}
      />

    </div>
  );
}
