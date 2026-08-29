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
  'image/gif',
  'image/svg+xml',
  'image/avif'
];

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Super Admin / Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      console.warn('[API Admin Upload Auth Failed]:', auth.error);
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
      console.warn('[API Admin Upload Validation]: No files found in request formData');
      return NextResponse.json(
        { success: false, error: 'لم يتم إرفاق أي ملف صورة للرفع' },
        { status: 400 }
      );
    }

    console.log(`[API Admin Upload] Received ${rawFiles.length} file(s) for upload:`, 
      rawFiles.map(f => ({ name: f.name, type: f.type, sizeBytes: f.size }))
    );

    const uploadedUrls: string[] = [];

    for (const file of rawFiles) {
      // Check MIME type
      const normalizedType = file.type.toLowerCase();
      if (!ALLOWED_MIME_TYPES.includes(normalizedType) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)) {
        console.warn(`[API Admin Upload Error]: Unsupported MIME type ${file.type} for file ${file.name}`);
        return NextResponse.json(
          {
            success: false,
            error: `نوع الملف (${file.name}) غير مدعوم. الصيغ المدعومة هي: JPG, JPEG, PNG, WEBP, GIF, SVG.`
          },
          { status: 400 }
        );
      }

      // Check File Size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.warn(`[API Admin Upload Error]: File ${file.name} exceeds max size limit (${file.size} bytes)`);
        return NextResponse.json(
          {
            success: false,
            error: `حجم الصورة (${file.name}) يتجاوز الحد الأقصى المسموح (15 ميجابايت).`
          },
          { status: 400 }
        );
      }

      // Generate clean unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^\w\u0621-\u064A-]+/g, '_')
        .substring(0, 30);
      const uniqueName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBaseName}.${fileExt}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`[API Admin Upload] Uploading ${uniqueName} (${buffer.length} bytes) to Supabase bucket 'product-images'...`);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true
        });

      if (uploadError || !uploadData) {
        console.error('[API Admin Upload Error] Supabase storage upload failed:', uploadError);
        return NextResponse.json(
          { success: false, error: `فشل رفع الصورة (${file.name}) إلى التخزين السحابي: ${uploadError?.message || 'خطأ في خادم التخزين'}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(uniqueName);

      if (publicUrlData?.publicUrl) {
        console.log(`[API Admin Upload Success] Generated Public URL: ${publicUrlData.publicUrl}`);
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
    console.error('[API Admin Upload Exception]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'حدث خطأ في الخادم أثناء رفع الصور' },
      { status: 500 }
    );
  }
}
