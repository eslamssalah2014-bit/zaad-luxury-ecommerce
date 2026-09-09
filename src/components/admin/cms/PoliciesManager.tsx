'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Plus,
  FileEdit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Globe,
  Heading1,
  Heading2,
  Bold,
  List,
  Quote,
  Minus,
  Sparkles,
  Lock,
  Search,
  Check,
  X
} from 'lucide-react';
import { Policy, PolicyStatus } from '@/types/cms';
import { supabase } from '@/lib/supabase/client';

export default function PoliciesManager() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'editor' | 'preview' | 'seo'>('editor');
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [policyId, setPolicyId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<PolicyStatus>('published');

  // Delete State
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Fetch policies
  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/admin/policies', {
        headers,
        cache: 'no-store'
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'فشل استرجاع السياسات');
        return;
      }

      setPolicies(json.data || []);
    } catch (err: any) {
      console.error('Error fetching policies:', err);
      setErrorMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setPolicyId('');
    setTitle('');
    setSlug('');
    setContent(`## عنوان البند الأول\nأدخل نص وتفاصيل السياسة هنا بأسلوب قانوني راقٍ يتماشى مع معايير دار زاد الفاخرة.\n\n## البند الثاني\n- نقطة توضيحية أولى\n- نقطة توضيحية ثانية\n\n> ملاحظة مهمة للعملاء الكرام.`);
    setMetaTitle('');
    setMetaDescription('');
    setStatus('published');
    setActiveFormTab('editor');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Policy) => {
    setIsEditing(true);
    setPolicyId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setContent(p.content);
    setMetaTitle(p.meta_title || '');
    setMetaDescription(p.meta_description || '');
    setStatus(p.status);
    setActiveFormTab('editor');
    setIsModalOpen(true);
  };

  // Auto-generate slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      const generatedSlug = val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      if (generatedSlug) {
        setSlug(generatedSlug);
      }
    }
  };

  // Insert markdown snippet into content
  const insertMarkdown = (prefix: string, suffix = '') => {
    setContent(prev => prev + '\n' + prefix + suffix);
  };

  // Save / Update Policy
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        id: isEditing ? policyId : undefined,
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        content: content.trim(),
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
        status
      };

      const res = await fetch('/api/admin/policies', {
        method,
        headers,
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'فشل حفظ السياسة');
        setSaving(false);
        return;
      }

      setSuccessMsg(isEditing ? 'تم تحديث السياسة بنجاح' : 'تم إنشاء السياسة ونشرها بنجاح');
      setIsModalOpen(false);
      await fetchPolicies();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error saving policy:', err);
      setErrorMsg(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setSaving(false);
    }
  };

  // Delete Policy
  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;
    setDeleting(true);
    setErrorMsg('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/admin/policies?id=${encodeURIComponent(policyToDelete.id)}`, {
        method: 'DELETE',
        headers
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'فشل حذف السياسة');
        setDeleting(false);
        return;
      }

      setSuccessMsg('تم حذف صفحة السياسة بنجاح');
      setPolicyToDelete(null);
      await fetchPolicies();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error deleting policy:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء محاولة الحذف');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Publish Status
  const handleToggleStatus = async (p: Policy) => {
    try {
      const newStatus: PolicyStatus = p.status === 'published' ? 'draft' : 'published';
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/admin/policies', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: p.id,
          title: p.title,
          slug: p.slug,
          content: p.content,
          meta_title: p.meta_title,
          meta_description: p.meta_description,
          status: newStatus
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMsg(json.error || 'فشل تغيير حالة النشر');
        return;
      }

      setSuccessMsg(`تم تغيير حالة السياسة إلى: ${newStatus === 'published' ? 'منشور' : 'مسودة'}`);
      await fetchPolicies();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setErrorMsg('حدث خطأ أثناء تغيير الحالة');
    }
  };

  // Filtered list
  const filteredPolicies = policies.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(d);
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  return (
    <div className="space-y-6 font-arabic text-ivory-100">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zaad-900/80 border border-zaad-800 p-6 rounded-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ivory-50">
              إدارة سياسات المتجر واللوائح القانونية (Policies)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ivory-300/80 max-w-2xl">
            منظومة متكاملة لإنشاء وتعديل ونشر صفحات السياسات والشروط والأحكام مع إسناد ديناميكي لقواعد بيانات Supabase ودعم كامل لمحركات البحث (SEO).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zaad-950 font-bold text-xs shadow-lg hover:shadow-gold-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سياسة جديدة</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="bg-red-950/70 border border-red-500/50 p-4 rounded-xl text-xs text-red-200 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-950/70 border border-green-500/50 p-4 rounded-xl text-xs text-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <div className="flex-1">{successMsg}</div>
          <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zaad-900/50 border border-zaad-800/80 p-3.5 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-ivory-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث بالعنوان أو الرابط..."
            className="w-full bg-zaad-950 border border-zaad-700/80 rounded-lg pr-9 pl-3 py-2 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-gold-500 text-zaad-950 font-bold'
                : 'bg-zaad-800 text-ivory-300 hover:bg-zaad-700'
            }`}
          >
            الكل ({policies.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-zaad-800 text-ivory-300 hover:bg-zaad-700'
            }`}
          >
            المنشور ({policies.filter(p => p.status === 'published').length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'draft'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-zaad-800 text-ivory-300 hover:bg-zaad-700'
            }`}
          >
            المسودات ({policies.filter(p => p.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Policies Grid / Table */}
      {loading ? (
        <div className="bg-zaad-900/50 border border-zaad-800 p-12 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-gold-400 animate-spin" />
          <span className="text-xs text-ivory-400">جاري تحميل السياسات من قاعدة البيانات...</span>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-zaad-900/40 border border-dashed border-zaad-800 p-12 rounded-2xl text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-gold-500/40 mx-auto" />
          <p className="text-sm text-ivory-300">لم يتم العثور على سياسات تطابق معايير البحث.</p>
          <button
            onClick={handleOpenCreate}
            className="text-xs text-gold-400 hover:text-gold-300 font-semibold underline"
          >
            إنشاء صفحة سياسة جديدة الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolicies.map((p) => {
            const isPublished = p.status === 'published';
            return (
              <div
                key={p.id}
                className="bg-zaad-900/80 border border-zaad-800 hover:border-gold-500/40 p-5 rounded-2xl transition-all shadow-lg flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base text-ivory-100 group-hover:text-gold-300 transition-colors">
                      {p.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 ${
                        isPublished
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>منشور</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>مسودة</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gold-400/80 font-mono bg-zaad-950/70 px-3 py-1.5 rounded-lg border border-zaad-800">
                    <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="truncate">/policies/{p.slug}</span>
                  </div>

                  <p className="text-xs text-ivory-300/70 line-clamp-2 leading-relaxed">
                    {p.content.replace(/[#*`_>]/g, '').slice(0, 150)}...
                  </p>
                </div>

                <div className="pt-3 border-t border-zaad-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-ivory-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>تحديث: {formatDate(p.updated_at)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Live Preview Button */}
                    <a
                      href={`/policies/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zaad-800 hover:bg-zaad-700 text-ivory-300 hover:text-gold-300 transition-colors"
                      title="معاينة في المتجر"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Quick Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        isPublished
                          ? 'bg-amber-950/70 text-amber-300 hover:bg-amber-900 border border-amber-500/30'
                          : 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30'
                      }`}
                    >
                      {isPublished ? 'تحويل لمسودة' : 'نشر فوري'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 transition-colors"
                      title="تعديل السياسة"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setPolicyToDelete(p)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="حذف السياسة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zaad-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zaad-900 border border-zaad-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zaad-800 flex items-center justify-between bg-zaad-950/60">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-ivory-50">
                    {isEditing ? `تعديل صفحة السياسة: ${title}` : 'إنشاء صفحة سياسة جديدة'}
                  </h3>
                  <p className="text-[11px] text-ivory-400">
                    صلاحية الإدارة العليا (Fort Knox Super Admin)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-zaad-800 hover:bg-zaad-700 text-ivory-400 hover:text-ivory-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-3 border-b border-zaad-800 flex items-center gap-4 bg-zaad-950/30 text-xs">
              <button
                type="button"
                onClick={() => setActiveFormTab('editor')}
                className={`pb-2.5 font-bold transition-all border-b-2 ${
                  activeFormTab === 'editor'
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ivory-400 hover:text-ivory-200'
                }`}
              >
                محتوى السياسة (Editor)
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('preview')}
                className={`pb-2.5 font-bold transition-all border-b-2 ${
                  activeFormTab === 'preview'
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ivory-400 hover:text-ivory-200'
                }`}
              >
                معاينة القراءة الحية (Live Preview)
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('seo')}
                className={`pb-2.5 font-bold transition-all border-b-2 ${
                  activeFormTab === 'seo'
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-ivory-400 hover:text-ivory-200'
                }`}
              >
                محركات البحث (SEO & Meta)
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePolicy} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Common Details (Title, Slug, Status) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-ivory-300">
                    عنوان السياسة الرسمي <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="مثال: سياسة الضمان الذهبي الملكي"
                    className="w-full bg-zaad-950 border border-zaad-700 rounded-xl px-4 py-2.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-ivory-300">
                    حالة النشر
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PolicyStatus)}
                    className="w-full bg-zaad-950 border border-zaad-700 rounded-xl px-3 py-2.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="published">منشور (متاح للجميع)</option>
                    <option value="draft">مسودة (غير ظاهر)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ivory-300">
                  الرابط الدائم (URL Slug) <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ivory-400 font-mono bg-zaad-950 px-3 py-2.5 rounded-xl border border-zaad-800">
                    https://zaadstore.com/policies/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.trim().toLowerCase())}
                    placeholder="refund-policy"
                    className="flex-1 bg-zaad-950 border border-zaad-700 rounded-xl px-4 py-2.5 text-xs text-gold-400 font-mono focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Tab 1: Editor */}
              {activeFormTab === 'editor' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-ivory-300">
                      محتوى السياسة بنظام Markdown الغني <span className="text-red-400">*</span>
                    </label>

                    {/* Quick Formatting Toolbar */}
                    <div className="flex items-center gap-1 bg-zaad-950 p-1 rounded-lg border border-zaad-800">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('## عنوان فرعي رئيسي\n')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="عنوان H2"
                      >
                        <Heading1 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('### بند فرعي\n')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="عنوان H3"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('**نص بارز** ')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="خط عريض"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('- نقطة أولى\n- نقطة ثانية\n')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="قائمة نقطية"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('> تنبيه رسمي أو ملاحظة هامة\n')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="اقتباس / تنبيه"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('\n---\n')}
                        className="p-1 rounded hover:bg-zaad-800 text-ivory-300 hover:text-gold-400"
                        title="فاصل ذهبي"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    required
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="اكتب بنود وفقرات السياسة هنا..."
                    className="w-full bg-zaad-950 border border-zaad-700 rounded-xl p-4 text-xs font-mono text-ivory-100 leading-relaxed focus:outline-none focus:border-gold-400"
                  />
                </div>
              )}

              {/* Tab 2: Live Preview */}
              {activeFormTab === 'preview' && (
                <div className="bg-ivory-100 text-charcoal-900 p-6 rounded-2xl border border-gold-500/30 max-h-96 overflow-y-auto space-y-4">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-zaad-950 border-b pb-3 border-gold-500/20">
                    {title || 'عنوان السياسة المعاينة'}
                  </h1>

                  <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-charcoal-800 font-light">
                    {content.split('\n\n').map((block, idx) => {
                      const trimmed = block.trim();
                      if (trimmed.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-base font-serif font-bold text-zaad-900 pt-2 border-r-2 border-gold-500 pr-2">
                            {trimmed.replace('## ', '')}
                          </h2>
                        );
                      }
                      if (trimmed.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="text-sm font-serif font-semibold text-zaad-800 pr-2">
                            {trimmed.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (trimmed.startsWith('> ')) {
                        return (
                          <blockquote key={idx} className="bg-gold-50 border-r-4 border-gold-500 p-3 rounded-lg text-xs italic text-zaad-950 font-medium">
                            {trimmed.replace('> ', '')}
                          </blockquote>
                        );
                      }
                      if (trimmed.startsWith('- ')) {
                        const items = trimmed.split('\n');
                        return (
                          <ul key={idx} className="list-disc list-inside space-y-1.5 pr-2">
                            {items.map((item, i) => (
                              <li key={i}>{item.replace(/^- /, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx}>{trimmed}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: SEO */}
              {activeFormTab === 'seo' && (
                <div className="space-y-4 bg-zaad-950/60 p-5 rounded-2xl border border-zaad-800">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-ivory-300">
                        عنوان صفحة محركات البحث (Meta Title)
                      </label>
                      <span className="text-[10px] text-ivory-500 font-mono">
                        {metaTitle.length}/60 حرف
                      </span>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title ? `${title} | زاد (ZAAD)` : 'سياسة الخصوصية | زاد (ZAAD)'}
                      className="w-full bg-zaad-900 border border-zaad-700 rounded-xl px-4 py-2.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-ivory-300">
                        وصف الصفحة لمقتطف Google (Meta Description)
                      </label>
                      <span className="text-[10px] text-ivory-500 font-mono">
                        {metaDescription.length}/160 حرف
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="تعرف على الشروط والسياسات الرسمية المعتمدة لدار زاد..."
                      className="w-full bg-zaad-900 border border-zaad-700 rounded-xl p-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  {/* Google Search Simulation Box */}
                  <div className="pt-3 border-t border-zaad-800 space-y-1">
                    <span className="text-[11px] text-gold-400 font-semibold block">
                      معاينة الظهور في محرك بحث Google:
                    </span>
                    <div className="bg-white p-3.5 rounded-xl text-left font-sans text-xs space-y-1 shadow-md" dir="ltr">
                      <div className="text-[11px] text-slate-500 truncate">
                        https://zaadstore.com/policies/{slug || 'policy-slug'}
                      </div>
                      <div className="text-blue-700 font-medium text-sm hover:underline cursor-pointer truncate">
                        {metaTitle || (title ? `${title} | زاد (ZAAD)` : 'سياسة دار زاد')}
                      </div>
                      <div className="text-slate-600 text-[11px] line-clamp-2">
                        {metaDescription || 'تعرف على ميثاق وسياسات دار زاد للنقاء الملكي والأعسال الطبيعية الفاخرة.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zaad-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zaad-800 hover:bg-zaad-700 text-ivory-300 text-xs font-semibold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zaad-950 text-xs font-bold shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>جاري الحفظ المشفر...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditing ? 'حفظ التعديلات' : 'نشر السياسة'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {policyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zaad-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zaad-900 border border-red-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-ivory-100">
                تأكيد حذف السياسة
              </h3>
              <p className="text-xs text-ivory-400">
                هل أنت متأكد من رغبتك في حذف صفحة <span className="text-gold-400 font-semibold">"{policyToDelete.title}"</span> نهائياً؟ هذا الإجراء غير قابل للتراجع.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPolicyToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-zaad-800 hover:bg-zaad-700 text-ivory-300 text-xs font-semibold transition-colors"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleDeletePolicy}
                disabled={deleting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>نعم، حذف نهائي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
