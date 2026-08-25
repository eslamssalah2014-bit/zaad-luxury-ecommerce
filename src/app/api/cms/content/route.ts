import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import {
  getCmsSettings,
  saveCmsDraft,
  publishCmsSettings,
  DEFAULT_CMS_SETTINGS
} from '@/lib/services/cmsService';
import { CmsSettingsDocument } from '@/types/cms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isDraft = searchParams.get('draft') === 'true';

    // If requesting draft, verify admin auth
    if (isDraft) {
      const auth = await verifyAdminSession(request);
      if (!auth.isAuthorized) {
        // Fallback to published if not authorized
        const liveData = await getCmsSettings(false);
        return NextResponse.json({ success: true, data: liveData, isDraft: false });
      }
    }

    const data = await getCmsSettings(isDraft);
    return NextResponse.json({ success: true, data, isDraft });
  } catch (error: any) {
    console.error('Error fetching CMS content:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في استرجاع إعدادات المحتوى', fallback: DEFAULT_CMS_SETTINGS },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authentication
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json(
        { success: false, error: auth.error || 'غير مصرح لك بتعديل محتوى المتجر' },
        { status: auth.status || 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { action, settings } = body as {
      action: 'save_draft' | 'publish' | 'reset_default';
      settings?: CmsSettingsDocument;
    };

    if (action === 'reset_default') {
      const pubRes = await publishCmsSettings(DEFAULT_CMS_SETTINGS);
      if (!pubRes.success) {
        return NextResponse.json({ success: false, error: pubRes.error }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: 'تمت استعادة إعدادات المتجر الافتراضية ونشرها بنجاح',
        data: DEFAULT_CMS_SETTINGS
      });
    }

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'لم يتم إرسال بيانات الإعدادات' },
        { status: 400 }
      );
    }

    if (action === 'save_draft') {
      const draftRes = await saveCmsDraft(settings);
      if (!draftRes.success) {
        return NextResponse.json({ success: false, error: draftRes.error }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: 'تم حفظ مسودة التعديلات بنجاح',
        data: settings
      });
    }

    if (action === 'publish') {
      const pubRes = await publishCmsSettings(settings);
      if (!pubRes.success) {
        return NextResponse.json({ success: false, error: pubRes.error }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        message: 'تم نشر التعديلات بنجاح، والمتجر الآن يعكس المحتوى الجديد فورياً',
        data: settings
      });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing CMS POST request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء معالجة المحتوى' },
      { status: 500 }
    );
  }
}
