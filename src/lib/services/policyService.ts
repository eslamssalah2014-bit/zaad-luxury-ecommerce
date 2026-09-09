import { Policy } from '@/types/cms';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabase } from '@/lib/supabase/client';

export const DEFAULT_POLICIES: Policy[] = [
  {
    id: 'policy-privacy',
    title: 'سياسة الخصوصية وسرية المعلومات',
    slug: 'privacy-policy',
    content: `## مقدمة وميثاق الأمانة
في دار زاد (ZAAD)، نضع خصوصية عملائنا الكرام ومقتني أعسالنا النادرة في قمة أولوياتنا. يعكس هذا الميثاق التزامنا الراسخ بحماية بياناتك الشخصية وسريتها وفق أرقى المعايير الدولية والأنظمة المرعية في المملكة العربية السعودية.

## البيانات التي نقوم بجمعها
نقوم بجمع البيانات الضرورية لتقديم تجربة تسوق ملكية تليق بكم:
- **البيانات الشخصية**: الاسم الكامل، رقم الهاتف، وعنوان البريد الإلكتروني.
- **بيانات التوصيل والشحن**: عنوان الاستلام، المدينة، والرمز البريدي لضمان وصول الشحنة بدقة فائقة.
- **بيانات التحقق المالي**: إيصالات التحويل البنكي وصور المطابقة المالية المشفرة التي تُرفع لإتمام التحقق من الدفع.

## أمن البيانات والتشفير
تخضع جميع البيانات المتبادلة عبر منصة زاد لأعلى درجات التشفير عبر بروتوكولات SSL/TLS المتقدمة. لا نقوم بتخزين أي أرقام بطاقات ائتمانية حساسة على خوادمنا الداخلية، وتتم العمليات البنكية عبر قنوات مصرفية مباشرة ومحمية بموجب أعلى معايير أمان المدفوعات (PCI-DSS).

## سرية المعلومات وعدم المشاركة
نتعهد بعدم بيع، تأجير، أو إفشاء بياناتكم الشخصية لأي طرف ثالث لأغراض تسويقية. تنحصر مشاركة البيانات مع شركائنا الموثوقين فقط (مثل شركات الشحن السريع المعتمدة) بالقدر اللازم لتوصيل طلباتكم الملكية.

## حقوقك والتحكم في بياناتك
يحق لك في أي وقت مراجعة بياناتك المسجلة لدينا، طلب تعديلها، أو طلب إزالتها من سجلاتنا عبر التواصل مع خدمة العملاء والكونسيرج: concierge@zaad.sa.`,
    meta_title: 'سياسة الخصوصية وسرية البيانات | زاد (ZAAD)',
    meta_description: 'تعرف على ميثاق الخصوصية وسرية البيانات لدى دار زاد للنقاء الملكي. التزام كامل بحماية بياناتك وتشفيرها بأعلى المعايير.',
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-09T10:00:00Z'
  },
  {
    id: 'policy-terms',
    title: 'الشروط والأحكام وميثاق الاستخدام',
    slug: 'terms-and-conditions',
    content: `## الترحيب والتعريف بالدار
أهلاً بكم في دار زاد (ZAAD)، العلامة الرائدة في توثيق وتقديم أفخر أنواع الأعسال النادرة والمحاصيل الملكية الطبيعية. يشكل استخدامكم لموقعنا وتطبيقاتنا موافقة تامة وغير مشروطة على هذه الشروط والأحكام.

## أهلية الاستخدام والشراء
- يُشترط أن يكون العميل قد بلغ السن القانوني للشراء، ومؤهلاً لإبرام العقود والمعاملات التجارية.
- يلتزم المشتري بتقديم معلومات صحيحة ودقيقة عند التسجيل وإتمام الطلب لضمان دقة وسرعة التوصيل.

## المنتجات والأصالة المخبرية
- جميع الأعسال والمنتجات المعروضة في زاد هي منتجات طبيعية 100% غير مبسترة، ومفحوصة مخبرياً لضمان أعلى نسب النقاء والإنزيمات الحية.
- نظراً للطبيعة الخام للأعسال، قد يطرأ تبلور طبيعي على بعض الأصناف النادرة، وهو دليل قاطع على جودة العسل وخلوه من المعالجات الحرارية الصناعية.

## الأسعار والمدفوعات
- جميع الأسعار المعروضة معتمدة بالعملات المحددة وتشمل ضريبة القيمة المضافة وفق الأنظمة السارية في المملكة.
- يحتفظ المتجر بحق تعديل الأسعار أو تحديث عروض المحاصيل الموسمية في أي وقت دون إشعار مسبق.

## حقوق الملكية الفكرية
جميع العلامات التجارية، الصور الفوتوغرافية، التصاميم، والنصوص المكتوبة في هذا الموقع هي ملكية حصرية لـ "دار زاد للنقاء الطبيعي" ومحمية بموجب أنظمة حماية حقوق المؤلف والعلامات التجارية المعمول بها دولياً ومحلياً.`,
    meta_title: 'الشروط والأحكام وميثاق الاستخدام | زاد (ZAAD)',
    meta_description: 'الشروط والأحكام الرسمية المعتمدة لدار زاد للنقاء الطبيعي والأعسال الملكية النادرة والمحاصيل الموثقة.',
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-09T10:00:00Z'
  },
  {
    id: 'policy-refund',
    title: 'الضمان الذهبي وسياسة الاسترجاع والاستبدال',
    slug: 'refund-policy',
    content: `## الضمان الذهبي لنقاء زاد
ثقتكم هي أثمن ما نملك. لذلك، نقدم "الضمان الذهبي الملكي": إذا ثبت بالفحص المخبري المعتمد عدم نقاء عسل زاد أو مخالفته لأعلى المعايير الطبيعية، نلتزم باسترجاع كامل المبلغ المدفوع مع التعويض.

## شروط الاسترجاع والاستبدال
حرصاً على السلامة الصحية العامة وجودة المنتجات الغذائية الفاخرة:
- يحق للعميل طلب الاسترجاع أو الاستبدال خلال **7 أيام** من تاريخ استلام الشحنة.
- يجب أن يكون المنتج في عبوته الأصلية محكمة الإغلاق وغير مفتوح، مع الاحتفاظ بكافة ملصقات الضمان والختم الشمعي الأصلي.
- في حال استلام منتج تالف أو به كسر ناتج عن الشحن، يتم التعويض فوراً بإرسال بديل جديد مجاناً أو استرداد كامل للمبلغ دون أي تكلفة إضافية على العميل.

## آلية استرداد الأموال
- تتم مراجعة وفحص الشحنة المسترجعة فور وصولها إلى مستودعاتنا المركزية خلال 48 ساعة عمل.
- يتم تحويل المبلغ المسترد إلى الحساب البنكي للعميل أو بطاقته الائتمانية خلال **3 إلى 5 أيام عمل** من تاريخ اعتماد الاسترجاع.`,
    meta_title: 'الضمان الذهبي وسياسة الاسترجاع | زاد (ZAAD)',
    meta_description: 'تفاصيل الضمان الذهبي الملكي وسياسة الاسترجاع والاستبدال المعتمدة لدى دار زاد لضمان أعلى درجات الرضا والأمان.',
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-09T10:00:00Z'
  },
  {
    id: 'policy-shipping',
    title: 'سياسة الشحن والتسليم الملكي',
    slug: 'shipping-policy',
    content: `## معايير الشحن والتغليف الفاخر
تخضع شحنات دار زاد لعناية فائقة وتغليف حراري عازل صُمم خصيصاً لحماية مرطبانات العسل الفاخرة من الصدمات والتقلبات الحرارية، بما يضمن وصول الإنزيمات الحية بحالتها الطبيعية الكاملة وكأنك قطفتها من الخلية للتو.

## مناطق وفترات التوصيل
- **التوصيل السريع داخل المدن الرئيسية (الرياض، جدة، الدمام)**: خلال 24 إلى 48 ساعة عمل.
- **التوصيل لجميع مدن ومحافظات المملكة**: من 2 إلى 4 أيام عمل كحد أقصى.
- **التوصيل الإقليمي والدولي**: نوفر الشحن لدول مجلس التعاون الخليجي والوجهات الدولية المعتمدة عبر ناقلين دوليين موثوقين.

## تتبع الشحنات الفوري
فور تجهيز الشحنة من مستودعنا المركزي، يتلقى العميل رسالة نصية (SMS) وبريداً إلكترونياً يحتوي على رقم التتبع المباشر ورابط لمتابعة مسار الشحنة خطوة بخطوة حتى باب المنزل.

## رسوم الشحن والعروض المجانية
- يتم احتساب رسوم الشحن بوضوح في صفحة إتمام الطلب بناءً على الوجهة ووزن الطرد.
- استمتع بالشحن المجاني الملكي للطلبات التي تتجاوز قيمتها الحد الأدنى المعلن عنه في شريط العروض العلوي.`,
    meta_title: 'سياسة الشحن والتوصيل الفاخر | زاد (ZAAD)',
    meta_description: 'دليل الشحن والتوصيل الفاخر من دار زاد، معايير التغليف الحراري الآمن، والتوصيل السريع لجميع مناطق المملكة والخليج.',
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-09T10:00:00Z'
  }
];

const CMS_POLICIES_KEY = 'cms_policies_registry';

/**
 * Fetch all policies from Supabase public.policies table with CMS fallback
 */
export async function getAllPolicies(includeDrafts = false): Promise<Policy[]> {
  try {
    // 1. Try querying public.policies table via supabaseAdmin (bypasses RLS for full control)
    let query = supabaseAdmin
      .from('policies')
      .select('*')
      .order('created_at', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as Policy[];
    }

    // 2. If table is empty or error (e.g. table not migrated yet), check CMS fallback blocks
    const { data: cmsData } = await supabaseAdmin
      .from('cms_blocks')
      .select('metadata')
      .eq('key', CMS_POLICIES_KEY)
      .maybeSingle();

    if (cmsData?.metadata?.policies && Array.isArray(cmsData.metadata.policies)) {
      const stored = cmsData.metadata.policies as Policy[];
      return includeDrafts ? stored : stored.filter(p => p.status === 'published');
    }

    // 3. Fallback to pre-seeded defaults
    return includeDrafts ? DEFAULT_POLICIES : DEFAULT_POLICIES.filter(p => p.status === 'published');
  } catch (err) {
    console.warn('PolicyService getAllPolicies fallback triggered:', err);
    return includeDrafts ? DEFAULT_POLICIES : DEFAULT_POLICIES.filter(p => p.status === 'published');
  }
}

/**
 * Fetch a single policy by its unique slug
 */
export async function getPolicyBySlug(slug: string, includeDrafts = false): Promise<Policy | null> {
  const cleanSlug = slug.trim().toLowerCase();

  try {
    // 1. Try Supabase policies table
    let query = supabaseAdmin
      .from('policies')
      .select('*')
      .eq('slug', cleanSlug);

    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      return data as Policy;
    }

    // 2. Try CMS block fallback
    const all = await getAllPolicies(includeDrafts);
    const found = all.find(p => p.slug.toLowerCase() === cleanSlug);
    return found || null;
  } catch (err) {
    console.warn(`PolicyService getPolicyBySlug(${cleanSlug}) fallback:`, err);
    const found = DEFAULT_POLICIES.find(p => p.slug.toLowerCase() === cleanSlug);
    if (!found) return null;
    if (!includeDrafts && found.status !== 'published') return null;
    return found;
  }
}

/**
 * Upsert a policy (Insert or Update) - Super Admin action
 */
export async function upsertPolicy(policyData: Partial<Policy>): Promise<{ success: boolean; data?: Policy; error?: string }> {
  try {
    if (!policyData.title || !policyData.slug || !policyData.content) {
      return { success: false, error: 'يرجى إدخال عنوان السياسة، الرابط الدائم (Slug)، ومحتوى النص' };
    }

    const cleanSlug = policyData.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
    const now = new Date().toISOString();

    const payload: Partial<Policy> = {
      title: policyData.title.trim(),
      slug: cleanSlug,
      content: policyData.content.trim(),
      meta_title: policyData.meta_title ? policyData.meta_title.trim() : null,
      meta_description: policyData.meta_description ? policyData.meta_description.trim() : null,
      status: policyData.status || 'published',
      updated_at: now
    };

    if (policyData.id && !policyData.id.startsWith('policy-')) {
      payload.id = policyData.id;
    }

    // 1. Try upserting in public.policies table
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('policies')
      .upsert(payload, { onConflict: 'slug' })
      .select()
      .single();

    if (!dbError && dbData) {
      // Also sync to CMS fallback block for seamless redundancy
      await syncToCmsFallback(dbData as Policy);
      return { success: true, data: dbData as Policy };
    }

    // 2. If table doesn't exist yet, save into CMS blocks registry
    console.warn('Upserting to policies table failed, writing to CMS fallback block:', dbError?.message);
    const fallbackData: Policy = {
      id: policyData.id || `policy-${Date.now()}`,
      title: payload.title!,
      slug: payload.slug!,
      content: payload.content!,
      meta_title: payload.meta_title,
      meta_description: payload.meta_description,
      status: payload.status!,
      created_at: policyData.created_at || now,
      updated_at: now
    };

    await syncToCmsFallback(fallbackData);
    return { success: true, data: fallbackData };
  } catch (err: any) {
    console.error('Error in upsertPolicy:', err);
    return { success: false, error: err.message || 'حدث خطأ أثناء حفظ السياسة' };
  }
}

/**
 * Delete a policy by ID or slug - Super Admin action
 */
export async function deletePolicy(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete from public.policies
    await supabaseAdmin
      .from('policies')
      .delete()
      .or(`id.eq.${id},slug.eq.${id}`);

    // 2. Delete from CMS fallback block if present
    const { data: cmsData } = await supabaseAdmin
      .from('cms_blocks')
      .select('metadata')
      .eq('key', CMS_POLICIES_KEY)
      .maybeSingle();

    if (cmsData?.metadata?.policies) {
      const updated = (cmsData.metadata.policies as Policy[]).filter(
        p => p.id !== id && p.slug !== id
      );
      await supabaseAdmin
        .from('cms_blocks')
        .upsert({
          key: CMS_POLICIES_KEY,
          title_ar: 'سجل السياسات الاحتياطي',
          metadata: { policies: updated },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in deletePolicy:', err);
    return { success: false, error: err.message || 'فشل حذف السياسة' };
  }
}

/**
 * Helper to sync a policy into the CMS fallback block
 */
async function syncToCmsFallback(policy: Policy) {
  try {
    const { data: cmsData } = await supabaseAdmin
      .from('cms_blocks')
      .select('metadata')
      .eq('key', CMS_POLICIES_KEY)
      .maybeSingle();

    let existing: Policy[] = cmsData?.metadata?.policies || [...DEFAULT_POLICIES];
    const index = existing.findIndex(p => p.slug === policy.slug || p.id === policy.id);

    if (index >= 0) {
      existing[index] = { ...existing[index], ...policy };
    } else {
      existing.push(policy);
    }

    await supabaseAdmin
      .from('cms_blocks')
      .upsert({
        key: CMS_POLICIES_KEY,
        title_ar: 'سجل السياسات الاحتياطي',
        is_active: true,
        metadata: { policies: existing, lastUpdated: new Date().toISOString() },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
  } catch (e) {
    console.error('syncToCmsFallback error:', e);
  }
}
