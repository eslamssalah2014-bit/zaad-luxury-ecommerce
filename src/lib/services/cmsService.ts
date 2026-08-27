import { cache } from 'react';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { CmsSettingsDocument } from '@/types/cms';

export const DEFAULT_CMS_SETTINGS: CmsSettingsDocument = {
  version: 1,
  updatedAt: '2026-08-25T12:00:00.000Z',
  publishedAt: '2026-08-25T12:00:00.000Z',

  // 1. Hero Configuration
  hero: {
    headlineAr: 'زاد...',
    headlineHighlightAr: 'حيث يلتقي النقاء بالفخامة.',
    subtitleAr: 'المنتجات الطبيعية الحصرية • إصدار شتاء 2026',
    descriptionAr: 'منتجات طبيعية مختارة بعناية، بمعايير جودة صارمة وتجربة استثنائية تليق بمن يقدّر الأفضل.',
    backgroundImageUrl: '/images/zaad-nature-honey-clover.jpg',
    badgeTextAr: 'المنتجات الطبيعية الحصرية • إصدار شتاء 2026',
    primaryCtaTextAr: 'استكشاف المنتجات الطبيعية',
    primaryCtaLink: '/shop',
    secondaryCtaTextAr: 'قصة وإرث دار زاد',
    secondaryCtaLink: '/story',
    trustPillars: [
      { id: 'p1', value: '+40', labelAr: 'عاماً من الخبرة', sublabelAr: 'منذ ثمانينيات القرن الماضي' },
      { id: 'p2', value: '100%', labelAr: 'منتجات طبيعية', sublabelAr: 'عسل نقي بدون إضافات' },
      { id: 'p3', value: '0%', labelAr: 'إضافات أو خلط', sublabelAr: 'كما خلقته الطبيعة' },
      { id: 'p4', value: 'إرث', labelAr: 'متوارث عبر الأجيال', sublabelAr: 'شغف لا ينتهي' }
    ]
  },

  // 2. Homepage Sections
  homepageSections: [
    {
      id: 'sec-1',
      type: 'image_text',
      titleAr: 'إرث من الشغف لا من التجارة',
      subtitleAr: 'الفلسفة الأولى • البدايات والشغف',
      headlineAr: 'إرث من الشغف لا من التجارة',
      bodyAr: 'لم تبدأ زاد كخطة تجارية أو مشروع استثماري، بل بدأت من شغف حقيقي بتربية النحل والمحافظة على جودة العسل كما خلقته الطبيعة. امتد هذا الشغف عبر الأجيال ليصبح إرثًا نحمله اليوم بكل فخر.',
      quoteAr: 'بعض العلامات التجارية تُبنى بالأفكار... أما زاد فبُنيت بالشغف.',
      imageUrl: '/images/zaad-heritage-beekeepers.jpg',
      imageAltAr: 'إرث تربية النحل - زاد',
      imagePosition: 'right',
      ctaTextAr: 'اكتشف قصة زاد التراثية الكاملة',
      ctaLink: '/story',
      backgroundColor: '#ffffff',
      textColor: '#0f2918',
      isVisible: true,
      order: 1
    },
    {
      id: 'sec-2',
      type: 'image_text',
      titleAr: 'من الخلية إلى المائدة كما خلقته الطبيعة',
      subtitleAr: 'النقاء المطلق • ميثاق الطبيعة',
      headlineAr: 'من الخلية إلى المائدة كما خلقته الطبيعة',
      bodyAr: 'نؤمن أن الطبيعة قدمت لنا الكمال بالفعل، لذلك نحافظ على العسل في صورته الأصيلة دون إضافات أو معالجات تفقده هويته وقيمته الطبيعية.',
      quoteAr: 'العسل يأتي من النحلة إليك... كما أرادته الطبيعة.',
      imageUrl: '/images/zaad-nature-honey-clover.jpg',
      imageAltAr: 'عسل نوارة زاد التراثي - من الخلية إلى المائدة كما خلقته الطبيعة',
      imagePosition: 'left',
      backgroundColor: '#07160c',
      textColor: '#fbf8f1',
      features: [
        'لا نضيف شيئاً...',
        'ولا ننزع شيئاً...',
        'نحافظ فقط على ما منحته الطبيعة.'
      ],
      isVisible: true,
      order: 2
    },
    {
      id: 'sec-3',
      type: 'heritage_story',
      titleAr: 'أكثر من أربعة عقود من الخبرة المتوارثة',
      subtitleAr: 'أصالة التراث • أربعة عقود',
      headlineAr: 'أكثر من أربعة عقود من الخبرة المتوارثة',
      bodyAr: 'منذ ثمانينيات القرن الماضي تراكمت المعرفة والخبرة جيلاً بعد جيل، ليس فقط في إنتاج العسل، بل في فهم مواسمه واختيار أفضل المحاصيل والمحافظة على أعلى مستويات الجودة.',
      imageUrl: '/images/zaad-childhood-memories.jpg',
      imageAltAr: 'أربعة عقود من الخبرة المتوارثة - زاد',
      imagePosition: 'right',
      stats: [
        { id: 's1', value: '1980s', labelAr: 'بداية الرحلة', sublabelAr: 'هواية الجد وشغفه' },
        { id: 's2', value: '40+', labelAr: 'عاماً من الخبرة', sublabelAr: 'توارث المعرفة الحرفية' },
        { id: 's3', value: '100%', labelAr: 'مواسم مختارة', sublabelAr: 'نقاء تام بدون معالجة' }
      ],
      backgroundColor: '#f8f4ec',
      textColor: '#0f2918',
      isVisible: true,
      order: 3
    },
    {
      id: 'sec-4',
      type: 'banner',
      titleAr: 'انتقاء ملكي لأفضل المحاصيل',
      subtitleAr: 'المنتجات الطبيعية • معايير صارمة',
      headlineAr: 'انتقاء ملكي لأفضل المحاصيل',
      bodyAr: 'ليست كل المحاصيل تحمل اسم زاد. نختار بعناية ما ينسجم مع معاييرنا في النقاء والجودة والطعم والقيمة الغذائية لنقدم مجموعة منتقاة لمن يبحث عن الأفضل.',
      quoteAr: 'الفخامة الحقيقية تبدأ من حسن الاختيار.',
      imageUrl: '/images/zaad-story-hero-banner.jpg',
      imageAltAr: 'انتقاء ملكي لمحاصيل عسل زاد',
      imagePosition: 'left',
      backgroundColor: '#07160c',
      textColor: '#fbf8f1',
      isVisible: true,
      order: 4
    }
  ],

  // 3. Story & Heritage Page Configuration
  storyPage: {
    metaBadgeAr: 'إرث الأصالة المتوارث',
    mainTitleAr: 'قصة زاد',
    mainSubtitleAr: 'لم تبدأ زاد كشركة، ولا كمشروع تجاري.. بل بدأت كحكاية شغف وإخلاص امتدت لأكثر من أربعين عاماً.',
    heroBannerImageUrl: '/images/zaad-story-hero-banner.jpg',
    heroBannerTitleAr: 'إرثٌ عائلي من النقاء الخالص',
    heroBannerSubtitleAr: 'من ثمانينيات القرن الماضي وحتى اليوم',
    chapters: [
      {
        id: 'ch-1',
        periodTagAr: 'البدايات الأولى في ثمانينيات القرن الماضي',
        titleAr: 'هواية أحبها الجد وأخلص لها',
        descriptionParagraphs: [
          'بدأت الحكاية في ثمانينيات القرن الماضي، حين كان جدي يمارس تربية النحل كهواية أحبها وأخلص لها. كان يقضي ساعات طويلة بين المناحل، يتابع النحل بعناية ويحرص على أن يبقى العسل كما خلقته الطبيعة؛ نقيًا، خالصًا، دون أي إضافات أو تدخلات.',
          'لم يكن يبيع العسل في ذلك الوقت، بل كان يقدمه للأقارب والأصدقاء والمعارف. ومع مرور السنوات، أصبح الجميع ينتظر موسم العسل بشغف، لما عرفوه فيه من نقاء وجودة وطعم مختلف يصعب العثور عليه في الأسواق.'
        ],
        imageUrl: '/images/zaad-heritage-beekeepers.jpg',
        imageCaptionAr: 'صورة حقيقية لجدي رحمه الله عليه',
        order: 1,
        isVisible: true
      },
      {
        id: 'ch-2',
        periodTagAr: 'ذكريات الطفولة والمائدة العائلية',
        titleAr: 'عسلٌ كبرنا معه وعرفنا قيمته',
        descriptionParagraphs: [
          'بالنسبة لنا، لم يكن العسل مجرد غذاء، بل جزءًا أساسيًا من تفاصيل يومنا منذ الطفولة. كبرنا ونحن نرى كيف يُجمع العسل بحرص، وكيف يُحفظ بأمانة، وكيف تكون قطرة العسل الطبيعية الحقيقية مختلفة في قوامها، رائحتها، ومذاقها.',
          'تلك الذكريات غرست فينا معرفة عميقة بقيمة العسل الأصيل، وجعلتنا ندرك الفارق الحقيقي بين ما تنتجه الطبيعة بحرية وما تصنعه العمليات التجارية السريعة.'
        ],
        imageUrl: '/images/zaad-childhood-memories.jpg',
        imageCaptionAr: 'ذكريات الطفولة مع مواسم العسل الأولى',
        order: 2,
        isVisible: true
      },
      {
        id: 'ch-3',
        periodTagAr: 'ولادة زاد واستمرار العهد',
        titleAr: 'من إرث عائلي إلى دار زاد',
        descriptionParagraphs: [
          'مع مرور السنوات، ومن واقع ذلك الشغف المتوارث وتلك المعرفة المتراكمة، وُلدت «زاد».',
          'ولم يكن الهدف إنشاء علامة تجارية جديدة، بل الحفاظ على إرث عائلي امتد لعقود، والاستمرار على النهج نفسه الذي بدأ به جدي منذ أكثر من أربعين عامًا: عسل طبيعي خالص، يُنتج بعناية، ويصل إليك كما خرج من الخلية.'
        ],
        imageUrl: '/images/zaad-nature-honey-clover.jpg',
        imageCaptionAr: 'عسل زاد الطبيعي النقي - استمرار الإرث',
        order: 3,
        isVisible: true
      }
    ],
    valuesTitleAr: 'مبادئنا في دار زاد',
    valuesSubtitleAr: 'قيم متوارثة نلتزم بها في كل قطرة نقدمها',
    values: [
      { id: 'v1', titleAr: 'الأصالة المتوارثة', descAr: 'خبرة عملية ممتدة لأكثر من أربعة عقود توارثناها جيلاً بعد جيل.' },
      { id: 'v2', titleAr: 'النقاء الخالص 100%', descAr: 'عسل كما خلقته الطبيعة دون أي بسترة، تسخين، أو إضافات صناعية.' },
      { id: 'v3', titleAr: 'أمانة الاختيار', descAr: 'لا نعتمد إلا المنتجات التي تجتاز أعلى معايير الجودة الطبيعية.' }
    ]
  },

  // 4. Products / Shop Page Configuration
  shopPage: {
    heroBadgeAr: 'المجموعة الملكية المباشرة',
    mainTitleAr: 'مقتنيات زاد من أندر خيرات الطبيعة',
    subtitleAr: 'استكشف خيارات الأعسال الطبيعية المحصودة يدوياً والمختارة بعناية.',
    bannerImageUrl: '',
    searchPlaceholderAr: 'بحث باسم الصنف...',
    allCategoriesLabelAr: 'كافة المنتجات الطبيعية',
    sortFeaturedLabelAr: 'ترتيب: الإصدارات المميزة',
    sortPriceHighLabelAr: 'السعر: من الأعلى للأقل',
    sortPriceLowLabelAr: 'السعر: من الأقل للأعلى',
    sortRatingLabelAr: 'الأعلى تقييماً',
    resultsCountTemplateAr: 'النتائج المتاحة: {count} منتج طبيعي فاخر',
    resetFiltersLabelAr: 'إعادة تعيين المرشحات',
    gridColumns: 3,
    addToCartButtonTextAr: 'اقتناء',
    quickViewButtonTextAr: 'تفاصيل المنتج الطبيعي',
    showLabBatchTag: false,
    showOriginRegionTag: true,
    showRatingStars: true,
    emptyStateTitleAr: 'لم يتم العثور على مقتنيات مطابقة',
    emptyStateDescAr: 'جرب تغيير معايير البحث أو اختيار فئة أخرى لاستعراض منتجات زاد.',
    emptyStateButtonTextAr: 'استعراض كافة المنتجات',
    promoBanner: {
      isEnabled: true,
      badgeAr: 'ميثاق الجودة الملكية',
      titleAr: 'الضمان الذهبي والشحن لجميع محافظات مصر',
      descriptionAr: 'نضمن لك استرداداً كاملاً إذا لم تطابق منتجاتنا أعلى معايير النقاء الطبيعي.',
      buttonTextAr: 'استشر الخبير',
      buttonLink: '/#quiz',
      backgroundColor: '#07160c',
      textColor: '#fbf8f1'
    }
  },

  // 4b. Product Details Page Configuration
  productDetailPage: {
    defaultShippingTextAr: 'شحن لجميع محافظات مصر',
    defaultVatTextAr: 'شامل ضريبة القيمة المضافة',
    defaultTrustBadgeTextAr: 'نقاء موثق وخام 100%',
    defaultStockAvailableTextAr: 'متوفر بالمستودع',
    defaultStockOutTextAr: 'نفد من المخزون',
    relatedProductsTitleAr: 'منتجات طبيعية متناغمة قد تنال إعجابكم',
    reviewsHeadingAr: 'آراء المقتنين',
    addReviewHeadingAr: 'شاركنا انطباعك عن تجربة هذا المنتج',
    addReviewSubheadingAr: 'تقييمك يسهم في إثراء سجل دار زاد للنقاء.',
    addReviewButtonTextAr: 'إرسال التقييم',

    showBreadcrumbs: true,
    showWishlistAndShare: true,
    showRatingStars: true,
    showCompareAtPrice: true,
    showVatMessage: true,
    showShippingMessage: true,
    showTrustBadges: true,
    showStockStatus: true,
    showQuantityStepper: true,
    showAttributesGrid: true,
    showTabsSection: true,
    showRelatedProducts: true,
    showLabBatch: false,
    showSensoryProfile: false,

    defaultAttributes: [
      { id: 'attr-1', nameAr: 'اللون', valueAr: 'عنبري ذهبي نقي', icon: 'droplet', isVisible: true, order: 1 },
      { id: 'attr-2', nameAr: 'الرائحة', valueAr: 'عطرية زهرية دافئة', icon: 'sparkles', isVisible: true, order: 2 },
      { id: 'attr-3', nameAr: 'القوام', valueAr: 'حريري كثيف ومتماسك', icon: 'feather', isVisible: true, order: 3 },
      { id: 'attr-4', nameAr: 'المصدر', valueAr: 'أودية ومحميات طبيعية عذراء', icon: 'map-pin', isVisible: true, order: 4 },
      { id: 'attr-5', nameAr: 'بلد المنشأ', valueAr: 'جمهورية مصر العربية / وادي دوعن', icon: 'shield', isVisible: true, order: 5 },
      { id: 'attr-6', nameAr: 'الوزن الصافي', valueAr: '500 جرام', icon: 'award', isVisible: true, order: 6 },
    ],

    defaultTabs: [
      {
        id: 'tab-natural-details',
        slug: 'details',
        titleAr: 'تفاصيل المنتج الطبيعي',
        isVisible: true,
        order: 1,
        blocks: [
          {
            id: 'blk-1',
            type: 'rich_text',
            titleAr: 'قصة ونقاء المنتج',
            bodyAr: 'منتج طبيعي خالص يُستخرج وفق أعلى معايير الجودة والنقاء التام، دون أي إضافات صناعية أو معالجة حرارية تفقده خواصه الحيوية الفريدة.',
            isVisible: true,
            order: 1
          },
          {
            id: 'blk-2',
            type: 'icons_grid',
            titleAr: 'مواصفات الجودة والأصالة',
            isVisible: true,
            order: 2,
            iconsGridItems: [
              { id: 'ig-1', titleAr: 'خام 100%', descAr: 'مقطوف بعناية دون أي بسترة', icon: 'shield' },
              { id: 'ig-2', titleAr: 'إنزيمات حية', descAr: 'محفوظ بكامل نشاطه الطبيعي', icon: 'sparkles' },
              { id: 'ig-3', titleAr: 'نقاء مضمون', descAr: 'مطابق لأعلى مواصفات الجودة', icon: 'award' }
            ]
          }
        ]
      },
      {
        id: 'tab-benefits-usage',
        slug: 'benefits-usage',
        titleAr: 'الفوائد الصحية وطرق الاستخدام',
        isVisible: true,
        order: 2,
        blocks: [
          {
            id: 'blk-3',
            type: 'rich_text',
            titleAr: 'الفوائد الصحية وطقوس التذوق',
            bodyAr: 'يمتاز هذا المنتج بتركيزه العالي من مضادات الأكسدة والإنزيمات الحيوية التي تدعم مناعة الجسم وتعزز النشاط اليومي.',
            isVisible: true,
            order: 1
          },
          {
            id: 'blk-4',
            type: 'faq',
            titleAr: 'طرق الاستخدام المثالية',
            isVisible: true,
            order: 2,
            faqItems: [
              { id: 'fq-1', question: 'ما هي الطريقة الفضلى للاستخدام الصباحي؟', answer: 'ملعقة صباحية على الريق أو مذابة في ماء فاتر لتحقيق أقصى استفادة حيوية.' },
              { id: 'fq-2', question: 'كيف يُحفظ المنتج للمحافظة على جودته؟', answer: 'يحفظ في درجة حرارة الغرفة العادية بعيداً عن الرطوبة وأشعة الشمس المباشرة.' }
            ]
          }
        ]
      },
      {
        id: 'tab-faq',
        slug: 'faq',
        titleAr: 'الأسئلة الشائعة',
        isVisible: true,
        order: 3,
        blocks: [
          {
            id: 'blk-5',
            type: 'faq',
            titleAr: 'الأسئلة الأكثر شيوعاً حول المنتجات',
            isVisible: true,
            order: 1,
            faqItems: [
              { id: 'faq-101', question: 'هل العسل نقي وخام 100%؟', answer: 'نعم، كافة منتجات زاد خامة ومقطوفة بعناية ولا تخضع لأي تسخين أو معالجات كيميائية.' },
              { id: 'faq-102', question: 'ما هي مناطق التوصيل المتاحة؟', answer: 'نوفر الشحن والتوصيل لكافة محافظات جمهورية مصر العربية والدول العربية.' },
              { id: 'faq-103', question: 'ما هي سياسة الضمان والاسترجاع؟', answer: 'نضمن لك استرداداً كاملاً إذا لم يطابق المنتج توقعاتك ومعايير النقاء المعلنة.' }
            ]
          }
        ]
      },
      {
        id: 'tab-reviews',
        slug: 'reviews',
        titleAr: 'آراء المقتنين',
        isVisible: true,
        order: 4,
        isSystemReviewsTab: true,
        blocks: []
      }
    ]
  },

  // 5. Shopping Bag / Cart Drawer Configuration
  cartDrawer: {
    drawerTitleAr: 'حقيبة المنتجات الطبيعية',
    headerBadgeAr: 'نقاء وأصالة زاد',
    showFreeShippingBar: true,
    freeShippingThreshold: 600,
    freeShippingRemainingTextAr: 'تبقى {amount} للحصول على الشحن المجاني',
    freeShippingEligibleTextAr: 'مبارك! أنت مؤهل للشحن المجاني لجميع المحافظات',
    showGiftPackaging: true,
    giftPackagingTitleAr: 'تغليف الإهداء الطبيعي الفاخر',
    giftPackagingSubtitleAr: 'مقدم مع ملعقة خشب زيتون طبيعية مجاناً',
    giftMessagePlaceholderAr: 'اكتب رسالة إهداء خاصة ترفق مع الطلب...',
    showCouponSection: true,
    couponPlaceholderAr: 'رمز الخصم (جرب: ZAAD10)',
    couponButtonTextAr: 'تطبيق',
    couponActiveLabelAr: 'الرمز النشط:',
    subtotalLabelAr: 'إجمالي المنتجات:',
    discountLabelAr: 'الخصم المطبق:',
    shippingLabelAr: 'الشحن والتوصيل:',
    freeShippingLabelAr: 'مجاني',
    totalLabelAr: 'الإجمالي النهائي:',
    vatNoteAr: 'شامل ضريبة القيمة المضافة',
    checkoutButtonTextAr: 'متابعة إتمام الطلب',
    showViewCartLink: true,
    viewCartLinkTextAr: 'معاينة وتخصيص تفاصيل الحقيبة',
    emptyStateTitleAr: 'حقيبتك فارغة حالياً',
    emptyStateDescAr: 'استكشف منتجات زاد الطبيعية من أندر الأعسال والمنتجات النقية.',
    emptyStateButtonTextAr: 'استكشاف المنتجات الطبيعية',
    emptyStateButtonLink: '/shop'
  },

  // 6. Announcement Bar Configuration
  announcementBar: {
    isEnabled: true,
    messageTextAr: 'نقاء طبيعي بنسبة 100% مع كل برطمان | شحن لجميع محافظات مصر',
    secondaryTextAr: 'ميثاق النقاء الطبيعي',
    linkUrl: '/story',
    iconName: 'sparkles',
    backgroundColor: '#07160c',
    textColor: '#f3e8cb',
    accentColor: '#d4af37'
  },

  // 5. Navigation Menu Configuration
  navigation: {
    brandNameAr: 'زاد',
    brandTaglineAr: 'دَارُ النَّقَاءِ',
    logoUrl: '/images/zaad-logo.png',
    items: [
      { id: 'nav-1', nameAr: 'الرئيسية', href: '/', order: 1, isVisible: true },
      { id: 'nav-2', nameAr: 'المنتجات الطبيعية', href: '/shop', order: 2, isVisible: true, badgeAr: 'حصري' },
      { id: 'nav-3', nameAr: 'إرث وقصة زاد', href: '/story', order: 3, isVisible: true },
      { id: 'nav-4', nameAr: 'المنتجات الطبيعية', href: '/shop', order: 4, isVisible: false }
    ]
  },

  // 6. Testimonials Section Configuration (Echoes of Trust in ZAAD)
  testimonials: {
    isEnabled: true,
    mainTitleAr: 'أصداء الثقة في رحاب زاد',
    subtitleAr: 'شهادات النخبة وكبار المقتنين',
    descriptionAr: 'تجارب حقيقية موثقة من عملاء انتقوا التميز واعتمدوا نقاء زاد جزءاً من أسلوب حياتهم الراقي.',
    backgroundColor: '#faf7f0',
    textColor: '#0f2918',
    displayCount: 3,
    layoutType: 'grid',
    items: [
      {
        id: 'test-1',
        customerName: 'د. خالد بن سلطان آل سعود',
        customerTitleAr: 'مقتني معتمد لكبار الشخصيات',
        headingAr: 'نقاء دوعني استثنائي لا يقارن',
        contentAr: 'أقتني الأعسال النادرة منذ أكثر من عقدين، ولكن عسل السدر الدوعني من دار زاد فاق كل التوقعات بقوامه المخملي ورائحته الزكية ونقائه الصارم.',
        rating: 5,
        customerImageUrl: '',
        isVisible: true,
        order: 1,
        productPurchasedAr: 'عسل سدر دوعني ملكي معتق'
      },
      {
        id: 'test-2',
        customerName: 'سعادة المهندس فيصل الشمري',
        customerTitleAr: 'مهتم بالصحة الحيوية والطب الطبيعي',
        headingAr: 'خام 100% بكامل خواصه العلاجية والإنزيمات الحية',
        contentAr: 'أهم ما يميز زاد هو النقاء الطبيعي وخلو العسل تماماً من أي تسخين حراري. الإنزيمات الحية واضحة في المذاق والطاقة الحيوية التي يمنحها للجسم.',
        rating: 5,
        customerImageUrl: '',
        isVisible: true,
        order: 2,
        productPurchasedAr: 'عسل سمر بري جبلي نادر'
      },
      {
        id: 'test-3',
        customerName: 'الأستاذة نورة المنصور',
        customerTitleAr: 'سفيرة الفخامة والإهداء الراقي',
        headingAr: 'صندوق إهداء ملكي يبهر أصحاب الذوق الرفيع',
        contentAr: 'اخترت صندوق الإهداء لتقديمه في مناسبة رسمية، وكانت التجربة من التغليف المذهب والزجاج المعتم وسرعة التوصيل في قمة الاحترافية والرفعة.',
        rating: 5,
        customerImageUrl: '',
        isVisible: true,
        order: 3,
        productPurchasedAr: 'صندوق الاحتياط الملكي المذهب'
      }
    ]
  },

  // 7. Design & Theme Tokens
  design: {
    primaryGreen: '#0f2918',
    darkGreen: '#07160c',
    accentGold: '#d4af37',
    lightGold: '#f3e8cb',
    backgroundColor: '#faf7f0',
    surfaceColor: '#ffffff',
    fontFamily: 'Amiri',
    baseFontSizePx: 16,
    buttonRadius: 'pill',
    enableGlowEffects: true
  },

  // 8. SEO Configuration
  seo: {
    defaultMetaTitle: 'زاد | دار النقاء الطبيعي للأعسال الفاخرة',
    defaultMetaDescription: 'زاد (ZAAD) تقدم أفخر أنواع العسل الطبيعي النقي 100% من أودية دوعن وجبال عسير العذراء وفق أعلى معايير النقاء والجودة.',
    defaultOgImage: '/images/zaad-story-hero-banner.jpg',
    pages: [
      {
        pagePath: '/',
        pageNameAr: 'الرئيسية',
        metaTitle: 'زاد | دار النقاء الطبيعي للأعسال النادرة',
        metaDescription: 'اكتشف أنقى أنواع العسل الطبيعي من دار زاد.',
        ogImageUrl: '/images/zaad-story-hero-banner.jpg',
        keywords: ['عسل زاد', 'عسل سدر ملكي', 'عسل طبيعي نقي', 'عسل دوعني', 'أعسال فاخرة']
      },
      {
        pagePath: '/shop',
        pageNameAr: 'المنتجات الطبيعية (المتجر)',
        metaTitle: 'المنتجات الطبيعية | تسوق أفخر أعسال دار زاد',
        metaDescription: 'تسوق عسل السدر الدوعني وعسل السمر البري ومجموعات الهدايا الفاخرة.',
        ogImageUrl: '/images/zaad-nature-honey-clover.jpg',
        keywords: ['شراء عسل سدر', 'عسل سمر', 'هدايا عسل', 'عسل نوارة']
      },
      {
        pagePath: '/story',
        pageNameAr: 'إرث وقصة زاد',
        metaTitle: 'قصة زاد | أكثر من أربعة عقود من الخبرة المتوارثة',
        metaDescription: 'تعرف على قصة بدايات دار زاد في ثمانينيات القرن الماضي وشغف الجد برعاية النحل.',
        ogImageUrl: '/images/zaad-heritage-beekeepers.jpg',
        keywords: ['تراث زاد', 'تاريخ عسل زاد', 'قصة دار زاد', 'تربية النحل']
      }
    ]
  },

  // 9. Footer Configuration
  footer: {
    logoUrl: '/images/zaad-logo.png',
    brandNameAr: 'زاد | ZAAD',
    brandSloganAr: 'زَاد | دَارُ النَّقَاءِ الطَّبِيعِي',
    aboutTextAr: 'زاد ليست مجرد متجر للمنتجات الطبيعية؛ زاد هي عهد أصيل بحفظ التراث الطبيعي للأعسال النادرة، وتوثيق أعلى مستويات النقاء بعيداً عن المعالجات التجارية، لتصلكم خيرات الأرض كما أرادتها الطبيعة.',
    backgroundColor: '#07160c',
    textColor: '#fbf8f1',
    accentColor: '#c59b27',
    badges: [
      { id: 'b1', titleAr: 'نقاء دوعني موثق 100%', subtitleAr: 'جودة استثنائية لكل صنف', icon: 'award', isVisible: true, order: 1 },
      { id: 'b2', titleAr: 'إنزيمات حية كاملة', subtitleAr: 'بدون أي بسترة أو تسخين حراري', icon: 'shield', isVisible: true, order: 2 },
      { id: 'b3', titleAr: 'شحن لجميع المحافظات', subtitleAr: 'توصيل سريع لجميع محافظات مصر', icon: 'truck', isVisible: true, order: 3 },
      { id: 'b4', titleAr: 'مطابقة مالية فورية', subtitleAr: 'تحقق آمن وفوري لإيصالات التحويل', icon: 'lock', isVisible: true, order: 4 }
    ],
    columns: [
      {
        id: 'col-2',
        titleAr: 'عالم دار زاد',
        isVisible: true,
        order: 1,
        links: [
          { id: 'l5', labelAr: 'إرث وقصة دار زاد', href: '/story', openInNewTab: false, isVisible: true, order: 1 },
          { id: 'l6', labelAr: 'ميثاق النقاء الطبيعي', href: '/story', openInNewTab: false, isVisible: true, order: 2 },
          { id: 'l7', labelAr: 'مساعد اختيار العسل', href: '/#quiz', openInNewTab: false, isVisible: true, order: 3 }
        ]
      },
      {
        id: 'col-3',
        titleAr: 'خدمة العملاء',
        isVisible: true,
        order: 2,
        links: [
          { id: 'l8', labelAr: 'تتبع الشحنات والطلبات', href: '/cart', openInNewTab: false, isVisible: true, order: 1 },
          { id: 'l9', labelAr: 'الضمان الذهبي للاسترجاع', href: '/story', openInNewTab: false, isVisible: true, order: 2 },
          { id: 'l10', labelAr: 'التواصل المباشر مع الدار', href: 'https://wa.me/966500000000', openInNewTab: true, isVisible: true, order: 3 }
        ]
      }
    ],
    contact: {
      whatsappNumber: '+966500000000',
      whatsappPrefilledMessageAr: 'مرحباً دار زاد، أرغب بالاستفسار عن المنتجات الطبيعية المتاحة.',
      customerSupportEmail: 'concierge@zaad.sa',
      supportPhone: '+966 800 123 9223',
      workingHoursAr: 'يومياً من 9:00 ص حتى 11:00 م (توقيت مكة المكرمة)',
      addressAr: 'المملكة العربية السعودية • الرياض • حي حطين'
    },
    social: {
      instagram: 'https://instagram.com/zaad_honey',
      twitter: 'https://twitter.com/zaad_honey',
      whatsapp: 'https://wa.me/966500000000',
      tiktok: 'https://tiktok.com/@zaad_honey',
      youtube: '',
      facebook: '',
      linkedin: ''
    },
    copyrightTextAr: '© 2026 دار زاد للنقاء الطبيعي (House of ZAAD). جميع الحقوق محفوظة.',
    vatOrCrNumberAr: 'سجل تجاري: 1010894210 • الرقم الضريبي: 31098421000003'
  }
};

/**
 * Cache for live and draft CMS settings
 */
let cachedLiveSettings: CmsSettingsDocument | null = null;
let cachedDraftSettings: CmsSettingsDocument | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds

/**
 * Loads published or draft CMS configuration from Supabase cms_blocks with instant fallback
 */
export const getCmsSettings = cache(async function getCmsSettings(isDraft = false): Promise<CmsSettingsDocument> {
  const now = Date.now();
  if (isDraft && cachedDraftSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedDraftSettings;
  }
  if (!isDraft && cachedLiveSettings && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedLiveSettings;
  }

  try {
    const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
    const { data, error } = await client
      .from('cms_blocks')
      .select('*')
      .eq('key', 'master_cms_settings')
      .maybeSingle();

    if (error) {
      console.warn('⚠️ cms_blocks query notice (falling back to defaults):', error.message);
      return DEFAULT_CMS_SETTINGS;
    }

    if (data && data.metadata) {
      const meta = data.metadata as any;
      const liveData = (meta.data || meta) as CmsSettingsDocument;
      const draftData = (meta.draft_data || meta.data || meta) as CmsSettingsDocument;

      if (liveData) cachedLiveSettings = mergeWithDefaults(liveData);
      if (draftData) cachedDraftSettings = mergeWithDefaults(draftData);

      lastFetchTime = now;
      return isDraft
        ? (cachedDraftSettings || DEFAULT_CMS_SETTINGS)
        : (cachedLiveSettings || DEFAULT_CMS_SETTINGS);
    }

    // If record doesn't exist in Supabase yet, attempt to auto-seed it seamlessly
    if (typeof window === 'undefined') {
      try {
        await supabaseAdmin.from('cms_blocks').upsert({
          key: 'master_cms_settings',
          title_ar: 'إعدادات المحتوى الشامل (Master CMS)',
          subtitle_ar: 'هوية ومحتوى الموقع',
          headline_ar: DEFAULT_CMS_SETTINGS.hero.headlineAr,
          body_ar: DEFAULT_CMS_SETTINGS.hero.descriptionAr,
          metadata: {
            data: DEFAULT_CMS_SETTINGS,
            draft_data: DEFAULT_CMS_SETTINGS,
            is_published: true
          },
          is_active: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      } catch (seedErr) {
        console.warn('Could not auto-seed cms_blocks master_cms_settings (non-fatal):', seedErr);
      }
    }

    return DEFAULT_CMS_SETTINGS;
  } catch (err) {
    console.error('Error in getCmsSettings, using default luxury fallback:', err);
    return DEFAULT_CMS_SETTINGS;
  }
});

/**
 * Saves draft configuration in Supabase cms_blocks table
 */
export async function saveCmsDraft(draftDoc: CmsSettingsDocument): Promise<{ success: boolean; error?: string }> {
  try {
    const updatedDraft: CmsSettingsDocument = {
      ...draftDoc,
      updatedAt: new Date().toISOString()
    };

    // Fetch existing live data to preserve published state
    const currentLive = cachedLiveSettings || DEFAULT_CMS_SETTINGS;

    const { error } = await supabaseAdmin
      .from('cms_blocks')
      .upsert({
        key: 'master_cms_settings',
        title_ar: 'إعدادات المحتوى الشامل (Master CMS)',
        subtitle_ar: 'هوية ومحتوى الموقع',
        headline_ar: updatedDraft.hero?.headlineAr || 'زاد',
        body_ar: updatedDraft.hero?.descriptionAr || 'دار النقاء',
        metadata: {
          data: currentLive,
          draft_data: updatedDraft,
          is_published: true
        },
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      throw error;
    }

    cachedDraftSettings = updatedDraft;
    lastFetchTime = Date.now();
    return { success: true };
  } catch (err: any) {
    console.error('Error saving CMS draft:', err);
    return { success: false, error: err.message || 'فشل في حفظ المسودة' };
  }
}

/**
 * Publishes draft configuration to live storefront in Supabase cms_blocks table
 */
export async function publishCmsSettings(docToPublish: CmsSettingsDocument): Promise<{ success: boolean; error?: string }> {
  try {
    const publishedDoc: CmsSettingsDocument = {
      ...docToPublish,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('cms_blocks')
      .upsert({
        key: 'master_cms_settings',
        title_ar: 'إعدادات المحتوى الشامل (Master CMS)',
        subtitle_ar: 'هوية ومحتوى الموقع',
        headline_ar: publishedDoc.hero?.headlineAr || 'زاد',
        body_ar: publishedDoc.hero?.descriptionAr || 'دار النقاء',
        metadata: {
          data: publishedDoc,
          draft_data: publishedDoc,
          is_published: true
        },
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      throw error;
    }

    cachedLiveSettings = publishedDoc;
    cachedDraftSettings = publishedDoc;
    lastFetchTime = Date.now();
    return { success: true };
  } catch (err: any) {
    console.error('Error publishing CMS settings:', err);
    return { success: false, error: err.message || 'فشل في نشر التعديلات' };
  }
}

/**
 * Deep merge helper to guarantee no missing fields when schema evolves
 */
function mergeWithDefaults(incoming: Partial<CmsSettingsDocument>): CmsSettingsDocument {
  return {
    ...DEFAULT_CMS_SETTINGS,
    ...incoming,
    hero: { ...DEFAULT_CMS_SETTINGS.hero, ...(incoming.hero || {}) },
    homepageSections: incoming.homepageSections && incoming.homepageSections.length > 0
      ? incoming.homepageSections
      : DEFAULT_CMS_SETTINGS.homepageSections,
    storyPage: {
      ...DEFAULT_CMS_SETTINGS.storyPage,
      ...(incoming.storyPage || {}),
      chapters: incoming.storyPage?.chapters?.length
        ? incoming.storyPage.chapters
        : DEFAULT_CMS_SETTINGS.storyPage.chapters
    },
    shopPage: {
      ...DEFAULT_CMS_SETTINGS.shopPage,
      ...(incoming.shopPage || {}),
      promoBanner: {
        ...DEFAULT_CMS_SETTINGS.shopPage.promoBanner,
        ...(incoming.shopPage?.promoBanner || {})
      }
    },
    productDetailPage: {
      ...DEFAULT_CMS_SETTINGS.productDetailPage,
      ...(incoming.productDetailPage || {}),
      defaultTabs: incoming.productDetailPage?.defaultTabs && incoming.productDetailPage.defaultTabs.length > 0
        ? incoming.productDetailPage.defaultTabs
        : DEFAULT_CMS_SETTINGS.productDetailPage.defaultTabs,
      defaultAttributes: incoming.productDetailPage?.defaultAttributes && incoming.productDetailPage.defaultAttributes.length > 0
        ? incoming.productDetailPage.defaultAttributes
        : DEFAULT_CMS_SETTINGS.productDetailPage.defaultAttributes,
    },
    cartDrawer: { ...DEFAULT_CMS_SETTINGS.cartDrawer, ...(incoming.cartDrawer || {}) },
    announcementBar: { ...DEFAULT_CMS_SETTINGS.announcementBar, ...(incoming.announcementBar || {}) },
    navigation: {
      ...DEFAULT_CMS_SETTINGS.navigation,
      ...(incoming.navigation || {}),
      items: incoming.navigation?.items?.length
        ? incoming.navigation.items
        : DEFAULT_CMS_SETTINGS.navigation.items
    },
    testimonials: {
      ...DEFAULT_CMS_SETTINGS.testimonials,
      ...(incoming.testimonials || {}),
      items: incoming.testimonials?.items?.length
        ? incoming.testimonials.items
        : DEFAULT_CMS_SETTINGS.testimonials.items
    },
    design: { ...DEFAULT_CMS_SETTINGS.design, ...(incoming.design || {}) },
    seo: {
      ...DEFAULT_CMS_SETTINGS.seo,
      ...(incoming.seo || {}),
      pages: incoming.seo?.pages?.length ? incoming.seo.pages : DEFAULT_CMS_SETTINGS.seo.pages
    },
    footer: {
      ...DEFAULT_CMS_SETTINGS.footer,
      ...(incoming.footer || {}),
      badges: incoming.footer?.badges !== undefined ? incoming.footer.badges : DEFAULT_CMS_SETTINGS.footer.badges,
      columns: incoming.footer?.columns !== undefined ? incoming.footer.columns : DEFAULT_CMS_SETTINGS.footer.columns,
      contact: { ...DEFAULT_CMS_SETTINGS.footer.contact, ...(incoming.footer?.contact || {}) },
      social: { ...DEFAULT_CMS_SETTINGS.footer.social, ...(incoming.footer?.social || {}) }
    }
  };
}
