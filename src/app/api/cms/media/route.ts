import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { CmsMediaItem, MediaFolder } from '@/types/cms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/jpg',
  'image/gif'
];

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB

// Default curated local assets for immediate availability
const STATIC_ASSETS: CmsMediaItem[] = [
  {
    id: 'media-static-1',
    name: 'zaad-nature-honey-clover.jpg',
    url: '/images/zaad-nature-honey-clover.jpg',
    folder: 'homepage',
    fileType: 'image/jpeg',
    sizeBytes: 334426,
    createdAt: '2026-08-25T12:00:00.000Z'
  },
  {
    id: 'media-static-2',
    name: 'zaad-story-hero-banner.jpg',
    url: '/images/zaad-story-hero-banner.jpg',
    folder: 'banners',
    fileType: 'image/jpeg',
    sizeBytes: 333144,
    createdAt: '2026-08-24T10:00:00.000Z'
  },
  {
    id: 'media-static-3',
    name: 'zaad-heritage-beekeepers.jpg',
    url: '/images/zaad-heritage-beekeepers.jpg',
    folder: 'story',
    fileType: 'image/jpeg',
    sizeBytes: 433315,
    createdAt: '2026-08-24T10:00:00.000Z'
  },
  {
    id: 'media-static-4',
    name: 'zaad-childhood-memories.jpg',
    url: '/images/zaad-childhood-memories.jpg',
    folder: 'story',
    fileType: 'image/jpeg',
    sizeBytes: 387192,
    createdAt: '2026-08-24T10:00:00.000Z'
  },
  {
    id: 'media-static-5',
    name: 'zaad-logo.png',
    url: '/images/zaad-logo.png',
    folder: 'logos',
    fileType: 'image/png',
    sizeBytes: 23847,
    createdAt: '2026-08-24T10:00:00.000Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') as MediaFolder | 'all' | null;
    const search = searchParams.get('search')?.toLowerCase() || '';

    // 1. Fetch direct from Supabase Storage bucket 'product-images'
    const storageMedia: CmsMediaItem[] = [];
    try {
      const { data: storageFiles, error: storageErr } = await supabaseAdmin.storage
        .from('product-images')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (!storageErr && storageFiles) {
        storageFiles.forEach((file) => {
          if (!file.name || file.name.startsWith('.')) return;

          const { data: urlData } = supabaseAdmin.storage
            .from('product-images')
            .getPublicUrl(file.name);

          // Infer folder from prefix or name (e.g. cms_homepage_..., cms_story_...)
          let inferredFolder: MediaFolder = 'general';
          if (file.name.includes('_homepage_') || file.name.startsWith('hero_')) inferredFolder = 'homepage';
          else if (file.name.includes('_story_')) inferredFolder = 'story';
          else if (file.name.includes('_banners_') || file.name.includes('banner')) inferredFolder = 'banners';
          else if (file.name.includes('_products_') || file.name.startsWith('prod_')) inferredFolder = 'products';
          else if (file.name.includes('_logos_') || file.name.includes('logo')) inferredFolder = 'logos';
          else if (file.name.includes('_certificates_') || file.name.includes('cert')) inferredFolder = 'certificates';

          const ext = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
          const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';

          storageMedia.push({
            id: file.id || `storage-${file.name}`,
            name: file.name,
            url: urlData.publicUrl,
            folder: inferredFolder,
            fileType: mimeType,
            sizeBytes: (file.metadata as any)?.size || 150000,
            createdAt: file.created_at || new Date().toISOString()
          });
        });
      }
    } catch (sErr) {
      console.warn('Storage list notice:', sErr);
    }

    // 2. Merge Storage files with Static fallback assets (avoiding duplicates by URL)
    const allMedia = [...storageMedia];
    STATIC_ASSETS.forEach(stat => {
      if (!allMedia.some(m => m.url === stat.url || m.name === stat.name)) {
        allMedia.push(stat);
      }
    });

    // 3. Apply filtering
    let filtered = allMedia;
    if (folder && folder !== 'all') {
      filtered = filtered.filter(item => item.folder === folder);
    }
    if (search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
    }

    return NextResponse.json({ success: true, data: filtered, total: filtered.length });
  } catch (error: any) {
    console.error('Error fetching media library:', error);
    return NextResponse.json(
      { success: true, data: STATIC_ASSETS, total: STATIC_ASSETS.length },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json(
        { success: false, error: auth.error || 'غير مصرح لك برفع الوسائط' },
        { status: auth.status || 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const folder = (formData.get('folder') as MediaFolder) || 'general';
    const rawFiles: File[] = [];

    const filesList = formData.getAll('files');
    const singleFile = formData.get('file');

    if (filesList && filesList.length > 0) {
      filesList.forEach((f) => {
        if (f instanceof File) rawFiles.push(f);
      });
    } else if (singleFile instanceof File) {
      rawFiles.push(singleFile);
    }

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لم يتم إرفاق أي ملف صورة للرفع' },
        { status: 400 }
      );
    }

    // Ensure bucket exists
    try {
      await supabaseAdmin.storage.createBucket('product-images', { public: true });
    } catch {
      // Bucket exists
    }

    const uploadedItems: CmsMediaItem[] = [];

    for (const file of rawFiles) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `نوع الملف (${file.name}) غير مدعوم. الصيغ المدعومة هي: JPG, PNG, WEBP, SVG.`
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `حجم الصورة (${file.name}) يتجاوز الحد الأقصى (12 ميجابايت).`
          },
          { status: 400 }
        );
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A-]+/g, '_')
        .substring(0, 30);
      const uniqueName = `cms_${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBaseName}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json(
          { success: false, error: `فشل رفع الملف (${file.name}): ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(uniqueName);

      const publicUrl = publicUrlData.publicUrl;
      const mediaItem: CmsMediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        url: publicUrl,
        folder,
        fileType: file.type,
        sizeBytes: file.size,
        createdAt: new Date().toISOString()
      };

      uploadedItems.push(mediaItem);
    }

    return NextResponse.json({
      success: true,
      message: `تم رفع ${uploadedItems.length} ملف/ملفات بنجاح`,
      data: uploadedItems
    });
  } catch (error: any) {
    console.error('Error in media upload POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في رفع الوسائط' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json(
        { success: false, error: auth.error || 'غير مصرح لك بحذف الوسائط' },
        { status: auth.status || 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mediaName = searchParams.get('name');
    const mediaUrl = searchParams.get('url');

    if (!mediaName && !mediaUrl) {
      return NextResponse.json({ success: false, error: 'اسم الصورة أو الرابط مطلوب للحذف' }, { status: 400 });
    }

    let fileNameToDelete = mediaName;
    if (!fileNameToDelete && mediaUrl) {
      fileNameToDelete = mediaUrl.split('/').pop() || '';
    }

    if (fileNameToDelete) {
      await supabaseAdmin.storage.from('product-images').remove([fileNameToDelete]);
    }

    return NextResponse.json({ success: true, message: 'تم حذف الملف من المكتبة بنجاح' });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ success: false, error: error.message || 'فشل في حذف الملف' }, { status: 500 });
  }
}
