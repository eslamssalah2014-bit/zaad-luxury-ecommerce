'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye
} from 'lucide-react';
import { Category, Subcategory } from '@/types';

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catNameAr, setCatNameAr] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescAr, setCatDescAr] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(0);
  const [catIsActive, setCatIsActive] = useState(true);

  // Subcategory modal state
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [subParentId, setSubParentId] = useState('');
  const [subNameAr, setSubNameAr] = useState('');
  const [subNameEn, setSubNameEn] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDescAr, setSubDescAr] = useState('');
  const [subSortOrder, setSubSortOrder] = useState(0);
  const [subIsActive, setSubIsActive] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?all=true', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setCategories(json.data || []);
        setSubcategories(json.subcategories || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading categories:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open Category Create / Edit Modal
  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatNameAr(cat.nameAr);
      setCatNameEn(cat.nameEn);
      setCatSlug(cat.slug);
      setCatDescAr(cat.descriptionAr || '');
      setCatImageUrl(cat.imageUrl || '');
      setCatSortOrder(cat.sortOrder || 0);
      setCatIsActive(cat.isActive !== false);
    } else {
      setEditingCategory(null);
      setCatNameAr('');
      setCatNameEn('');
      setCatSlug('');
      setCatDescAr('');
      setCatImageUrl('/images/zaad-logo.png');
      setCatSortOrder(categories.length + 1);
      setCatIsActive(true);
    }
    setCategoryModalOpen(true);
  };

  // Open Subcategory Create / Edit Modal
  const openSubcategoryModal = (sub?: Subcategory) => {
    if (sub) {
      setEditingSubcategory(sub);
      setSubParentId(sub.categoryId);
      setSubNameAr(sub.nameAr);
      setSubNameEn(sub.nameEn);
      setSubSlug(sub.slug);
      setSubDescAr(sub.descriptionAr || '');
      setSubSortOrder(sub.sortOrder || 0);
      setSubIsActive(sub.isActive !== false);
    } else {
      setEditingSubcategory(null);
      setSubParentId(categories[0]?.id || '');
      setSubNameAr('');
      setSubNameEn('');
      setSubSlug('');
      setSubDescAr('');
      setSubSortOrder(subcategories.length + 1);
      setSubIsActive(true);
    }
    setSubcategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingCategory?.id,
        nameAr: catNameAr,
        nameEn: catNameEn,
        slug: catSlug || catNameEn.toLowerCase().replace(/\s+/g, '-'),
        descriptionAr: catDescAr,
        imageUrl: catImageUrl,
        sortOrder: Number(catSortOrder),
        isActive: catIsActive
      };

      const res = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', editingCategory ? 'تم تحديث التصنيف بنجاح' : 'تم إضافة التصنيف الجديد بنجاح');
        setCategoryModalOpen(false);
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل حفظ التصنيف');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'حدث خطأ غير متوقع');
    }
  };

  // Save Subcategory
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingSubcategory?.id,
        type: 'subcategory',
        categoryId: subParentId,
        nameAr: subNameAr,
        nameEn: subNameEn,
        slug: subSlug || subNameEn.toLowerCase().replace(/\s+/g, '-'),
        descriptionAr: subDescAr,
        sortOrder: Number(subSortOrder),
        isActive: subIsActive
      };

      const res = await fetch('/api/categories', {
        method: editingSubcategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', editingSubcategory ? 'تم تحديث الفئة الفرعية بنجاح' : 'تم إضافة الفئة الفرعية بنجاح');
        setSubcategoryModalOpen(false);
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل حفظ الفئة الفرعية');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'حدث خطأ غير متوقع');
    }
  };

  // Toggle Category Active Status
  const handleToggleCategoryActive = async (cat: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cat.id,
          nameAr: cat.nameAr,
          nameEn: cat.nameEn,
          slug: cat.slug,
          imageUrl: cat.imageUrl,
          sortOrder: cat.sortOrder,
          isActive: !cat.isActive
        })
      });
      if (res.ok) {
        await loadData();
        showNotification('success', `تم تغيير حالة [${cat.nameAr}] بنجاح.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف التصنيف [${name}]؟`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification('success', 'تم حذف التصنيف بنجاح');
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل الحذف');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفئة الفرعية [${name}]؟`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}&type=subcategory`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification('success', 'تم حذف الفئة الفرعية بنجاح');
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل الحذف');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubcategories = subcategories.filter(s =>
    s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-arabic">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <FolderTree className="w-3.5 h-3.5" />
            <span>إدارة شجرة الكتالوج والتصنيفات المركزية</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            التصنيفات والفئات الفرعية
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'categories' ? (
            <button
              onClick={() => openCategoryModal()}
              className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تصنيف رئيسي</span>
            </button>
          ) : (
            <button
              onClick={() => openSubcategoryModal()}
              className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فئة فرعية</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in border ${
          notification.type === 'success' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">التصنيفات الرئيسية</span>
            <span className="font-serif text-2xl font-bold text-zaad-900">{categories.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">الفئات الفرعية</span>
            <span className="font-serif text-2xl font-bold text-zaad-900">{subcategories.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-700/70 block">التصنيفات النشطة بالمتجر</span>
            <span className="font-serif text-2xl font-bold text-green-700">
              {categories.filter(c => c.isActive !== false).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-300 flex items-center justify-center text-green-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-ivory-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'categories' ? 'bg-zaad-900 text-gold-400 shadow-md' : 'text-charcoal-700 hover:text-zaad-900'
            }`}
          >
            التصنيفات الرئيسية ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'subcategories' ? 'bg-zaad-900 text-gold-400 shadow-md' : 'text-charcoal-700 hover:text-zaad-900'
            }`}
          >
            الفئات الفرعية ({subcategories.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث بالاسم أو الرابط..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-2 pl-9 text-xs focus:border-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-charcoal-700/50 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل هيكل التصنيفات من Supabase...</div>
      ) : activeTab === 'categories' ? (
        /* MAIN CATEGORIES TABLE */
        <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                <tr>
                  <th className="p-4">الصورة</th>
                  <th className="p-4">اسم التصنيف (عربي / English)</th>
                  <th className="p-4">الرابط (Slug)</th>
                  <th className="p-4">الترتيب</th>
                  <th className="p-4">الفئات الفرعية</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-charcoal-700/60">
                      لا توجد تصنيفات مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-ivory-50/50 transition-colors">
                      <td className="p-4">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-ivory-100 border border-ivory-200">
                          <Image src={cat.imageUrl || '/images/zaad-logo.png'} alt={cat.nameAr} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-zaad-900">
                        <div className="font-bold text-sm">{cat.nameAr}</div>
                        <div className="text-[11px] text-charcoal-700/60 font-mono">{cat.nameEn}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-gold-700">/{cat.slug}</td>
                      <td className="p-4 font-mono font-bold text-zaad-900">{cat.sortOrder}</td>
                      <td className="p-4">
                        <span className="bg-gold-50 text-gold-800 border border-gold-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                          {cat.subcategories?.length || 0} فئات
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleCategoryActive(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            cat.isActive !== false
                              ? 'bg-green-50 text-green-700 border border-green-300'
                              : 'bg-charcoal-100 text-charcoal-700 border border-charcoal-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive !== false ? 'bg-green-600' : 'bg-charcoal-400'}`} />
                          <span>{cat.isActive !== false ? 'نشط بالمتجر' : 'معطل'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openCategoryModal(cat)}
                            className="p-1.5 bg-ivory-100 hover:bg-gold-100 text-zaad-900 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.nameAr)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SUBCATEGORIES TABLE */
        <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                <tr>
                  <th className="p-4">اسم الفئة الفرعية</th>
                  <th className="p-4">التصنيف الرئيسي التابع له</th>
                  <th className="p-4">الرابط (Slug)</th>
                  <th className="p-4">الترتيب</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-charcoal-700/60">
                      لا توجد فئات فرعية مضافة حتى الآن
                    </td>
                  </tr>
                ) : (
                  filteredSubcategories.map((sub) => {
                    const parentCat = categories.find(c => c.id === sub.categoryId);

                    return (
                      <tr key={sub.id} className="hover:bg-ivory-50/50 transition-colors">
                        <td className="p-4 font-semibold text-zaad-900">
                          <div className="font-bold text-sm">{sub.nameAr}</div>
                          <div className="text-[11px] text-charcoal-700/60 font-mono">{sub.nameEn}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-ivory-100 text-zaad-900 px-3 py-1 rounded-xl font-bold border border-ivory-300">
                            {parentCat?.nameAr || 'غير محدد'}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-gold-700">/{sub.slug}</td>
                        <td className="p-4 font-mono font-bold text-zaad-900">{sub.sortOrder}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            sub.isActive ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-charcoal-100 text-charcoal-700'
                          }`}>
                            <span>{sub.isActive ? 'نشط' : 'معطل'}</span>
                          </span>
                        </td>
                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openSubcategoryModal(sub)}
                              className="p-1.5 bg-ivory-100 hover:bg-gold-100 text-zaad-900 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(sub.id, sub.nameAr)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 bg-zaad-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-ivory-300 shadow-2xl space-y-5 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-zaad-900">
              {editingCategory ? 'تعديل التصنيف الرئيسي' : 'إضافة تصنيف رئيسي جديد'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zaad-900 mb-1">اسم التصنيف باللغة العربية *</label>
                <input
                  type="text"
                  required
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                  placeholder="مثال: عسل السدر الدوعني الملكي"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">Category English Name</label>
                <input
                  type="text"
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  placeholder="e.g. Royal Sidr Honey"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zaad-900 mb-1">الرابط الفرعي (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="royal-sidr-honey"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zaad-900 mb-1">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">رابط صورة التصنيف (Image URL)</label>
                <input
                  type="text"
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  placeholder="https://... أو /images/..."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={catDescAr}
                  onChange={(e) => setCatDescAr(e.target.value)}
                  placeholder="وصف فاخر للمجموعة الملكية..."
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-ivory-50 rounded-xl border border-ivory-200">
                <span className="font-bold text-zaad-900">تفعيل التصنيف بالمتجر</span>
                <input
                  type="checkbox"
                  checked={catIsActive}
                  onChange={(e) => setCatIsActive(e.target.checked)}
                  className="w-4 h-4 text-gold-600 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 bg-ivory-100 text-xs font-bold rounded-xl text-charcoal-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 text-xs font-bold rounded-xl shadow-md"
                >
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBCATEGORY MODAL */}
      {subcategoryModalOpen && (
        <div className="fixed inset-0 bg-zaad-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-ivory-300 shadow-2xl space-y-5 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-zaad-900">
              {editingSubcategory ? 'تعديل الفئة الفرعية' : 'إضافة فئة فرعية جديدة'}
            </h3>

            <form onSubmit={handleSaveSubcategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zaad-900 mb-1">التصنيف الرئيسي التابع له *</label>
                <select
                  required
                  value={subParentId}
                  onChange={(e) => setSubParentId(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr} ({c.nameEn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">اسم الفئة الفرعية بالعربية *</label>
                <input
                  type="text"
                  required
                  value={subNameAr}
                  onChange={(e) => setSubNameAr(e.target.value)}
                  placeholder="مثال: عسل سدر دوعني صافي"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zaad-900 mb-1">Subcategory English Name</label>
                <input
                  type="text"
                  value={subNameEn}
                  onChange={(e) => setSubNameEn(e.target.value)}
                  placeholder="e.g. Pure Doan Sidr Honey"
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zaad-900 mb-1">الرابط الفرعي (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={subSlug}
                    onChange={(e) => setSubSlug(e.target.value)}
                    placeholder="pure-doan-sidr"
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zaad-900 mb-1">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={subSortOrder}
                    onChange={(e) => setSubSortOrder(Number(e.target.value))}
                    className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-ivory-50 rounded-xl border border-ivory-200">
                <span className="font-bold text-zaad-900">تفعيل الفئة الفرعية</span>
                <input
                  type="checkbox"
                  checked={subIsActive}
                  onChange={(e) => setSubIsActive(e.target.checked)}
                  className="w-4 h-4 text-gold-600 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setSubcategoryModalOpen(false)}
                  className="px-4 py-2 bg-ivory-100 text-xs font-bold rounded-xl text-charcoal-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 text-xs font-bold rounded-xl shadow-md"
                >
                  حفظ الفئة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
