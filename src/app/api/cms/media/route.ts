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

    // Fetch from Supabase cms_media table if available
    let dbMedia: CmsMediaItem[] = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('cms_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbMedia = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          url: d.url,
          folder: d.folder || 'general',
          fileType: d.file_type || 'image/jpeg',
          sizeBytes: Number(d.size_bytes || 0),
          createdAt: d.created_at || new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn('Notice: cms_media table not initialized yet:', e);
    }

    // Merge static and dynamic media, avoid duplicates
    const allMedia = [...dbMedia];
    STATIC_ASSETS.forEach(stat => {
      if (!allMedia.some(m => m.url === stat.url)) {
        allMedia.push(stat);
      }
    });

    // Apply filtering
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

      // Try recording in cms_media table
      try {
        await supabaseAdmin.from('cms_media').insert({
          id: mediaItem.id,
          name: mediaItem.name,
          url: mediaItem.url,
          folder: mediaItem.folder,
          file_type: mediaItem.fileType,
          size_bytes: mediaItem.sizeBytes,
          created_at: mediaItem.createdAt
        });
      } catch (dbErr) {
        console.warn('Could not insert into cms_media table (non-fatal):', dbErr);
      }

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
    const mediaId = searchParams.get('id');
    const mediaUrl = searchParams.get('url');

    if (!mediaId && !mediaUrl) {
      return NextResponse.json({ success: false, error: 'معرّف الصورة مطلوب للحذف' }, { status: 400 });
    }

    // Attempt delete from cms_media table
    if (mediaId) {
      await supabaseAdmin.from('cms_media').delete().eq('id', mediaId);
    }

    return NextResponse.json({ success: true, message: 'تم حذف الملف من المكتبة بنجاح' });
  } catch (error: any) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ success: false, error: error.message || 'فشل في حذف الملف' }, { status: 500 });
  }
}
