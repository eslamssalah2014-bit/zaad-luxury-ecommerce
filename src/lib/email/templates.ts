export interface EmailTemplatePayload {
  recipientName: string;
  orderNumber?: string;
  orderTotal?: string | number;
  itemsSummary?: string;
  trackingNumber?: string;
  rejectionReason?: string;
  batchNumber?: string;
}

export function generateLuxuryEmailHtml(
  type: 'order_confirmation' | 'verification_pending' | 'payment_approved' | 'payment_rejected' | 'shipped' | 'delivered' | 'welcome' | 'vip_invitation',
  data: EmailTemplatePayload
): { subject: string; html: string } {
  const brandGreen = '#163E23';
  const brandGold = '#C59B27';
  const brandIvory = '#FAF8F5';

  let subject = '';
  let headline = '';
  let subheadline = '';
  let messageBody = '';
  let callToAction = { text: 'عرض تفاصيل الطلب في بوابة زاد', url: 'https://zaad-luxury.com/account' };

  switch (type) {
    case 'order_confirmation':
      subject = `زاد | تأكيد استلام طلبكم الكريم رقم (${data.orderNumber})`;
      headline = 'شكراً لاختياركم دار زاد للنقاء';
      subheadline = `الطلب رقم: ${data.orderNumber}`;
      messageBody = `
        <p>عميلنا الكريم <strong>${data.recipientName}</strong>،</p>
        <p>لقد استلمنا تفاصيل طلبكم لمقتنيات زاد الفاخرة. نسعد بثقتكم في انتقاء أجود أنواع العسل الطبيعي النادر المقطوف وفق أعلى معايير الأصالة والتراث.</p>
        <div style="background:#f4efe8; border-right: 4px solid ${brandGold}; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin:0; font-size:14px; color:#53483D;"><strong>إجمالي المقتنيات:</strong> ${data.orderTotal} ر.س</p>
          <p style="margin:6px 0 0 0; font-size:13px; color:#7F6E5E;">تم إرسال الطلب لغرفة التجهيز المعقمة لدى خبرائنا.</p>
        </div>
      `;
      break;

    case 'verification_pending':
      subject = `زاد | إيصال التحويل قيد المراجعة للطلب (${data.orderNumber})`;
      headline = 'جاري مطابقة إيصال الدفع';
      subheadline = `الطلب رقم: ${data.orderNumber}`;
      messageBody = `
        <p>عميلنا المتميز <strong>${data.recipientName}</strong>،</p>
        <p>تم استلام إيصال التحويل البنكي الخاص بكم بنجاح. يقوم فريق العمليات والمطابقة المالية حالياً بمراجعة التفاصيل لضمان أعلى معايير الدقة والسرعة.</p>
        <p>سيتم إشعاركم فور الاعتماد النهائي للبدء في تعبئة طلبكم داخل الصندوق الملكي الخاص.</p>
      `;
      break;

    case 'payment_approved':
      subject = `زاد | تم اعتماد الدفع بنجاح وبدء التجهيز الملكي (${data.orderNumber})`;
      headline = 'تم اعتماد التحويل البنكي بنجاح';
      subheadline = `الطلب رقم: ${data.orderNumber}`;
      messageBody = `
        <p>صاحب الذوق الرفيع <strong>${data.recipientName}</strong>،</p>
        <p>يسرنا إبلاغكم بأنه تم اعتماد إيصال الدفع بنجاح. انتقل طلبكم الآن إلى مرحلة <strong>التجهيز والتغليف الملكي</strong> بإشراف خبير الجودة لدينا.</p>
        <p>برطماناتكم ستصلكم مع شهادات الفحص المخبري المعتمدة ومحفورة برقم التشغيلة الفريد.</p>
      `;
      callToAction = { text: 'متابعة مسار التجهيز المباشر', url: `https://zaad-luxury.com/order-confirmation/${data.orderNumber}` };
      break;

    case 'payment_rejected':
      subject = `زاد | تنبيه بشأن إيصال الدفع للطلب (${data.orderNumber})`;
      headline = 'تنبيه بشأن مراجعة الإيصال';
      subheadline = `الطلب رقم: ${data.orderNumber}`;
      messageBody = `
        <p>عميلنا العزيز <strong>${data.recipientName}</strong>،</p>
        <p>نعتذر عن عدم التمكن من اعتماد الإيصال المرفق للأسباب التالية:</p>
        <div style="background:#FFF5F5; border-right: 4px solid #E53E3E; padding: 16px; margin: 20px 0; border-radius: 4px; color:#C53030;">
          <p style="margin:0; font-weight:bold;">سبب الملاحظة:</p>
          <p style="margin:4px 0 0 0;">${data.rejectionReason || 'الإيصال غير واضح أو لا يتطابق رقم الحساب المحول منه.'}</p>
        </div>
        <p>يرجى التكرم بالضغط على الرابط أدناه لإعادة إرفاق الإيصال الصحيح لنباشر فوراً تجهيز شحنتكم.</p>
      `;
      callToAction = { text: 'إعادة رفع إيصال الدفع', url: `https://zaad-luxury.com/order-confirmation/${data.orderNumber}` };
      break;

    case 'shipped':
      subject = `زاد | تم شحن مقتنياتكم الفاخرة برقم تتبع (${data.trackingNumber})`;
      headline = 'شحنتكم الملكية في طريقها إليكم';
      subheadline = `رقم التتبع: ${data.trackingNumber}`;
      messageBody = `
        <p>عميلنا الكريم <strong>${data.recipientName}</strong>،</p>
        <p>خرجت مقتنياتكم الآن من دار زاد داخل سيارات الشحن المبرد لحماية الإنزيمات الحية والنقاء الطبيعي من درجات الحرارة.</p>
        <div style="background:#f4efe8; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin:0; font-size:14px;"><strong>شركة الشحن:</strong> سمسا إكسبريس (النقل المبرد الفاخر)</p>
          <p style="margin:6px 0 0 0; font-size:14px;"><strong>رقم الشحنة:</strong> ${data.trackingNumber}</p>
        </div>
      `;
      callToAction = { text: 'تتبع الشحنة المباشر', url: 'https://zaad-luxury.com/account' };
      break;

    case 'delivered':
      subject = `زاد | نتمنى لكم تجربة نقاء لا تُنسى`;
      headline = 'تم تسليم مقتنيات زاد بنجاح';
      subheadline = 'نقاءٌ يصافح ذوقكم الرفيع';
      messageBody = `
        <p>عميلنا الراقي <strong>${data.recipientName}</strong>،</p>
        <p>تم تسليم طلبكم بنجاح. نرجو أن تكون تجربة التذوق بمستوى تطلعاتكم الرفيعة.</p>
        <p>يمكنكم فحص شهادة التحليل المخبري الخاصة بتشغيلتكم عبر مسح رمز الاستجابة السريع (QR) المطبوع على العبوة، أو مشاركتنا تقييمكم الكريم.</p>
      `;
      callToAction = { text: 'فحص شهادة النقاء وتقييم التجربة', url: 'https://zaad-luxury.com/purity-checker' };
      break;

    case 'welcome':
      subject = 'زاد | أهلاً بكم في دار الفخامة والنقاء الطبيعي';
      headline = 'مرحباً بكم في عالم زاد';
      subheadline = 'حيث تلتقي الأصالة بالفخامة الهادئة';
      messageBody = `
        <p>أهلاً بكم <strong>${data.recipientName}</strong>،</p>
        <p>بانضمامكم إلى دار زاد، تصبحون جزءاً من دائرة حصرية تقدّر النقاء المطلق والحرفة اليدوية المتوارثة في جني أندر أعسال الجزيرة العربية والعالم.</p>
        <p>حسابكم يمنحكم أولوية الحجز في مواسم القطاف النادرة والحصول على شهادات النقاء الرقمية الموثقة لكل قطرة.</p>
      `;
      callToAction = { text: 'استكشاف المحصول الحصري', url: 'https://zaad-luxury.com/shop' };
      break;

    case 'vip_invitation':
      subject = 'زاد | دعوة حصرية لنخبة الأعضاء: حصاد السدر الدوعني الملكي 2026';
      headline = 'دعوة خاصة لنخبة مقتني زاد';
      subheadline = 'إصدار محدود مرقم (200 برطمان فقط)';
      messageBody = `
        <p>سعادة <strong>${data.recipientName}</strong>،</p>
        <p>يسر دار زاد أن تفتح باب الحجز المبكر لمحصول الشتاء الملكي من أعماق وادي دوعن، بنسبة نقاء لقاح غير مسبوقة (99.1%) ورطوبة فائقة الانخفاض (13.8%).</p>
        <p>نظراً لمحدودية المحصول، تمت إتاحة الحجز المسبق لأعضاء الدائرة الخاصة فقط قبل طرحه العام.</p>
      `;
      callToAction = { text: 'حجز حصتكم من المحصول الملكي', url: 'https://zaad-luxury.com/shop' };
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif; background-color: #FAF8F5; margin: 0; padding: 0; color: #121814; direction: rtl; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border: 1px solid #E8E2D8; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: ${brandGreen}; padding: 36px 20px; text-align: center; border-bottom: 3px solid ${brandGold}; }
        .logo-text { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #FAF8F5; margin: 0; font-family: 'Amiri', serif; }
        .logo-accent { color: ${brandGold}; }
        .content { padding: 36px 30px; line-height: 1.8; font-size: 15px; }
        .headline { font-size: 22px; font-weight: bold; color: ${brandGreen}; margin-top: 0; margin-bottom: 6px; }
        .subheadline { font-size: 14px; color: ${brandGold}; font-weight: 600; text-transform: uppercase; margin-bottom: 24px; }
        .cta-btn { display: inline-block; background: ${brandGreen}; color: #ffffff !important; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 4px; margin-top: 24px; border: 1px solid ${brandGold}; font-size: 14px; }
        .footer { background: #F4EFE8; padding: 24px 30px; text-align: center; font-size: 12px; color: #7F6E5E; border-top: 1px solid #E8E2D8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo-text">Z<span class="logo-accent">AA</span>D</h1>
          <p style="margin: 6px 0 0 0; color: #DFBE60; font-size: 12px; letter-spacing: 2px;">دار النقاء الملكي والمنتجات الطبيعية</p>
        </div>
        <div class="content">
          <h2 class="headline">${headline}</h2>
          <div class="subheadline">${subheadline}</div>
          ${messageBody}
          <div style="text-align: center;">
            <a href="${callToAction.url}" class="cta-btn">${callToAction.text}</a>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 8px 0;"><strong>دار زاد للنقاء الفاخر (ZAAD)</strong></p>
          <p style="margin: 0 0 8px 0;">المملكة العربية السعودية | الإمارات العربية المتحدة | مصر</p>
          <p style="margin: 0; font-size: 11px; color: #A6927E;">جميع الحقوق محفوظة © ${new Date().getFullYear()} دار زاد</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
