import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/gif'
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Super Admin / Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json(
        { success: false, error: auth.error || 'غير مصرح لك برفع الصور' },
        { status: auth.status || 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const rawFiles: File[] = [];

    // Support both 'files' array and single 'file' field
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
      // Bucket already exists
    }

    const uploadedUrls: string[] = [];

    for (const file of rawFiles) {
      // Check MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `نوع الملف (${file.name}) غير مدعوم. الصيغ المدعومة هي: JPG, JPEG, PNG, WEBP.`
          },
          { status: 400 }
        );
      }

      // Check File Size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `حجم الصورة (${file.name}) يتجاوز الحد الأقصى المسموح (10 ميجابايت).`
          },
          { status: 400 }
        );
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A-]+/g, '_')
        .substring(0, 30);
      const uniqueName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBaseName}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError || !uploadData) {
        console.error('Error uploading image to Supabase storage:', uploadError);
        return NextResponse.json(
          { success: false, error: `فشل رفع الصورة (${file.name}): ${uploadError?.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(uniqueName);

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      data: {
        url: uploadedUrls[0],
        count: uploadedUrls.length
      },
      message: `تم رفع ${uploadedUrls.length} صورة بنجاح إلى السحابة.`
    });
  } catch (error: any) {
    console.error('Exception in /api/admin/upload:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ في الخادم أثناء رفع الصور' },
      { status: 500 }
    );
  }
}
