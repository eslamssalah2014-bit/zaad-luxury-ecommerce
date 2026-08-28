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
  Info,
  UploadCloud,
  ImagePlus,
  Star,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MoveRight,
  MoveLeft,
  FileEdit,
  Droplet,
  Feather,
  MapPin,
  HelpCircle,
  Quote,
  ArrowUp,
  ArrowDown,
  HeartHandshake,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Product, Category, Subcategory, ProductVisibility } from '@/types';
import { ProductAttribute, ProductTab, ProductContentBlock } from '@/types/cms';
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
  const [modalTab, setModalTab] = useState<'basic' | 'pricing' | 'attributes' | 'cms_tabs' | 'inventory' | 'media' | 'benefits'>('basic');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Upload State
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
  const [usageInstructionsAr, setUsageInstructionsAr] = useState('');
  const [storageInstructionsAr, setStorageInstructionsAr] = useState('يحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة');
  const [images, setImages] = useState<string[]>(['/images/zaad-logo.png']);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [visibilityStatus, setVisibilityStatus] = useState<ProductVisibility>('published');
  const [badge, setBadge] = useState('');

  // Dynamic CMS Fields
  const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([]);
  const [productTabs, setProductTabs] = useState<ProductTab[]>([]);
  const [customShippingMessage, setCustomShippingMessage] = useState('');
  const [customVatMessage, setCustomVatMessage] = useState('');
  const [customTrustBadgeText, setCustomTrustBadgeText] = useState('');

  // Product-Specific Health Benefits (1 to 4)
  const [healthBenefit1Title, setHealthBenefit1Title] = useState('');
  const [healthBenefit1Desc, setHealthBenefit1Desc] = useState('');
  const [healthBenefit2Title, setHealthBenefit2Title] = useState('');
  const [healthBenefit2Desc, setHealthBenefit2Desc] = useState('');
  const [healthBenefit3Title, setHealthBenefit3Title] = useState('');
  const [healthBenefit3Desc, setHealthBenefit3Desc] = useState('');
  const [healthBenefit4Title, setHealthBenefit4Title] = useState('');
  const [healthBenefit4Desc, setHealthBenefit4Desc] = useState('');

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
      setOriginRegionAr(prod.originRegionAr || '');
      setOriginRegionEn(prod.originRegionEn || '');
      setFloralSourceAr(prod.floralSourceAr || '');
      setFloralSourceEn(prod.floralSourceEn || '');
      setShortDescAr(prod.shortDescAr);
      setFullStoryAr(prod.fullStoryAr);
      setUsageInstructionsAr(prod.usageInstructionsAr || '');
      setStorageInstructionsAr(prod.storageInstructionsAr || 'يحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة');
      setImages(prod.images?.length > 0 ? prod.images : ['/images/zaad-logo.png']);
      setIsFeatured(prod.isFeatured);
      setVisibilityStatus(prod.visibilityStatus || 'published');
      setBadge(prod.badge || '');

      // Health Benefits
      setHealthBenefit1Title(prod.healthBenefit1Title || prod.healthBenefits?.[0]?.title || (typeof prod.healthBenefitsAr?.[0] === 'string' ? prod.healthBenefitsAr[0] : (prod.healthBenefitsAr?.[0] as any)?.title) || '');
      setHealthBenefit1Desc(prod.healthBenefit1Desc || prod.healthBenefits?.[0]?.description || (prod.healthBenefitsAr?.[0] as any)?.description || '');
      setHealthBenefit2Title(prod.healthBenefit2Title || prod.healthBenefits?.[1]?.title || (typeof prod.healthBenefitsAr?.[1] === 'string' ? prod.healthBenefitsAr[1] : (prod.healthBenefitsAr?.[1] as any)?.title) || '');
      setHealthBenefit2Desc(prod.healthBenefit2Desc || prod.healthBenefits?.[1]?.description || (prod.healthBenefitsAr?.[1] as any)?.description || '');
      setHealthBenefit3Title(prod.healthBenefit3Title || prod.healthBenefits?.[2]?.title || (typeof prod.healthBenefitsAr?.[2] === 'string' ? prod.healthBenefitsAr[2] : (prod.healthBenefitsAr?.[2] as any)?.title) || '');
      setHealthBenefit3Desc(prod.healthBenefit3Desc || prod.healthBenefits?.[2]?.description || (prod.healthBenefitsAr?.[2] as any)?.description || '');
      setHealthBenefit4Title(prod.healthBenefit4Title || prod.healthBenefits?.[3]?.title || (typeof prod.healthBenefitsAr?.[3] === 'string' ? prod.healthBenefitsAr[3] : (prod.healthBenefitsAr?.[3] as any)?.title) || '');
      setHealthBenefit4Desc(prod.healthBenefit4Desc || prod.healthBenefits?.[3]?.description || (prod.healthBenefitsAr?.[3] as any)?.description || '');

      // Dynamic CMS Attributes & Tabs (Preserve empty arrays)
      if (Array.isArray(prod.attributes)) {
        setProductAttributes(prod.attributes);
      } else if (Array.isArray(prod.sensoryProfile?.attributes)) {
        setProductAttributes(prod.sensoryProfile.attributes);
      } else {
        setProductAttributes([]);
      }

      if (Array.isArray(prod.tabs)) {
        setProductTabs(prod.tabs);
      } else if (Array.isArray(prod.sensoryProfile?.tabs)) {
        setProductTabs(prod.sensoryProfile.tabs);
      } else {
        setProductTabs([]);
      }

      setCustomShippingMessage(prod.customShippingMessage || '');
      setCustomVatMessage(prod.customVatMessage || '');
      setCustomTrustBadgeText(prod.customTrustBadgeText || '');
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
      setOriginRegionAr('');
      setOriginRegionEn('');
      setFloralSourceAr('');
      setFloralSourceEn('');
      setShortDescAr('');
      setFullStoryAr('');
      setUsageInstructionsAr('');
      setStorageInstructionsAr('يحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة');
      setImages(['/images/zaad-logo.png']);
      setIsFeatured(false);
      setVisibilityStatus('published');
      setBadge('');

      // Reset Health Benefits
      setHealthBenefit1Title('');
      setHealthBenefit1Desc('');
      setHealthBenefit2Title('');
      setHealthBenefit2Desc('');
      setHealthBenefit3Title('');
      setHealthBenefit3Desc('');
      setHealthBenefit4Title('');
      setHealthBenefit4Desc('');

      // Dynamic CMS Attributes & Tabs
      setProductAttributes([
        { id: 'attr-1', nameAr: 'اللون', valueAr: 'عنبري ذهبي نقي', icon: 'droplet', isVisible: true, order: 1 },
        { id: 'attr-2', nameAr: 'الرائحة', valueAr: 'عطرية زهرية دافئة', icon: 'sparkles', isVisible: true, order: 2 },
        { id: 'attr-3', nameAr: 'القوام', valueAr: 'حريري كثيف ومتماسك', icon: 'feather', isVisible: true, order: 3 },
        { id: 'attr-6', nameAr: 'الوزن الصافي', valueAr: '500 جرام', icon: 'package', isVisible: true, order: 6 },
      ]);
      setProductTabs([]);
      setCustomShippingMessage('');
      setCustomVatMessage('');
      setCustomTrustBadgeText('');
    }
    setProductModalOpen(true);
  };

  // Direct Image File Upload
  const handleFileUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);

    try {
      const formData = new FormData();
      let count = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          showNotification('error', `حجم الملف (${file.name}) يتجاوز 10 ميجابايت.`);
          setUploadingImages(false);
          return;
        }
        formData.append('files', file);
        count++;
      }

      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.urls) && json.urls.length > 0) {
        setImages((prev) => {
          const isOnlyPlaceholder = prev.length === 1 && prev[0] === '/images/zaad-logo.png';
          return isOnlyPlaceholder ? json.urls : [...prev, ...json.urls];
        });
        showNotification('success', `تم رفع ${json.urls.length} صورة بنجاح وإضافتها للمنتج.`);
      } else {
        showNotification('error', json.error || 'فشل رفع الصور.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      showNotification('error', err?.message || 'حدث خطأ أثناء رفع الصور.');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add Manual Image URL (Optional)
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => {
      const isOnlyPlaceholder = prev.length === 1 && prev[0] === '/images/zaad-logo.png';
      return isOnlyPlaceholder ? [newImageUrl.trim()] : [...prev, newImageUrl.trim()];
    });
    setNewImageUrl('');
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated.length > 0 ? updated : ['/images/zaad-logo.png']);
  };

  // Set Featured / Primary Image (Moves to index 0)
  const handleSetFeaturedImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
    showNotification('success', 'تم تعيين الصورة كصورة رئيسية للمنتج.');
  };

  // Move Image Position (Reorder)
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    // In RTL display: 'left' moves to higher index, 'right' moves to lower index
    const newIndex = direction === 'left' ? index + 1 : index - 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setImages(updated);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // Step 1: Pre-validation with friendly Tab redirection
    if (!nameAr || nameAr.trim() === '') {
      showNotification('error', 'يرجى إدخال اسم المنتج باللغة العربية');
      setModalTab('basic');
      return;
    }

    if (!sku || sku.trim() === '') {
      showNotification('error', 'يرجى إدخال رمز SKU للمنتج');
      setModalTab('basic');
      return;
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      showNotification('error', 'يرجى إدخال سعر بيع صحيح للمنتج');
      setModalTab('pricing');
      return;
    }

    setIsSaving(true);

    try {
      const generatedSlug = slug
        ? slug.toLowerCase().trim().replace(/\s+/g, '-')
        : (nameEn ? nameEn.toLowerCase().trim().replace(/\s+/g, '-') : (nameAr || 'product').toLowerCase().trim().replace(/\s+/g, '-'));

      const payload = {
        id: editingProduct?.id,
        nameAr: nameAr.trim(),
        nameEn: nameEn?.trim() || nameAr.trim(),
        slug: generatedSlug,
        sku: sku.trim().toUpperCase(),
        taglineAr: taglineAr?.trim() || null,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        costPrice: Number(costPrice || Math.round(Number(price) * 0.45)),
        currency: 'EGP',
        stockQuantity: Number(stockQuantity ?? 0),
        lowStockThreshold: Number(lowStockThreshold ?? 5),
        weightGrams: Number(weightGrams ?? 500),
        originRegionAr: originRegionAr || 'وادي دوعن، حضرموت',
        originRegionEn: originRegionEn || 'Doan Valley, Hadramout',
        floralSourceAr: floralSourceAr || 'أشجار ومروج برية',
        floralSourceEn: floralSourceEn || 'Wild Flora',
        shortDescAr: shortDescAr?.trim() || nameAr.trim(),
        fullStoryAr: fullStoryAr?.trim() || shortDescAr?.trim() || nameAr.trim(),
        healthBenefit1Title: healthBenefit1Title?.trim() || '',
        healthBenefit1Desc: healthBenefit1Desc?.trim() || '',
        healthBenefit2Title: healthBenefit2Title?.trim() || '',
        healthBenefit2Desc: healthBenefit2Desc?.trim() || '',
        healthBenefit3Title: healthBenefit3Title?.trim() || '',
        healthBenefit3Desc: healthBenefit3Desc?.trim() || '',
        healthBenefit4Title: healthBenefit4Title?.trim() || '',
        healthBenefit4Desc: healthBenefit4Desc?.trim() || '',
        usageInstructionsAr: usageInstructionsAr?.trim() || null,
        storageInstructionsAr: storageInstructionsAr?.trim() || null,
        images: Array.isArray(images) && images.length > 0 ? images : ['/images/zaad-logo.png'],
        isFeatured: Boolean(isFeatured),
        isAvailable: visibilityStatus === 'published' || visibilityStatus === 'out_of_stock',
        visibilityStatus: visibilityStatus || 'published',
        badge: badge?.trim() || null,
        attributes: Array.isArray(productAttributes) ? productAttributes : [],
        tabs: Array.isArray(productTabs) ? productTabs : [],
        customShippingMessage: customShippingMessage?.trim() || null,
        customVatMessage: customVatMessage?.trim() || null,
        customTrustBadgeText: customTrustBadgeText?.trim() || null
      };

      console.log('[CMS Product Editor Save Pipeline] Starting save execution...');
      console.log('[CMS Product Editor Save Pipeline] Product ID:', payload.id || 'NEW_PRODUCT');
      console.log('[CMS Product Editor Save Pipeline] Submitted payload:', payload);
      console.log('[CMS Product Editor Save Pipeline] Dynamic attributes payload:', {
        count: payload.attributes.length,
        items: payload.attributes
      });

      const res = await adminFetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('[CMS Product Editor Save Pipeline] HTTP Response Status:', res.status, res.statusText);

      const json = await res.json();
      console.log('[CMS Product Editor Save Pipeline] API response body:', json);

      if (json.success) {
        console.log('[CMS Product Editor Save Pipeline] Database update SUCCESS for ID:', json.data?.id || payload.id);
        showNotification('success', editingProduct ? 'تم حفظ وتحديث بيانات المنتج والخصائص الحيوية بنجاح' : 'تم إضافة المنتج الجديد بنجاح');
        setProductModalOpen(false);
        await loadData();
      } else {
        console.error('[CMS Product Editor Save Pipeline Error] API returned error:', json.error);
        showNotification('error', json.error || 'فشل حفظ المنتج في قاعدة البيانات');
      }
    } catch (err: any) {
      console.error('[CMS Product Editor Save Pipeline Exception]:', err);
      showNotification('error', err?.message || 'حدث خطأ غير متوقع أثناء الحفظ');
    } finally {
      setIsSaving(false);
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
            <span>نظام إدارة المنتجات والتسعير المتقدم (CMS)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
            كتالوج المنتجات الطبيعية
          </h1>
        </div>

        <button
          onClick={() => openProductModal()}
          className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 px-5 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج طبيعي جديد</span>
        </button>
      </div>

      {/* Global High-Priority Notification Toast (Rendered above modals) */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[90%] p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-2xl animate-fade-in border backdrop-blur-xl ${
          notification.type === 'success'
            ? 'bg-green-950/90 border-green-500/60 text-green-200'
            : 'bg-red-950/95 border-red-500/70 text-red-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="leading-relaxed">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-ivory-400 hover:text-white p-1 rounded-lg transition-colors text-base font-bold"
          >
            ✕
          </button>
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
                              <Image src={p.images[0] || '/images/zaad-logo.png'} alt={p.nameAr} fill unoptimized className="object-cover" />
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
                          <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${margin >= 50 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
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
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${p.visibilityStatus === 'published'
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
                <span className="text-xs text-gold-400 font-bold block">محرر بيانات المنتجات والكتالوج الطبيعي</span>
                <h3 className="font-serif text-xl font-bold">
                  {editingProduct ? `تعديل المنتج: ${editingProduct.nameAr}` : 'إضافة منتج طبيعي جديد'}
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'basic' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                البيانات الأساسية
              </button>
              <button
                type="button"
                onClick={() => setModalTab('pricing')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'pricing' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                التسعير والرسائل
              </button>
              <button
                type="button"
                onClick={() => setModalTab('attributes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'attributes' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                الخصائص الحيوية ({productAttributes.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('cms_tabs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'cms_tabs' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                التبويبات والمحتوى ({productTabs.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('inventory')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'inventory' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                المخزون والظهور
              </button>
              <button
                type="button"
                onClick={() => setModalTab('media')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'media' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                معرض الصور ({images.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('benefits')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${modalTab === 'benefits' ? 'bg-zaad-900 text-gold-400 shadow-sm' : 'text-charcoal-700 hover:text-zaad-900'
                  }`}
              >
                الفوائد والاستخدام والتخزين
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
                    <label className="block font-bold text-zaad-900 mb-1">قصة المنتج وتفاصيله الكاملة</label>
                    <textarea
                      rows={3}
                      value={fullStoryAr}
                      onChange={(e) => setFullStoryAr(e.target.value)}
                      placeholder="تفاصيل الحصاد، البيئة الطبيعية، الخصائص العلاجية..."
                      className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">إرشادات الاستخدام والتناول (Usage Instructions)</label>
                      <textarea
                        rows={2}
                        value={usageInstructionsAr}
                        onChange={(e) => setUsageInstructionsAr(e.target.value)}
                        placeholder="مثال: يؤخذ ملعقة صباحاً على الريق مع ماء فاتر..."
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-zaad-900 mb-1">إرشادات حفظ النقاء (Storage Instructions)</label>
                      <textarea
                        rows={2}
                        value={storageInstructionsAr}
                        onChange={(e) => setStorageInstructionsAr(e.target.value)}
                        placeholder="يحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة"
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & COMMERCIAL MESSAGES */}
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
                      <span className={`font-mono text-base font-bold px-3 py-1 rounded-full ${liveMarginPercent >= 50 ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                        {liveMarginPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Custom Commercial Message Overrides */}
                  <div className="border-t border-ivory-300 pt-4 space-y-4">
                    <h4 className="font-bold text-zaad-900 text-xs">تخصيص الرسائل التجارية الخاصة بهذا المنتج (اختياري لتجاوز الإعداد العام):</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-charcoal-700 mb-1">رسالة الشحن المخصصة:</label>
                        <input
                          type="text"
                          value={customShippingMessage}
                          onChange={(e) => setCustomShippingMessage(e.target.value)}
                          placeholder="افتراضي CMS العام"
                          className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-charcoal-700 mb-1">رسالة الضريبة المخصصة:</label>
                        <input
                          type="text"
                          value={customVatMessage}
                          onChange={(e) => setCustomVatMessage(e.target.value)}
                          placeholder="افتراضي CMS العام"
                          className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-charcoal-700 mb-1">وسام الثقة المخصص:</label>
                        <input
                          type="text"
                          value={customTrustBadgeText}
                          onChange={(e) => setCustomTrustBadgeText(e.target.value)}
                          placeholder="افتراضي CMS العام"
                          className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-2.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DYNAMIC ATTRIBUTES BUILDER */}
              {modalTab === 'attributes' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 pb-3">
                    <div>
                      <h4 className="font-bold text-zaad-900 text-sm">الخصائص الحيوية للمنتج (Dynamic Attributes)</h4>
                      <p className="text-[11px] text-charcoal-700/70">أضف خصائص غير محدودة مثل اللون، الرائحة، القوام، المصدر، بلد المنشأ</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {productAttributes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من رغبتك في حذف جميع الخصائص؟')) {
                              console.log('[CMS Product Editor] User deleted all attributes');
                              setProductAttributes([]);
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف جميع الخصائص</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const newAttr: ProductAttribute = {
                            id: `attr-${Date.now()}`,
                            nameAr: 'خاصية جديدة',
                            valueAr: 'القيمة',
                            icon: 'sparkles',
                            isVisible: true,
                            order: productAttributes.length + 1
                          };
                          console.log('[CMS Product Editor] Adding new attribute:', newAttr);
                          setProductAttributes([...productAttributes, newAttr]);
                        }}
                        className="px-3.5 py-1.5 bg-zaad-800 text-white rounded-xl text-xs font-bold hover:bg-zaad-700 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 text-gold-400" />
                        <span>إضافة خاصية</span>
                      </button>
                    </div>
                  </div>

                  {productAttributes.length === 0 ? (
                    <div className="text-center py-10 bg-ivory-50 rounded-2xl border-2 border-dashed border-ivory-300 space-y-2">
                      <p className="text-xs font-bold text-zaad-900">لا توجد أي خصائص مضافة لهذا المنتج حالياً (قائمة فارغة).</p>
                      <p className="text-[11px] text-charcoal-700/60 max-w-md mx-auto">
                        يمكنك حفظ المنتج بدون أي خصائص، أو الضغط على زر &quot;إضافة خاصية&quot; أعلاه لإنشاء خصائص مخصصة.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {productAttributes.map((attr, aIdx) => (
                        <div key={attr.id || aIdx} className="p-3 bg-ivory-50 border border-ivory-300 rounded-2xl flex flex-wrap items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white border border-ivory-300 flex items-center justify-center font-bold text-xs">
                            {aIdx + 1}
                          </span>

                          <div className="flex-1 min-w-[130px]">
                            <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">اسم الخاصية:</label>
                            <input
                              type="text"
                              value={attr.nameAr}
                              onChange={(e) => {
                                const updated = [...productAttributes];
                                updated[aIdx] = { ...updated[aIdx], nameAr: e.target.value };
                                setProductAttributes(updated);
                              }}
                              className="w-full bg-white border border-ivory-300 rounded-lg p-1.5 font-bold text-xs"
                              placeholder="اللون"
                            />
                          </div>

                          <div className="flex-1 min-w-[160px]">
                            <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">القيمة:</label>
                            <input
                              type="text"
                              value={attr.valueAr}
                              onChange={(e) => {
                                const updated = [...productAttributes];
                                updated[aIdx] = { ...updated[aIdx], valueAr: e.target.value };
                                setProductAttributes(updated);
                              }}
                              className="w-full bg-white border border-ivory-300 rounded-lg p-1.5 text-xs"
                              placeholder="عنبري ذهبي"
                            />
                          </div>

                          <div className="w-28">
                            <label className="block text-[10px] font-bold text-charcoal-700 mb-0.5">الأيقونة:</label>
                            <select
                              value={attr.icon || 'sparkles'}
                              onChange={(e) => {
                                const updated = [...productAttributes];
                                updated[aIdx] = { ...updated[aIdx], icon: e.target.value };
                                setProductAttributes(updated);
                              }}
                              className="w-full bg-white border border-ivory-300 rounded-lg p-1.5 text-xs"
                            >
                              <option value="sparkles">✨ بريق</option>
                              <option value="droplet">💧 قطرة / لون</option>
                              <option value="feather">🪶 قوام</option>
                              <option value="map-pin">📍 موطن</option>
                              <option value="shield">🛡️ حماية</option>
                              <option value="award">🏅 جودة</option>
                              <option value="package">📦 عبوة</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5 pt-2 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (aIdx === 0) return;
                                const updated = [...productAttributes];
                                const temp = updated[aIdx - 1];
                                updated[aIdx - 1] = updated[aIdx];
                                updated[aIdx] = temp;
                                setProductAttributes(updated);
                              }}
                              disabled={aIdx === 0}
                              className="p-1.5 bg-white border border-ivory-300 rounded-lg disabled:opacity-30"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (aIdx === productAttributes.length - 1) return;
                                const updated = [...productAttributes];
                                const temp = updated[aIdx + 1];
                                updated[aIdx + 1] = updated[aIdx];
                                updated[aIdx] = temp;
                                setProductAttributes(updated);
                              }}
                              disabled={aIdx === productAttributes.length - 1}
                              className="p-1.5 bg-white border border-ivory-300 rounded-lg disabled:opacity-30"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                console.log('[CMS Product Editor] Deleting attribute at index:', aIdx);
                                setProductAttributes(productAttributes.filter((_, i) => i !== aIdx));
                              }}
                              className="p-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DYNAMIC TABS & CONTENT BLOCKS BUILDER */}
              {modalTab === 'cms_tabs' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
                    <div>
                      <h4 className="font-bold text-zaad-900 text-sm">التبويبات والمحتوى المخصص لهذا المنتج (Tabs & Blocks)</h4>
                      <p className="text-[11px] text-charcoal-700/70">إذا تركت فارغة، سيتم تطبيق القالب الافتراضي المعتمد في CMS العام تلقائياً.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProductTabs([
                          ...productTabs,
                          {
                            id: `tab-${Date.now()}`,
                            slug: `tab-${productTabs.length + 1}`,
                            titleAr: 'تبويب مخصص',
                            isVisible: true,
                            order: productTabs.length + 1,
                            blocks: [
                              {
                                id: `blk-${Date.now()}`,
                                type: 'rich_text',
                                titleAr: 'عنوان المحتوى',
                                bodyAr: 'نص المحتوى التوضيحي...',
                                isVisible: true,
                                order: 1
                              }
                            ]
                          }
                        ]);
                      }}
                      className="px-3.5 py-1.5 bg-gold-500 text-zaad-950 rounded-xl text-xs font-bold hover:bg-gold-400 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة تبويب مخصص</span>
                    </button>
                  </div>

                  {productTabs.length === 0 ? (
                    <div className="text-center py-8 bg-ivory-50 rounded-2xl border border-ivory-200 text-xs text-charcoal-700/70 space-y-1">
                      <p className="font-bold text-zaad-900">هذا المنتج يستخدم التبويبات الافتراضية من لوحة CMS العامة.</p>
                      <p>اضغط على زر &ldquo;إضافة تبويب مخصص&rdquo; إذا كنت ترغب في تخصيص تبويبات وبلوكات فريدة خاصة بهذا المنتج فقط.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {productTabs.map((tab, tIdx) => (
                        <div key={tab.id || tIdx} className="p-4 bg-ivory-50 border border-ivory-300 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-6 h-6 rounded-lg bg-zaad-900 text-gold-300 flex items-center justify-center font-bold text-xs">
                                {tIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={tab.titleAr}
                                onChange={(e) => {
                                  const updated = [...productTabs];
                                  updated[tIdx] = { ...updated[tIdx], titleAr: e.target.value };
                                  setProductTabs(updated);
                                }}
                                className="bg-white border border-ivory-300 rounded-lg px-2.5 py-1 font-bold text-xs"
                                placeholder="عنوان التبويب"
                              />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...productTabs];
                                  const blocks = [...(updated[tIdx].blocks || [])];
                                  blocks.push({
                                    id: `blk-${Date.now()}`,
                                    type: 'rich_text',
                                    titleAr: 'عنوان المحتوى',
                                    bodyAr: 'أدخل النص...',
                                    isVisible: true,
                                    order: blocks.length + 1
                                  });
                                  updated[tIdx] = { ...updated[tIdx], blocks };
                                  setProductTabs(updated);
                                }}
                                className="px-2 py-1 bg-white border border-ivory-300 rounded text-[10px] font-bold"
                              >
                                + بلوك نص
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProductTabs(productTabs.filter((_, i) => i !== tIdx));
                                }}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Tab Blocks */}
                          <div className="space-y-2">
                            {(tab.blocks || []).map((blk, bIdx) => (
                              <div key={blk.id || bIdx} className="p-2.5 bg-white border border-ivory-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[11px] text-zaad-900">بلوك #{bIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...productTabs];
                                      const blocks = (updated[tIdx].blocks || []).filter((_, i) => i !== bIdx);
                                      updated[tIdx] = { ...updated[tIdx], blocks };
                                      setProductTabs(updated);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={blk.titleAr || ''}
                                  onChange={(e) => {
                                    const updated = [...productTabs];
                                    const blocks = [...(updated[tIdx].blocks || [])];
                                    blocks[bIdx] = { ...blocks[bIdx], titleAr: e.target.value };
                                    updated[tIdx] = { ...updated[tIdx], blocks };
                                    setProductTabs(updated);
                                  }}
                                  placeholder="عنوان البلوك..."
                                  className="w-full bg-ivory-50 border border-ivory-300 rounded px-2 py-1 text-xs font-bold"
                                />
                                <textarea
                                  rows={2}
                                  value={blk.bodyAr || ''}
                                  onChange={(e) => {
                                    const updated = [...productTabs];
                                    const blocks = [...(updated[tIdx].blocks || [])];
                                    blocks[bIdx] = { ...blocks[bIdx], bodyAr: e.target.value };
                                    updated[tIdx] = { ...updated[tIdx], blocks };
                                    setProductTabs(updated);
                                  }}
                                  placeholder="نص البلوك..."
                                  className="w-full bg-ivory-50 border border-ivory-300 rounded px-2 py-1 text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: INVENTORY & VISIBILITY */}
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

              {/* TAB 4: MEDIA GALLERY & CLOUD STORAGE UPLOAD */}
              {modalTab === 'media' && (
                <div className="space-y-6 animate-fade-in">

                  {/* Direct File Upload & Drag-and-Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFileUpload(e.dataTransfer.files);
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${dragOver
                      ? 'border-gold-500 bg-gold-500/10 scale-[1.01]'
                      : 'border-ivory-300 bg-ivory-50/70 hover:border-gold-400 hover:bg-ivory-100/50'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-600 shadow-inner">
                        {uploadingImages ? (
                          <Loader2 className="w-8 h-8 animate-spin text-gold-600" />
                        ) : (
                          <UploadCloud className="w-8 h-8" />
                        )}
                      </div>

                      {uploadingImages ? (
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-zaad-900">جاري معالجة ورفع الصور إلى السحابة (Supabase Storage)...</p>
                          <p className="text-xs text-charcoal-700/60 font-mono">يرجى الانتظار بضع ثوانٍ</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="font-bold text-base text-zaad-900">
                            رفع صور المنتج مباشرة من جهاز الكمبيوتر
                          </h4>
                          <p className="text-xs text-charcoal-700/70 max-w-md mx-auto">
                            اسحب الصور وأفلتها هنا مباشرة، أو اضغط على الزر أدناه لتحديد الصور من جهازك
                          </p>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-gradient-to-r from-zaad-900 to-zaad-950 text-gold-400 hover:text-gold-300 font-bold px-6 py-2.5 rounded-xl text-xs border border-gold-500/40 shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
                            >
                              <ImagePlus className="w-4 h-4" />
                              <span>اختيار صور من الجهاز (Upload Images)</span>
                            </button>
                          </div>

                          <div className="pt-2 text-[11px] text-charcoal-700/60 flex items-center justify-center gap-4">
                            <span>الصيغ المدعومة: JPG, PNG, WEBP</span>
                            <span>•</span>
                            <span>الحد الأقصى للملف: 10 ميجابايت</span>
                            <span>•</span>
                            <span>يدعم رفع عدة صور معاً</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Gallery Preview Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zaad-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-gold-600" />
                        <span>معرض صور المحصول المعتمدة ({images.length} صور):</span>
                      </span>
                      <span className="text-[11px] text-charcoal-700/60">
                        الصورة الأولى هي الصورة الرئيسية التي تظهر في المتجر
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-2xl overflow-hidden bg-ivory-100 border-2 transition-all group aspect-square flex flex-col justify-between ${idx === 0
                            ? 'border-gold-500 ring-2 ring-gold-400/30 shadow-md'
                            : 'border-ivory-300 hover:border-gold-300'
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`Product Media ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />

                          {/* Primary Badge */}
                          <div className="relative z-10 p-2 flex justify-between items-start">
                            {idx === 0 ? (
                              <span className="bg-gradient-to-r from-gold-600 to-gold-500 text-zaad-950 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 fill-zaad-950" />
                                <span>الرئيسية</span>
                              </span>
                            ) : (
                              <span className="bg-zaad-900/80 text-ivory-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Actions Overlay */}
                          <div className="relative z-10 p-2 bg-gradient-to-t from-zaad-950/90 via-zaad-950/60 to-transparent flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity">

                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  title="تحريك لليمين"
                                  onClick={() => handleMoveImage(idx, 'right')}
                                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-gold-500 hover:text-zaad-950 text-white flex items-center justify-center text-xs transition-colors"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  title="تحريك لليسار"
                                  onClick={() => handleMoveImage(idx, 'left')}
                                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-gold-500 hover:text-zaad-950 text-white flex items-center justify-center text-xs transition-colors"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Set Primary or Delete */}
                            <div className="flex items-center gap-1">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetFeaturedImage(idx)}
                                  className="bg-gold-500 hover:bg-gold-400 text-zaad-950 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  title="تعيين كصورة رئيسية للمنتج"
                                >
                                  <Star className="w-3 h-3" />
                                  <span>رئيسية</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                title="حذف الصورة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Fallback: Manual Image URL Input */}
                  <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-300 space-y-2">
                    <label className="block text-xs font-bold text-charcoal-700">
                      أو إضافة رابط صورة يدوي (External Image URL - خيار متقدم):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/... أو أي رابط مباشر"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-white border border-ivory-300 rounded-xl p-2.5 text-xs focus:border-gold-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-zaad-900 hover:bg-zaad-800 text-gold-400 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        إضافة الرابط
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: HEALTH BENEFITS, USAGE & STORAGE INSTRUCTIONS */}
              {modalTab === 'benefits' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Health Benefits 1 to 4 Section */}
                  <div className="space-y-4">
                    <div className="border-b border-ivory-200 pb-2">
                      <h4 className="font-bold text-zaad-900 text-sm flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-gold-600" />
                        <span>الفوائد الصحية والخصائص الحيوية للمنتج (Health Benefits)</span>
                      </h4>
                      <p className="text-[11px] text-charcoal-700/70">أدخل الفوائد الصحية المحددة لهذا المنتج والتي ستظهر في بطاقات التبويب بالموقع.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Benefit 1 */}
                      <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-zaad-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-zaad-900 text-gold-400 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                          <span>الفائدة الصحية الأولى (Benefit 1):</span>
                        </span>
                        <input
                          type="text"
                          value={healthBenefit1Title}
                          onChange={(e) => setHealthBenefit1Title(e.target.value)}
                          placeholder="عنوان الفائدة (مثال: تعزيز الطاقة والتحمل البدني)"
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-bold text-xs focus:border-gold-500 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={healthBenefit1Desc}
                          onChange={(e) => setHealthBenefit1Desc(e.target.value)}
                          placeholder="شرح وتفاصيل الفائدة الأولى..."
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Benefit 2 */}
                      <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-zaad-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-zaad-900 text-gold-400 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                          <span>الفائدة الصحية الثانية (Benefit 2):</span>
                        </span>
                        <input
                          type="text"
                          value={healthBenefit2Title}
                          onChange={(e) => setHealthBenefit2Title(e.target.value)}
                          placeholder="عنوان الفائدة (مثال: تقوية المناعة الطبيعية)"
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-bold text-xs focus:border-gold-500 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={healthBenefit2Desc}
                          onChange={(e) => setHealthBenefit2Desc(e.target.value)}
                          placeholder="شرح وتفاصيل الفائدة الثانية..."
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Benefit 3 */}
                      <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-zaad-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-zaad-900 text-gold-400 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                          <span>الفائدة الصحية الثالثة (Benefit 3):</span>
                        </span>
                        <input
                          type="text"
                          value={healthBenefit3Title}
                          onChange={(e) => setHealthBenefit3Title(e.target.value)}
                          placeholder="عنوان الفائدة (مثال: دعم الجهاز الهضمي والامتصاص)"
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-bold text-xs focus:border-gold-500 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={healthBenefit3Desc}
                          onChange={(e) => setHealthBenefit3Desc(e.target.value)}
                          placeholder="شرح وتفاصيل الفائدة الثالثة..."
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Benefit 4 */}
                      <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-zaad-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-zaad-900 text-gold-400 flex items-center justify-center font-mono font-bold text-[10px]">4</span>
                          <span>الفائدة الصحية الرابعة (Benefit 4):</span>
                        </span>
                        <input
                          type="text"
                          value={healthBenefit4Title}
                          onChange={(e) => setHealthBenefit4Title(e.target.value)}
                          placeholder="عنوان الفائدة (مثال: تنقية وتجديد الخلايا)"
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2.5 font-bold text-xs focus:border-gold-500 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={healthBenefit4Desc}
                          onChange={(e) => setHealthBenefit4Desc(e.target.value)}
                          placeholder="شرح وتفاصيل الفائدة الرابعة..."
                          className="w-full bg-white border border-ivory-300 rounded-xl p-2 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Usage & Storage Instructions Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-ivory-200 pt-4">
                    
                    {/* Usage Instructions */}
                    <div className="space-y-2">
                      <label className="block font-bold text-zaad-900 flex items-center gap-1.5 text-xs">
                        <Clock className="w-4 h-4 text-gold-600" />
                        <span>طرق الاستخدام والطقوس اليومية الموصى بها (Usage Instructions)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={usageInstructionsAr}
                        onChange={(e) => setUsageInstructionsAr(e.target.value)}
                        placeholder="مثال: تناول ملعقة صباحاً على الريق مع ماء فاتر..."
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Storage Instructions */}
                    <div className="space-y-2">
                      <label className="block font-bold text-zaad-900 flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>إرشادات حفظ النقاء والتخزين (Storage Instructions)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={storageInstructionsAr}
                        onChange={(e) => setStorageInstructionsAr(e.target.value)}
                        placeholder="مثال: يحفظ في مكان بارد وجاف تحت 22 درجة مئوية..."
                        className="w-full bg-ivory-50 border border-ivory-300 rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* Inline Modal Error Message */}
              {notification && notification.type === 'error' && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 flex items-center gap-2 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{notification.message}</span>
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
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-zaad-900 hover:bg-zaad-800 text-gold-400 border border-gold-500/40 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving && <span className="w-3.5 h-3.5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />}
                  <span>{isSaving ? 'جاري الحفظ في Supabase...' : (editingProduct ? 'حفظ التعديلات في Supabase' : 'إيداع المحصول بالكتالوج')}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
