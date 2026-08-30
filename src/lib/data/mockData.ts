import { Product, Category, Order, User, Review, CmsSection, AuditLog } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    nameAr: 'أعسال السدر النادرة',
    nameEn: 'Rare Sidr Honeys',
    slug: 'rare-sidr',
    descriptionAr: 'أنقى أنواع عسل السدر المقطوف من أصفى المحميات والمناحل العذراء وفق أعلى معايير النقاء الملكي.',
    imageUrl: '/images/zaad-nature-honey-clover.jpg',
    sortOrder: 1,
    itemCount: 4,
  },
  {
    id: 'cat-2',
    nameAr: 'أعسال الجبال والبراري',
    nameEn: 'Mountain & Wild Honeys',
    slug: 'mountain-wild',
    descriptionAr: 'رحيق بري غني بمضادات الأكسدة مستخلص من أزهار شوكية نادرة وأشجار السمر البرية المعمرة.',
    imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    sortOrder: 2,
    itemCount: 3,
  },
  {
    id: 'cat-3',
    nameAr: 'المجموعات الملكية والهدايا',
    nameEn: 'Royal Reserve & Gift Boxes',
    slug: 'royal-gifts',
    descriptionAr: 'صناديق خشبية فاخرة مكسوة بالمخمل ومختومة بالذهب مع ملاعق خشب الزيتون المعتق لنخبة الإهداء.',
    imageUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=800&q=80',
    sortOrder: 3,
    itemCount: 2,
  },
  {
    id: 'cat-4',
    nameAr: 'منتجات الخلية الفاخرة',
    nameEn: 'Royal Bee Essentials',
    slug: 'bee-essentials',
    descriptionAr: 'غذاء الملكات النقي، وصمغ العكبر المعتق، وحبوب اللقاح الجبلية عالية التركيز الحيوي.',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    sortOrder: 4,
    itemCount: 2,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'royal-sidr-doan',
    sku: 'ZD-SDR-500',
    nameAr: 'عسل سدر ملكي فاخر',
    nameEn: 'Royal Sidr Honey',
    taglineAr: 'تاج الأعسال النادرة، مقطوف يدوياً من أشجار السدر البرية بنقاء استثنائي.',
    categoryId: 'cat-1',
    categoryNameAr: 'أعسال السدر النادرة',
    price: 490,
    compareAtPrice: 580,
    currency: 'EGP',
    stockQuantity: 28,
    reservedStock: 4,
    lowStockThreshold: 10,
    weightGrams: 500,
    originRegionAr: '',
    originRegionEn: '',
    floralSourceAr: 'شجر السدر البري المعمر (Ziziphus Spina-Christi)',
    floralSourceEn: 'Ancient Wild Sidr Trees',
    shortDescAr: 'عسل سدر أحادي الزهرة بنسبة نقاء لقاح تتجاوز 98.6%، يمتاز بقوام حريري ثقيل ولون كهرماني ذهبي ونكهة خشبية دافئة لا تضاهى.',
    fullStoryAr: `في قلب المحميات الطبيعية المعزولة عن أي مصادر تلوث، حيث تتجذر أشجار السدر لقرون طويلة في تربة غنية بالمعادن، يجمع نحالونا المعتمدون هذا الرحيق النادر في فترة إزهار وجيزة لا تتجاوز بضعة أسابيع في العام.
    
    يمر كل برطمان بعملية فلترة يدوية باردة ثلاثية المراحل دون أي تسخين أو معالجة حرارية للحفاظ على الإنزيمات الحية ومركبات الفلافونويد الفعالة. هذا الإصدار يخضع لمعايير جودة صارمة توثق خلوه التام من السكريات المضافة والمتبقيات الكيميائية.`,
    healthBenefitsAr: [
      'دعم فائق للجهاز المناعي بفضل مضادات الأكسدة الفريدة',
      'تعزيز طاقة الجسم الحيوية والنشاط الذهني الصباحي',
      'تهدئة الجهاز الهضمي وترميم الأغشية المخاطية',
      'نقاء طبيعي 100% غني بالإنزيمات الحية النشطة'
    ],
    pairingSuggestionsAr: [
      'ملعقة واحدة على الريق مع ماء فاتر دافئ',
      'مع جبن الماعز المعتق والمكسرات النيئة',
      'لمسة ذهبية فوق المشروبات العشبية الملكية'
    ],
    storageInstructionsAr: 'يحفظ في مكان مظلم وبارد بدرجة حرارة الغرفة (18-24 مئوية). تجنب استخدام ملاعق معدنية ويفضل استخدام ملعقة خشب الزيتون المرفقة.',
    images: [
      '/images/zaad-nature-honey-clover.jpg',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 4.98,
    reviewCount: 42,
    badge: 'إصدار ملكي خاص',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 5,
      density: 5,
      intensity: 4,
      crystallization: 'نادر جداً'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-SD01',
      harvestSeason: 'موسم الشتاء 2026',
      harvestDate: '2026-01-15',
      testedDate: '2026-02-02',
      labName: 'مختبرات الجودة النوعية الأوروبية (Eurofins Scientific)',
      moisturePercentage: 14.2,
      hmfLevel: 2.1,
      diastaseActivity: 19.4,
      sucrosePercentage: 0.8,
      pollenPurityPercentage: 98.6,
      certificatePdfUrl: '/certificates/ZD-2026-SD01.pdf',
      labSealImageUrl: '/images/lab-seal.png'
    }
  },
  {
    id: 'prod-2',
    slug: 'wild-samar-honey',
    sku: 'ZD-SMR-500',
    nameAr: 'عسل سمر بري جبلي معتق',
    nameEn: 'Aged Wild Mountain Samar Honey',
    taglineAr: 'رحيق داكن كثيف مستخلص من شوكيات السمر البرية في جبال عسير الشاهقة.',
    categoryId: 'cat-2',
    categoryNameAr: 'أعسال الجبال والبراري',
    price: 360,
    compareAtPrice: 420,
    currency: 'EGP',
    stockQuantity: 19,
    reservedStock: 2,
    lowStockThreshold: 8,
    weightGrams: 500,
    originRegionAr: 'منحدرات جبال عسير، المملكة العربية السعودية',
    originRegionEn: 'Asir Highlands, Saudi Arabia',
    floralSourceAr: 'شجر السمر البري وأشجار الطلح (Acacia Tortilis)',
    floralSourceEn: 'Wild Acacia & Samar Blossoms',
    shortDescAr: 'يمتاز بلونه العنابي الداكن المائل للسواد ونكهته المدخنة اللذيذة المحببة لعشاق الأعسال الكثيفة الغنية بالحديد والمعادن.',
    fullStoryAr: `يعد عسل السمر الجبلي من أكثر الأعسال تميزاً بتركيبته المعدنية الغنية. ينحدر هذا العسل من شجيرات السمر المقاومة لقسوة الجبال، حيث تمتص جذورها العميقة خلاصة التربة البركانية الغنية.
    
    يتميز بنسبة عالية جداً من مضادات الأكسدة التي تمنحه لونه الداكن وقوامه المخملي الفريد. تم فحصه بعناية لضمان أدنى مستويات الرطوبة الطبيعية مما يمنحه ثباتاً وجودة استثنائية عبر السنين.`,
    healthBenefitsAr: [
      'غني جداً بالحديد والمعادن لتعزيز صحة الدم',
      'مفيد لصحة الكبد وتطهير السموم الحيوية',
      'مهدئ فعال لالتهابات الحلق والجهاز التنفسي',
      'منخفض السكريات الأحادية ومناسب لكبار السن'
    ],
    pairingSuggestionsAr: [
      'مع الحليب الدافئ وحبة البركة',
      'مكمل فاخر للخبز الأسمر والزبدة الطبيعية',
      'ملعقة قبل النوم لنوم هادئ ومريح'
    ],
    storageInstructionsAr: 'يحفظ بعيداً عن الرطوبة وأشعة الشمس المباشرة.',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85',
      '/images/zaad-nature-honey-clover.jpg'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 4.95,
    reviewCount: 31,
    badge: 'موسم نادر',
    sensoryProfile: {
      sweetness: 3,
      floralAroma: 4,
      density: 5,
      intensity: 5,
      crystallization: 'منعدم'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-SM02',
      harvestSeason: 'موسم ربيع 2026',
      harvestDate: '2026-01-20',
      testedDate: '2026-02-05',
      labName: 'معهد أبحاث النحل والمنتجات الطبيعية',
      moisturePercentage: 13.8,
      hmfLevel: 1.8,
      diastaseActivity: 22.1,
      sucrosePercentage: 0.5,
      pollenPurityPercentage: 97.2,
      certificatePdfUrl: '/certificates/ZD-2026-SM02.pdf'
    }
  },
  {
    id: 'prod-3',
    slug: 'white-mountain-honey',
    sku: 'ZD-WMT-500',
    nameAr: 'عسل المروج البيضاء القرغيزي النقي',
    nameEn: 'White Mountain Meadow Honey',
    taglineAr: 'بلورات كريمية بيضاء نادرة تذوب في الفم برقة نسيم جبال تيان شان الثلجية.',
    categoryId: 'cat-2',
    categoryNameAr: 'أعسال الجبال والبراري',
    price: 320,
    compareAtPrice: 380,
    currency: 'EGP',
    stockQuantity: 14,
    reservedStock: 1,
    lowStockThreshold: 5,
    weightGrams: 500,
    originRegionAr: 'جبال ألا-تو، آسيا الوسطى (ارتفاع 2800م)',
    originRegionEn: 'Ala-Too Alpine Peaks (2800m altitude)',
    floralSourceAr: 'نباتات العنبريس البرية وإسبرسيت الجبلي',
    floralSourceEn: 'Wild Sainfoin & Alpine Herbs',
    shortDescAr: 'عسل أبيض ثلجي ذو قوام كريمي كالحرير، بنكهة زهرية منعشة خفيفة وحلاوة متوازنة تجعله تجربة حسية فريدة لا تنسى.',
    fullStoryAr: `يجمع هذا العسل من ارتفاعات شاهقة تفوق 2800 متر فوق سطح البحر حيث الهواء فائق النقاء والمياه العذبة الذائبة من القمم الجليدية.
    
    تمنحه أزهار الساينفوين الجبلية لونه الأبيض الحليبي الطبيعي دون أي إضافات، ويتبلور بشكل طبيعي ميكروسكوبي ليكتسب ملمس الزبدة المخفوقة الفاخرة.`,
    healthBenefitsAr: [
      'مهدئ رائع للأعصاب ومساعد على الاسترخاء',
      'مرطب ممتاز للبشرة ومقاوم لعلامات الإجهاد',
      'خفيف جداً على المعدة وسهل الهضم السريع',
      'مثالي للأطفال والرياضيين'
    ],
    pairingSuggestionsAr: [
      'مع رقائق الشوفان والزبادي اليوناني',
      'دهنه على التوست الفرنسي الساخن',
      'مع الشاي الأبيض النادر'
    ],
    storageInstructionsAr: 'يحفظ في بيئة معتدلة (15-20 مئوية) للحفاظ على بنيته الكريمية.',
    images: [
      'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=1000&q=85',
      '/images/zaad-nature-honey-clover.jpg'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 4.92,
    reviewCount: 19,
    badge: 'قوام كريمي فاخر',
    sensoryProfile: {
      sweetness: 3,
      floralAroma: 4,
      density: 4,
      intensity: 3,
      crystallization: 'كريمي طبيعي'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-WM03',
      harvestSeason: 'موسم صيف 2025',
      harvestDate: '2025-08-10',
      testedDate: '2025-09-01',
      labName: 'مختبر مراقبة الأغذية العضوية الدولي',
      moisturePercentage: 15.1,
      hmfLevel: 3.2,
      diastaseActivity: 17.0,
      sucrosePercentage: 1.1,
      pollenPurityPercentage: 96.8,
      certificatePdfUrl: '/certificates/ZD-2026-WM03.pdf'
    }
  },
  {
    id: 'prod-4',
    slug: 'royal-zaad-reserve-box',
    sku: 'ZD-ROYAL-BOX',
    nameAr: 'صندوق الاحتياط الملكي الفاخر (ثلاثية زاد)',
    nameEn: 'The House of ZAAD Royal Reserve Box',
    taglineAr: 'تحفة إهدائية تضم أعسال السدر والسمر والمروج البيضاء في صندوق من خشب الجوز المعتق.',
    categoryId: 'cat-3',
    categoryNameAr: 'المجموعات الملكية والهدايا',
    price: 1190,
    compareAtPrice: 1350,
    currency: 'EGP',
    stockQuantity: 12,
    reservedStock: 3,
    lowStockThreshold: 5,
    weightGrams: 1500,
    originRegionAr: 'إصدار منتقى من أفضل محاصيل الجزيرة وآسيا',
    originRegionEn: 'Exclusive Multi-Valley Collection',
    floralSourceAr: 'سدر ملكي + سمر جبلي + مروج بيضاء',
    floralSourceEn: 'Royal Sidr + Mountain Samar + White Meadow',
    shortDescAr: 'المجموعة الإهدائية الأكثر فخامة. تتضمن 3 برطمانات كريستالية معتمة لحفظ النقاء، مع ملعقتين محفورتين من خشب الزيتون المعمر وبطاقة إهداء مذهبة.',
    fullStoryAr: `صممت مجموعة الاحتياط الملكي لتمثل قمة الفخامة العربية والضيافة الرفيعة. تم تصنيع كل صندوق يدوياً من خشب الجوز الطبيعي المبطن بالمخمل الأخضر الملكي، مختوماً بشعار زاد المذهب.
    
    تتضمن المجموعة شهادة أصالة موقعة تتضمن أرقام التشغيلات وتوثيق الجودة والنقاء لكل صنف لضمان تجربة إهداء تليق بالمقام.`,
    healthBenefitsAr: [
      'تجربة متكاملة تجمع خصائص العلاج والنقاء الملكي',
      'تنوع فريد في المعادن ومضادات الأكسدة الحيوية',
      'أفضل هدية لكبار الشخصيات ورجال الأعمال'
    ],
    pairingSuggestionsAr: [
      'تذوق مقارن مع مجالس الشاي والقهوة العربية',
      'تقديمها في المناسبات والمجالس الرفيعة'
    ],
    storageInstructionsAr: 'يحفظ الصندوق في مكان جاف ومعتدل.',
    images: [
      'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=1000&q=85',
      '/images/zaad-nature-honey-clover.jpg'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 5.00,
    reviewCount: 16,
    badge: 'الأكثر فخامة',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 5,
      density: 5,
      intensity: 5,
      crystallization: 'متنوع'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-ROYAL-BOX',
      harvestSeason: 'المنتجات الطبيعية 2026',
      harvestDate: '2026-01-18',
      testedDate: '2026-02-08',
      labName: 'معهد فحص النقاء الملكي المعتمد',
      moisturePercentage: 14.0,
      hmfLevel: 2.0,
      diastaseActivity: 20.5,
      sucrosePercentage: 0.7,
      pollenPurityPercentage: 99.1,
      certificatePdfUrl: '/certificates/ZD-2026-ROYAL-BOX.pdf'
    }
  },
  {
    id: 'prod-5',
    slug: 'pure-black-seed-honey',
    sku: 'ZD-NIG-500',
    nameAr: 'عسل حبة البركة النقي الطبيعي',
    nameEn: 'Pure Black Seed Flower Honey',
    taglineAr: 'عسل طبيعي خالص ينتجه النحل من رحيق أزهار حبة البركة (حبة السوداء).',
    categoryId: 'cat-2',
    categoryNameAr: 'أعسال الجبال والبراري',
    price: 290,
    compareAtPrice: 340,
    currency: 'EGP',
    stockQuantity: 22,
    reservedStock: 1,
    lowStockThreshold: 6,
    weightGrams: 500,
    originRegionAr: 'واحات صعيد مصر العليا العضوية',
    originRegionEn: 'Upper Egypt Organic Oases',
    floralSourceAr: 'أزهار نبات الحبة السوداء (Nigella Sativa)',
    floralSourceEn: 'Black Cumin Blossoms',
    shortDescAr: 'عسل غير مخلوط بحبوب البركة المطحونة، بل ناتج من تغذية النحل الحصرية على رحيق زهورها البنفسجية الرقيقة.',
    fullStoryAr: `يختلف عسل زاد لحبة البركة تماماً عما هو رائج تجارياً؛ فنحن لا نخلط مسحوق الحبة السوداء بالعسل، بل نضع خلايانا في مزارع معتمدة ومحمية أثناء موسم تفتح أزهار النبتة.
    
    يمتلك هذا العسل رائحة عطرية مميزة ولوناً عنبرياً شفافاً، مع تركيز عالٍ من مركب الثيموكينون الطبيعي المهدئ والداعم للمناعة.`,
    healthBenefitsAr: [
      'غني بمركبات الثيموكينون الداعمة للجهاز التنفسي والمناعي',
      'يساعد على تنشيط الدورة الدموية ومقاومة الإجهاد',
      'مفيد جداً في مواسم تغير الطقس والشتاء'
    ],
    pairingSuggestionsAr: [
      'مع عصير الليمون الطازج والزنجبيل',
      'ملعقة صباحية مع التمر الرطب'
    ],
    storageInstructionsAr: 'يحفظ في درجة حرارة الغرفة العادية.',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: false,
    isAvailable: true,
    rating: 4.88,
    reviewCount: 14,
    badge: 'طاقة ومناعة',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 4,
      density: 4,
      intensity: 4,
      crystallization: 'نادر'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-NG04',
      harvestSeason: 'موسم ربيع 2026',
      harvestDate: '2026-02-01',
      testedDate: '2026-02-12',
      labName: 'المركز القومي للمنتجات العضوية',
      moisturePercentage: 15.5,
      hmfLevel: 2.8,
      diastaseActivity: 18.2,
      sucrosePercentage: 1.2,
      pollenPurityPercentage: 95.5,
      certificatePdfUrl: '/certificates/ZD-2026-NG04.pdf'
    }
  },
  {
    id: 'prod-6',
    slug: 'pure-royal-jelly-extract',
    sku: 'ZD-RJ-100',
    nameAr: 'غذاء ملكات النحل الجبلي النقي 100%',
    nameEn: '100% Pure Mountain Royal Jelly',
    taglineAr: 'إكسير الشباب الملكي الخام، مستخرج ومجمد فورياً للحفاظ على النشاط الحيوي.',
    categoryId: 'cat-4',
    categoryNameAr: 'منتجات الخلية الفاخرة',
    price: 450,
    compareAtPrice: 520,
    currency: 'EGP',
    stockQuantity: 15,
    reservedStock: 0,
    lowStockThreshold: 5,
    weightGrams: 100,
    originRegionAr: 'جبال طوروس العذراء',
    originRegionEn: 'Taurus Mountain Reserves',
    floralSourceAr: 'إفراز بيولوجي نقي من عاملات النحل اليافعات',
    floralSourceEn: 'Pure Queen Bee Royal Secretion',
    shortDescAr: 'غذاء ملكات طازج 100% خام غير مخفف، بتركيز 10-HDA يفوق 2.6%، يشحن في عبوات حرارية مبردة للحفاظ على فاعليته البيولوجية.',
    fullStoryAr: `يعد غذاء الملكات من أندر هدايا الخلية، فهو الغذاء الحصري لملكة النحل الذي يمنحها عمراً وحيوية تفوق باقي النحل بأربعين ضعفاً.
    
    نقوم بجمعه في بيئات خالية تماماً من المبيدات، ونعبئه فوراً في عبوات زجاجية معتمة تحفظ في درجات تبريد صارمة لضمان وصوله إلى طاولتكم بكامل طاقته الطبيعية.`,
    healthBenefitsAr: [
      'تجديد خلايا الجسم وتعزيز الحيوية والشباب',
      'زيادة التركيز ومقاومة الإرهاق الذهني والبدني',
      'موازنة وظائف الجسم الحيوية'
    ],
    pairingSuggestionsAr: [
      'جرام واحد تحت اللسان صباحاً قبل الإفطار',
      'خلطه مع عسل السدر الملكي لتركيبة طاقة حيوية'
    ],
    storageInstructionsAr: 'يحفظ مجمدًا أو مبردًا في الثلاجة (تحت 4 درجات مئوية).',
    images: [
      '/images/zaad-nature-honey-clover.jpg',
      'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: false,
    isAvailable: true,
    rating: 4.96,
    reviewCount: 24,
    badge: 'تركيز فائق',
    sensoryProfile: {
      sweetness: 1,
      floralAroma: 2,
      density: 4,
      intensity: 5,
      crystallization: 'كريمي حمضي'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-RJ05',
      harvestSeason: 'المحصول الطازج 2026',
      harvestDate: '2026-02-05',
      testedDate: '2026-02-14',
      labName: 'مختبر التكنولوجيا الحيوية للأغذية',
      moisturePercentage: 66.2,
      hmfLevel: 0.0,
      diastaseActivity: 0.0,
      sucrosePercentage: 0.0,
      pollenPurityPercentage: 100.0,
      certificatePdfUrl: '/certificates/ZD-2026-RJ05.pdf'
    }
  },
  {
    id: 'prod-7',
    slug: 'adult-honey-blend',
    sku: 'ZD-ADULT-450',
    nameAr: 'خلطة زاد للبالغين بالجينسنغ والغذاء الملكي',
    nameEn: 'House of ZAAD Adult Energy & Vitality Honey Blend',
    taglineAr: 'تركيبة حيوية استثنائية تجمع عسل السدر الخام مع خلاصة الجينسنغ الأحمر وغذاء الملكات وحبوب اللقاح.',
    categoryId: 'cat-4',
    categoryNameAr: 'منتجات الخلية الفاخرة',
    price: 590,
    compareAtPrice: 690,
    currency: 'EGP',
    stockQuantity: 25,
    reservedStock: 2,
    lowStockThreshold: 5,
    weightGrams: 450,
    originRegionAr: 'مزارع الوادي الجديد ومناحل سيناء العضوية',
    originRegionEn: 'New Valley & Sinai Organic Reserves',
    floralSourceAr: 'سدر بري + جينسنغ أحمر كوري + حبوب لقاح النخيل + غذاء ملكات طازج',
    floralSourceEn: 'Wild Sidr + Korean Red Ginseng + Royal Jelly + Palm Pollen',
    shortDescAr: 'خلطة طبيعية متكاملة مصممة خصيصاً للبالغين لتعزيز النشاط البدني والذهني ومقاومة الإجهاد اليومي بتركيز نشط 100%.',
    fullStoryAr: `صيغت خلطة زاد للبالغين بعناية فائقة لتجمع أقوى عناصر الخلية مع أعشاب الحيوية الشرقية. يتم مزج غذاء الملكات الطازج مع خلاصة الجينسنغ الأحمر وغبار طلع النخيل داخل قاعدة من عسل السدر الجبلي النقي بدرجات حرارة منخفضة جداً تحافظ على كافة الإنزيمات الحية والخصائص الحيوية للمكونات دون أي مواد كيميائية أو سكريات مضافة.`,
    healthBenefitsAr: [
      'دعم فوري للطاقة الحيوية والقدرة على التحمل البدني والنشاط',
      'تعزيز التركيز والصفاء الذهني وتقليل الإجهاد المزمن والتوتر',
      'تقوية المناعة الطبيعية وتجديد الحيوية اليومية المستدامة للبالغين',
      'تحسين الدورة الدموية ومقاومة عوامل التأكسد والشيخوخة المبكرة'
    ],
    pairingSuggestionsAr: [
      'ملعقة واحدة على الريق صباحاً مع كوب ماء فاتر',
      'قبل التمارين الرياضية أو النشاط البدني بساعة',
      'إضافته لسموذي المكسرات والتمور الطبيعية'
    ],
    usageInstructionsAr: 'تناول ملعقة واحدة (15 جرام) صباحاً على الريق أو قبل النشاط البدني بساعة. يُفضل عدم تناول المشروبات الساخنة بعدها مباشرة للحفاظ على فاعلية الجينسنغ والإنزيمات الحية.',
    storageInstructionsAr: 'يحفظ في مكان بارد وجاف تحت 22 درجة مئوية. يُفضل تحريك المزيج بملعقة خشبية قبل كل استخدام لضمان تجانس المكونات.',
    images: [
      '/images/zaad-nature-honey-clover.jpg',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 4.97,
    reviewCount: 38,
    badge: 'الأعلى طلباً للبالغين',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 4,
      density: 5,
      intensity: 5,
      crystallization: 'كثيف متماسك'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-ADULT01',
      harvestSeason: 'خلطة الموسم الطازجة 2026',
      harvestDate: '2026-02-10',
      testedDate: '2026-02-20',
      labName: 'المركز الإقليمي لتحاليل الأغذية الحيوية',
      moisturePercentage: 14.5,
      hmfLevel: 1.9,
      diastaseActivity: 21.3,
      sucrosePercentage: 0.6,
      pollenPurityPercentage: 99.4,
      certificatePdfUrl: '/certificates/ZD-2026-ADULT01.pdf'
    }
  },
  {
    id: 'prod-8',
    slug: 'royal',
    sku: 'ZD-ROYAL-500',
    nameAr: 'عسل السدر الملكي التراثي النادر',
    nameEn: 'Royal Reserve Heritage Sidr Honey',
    taglineAr: 'خلاصة قطاف أشجار السدر المعمرة، معبأ يدوياً بإصدار مرقم محدود.',
    categoryId: 'cat-1',
    categoryNameAr: 'أعسال السدر النادرة',
    price: 650,
    compareAtPrice: 780,
    currency: 'EGP',
    stockQuantity: 18,
    reservedStock: 2,
    lowStockThreshold: 5,
    weightGrams: 500,
    originRegionAr: '',
    originRegionEn: '',
    floralSourceAr: 'أشجار السدر العتيقة المعمرة (Ziziphus Spina-Christi)',
    floralSourceEn: 'Ancient Wild Sidr Trees',
    shortDescAr: 'الإصدار الملكي التراثي من عسل السدر الصافي، يتميز بكثافة لزجة استثنائية ونكهة خشبية فخمة تدوم طويلاً في الفم مع نقاء أحادي الزهرة يفوق 99.8%.',
    fullStoryAr: `يمثل هذا الإصدار أرقى ما تجود به الطبيعة العذراء، حيث تقطف الأقراص الشمعية يدوياً من مناحل تقليدية معزولة عن أي شوائب بيئية. يمر العسل باختبارات فحص صارمة لضمان نقاء أحادي الزهرة بنسبة تتجاوز 99% وتوثيق خلوه من أي تغذية سكرية صناعية.`,
    healthBenefitsAr: [
      'أعلى تركيز لمركبات الفلافونويد ومضادات الأكسدة الفائقة',
      'ترميم الغشاء المخاطي ودعم الجهاز الهضمي والقولون',
      'تعزيز المناعة العامة وتنشيط الكبد وتطهير السموم',
      'مصدر طبيعي فاخر للمعادن النادرة والإنزيمات الحية'
    ],
    pairingSuggestionsAr: [
      'تذوق قطرات نقية على الريق للاستمتاع بالنكهة الملكية',
      'مع الجبن العضوي المعتق وقطع الجوز الملكي',
      'إضافته للقهوة العربية الأصيلة'
    ],
    usageInstructionsAr: 'ملعقة خشبية صغيرة صباحاً على الريق لتذوق النكهة العطرية والتمتع بكامل الفوائد الإنزيمية.',
    storageInstructionsAr: 'يحفظ في مكان معتم بدرجة حرارة الغرفة (18-24 مئوية). لا يحفظ في الثلاجة مطلقاً.',
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85',
      '/images/zaad-nature-honey-clover.jpg'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 5.0,
    reviewCount: 49,
    badge: 'إصدار ملكي خاص',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 5,
      density: 5,
      intensity: 5,
      crystallization: 'نادر جداً'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-ROYAL99',
      harvestSeason: 'موسم الشتاء الملكي 2026',
      harvestDate: '2026-01-12',
      testedDate: '2026-01-28',
      labName: 'مختبرات الجودة النوعية الأوروبية (Eurofins Scientific)',
      moisturePercentage: 13.6,
      hmfLevel: 1.2,
      diastaseActivity: 24.8,
      sucrosePercentage: 0.3,
      pollenPurityPercentage: 99.8,
      certificatePdfUrl: '/certificates/ZD-2026-ROYAL99.pdf'
    }
  },
  {
    id: 'prod-9',
    slug: 'sidr-honey',
    sku: 'ZD-SDR-WILD',
    nameAr: 'عسل السدر البري الطبيعي 100%',
    nameEn: 'Pure Wild Sidr Honey',
    taglineAr: 'رحيق نقي من أزهار السدر البرية في مروج الطبيعة النقية.',
    categoryId: 'cat-1',
    categoryNameAr: 'أعسال السدر النادرة',
    price: 390,
    compareAtPrice: 460,
    currency: 'EGP',
    stockQuantity: 30,
    reservedStock: 3,
    lowStockThreshold: 8,
    weightGrams: 500,
    originRegionAr: 'المحميات الطبيعية، جمهورية مصر العربية',
    originRegionEn: 'Protected Natural Reserves, Egypt',
    floralSourceAr: 'أشجار السدر والنبق البرية',
    floralSourceEn: 'Wild Lotus & Sidr Trees',
    shortDescAr: 'عسل سدر طبيعي 100% خام غير مبستر، خفيف ولذيذ بقوام حريري ولون عنبري ذهبي مناسب للاستخدام العائلي اليومي ودعم المناعة.',
    fullStoryAr: `عسل السدر البري من زاد يجسد التوازن المثالي بين الطعم اللذيذ والقيمة الغذائية العالية. يتم جنيه من أزهار شجر السدر البري في مواسم الإزهار السنوية، ويفلتر بارداً ليصل إليكم بكامل نقائه ومذاقه الأصيل دون أي تسخين يفقده فوائده.`,
    healthBenefitsAr: [
      'دعم مناعة العائلة والأطفال ضد نزلات البرد وتغير الفصول',
      'مُحلي طبيعي بديل وصحي للسكر الأبيض في المشروبات والأطعمة',
      'مهدئ لطيف للجهاز التنفسي والحلق والسعال',
      'يمد الجسم بالطاقة الصباحية النظيفة دون رفع مفاجئ للسكريات'
    ],
    pairingSuggestionsAr: [
      'ملعقة كبيرة مذابة في كوب ماء دافئ أو شاي أعشاب',
      'مع التوست المحمص والمكسرات النيئة',
      'فوق سلطة الفواكه الطازجة والزبادي'
    ],
    usageInstructionsAr: 'ملعقة كبيرة يومياً محلاة في المشروبات الدافئة أو على الخبز والمخبوزات الصباحية.',
    storageInstructionsAr: 'يحفظ في خزانة المطبخ في درجة حرارة الغرفة بعيداً عن الضوء المباشر والرطوبة.',
    images: [
      '/images/zaad-nature-honey-clover.jpg',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=85'
    ],
    isFeatured: true,
    isAvailable: true,
    rating: 4.91,
    reviewCount: 35,
    badge: 'نقاء طبيعي 100%',
    sensoryProfile: {
      sweetness: 4,
      floralAroma: 4,
      density: 4,
      intensity: 4,
      crystallization: 'بطيء'
    },
    latestLabBatch: {
      batchNumber: 'ZD-2026-SDR-WILD',
      harvestSeason: 'محصول ربيع 2026',
      harvestDate: '2026-02-01',
      testedDate: '2026-02-15',
      labName: 'المختبر المركزي لتحليل الأغذية والأعسال',
      moisturePercentage: 15.2,
      hmfLevel: 2.5,
      diastaseActivity: 18.5,
      sucrosePercentage: 0.9,
      pollenPurityPercentage: 96.5,
      certificatePdfUrl: '/certificates/ZD-2026-SDR-WILD.pdf'
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ZD-89421',
    customerId: 'usr-1',
    customerName: 'الأمير فيصل بن عبد العزيز آل سعود',
    customerEmail: 'faisal.a@luxury-sa.com',
    customerPhone: '+966 50 123 4567',
    shippingAddress: {
      fullName: 'صاحب السمو فيصل آل سعود',
      phone: '+966 50 123 4567',
      email: 'faisal.a@luxury-sa.com',
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      district: 'حي حطين النموذجي',
      street: 'شارع الأمير تركي الأول',
      buildingOrVilla: 'قصر رقم 14',
      postalCode: '11564',
      deliveryNotes: 'التسليم للمكتب الخاص بالبوابة الرئيسية'
    },
    items: [
      {
        productId: 'prod-4',
        productNameAr: 'صندوق الاحتياط الملكي الفاخر (ثلاثية زاد)',
        productSlug: 'royal-zaad-reserve-box',
        productImage: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400&q=80',
        price: 1190,
        quantity: 2,
        total: 2380,
        weightGrams: 3000
      },
      {
        productId: 'prod-1',
        productNameAr: 'عسل سدر ملكي فاخر',
        productSlug: 'royal-sidr-doan',
        productImage: '/images/zaad-nature-honey-clover.jpg',
        price: 490,
        quantity: 1,
        total: 490,
        weightGrams: 500
      }
    ],
    subtotal: 2870,
    discountAmount: 0,
    shippingFee: 0,
    luxuryGiftBoxIncluded: true,
    luxuryGiftMessage: 'مع أطيب التحيات والتقدير من دار زاد للنقاء',
    totalAmount: 2870,
    currency: 'EGP',
    status: 'awaiting_verification',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'proof_submitted',
    paymentProof: {
      id: 'prf-501',
      orderId: 'ord-101',
      receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      senderName: 'فيصل بن عبدالعزيز آل سعود',
      senderBank: 'مصرف الراجحي - الحساب الخاص',
      senderPhone: '+966 50 123 4567',
      transactionReference: 'TXN-RAJHI-984321098',
      transferDate: '2026-08-22',
      amountTransferred: 2870,
      status: 'proof_submitted',
      createdAt: '2026-08-22T09:15:00Z'
    },
    statusTimeline: [
      { status: 'pending', timestamp: '2026-08-22T09:10:00Z', noteAr: 'تم إنشاء الطلب واختيار الدفع عبر التحويل البنكي' },
      { status: 'awaiting_verification', timestamp: '2026-08-22T09:15:00Z', noteAr: 'تم رفع إيصال التحويل البنكي بنجاح وفي انتظار اعتماد العمليات' }
    ],
    createdAt: '2026-08-22T09:10:00Z',
    updatedAt: '2026-08-22T09:15:00Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'ZD-89419',
    customerId: 'usr-2',
    customerName: 'د. مريم النعيمي',
    customerEmail: 'dr.maryam@naimi-clinic.ae',
    customerPhone: '+971 50 987 6543',
    shippingAddress: {
      fullName: 'د. مريم النعيمي',
      phone: '+971 50 987 6543',
      email: 'dr.maryam@naimi-clinic.ae',
      country: 'الإمارات العربية المتحدة',
      city: 'دبي',
      district: 'جميرا 1',
      street: 'شارع شاطئ جميرا',
      buildingOrVilla: 'فيلا 88B',
      postalCode: '00000',
      deliveryNotes: 'الاتصال المسبق قبل الوصول بنصف ساعة'
    },
    items: [
      {
        productId: 'prod-1',
        productNameAr: 'عسل سدر ملكي فاخر',
        productSlug: 'royal-sidr-doan',
        productImage: '/images/zaad-nature-honey-clover.jpg',
        price: 490,
        quantity: 2,
        total: 980,
        weightGrams: 1000
      },
      {
        productId: 'prod-6',
        productNameAr: 'غذاء ملكات النحل الجبلي النقي 100%',
        productSlug: 'pure-royal-jelly-extract',
        productImage: '/images/zaad-nature-honey-clover.jpg',
        price: 450,
        quantity: 1,
        total: 450,
        weightGrams: 100
      }
    ],
    subtotal: 1430,
    discountAmount: 143,
    shippingFee: 0,
    luxuryGiftBoxIncluded: true,
    totalAmount: 1287,
    currency: 'EGP',
    status: 'paid',
    paymentMethod: 'instapay',
    paymentStatus: 'approved',
    paymentProof: {
      id: 'prf-502',
      orderId: 'ord-102',
      receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      senderName: 'مريم النعيمي',
      senderBank: 'بنك الإمارات دبي الوطني',
      transactionReference: 'ENBD-INSTA-44321',
      transferDate: '2026-08-21',
      amountTransferred: 1287,
      status: 'approved',
      reviewedBy: 'إدارة العمليات المركزية',
      reviewedAt: '2026-08-21T14:30:00Z',
      createdAt: '2026-08-21T14:00:00Z'
    },
    trackingNumber: 'SMSA-987654321',
    courierName: 'سمسا إكسبريس (شحن فاخر)',
    statusTimeline: [
      { status: 'pending', timestamp: '2026-08-21T13:55:00Z', noteAr: 'تم استلام الطلب' },
      { status: 'awaiting_verification', timestamp: '2026-08-21T14:00:00Z', noteAr: 'تم رفع إيصال الدفع' },
      { status: 'paid', timestamp: '2026-08-21T14:30:00Z', noteAr: 'تم اعتماد الدفع وتجهيز الشحنة في الغرفة المعقمة' }
    ],
    createdAt: '2026-08-21T13:55:00Z',
    updatedAt: '2026-08-21T14:30:00Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'ZD-89410',
    customerId: 'usr-3',
    customerName: 'المهندس كريم الشناوي',
    customerEmail: 'kareem.elshinawy@gmail.com',
    customerPhone: '+20 100 123 9988',
    shippingAddress: {
      fullName: 'كريم الشناوي',
      phone: '+20 100 123 9988',
      email: 'kareem.elshinawy@gmail.com',
      country: 'مصر',
      city: 'القاهرة',
      district: 'التجمع الخامس',
      street: 'شارع التسعين الشمالي',
      buildingOrVilla: 'كمبوند ميفيدا - فيلا 42',
      postalCode: '11835'
    },
    items: [
      {
        productId: 'prod-2',
        productNameAr: 'عسل سمر بري جبلي معتق',
        productSlug: 'wild-samar-honey',
        productImage: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=400&q=80',
        price: 360,
        quantity: 1,
        total: 360,
        weightGrams: 500
      }
    ],
    subtotal: 360,
    discountAmount: 0,
    shippingFee: 45,
    luxuryGiftBoxIncluded: false,
    totalAmount: 405,
    currency: 'EGP',
    status: 'delivered',
    paymentMethod: 'vodafone_cash',
    paymentStatus: 'approved',
    trackingNumber: 'ARAMEX-EG-554109',
    courierName: 'أرامكس للشحن السريع',
    statusTimeline: [
      { status: 'pending', timestamp: '2026-08-18T10:00:00Z', noteAr: 'تم إنشاء الطلب' },
      { status: 'paid', timestamp: '2026-08-18T10:20:00Z', noteAr: 'تم تأكيد فودافون كاش' },
      { status: 'shipped', timestamp: '2026-08-19T08:00:00Z', noteAr: 'خرجت الشحنة للتوصيل الدولي' },
      { status: 'delivered', timestamp: '2026-08-20T16:45:00Z', noteAr: 'تم التسليم بنجاح للعميل' }
    ],
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-20T16:45:00Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'operations@zaad-luxury.com',
    fullName: 'إدارة العمليات والمطابقة الملكية',
    role: 'super_admin',
    vipTier: 'Black Diamond',
    loyaltyPoints: 10000,
    totalSpent: 0,
    ordersCount: 0,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'usr-1',
    email: 'faisal.a@luxury-sa.com',
    fullName: 'صاحب السمو فيصل بن عبدالعزيز آل سعود',
    phone: '+966 50 123 4567',
    role: 'customer',
    vipTier: 'Black Diamond',
    loyaltyPoints: 2870,
    totalSpent: 14500,
    ordersCount: 6,
    createdAt: '2025-06-12T00:00:00Z'
  },
  {
    id: 'usr-2',
    email: 'dr.maryam@naimi-clinic.ae',
    fullName: 'د. مريم النعيمي',
    phone: '+971 50 987 6543',
    role: 'customer',
    vipTier: 'Royal Platinum',
    loyaltyPoints: 1287,
    totalSpent: 8200,
    ordersCount: 4,
    createdAt: '2025-09-04T00:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productNameAr: 'عسل سدر ملكي فاخر',
    customerName: 'عبدالرحمن بن خالد القحطاني',
    rating: 5,
    titleAr: 'أفضل عسل سدر تذوقته بلا مبالغة',
    commentAr: 'القوام والرائحة والشهادة المخبرية المرفقة تعكس مستوى احترافي لا تجده في السوق العادي. وصل الطلب مغلفاً بصندوق فاخر يستحق كل ريال.',
    isVerifiedPurchase: true,
    helpfulCount: 38,
    createdAt: '2026-08-10T12:00:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    productNameAr: 'عسل سدر ملكي فاخر',
    customerName: 'سارة بنت سلطان المهيري',
    rating: 5,
    titleAr: 'فخامة هادئة وتجربة استثنائية',
    commentAr: 'ملعقة واحدة على الريق تشعرك بالفرق المباشر في النقاء والطاقة. خدمة التحقق من الإيصال والتوصيل كانت راقية وسريعة جداً.',
    isVerifiedPurchase: true,
    helpfulCount: 24,
    createdAt: '2026-08-15T15:20:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    productNameAr: 'صندوق الاحتياط الملكي الفاخر (ثلاثية زاد)',
    customerName: 'خالد المنصوري',
    rating: 5,
    titleAr: 'هدية راقية جداً ترفع الرأس',
    commentAr: 'قدمت الصندوق إهداءً لأحد الشركاء المميزين وكان الانطباع مبهراً. جودة الخشب والمخمل وختم الذهب مع نقاء الأصناف الثلاثة شيء نادر.',
    isVerifiedPurchase: true,
    helpfulCount: 19,
    createdAt: '2026-08-19T18:30:00Z'
  }
];

export const INITIAL_CMS: CmsSection[] = [
  {
    id: 'cms-hero',
    key: 'hero_banner',
    titleAr: 'الواجهة الرئيسية الفاخرة',
    subtitleAr: 'زاد | دار النقاء الطبيعي',
    headlineAr: 'نقاءٌ استثنائي يستحقّه إرثك',
    bodyAr: 'نحن لا نبيع العسل كمنتج تجاري، بل نوثق إرثاً أصيلاً من النقاء الشامل، المقطوف يدوياً من أعالي الأودية العذراء بأعلى معايير الحرفة والتوثيق المخبري المعتمد عالمياً.',
    ctaTextAr: 'اكتشف المجموعة الملكية',
    ctaLink: '/shop',
    imageUrl: '/images/zaad-nature-honey-clover.jpg',
    isActive: true,
    updatedAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'cms-story',
    key: 'brand_story',
    titleAr: 'قصة زاد وفلسفة الفخامة الهادئة',
    subtitleAr: 'من الأودية العذراء إلى طاولتكم',
    headlineAr: 'رحلة البحث عن القطرة الأكثر نقاءً في العالم',
    bodyAr: 'تبدأ حكايتنا في أصفى المحميات والمناحل الطبيعية، حيث لا تصل آليات المدن ولا تتدخل الكيمياء الحديثة. نحرص على كل قطرة لتصلكم نقية وحية.',
    isActive: true,
    updatedAt: '2026-08-22T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'usr-admin-1',
    userName: 'إدارة العمليات',
    userRole: 'super_admin',
    action: 'APPROVE_PAYMENT_PROOF',
    entityType: 'PAYMENT',
    entityId: 'prf-502',
    detailsAr: 'تم اعتماد إيصال تحويل إنستاباي بمبلغ 1,287 ر.س للطلب ZD-89419 وإرسال بريد التأكيد للعميلة.',
    ipAddress: '192.168.1.10',
    timestamp: '2026-08-21T14:30:00Z'
  },
  {
    id: 'aud-2',
    userId: 'usr-admin-1',
    userName: 'إدارة العمليات',
    userRole: 'super_admin',
    action: 'CREATE_BATCH_LAB_TEST',
    entityType: 'BATCH',
    entityId: 'ZD-2026-SD01',
    detailsAr: 'تسجيل بيانات جودة تشغيلة السدر (نقاء لقاح 98.6%).',
    ipAddress: '192.168.1.10',
    timestamp: '2026-08-22T08:00:00Z'
  }
];
