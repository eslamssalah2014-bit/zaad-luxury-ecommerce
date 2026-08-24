'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Boxes,
  Info
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Product, Category, Subcategory, ProductVisibility } from '@/types';
import { adminFetch } from '@/lib/auth/adminFetch';

export default function AdminProductsPage() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVisibility, setSelectedVisibility] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'basic' | 'pricing' | 'inventory' | 'media' | 'lab' | 'visibility'>('basic');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [taglineAr, setTaglineAr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [costPrice, setCostPrice] = useState<number>(225);
  const [stockQuantity, setStockQuantity] = useState<number>(25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [weightGrams, setWeightGrams] = useState<number>(500);
  const [originRegionAr, setOriginRegionAr] = useState('حضرموت - وادي دوعن');
  const [originRegionEn, setOriginRegionEn] = useState('Hadramout - Doan Valley');
  const [floralSourceAr, setFloralSourceAr] = useState('أزهار أشجار السدر البرية الجبلية');
  const [floralSourceEn, setFloralSourceEn] = useState('Wild Mountain Sidr Blossom');
  const [shortDescAr, setShortDescAr] = useState('');
  const [fullStoryAr, setFullStoryAr] = useState('');
  const [images, setImages] = useState<string[]>(['/images/zaad-logo.png']);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [visibilityStatus, setVisibilityStatus] = useState<ProductVisibility>('published');
  const [badge, setBadge] = useState('');

  // Lab Batch Fields
  const [batchNumber, setBatchNumber] = useState('');
  const [harvestSeason, setHarvestSeason] = useState('المحصول الملكي 2026');
  const [labName, setLabName] = useState('مختبر الجودة الأوروبية المعتمد');
  const [moisturePercentage, setMoisturePercentage] = useState<number>(14.2);
  const [hmfLevel, setHmfLevel] = useState<number>(2.1);
  const [diastaseActivity, setDiastaseActivity] = useState<number>(19.4);
  const [pollenPurityPercentage, setPollenPurityPercentage] = useState<number>(98.6);

  const loadData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        adminFetch('/api/products?admin=true', { cache: 'no-store' }),
        adminFetch('/api/categories?all=true', { cache: 'no-store' })
      ]);

      const [prodJson, catJson] = await Promise.all([prodRes.json(), catRes.json()]);

      if (prodJson.success) setProducts(prodJson.data || []);
      if (catJson.success) {
        setCategories(catJson.data || []);
        setSubcategories(catJson.subcategories || []);
      }
      setLoading(false);
    } catch (e) {
      console.error('Error loading products CMS data:', e);
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

  // Open Modal for Create or Edit
  const openProductModal = (prod?: Product) => {
    setModalTab('basic');
    if (prod) {
      setEditingProduct(prod);
      setNameAr(prod.nameAr);
      setNameEn(prod.nameEn);
      setSlug(prod.slug);
      setSku(prod.sku);
      setTaglineAr(prod.taglineAr || '');
      setCategoryId(prod.categoryId || '');
      setSubcategoryId(prod.subcategoryId || '');
      setPrice(prod.price || prod.sellingPrice || 500);
      setCompareAtPrice(prod.compareAtPrice || prod.comparePrice);
      setCostPrice(prod.costPrice || Math.round((prod.price || 500) * 0.45));
      setStockQuantity(prod.stockQuantity);
      setLowStockThreshold(prod.lowStockThreshold);
      setWeightGrams(prod.weightGrams);
      setOriginRegionAr(prod.originRegionAr);
      setOriginRegionEn(prod.originRegionEn || '');
      setFloralSourceAr(prod.floralSourceAr);
      setFloralSourceEn(prod.floralSourceEn || '');
      setShortDescAr(prod.shortDescAr);
      setFullStoryAr(prod.fullStoryAr);
      setImages(prod.images?.length > 0 ? prod.images : ['/images/zaad-logo.png']);
      setIsFeatured(prod.isFeatured);
      setVisibilityStatus(prod.visibilityStatus || 'published');
      setBadge(prod.badge || '');

      // Lab Batch
      setBatchNumber(prod.latestLabBatch?.batchNumber || `ZD-2026-${prod.sku}`);
      setHarvestSeason(prod.latestLabBatch?.harvestSeason || 'المحصول الملكي 2026');
      setLabName(prod.latestLabBatch?.labName || 'مختبر الجودة الأوروبية المعتمد');
      setMoisturePercentage(prod.latestLabBatch?.moisturePercentage || 14.2);
      setHmfLevel(prod.latestLabBatch?.hmfLevel || 2.1);
      setDiastaseActivity(prod.latestLabBatch?.diastaseActivity || 19.4);
      setPollenPurityPercentage(prod.latestLabBatch?.pollenPurityPercentage || 98.6);
    } else {
      setEditingProduct(null);
      setNameAr('');
      setNameEn('');
      setSlug('');
      setSku(`ZD-${Math.floor(1000 + Math.random() * 9000)}`);
      setTaglineAr('');
      setCategoryId(categories[0]?.id || '');
      setSubcategoryId('');
      setPrice(500);
      setCompareAtPrice(undefined);
      setCostPrice(225);
      setStockQuantity(25);
      setLowStockThreshold(5);
      setWeightGrams(500);
      setOriginRegionAr('حضرموت - وادي دوعن');
      setOriginRegionEn('Hadramout - Doan Valley');
      setFloralSourceAr('أزهار أشجار السدر البرية الجبلية');
      setFloralSourceEn('Wild Mountain Sidr Blossom');
      setShortDescAr('');
      setFullStoryAr('');
      setImages(['/images/zaad-logo.png']);
      setIsFeatured(false);
      setVisibilityStatus('published');
      setBadge('');

      // Lab Batch
      setBatchNumber(`ZD-2026-${Math.floor(100 + Math.random() * 900)}`);
      setHarvestSeason('المحصول الملكي 2026');
      setLabName('مختبر الجودة الأوروبية المعتمد');
      setMoisturePercentage(14.2);
      setHmfLevel(2.1);
      setDiastaseActivity(19.4);
      setPollenPurityPercentage(98.6);
    }
    setProductModalOpen(true);
  };

  // Add Image URL
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove Image URL
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated.length > 0 ? updated : ['/images/zaad-logo.png']);
  };

  // Set Featured Image
  const handleSetFeaturedImage = (index: number) => {
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingProduct?.id,
        nameAr,
        nameEn,
        slug: slug || nameEn.toLowerCase().replace(/\s+/g, '-'),
        sku,
        taglineAr,
        categoryId,
        subcategoryId: subcategoryId || null,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        costPrice: Number(costPrice),
        currency: 'EGP',
        stockQuantity: Number(stockQuantity),
        lowStockThreshold: Number(lowStockThreshold),
        weightGrams: Number(weightGrams),
        originRegionAr,
        originRegionEn,
        floralSourceAr,
        floralSourceEn,
        shortDescAr,
        fullStoryAr,
        images,
        isFeatured,
        isAvailable: visibilityStatus === 'published' || visibilityStatus === 'out_of_stock',
        visibilityStatus,
        badge: badge || null,
        latestLabBatch: {
          batchNumber,
          harvestSeason,
          harvestDate: '2026-01-15',
          testedDate: new Date().toISOString().split('T')[0],
          labName,
          moisturePercentage: Number(moisturePercentage),
          hmfLevel: Number(hmfLevel),
          diastaseActivity: Number(diastaseActivity),
          sucrosePercentage: 0.8,
          pollenPurityPercentage: Number(pollenPurityPercentage)
        }
      };

      const res = await adminFetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showNotification('success', editingProduct ? 'تم تحديث بيانات المحصول بنجاح في Supabase' : 'تم إضافة المحصول الجديد بنجاح في Supabase');
        setProductModalOpen(false);
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل حفظ المنتج');
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  // Quick Toggle Visibility
  const handleQuickToggleVisibility = async (prod: Product, newStatus: ProductVisibility) => {
    try {
      const res = await adminFetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prod,
          visibilityStatus: newStatus,
          isAvailable: newStatus === 'published' || newStatus === 'out_of_stock'
        })
      });
      if (res.ok) {
        showNotification('success', `تم تغيير حالة ظهور [${prod.nameAr}] إلى: ${newStatus}`);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المحصول [${name}] نهائياً من قاعدة البيانات؟`)) return;
    try {
      const res = await adminFetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showNotification('success', 'تم حذف المنتج بنجاح');
        await loadData();
      } else {
        showNotification('error', json.error || 'فشل الحذف');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (selectedVisibility !== 'all' && p.visibilityStatus !== selectedVisibility) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate live profit margin for modal preview
  const liveGrossProfit = Number(price || 0) - Number(costPrice || 0);
  const liveMarginPercent = Number(price || 0) > 0
    ? Number(((liveGrossProfit / Number(price)) * 100).toFixed(1))
    : 0;

  return (
    <div className="space-y-8 animate-fade-in font-arabic">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>نظام إدارة المنتجات والمحاصيل والتسعير المتقدم (CMS)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            كتالوج المنتجات والمحاصيل الملكية
          </h1>
        </div>

        <button
          onClick={() => openProductModal()}
          className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 px-5 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة محصول ملكي جديد</span>
        </button>
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm">
          <span className="text-xs text-charcoal-700/70 block">إجمالي المنتجات</span>
          <span className="font-serif text-2xl font-bold text-zaad-900">{products.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm">
          <span className="text-xs text-charcoal-700/70 block">المنتجات المنشورة</span>
          <span className="font-serif text-2xl font-bold text-green-700">
            {products.filter(p => p.visibilityStatus === 'published').length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm">
          <span className="text-xs text-charcoal-700/70 block">مخزون منخفض (تنبيه)</span>
          <span className="font-serif text-2xl font-bold text-amber-700">
            {products.filter(p => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-sm">
          <span className="text-xs text-charcoal-700/70 block">نفد من المخزون</span>
          <span className="font-serif text-2xl font-bold text-red-700">
            {products.filter(p => p.stockQuantity === 0).length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث بالاسم أو الرمز (SKU)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ivory-50 border border-ivory-300 rounded-xl px-4 py-2.5 pl-9 text-xs focus:border-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-charcoal-700/50 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-700">التصنيف:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-xs font-bold text-zaad-900 focus:outline-none"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-700">حالة الظهور:</span>
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="bg-ivory-50 border border-ivory-300 rounded-xl px-3 py-2 text-xs font-bold text-zaad-900 focus:outline-none"
            >
              <option value="all">الكل</option>
              <option value="published">منشور بالمتجر</option>
              <option value="draft">مسودة</option>
              <option value="hidden">مخفي</option>
              <option value="out_of_stock">نفد المخزون</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-12 text-center text-zaad-900 font-serif">جاري تحميل كتالوج المحاصيل من Supabase...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-ivory-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-ivory-50 border-b border-ivory-200 text-charcoal-700 font-bold">
                <tr>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">سعر البيع</th>
                  <th className="p-4">تكلفة المنتج (Cost)</th>
                  <th className="p-4">هامش الربح</th>
                  <th className="p-4">المخزون المتاح</th>
                  <th className="p-4">حالة الظهور</th>
                  <th className="p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-charcoal-700/60">
                      لا توجد منتجات مطابقة لخيارات البحث والفلاتر
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const margin = p.costPrice && p.price
                      ? Number((((p.price - p.costPrice) / p.price) * 100).toFixed(1))
                      : 55;
                    const isLow = p.stockQuantity <= p.lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-ivory-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-ivory-100 border border-ivory-200 shrink-0">
                              <Image src={p.images[0] || '/images/zaad-logo.png'} alt={p.nameAr} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-zaad-900">{p.nameAr}</div>
                              <div className="text-[11px] text-charcoal-700/60 font-mono">SKU: {p.sku}</div>
                              {p.isFeatured && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gold-700 bg-gold-50 px-2 py-0.2 rounded-full border border-gold-300 mt-0.5">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>مميز بالواجهة</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-zaad-900">
                          {p.categoryNameAr || 'تصنيف ملكي'}
                        </td>

                        <td className="p-4 font-mono font-bold text-zaad-900">
                          <div>{formatPrice(p.price)}</div>
                          {p.compareAtPrice && (
                            <div className="text-[10px] text-charcoal-700/50 line-through">
                              {formatPrice(p.compareAtPrice)}
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-mono font-bold text-charcoal-700">
                          {formatPrice(p.costPrice || Math.round(p.price * 0.45))}
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            margin >= 50 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            <span>{margin}%</span>
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className={`font-bold text-sm ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                              {p.stockQuantity}
                            </span>
                            <span className="text-[10px] text-charcoal-700/60">وحدة</span>
                          </div>
                          {isLow && (
                            <span className="text-[9px] font-bold text-red-600 block">
                              تنبيه: اقترب من النفاد
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <select
                            value={p.visibilityStatus || 'published'}
                            onChange={(e) => handleQuickToggleVisibility(p, e.target.value as ProductVisibility)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                              p.visibilityStatus === 'published'
                                ? 'bg-green-50 text-green-700 border-green-300'
                                : (p.visibilityStatus === 'draft'
                                  ? 'bg-ivory-100 text-charcoal-700 border-ivory-300'
                                  : (p.visibilityStatus === 'hidden'
                                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                                    : 'bg-red-50 text-red-700 border-red-300'))
                            }`}
                          >
                            <option value="published">منشور بالمتجر</option>
                            <option value="draft">مسودة</option>
                            <option value="hidden">مخفي</option>
                            <option value="out_of_stock">نفد المخزون</option>
                          </select>
                        </td>

                        <td className="p-4 text-left">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openProductModal(p)}
                              className="p-2 bg-ivory-100 hover:bg-gold-100 text-zaad-900 rounded-xl transition-colors"
                              title="تعديل المحصول"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.nameAr)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                              title="حذف المحصول"
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

      {/* COMPREHENSIVE PRODUCT MODAL / DRAWER */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-zaad-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-ivory-300 shadow-2xl overflow-hidden my-8 animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-zaad-950 text-ivory-50 p-6 flex items-center justify-between border-b border-zaad-800">
              <div>
                <span className="text-xs text-gold-400 font-bold block">محرر بيانات المنتجات والكتالوج الملكي</span>
                <h3 className="font-serif text-xl font-bold">
                  {editingProduct ? `تعديل المحصول: ${editingProduct.nameAr}` : 'إضافة محصول ملكي جديد'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="w-9 h-9 rounded-full bg-zaad-800 text-ivory-200 hover:bg-zaad-700 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex bg-ivory-100 border-b border-ivory-200 p-2 overflow-x-auto gap-2">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modalTab === 'basic' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                }`}
              >
                البيانات الأساسية والتصنيف
              </button>
              <button
                type="button"
                onClick={() => setModalTab('pricing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modalTab === 'pricing' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                }`}
              >
                التسعير والتكلفة وهامش الربح
              </button>
              <button
                type="button"
                onClick={() => setModalTab('inventory')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modalTab === 'inventory' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                }`}
              >
                المخزون وحالة الظهور
              </button>
              <button
                type="button"
                onClick={() => setModalTab('media')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modalTab === 'media' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                }`}
              >
                معرض الصور والوسائط ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('lab')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  modalTab === 'lab' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                }`}
              >
                شهادة فحص النقاء والمختبر
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              
              {/* TAB 1: BASIC INFO */}
              {modalTab === 'basic' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">اسم المنتج باللغة العربية *</label>
                      <input
                        type="text"
                        required
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        placeholder="مثال: عسل السدر الدوعني الملكي الفاخر"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">Product English Name</label>
                      <input
                        type="text"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="e.g. Royal Doan Sidr Honey"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">الرابط المخصص (Slug)</label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="royal-doan-sidr"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">رمز المنتج (SKU) *</label>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="ZD-SIDR-01"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">شارة التميز (Badge)</label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="مثال: إصدار ملكي خاص / الأكثر طلباً"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">التصنيف الرئيسي *</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-bold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.nameAr}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">الفئة الفرعية (اختياري)</label>
                      <select
                        value={subcategoryId}
                        onChange={(e) => setSubcategoryId(e.target.value)}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      >
                        <option value="">بدون فئة فرعية</option>
                        {subcategories
                          .filter(s => !categoryId || s.categoryId === categoryId)
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.nameAr}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">الشعار التسويقي (Tagline)</label>
                    <input
                      type="text"
                      value={taglineAr}
                      onChange={(e) => setTaglineAr(e.target.value)}
                      placeholder="عسل نقي من أودية حضرموت التاريخية"
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">الوصف المختصر *</label>
                    <textarea
                      rows={2}
                      required
                      value={shortDescAr}
                      onChange={(e) => setShortDescAr(e.target.value)}
                      placeholder="وصف فاخر يظهر في بطاقات المتجر..."
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">قصة المحصول وتفاصيله الكاملة</label>
                    <textarea
                      rows={4}
                      value={fullStoryAr}
                      onChange={(e) => setFullStoryAr(e.target.value)}
                      placeholder="تفاصيل الحصاد، المناحل الجبلية، الخصائص العلاجية..."
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & COST TRACKING */}
              {modalTab === 'pricing' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">سعر البيع النهائي (ج.م - EGP) *</label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-base font-bold font-mono text-zaad-900 focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">السعر المقارن قبل الخصم (اختياري)</label>
                      <input
                        type="number"
                        value={compareAtPrice || ''}
                        onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="مثال: 650"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-base font-mono focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">تكلفة المنتج على الشركة (Cost Price - ج.م) *</label>
                      <input
                        type="number"
                        required
                        value={costPrice}
                        onChange={(e) => setCostPrice(Number(e.target.value))}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-base font-bold font-mono text-charcoal-700 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Real-time Profit Preview Card */}
                  <div className="bg-gradient-to-br from-zaad-950 to-zaad-900 text-ivory-100 p-6 rounded-3xl border border-zaad-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-zaad-800 pb-3">
                      <span className="font-bold text-gold-400 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>محاكاة الربحية اللحظية للمنتج</span>
                      </span>
                      <span className="text-[10px] text-ivory-400 font-mono">LIVE MARGIN ESTIMATOR</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-zaad-900/60 p-3 rounded-2xl border border-zaad-800">
                        <span className="text-ivory-400 block text-[10px]">سعر البيع</span>
                        <span className="font-mono text-lg font-bold text-ivory-50">{formatPrice(price)}</span>
                      </div>
                      <div className="bg-zaad-900/60 p-3 rounded-2xl border border-zaad-800">
                        <span className="text-ivory-400 block text-[10px]">التكلفة المباشرة</span>
                        <span className="font-mono text-lg font-bold text-amber-400">{formatPrice(costPrice)}</span>
                      </div>
                      <div className="bg-gold-500/10 p-3 rounded-2xl border border-gold-500/30">
                        <span className="text-gold-400 block text-[10px]">صافي الربح لكل وحدة</span>
                        <span className="font-mono text-lg font-bold text-gold-400">{formatPrice(liveGrossProfit)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zaad-800/80">
                      <span className="text-xs text-ivory-300">هامش الربح الإجمالي (Profit Margin):</span>
                      <span className={`font-mono text-base font-bold px-3 py-1 rounded-full ${
                        liveMarginPercent >= 50 ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {liveMarginPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY & VISIBILITY */}
              {modalTab === 'inventory' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">كمية المخزون الإجمالية *</label>
                      <input
                        type="number"
                        required
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(Number(e.target.value))}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono font-bold text-base focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">حد التنبيه عند نقص المخزون</label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">وزن العبوة (جرام)</label>
                      <input
                        type="number"
                        value={weightGrams}
                        onChange={(e) => setWeightGrams(Number(e.target.value))}
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">حالة نشر وظهور المنتج بالمتجر *</label>
                    <select
                      value={visibilityStatus}
                      onChange={(e) => setVisibilityStatus(e.target.value as ProductVisibility)}
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-bold text-xs focus:border-gold-500 focus:outline-none"
                    >
                      <option value="published">منشور بالمتجر (متاح للطلب المباشر)</option>
                      <option value="draft">مسودة (غير ظاهر للجمهور - قيد الإعداد)</option>
                      <option value="hidden">مخفي (معطل ومحجوب عن المتجر)</option>
                      <option value="out_of_stock">نفد المخزون (يظهر كنفد)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-ivory-50 rounded-2xl border border-ivory-200">
                    <div>
                      <span className="font-bold text-zaad-900 block">عرض كمنتج مميز بالصفحة الرئيسية (Featured)</span>
                      <span className="text-[11px] text-charcoal-700/60">سيظهر في الواجهة الأولى وصناديق التوصية الملكية</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 text-gold-600 rounded"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA GALLERY */}
              {modalTab === 'media' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل رابط صورة جديدة (URL)..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-zaad-900 text-gold-400 px-4 rounded-xl font-bold hover:bg-zaad-800"
                    >
                      إضافة صورة
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden bg-ivory-100 border-2 border-ivory-300 group aspect-square">
                        <Image src={img} alt={`Product ${idx}`} fill className="object-cover" />
                        
                        {idx === 0 && (
                          <span className="absolute top-2 right-2 bg-gold-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md">
                            الصورة الرئيسية
                          </span>
                        )}

                        <div className="absolute inset-0 bg-zaad-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity p-2 text-center">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetFeaturedImage(idx)}
                              className="bg-gold-500 text-zaad-950 px-2 py-1 rounded text-[10px] font-bold"
                            >
                              تعيين كرئيسية
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: LAB CERTIFICATION */}
              {modalTab === 'lab' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">رقم التشغيلة المخبرية (Batch Number)</label>
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        placeholder="ZD-2026-SD01"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 font-mono font-bold focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">موسم الحصاد الملكي</label>
                      <input
                        type="text"
                        value={harvestSeason}
                        onChange={(e) => setHarvestSeason(e.target.value)}
                        placeholder="المحصول الملكي 2026"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-zaad-900 mb-1">اسم المختبر المعتمد</label>
                    <input
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      placeholder="مختبر الجودة الأوروبية المعتمد"
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1 text-[11px]">نسبة الرطوبة % (&lt; 20%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={moisturePercentage}
                        onChange={(e) => setMoisturePercentage(Number(e.target.value))}
                        className="w-full bg-white border border-ivory-300 rounded-xl p-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1 text-[11px]">مستوى HMF (&lt; 80)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={hmfLevel}
                        onChange={(e) => setHmfLevel(Number(e.target.value))}
                        className="w-full bg-white border border-ivory-300 rounded-xl p-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1 text-[11px]">نشاط الدياستيز (&gt; 8)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={diastaseActivity}
                        onChange={(e) => setDiastaseActivity(Number(e.target.value))}
                        className="w-full bg-white border border-ivory-300 rounded-xl p-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zaad-900 mb-1 text-[11px]">نقاء حبوب اللقاح %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pollenPurityPercentage}
                        onChange={(e) => setPollenPurityPercentage(Number(e.target.value))}
                        className="w-full bg-white border border-ivory-300 rounded-xl p-2 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 bg-ivory-100 text-xs font-bold rounded-xl text-charcoal-700 hover:bg-ivory-200 transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  {editingProduct ? 'حفظ التعديلات في Supabase' : 'إيداع المحصول بالكتالوج'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
