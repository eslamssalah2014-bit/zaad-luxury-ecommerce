'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  UploadCloud,
  Search,
  Folder,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  ImageIcon,
  Loader2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { CmsMediaItem, MediaFolder } from '@/types/cms';
import { supabase } from '@/lib/supabase/client';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  defaultFolder?: MediaFolder;
  titleAr?: string;
}

const FOLDERS: { key: MediaFolder | 'all'; labelAr: string }[] = [
  { key: 'all', labelAr: 'جميع الوسائط' },
  { key: 'homepage', labelAr: 'الرئيسية' },
  { key: 'products', labelAr: 'المنتجات' },
  { key: 'story', labelAr: 'القصة والتراث' },
  { key: 'banners', labelAr: 'البانرات' },
  { key: 'logos', labelAr: 'الشعارات' },
  { key: 'certificates', labelAr: 'الشهادات' },
  { key: 'general', labelAr: 'عام' }
];

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  defaultFolder = 'general',
  titleAr = 'مكتبة الصور والوسائط (Media Library)'
}: MediaLibraryModalProps) {
  const [mediaList, setMediaList] = useState<CmsMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | 'all'>(defaultFolder);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CmsMediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/media?folder=${selectedFolder}&search=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMediaList(json.data);
      }
    } catch (e) {
      console.error('Error loading media:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, fetchMedia]);

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      const targetFolder = selectedFolder === 'all' ? 'general' : selectedFolder;
      formData.append('folder', targetFolder);

      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/cms/media', {
        method: 'POST',
        headers,
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'فشل في رفع الصورة');
      }

      setUploadSuccess(`تم رفع ${json.data?.length || 1} ملف بنجاح إلى مجلد ${targetFolder}`);
      await fetchMedia();

      // Auto-select the newly uploaded file
      if (json.data && json.data.length > 0) {
        setSelectedItem(json.data[0]);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (item: CmsMediaItem) => {
    if (!confirm(`هل أنت متأكد من حذف الصورة "${item.name}"؟`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/cms/media?id=${item.id}&url=${encodeURIComponent(item.url)}`, {
        method: 'DELETE',
        headers
      });
      const json = await res.json();
      if (json.success) {
        if (selectedItem?.id === item.id) setSelectedItem(null);
        await fetchMedia();
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelectImage(selectedItem.url);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zaad-950/80 backdrop-blur-md animate-fade-in font-arabic">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl border border-gold-500/30 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-zaad-900">{titleAr}</h2>
              <p className="text-xs text-charcoal-700/70">ارفع الصور من جهازك أو اختر من مكتبة دار زاد الرقمية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-charcoal-700 hover:text-zaad-900 hover:bg-ivory-200 rounded-full transition-all"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Area */}
          <div className="flex-1 flex flex-col p-5 overflow-hidden border-b md:border-b-0 md:border-l border-ivory-200">
            
            {/* Action Bar: Search + Upload Trigger */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-charcoal-700/50 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ابحث باسم الصورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-xl pr-9 pl-4 py-2 text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full sm:w-auto px-5 py-2.5 bg-zaad-900 hover:bg-zaad-800 text-gold-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    <span>جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-gold-400" />
                    <span>رفع صورة من جهازك (PC)</span>
                  </>
                )}
              </button>
            </div>

            {/* Folder Filter Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {FOLDERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFolder(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedFolder === f.key
                      ? 'bg-gold-500 text-zaad-950 shadow-sm'
                      : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>{f.labelAr}</span>
                </button>
              ))}
            </div>

            {/* Drag and Drop Zone Notice if empty */}
            {uploadSuccess && (
              <div className="mb-3 bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}
            {uploadError && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2 rounded-xl animate-fade-in">
                {uploadError}
              </div>
            )}

            {/* Media Grid */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-ivory-50/60 p-3 rounded-2xl border border-dashed border-ivory-300"
            >
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-zaad-900">
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-2" />
                  <span className="text-xs font-bold">جاري تحميل الوسائط...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-charcoal-700/60">
                  <UploadCloud className="w-12 h-12 text-gold-500/40 mb-2" />
                  <p className="text-xs font-bold">لا توجد صور في هذا المجلد بعد</p>
                  <p className="text-[11px] mt-1">اسحب وأفلت الصور هنا أو اضغط على زر الرفع</p>
                </div>
              ) : (
                mediaList.map((item) => {
                  const isSelected = selectedItem?.id === item.id || selectedItem?.url === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-white shadow-sm flex items-center justify-center ${
                        isSelected
                          ? 'border-gold-500 ring-2 ring-gold-500/50 shadow-md scale-[0.98]'
                          : 'border-ivory-300 hover:border-gold-400'
                      }`}
                    >
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />

                      {/* Selected Check Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 text-zaad-950 flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Hover Info Strip */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                        <span className="text-[10px] font-bold truncate">{item.name}</span>
                        <span className="text-[9px] text-ivory-300">{formatFileSize(item.sizeBytes)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Sidebar / Image Inspector */}
          <div className="w-full md:w-80 p-5 bg-ivory-50 flex flex-col justify-between overflow-y-auto shrink-0">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-ivory-300 bg-zaad-950/20 shadow-inner">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zaad-900 truncate mb-1" title={selectedItem.name}>
                    {selectedItem.name}
                  </h4>
                  <div className="space-y-1 text-[11px] text-charcoal-700/70">
                    <div className="flex justify-between">
                      <span>المجلد:</span>
                      <span className="font-bold text-zaad-800">{selectedItem.folder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحجم:</span>
                      <span>{formatFileSize(selectedItem.sizeBytes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>النوع:</span>
                      <span className="uppercase">{selectedItem.fileType.split('/')[1] || 'IMAGE'}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="space-y-2 pt-2 border-t border-ivory-200">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedItem.url)}
                    className="w-full py-2 px-3 bg-white border border-ivory-300 hover:border-gold-400 rounded-xl text-xs font-bold text-zaad-900 flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    {copiedUrl === selectedItem.url ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">تم نسخ الرابط!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-600" />
                        <span>نسخ رابط الصورة (URL)</span>
                      </>
                    )}
                  </button>

                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-white border border-ivory-300 hover:border-gold-400 rounded-xl text-xs font-bold text-charcoal-700 flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-charcoal-500" />
                    <span>فتح بالحجم الكامل</span>
                  </a>

                  {!selectedItem.id.startsWith('media-static-') && (
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedItem)}
                      className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف من المكتبة</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-charcoal-700/60">
                <ImageIcon className="w-12 h-12 text-gold-500/30 mb-2" />
                <p className="text-xs font-bold">حدد صورة من القائمة لعرض تفاصيلها أو استخدامها</p>
              </div>
            )}

            {/* Bottom Select Action */}
            <div className="pt-4 border-t border-ivory-300 mt-auto">
              <button
                type="button"
                onClick={handleConfirmSelect}
                disabled={!selectedItem}
                className="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-zaad-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>اعتماد الصورة المحددة للقسم</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
