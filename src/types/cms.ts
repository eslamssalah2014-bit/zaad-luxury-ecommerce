export type CmsSectionType =
  | 'image_text'
  | 'banner'
  | 'quote'
  | 'heritage_story'
  | 'product_showcase'
  | 'statistics'
  | 'rich_text'
  | 'cta_block';

export type MediaFolder =
  | 'homepage'
  | 'products'
  | 'story'
  | 'banners'
  | 'logos'
  | 'certificates'
  | 'general';

export interface CmsMediaItem {
  id: string;
  name: string;
  url: string;
  folder: MediaFolder;
  fileType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface HeroBadge {
  id: string;
  textAr: string;
  icon?: string;
}

export interface HeroStat {
  id: string;
  value: string;
  labelAr: string;
  sublabelAr?: string;
}

export interface HeroConfig {
  headlineAr: string;
  headlineHighlightAr: string;
  subtitleAr: string;
  descriptionAr: string;
  backgroundImageUrl: string;
  badgeTextAr: string;
  primaryCtaTextAr: string;
  primaryCtaLink: string;
  secondaryCtaTextAr: string;
  secondaryCtaLink: string;
  trustPillars: HeroStat[];
}

export interface HomepageSection {
  id: string;
  type: CmsSectionType;
  titleAr: string;
  subtitleAr?: string;
  badgeAr?: string;
  headlineAr?: string;
  bodyAr?: string;
  quoteAr?: string;
  quoteAuthorAr?: string;
  imageUrl?: string;
  imageAltAr?: string;
  imagePosition?: 'left' | 'right';
  ctaTextAr?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  isVisible: boolean;
  order: number;
  stats?: HeroStat[];
  features?: string[];
}

export interface StoryChapter {
  id: string;
  periodTagAr: string;
  titleAr: string;
  descriptionParagraphs: string[];
  imageUrl?: string;
  imageCaptionAr?: string;
  quoteAr?: string;
  order: number;
  isVisible: boolean;
}

export interface StoryPageConfig {
  metaBadgeAr: string;
  mainTitleAr: string;
  mainSubtitleAr: string;
  heroBannerImageUrl: string;
  heroBannerTitleAr: string;
  heroBannerSubtitleAr: string;
  chapters: StoryChapter[];
  valuesTitleAr: string;
  valuesSubtitleAr: string;
  values: { id: string; titleAr: string; descAr: string }[];
}

export interface AnnouncementBarConfig {
  isEnabled: boolean;
  messageTextAr: string;
  secondaryTextAr?: string;
  linkUrl?: string;
  iconName: 'sparkles' | 'truck' | 'shield' | 'flame' | 'gift' | 'bell' | 'crown';
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface NavItem {
  id: string;
  nameAr: string;
  href: string;
  order: number;
  isVisible: boolean;
  isExternal?: boolean;
  badgeAr?: string;
}

export interface NavigationMenuConfig {
  brandNameAr: string;
  brandTaglineAr: string;
  logoUrl: string;
  items: NavItem[];
}

export interface CmsTestimonialItem {
  id: string;
  customerName: string;
  customerTitleAr?: string;
  headingAr: string;
  contentAr: string;
  rating: number; // 1 to 5
  customerImageUrl?: string;
  isVisible: boolean;
  order: number;
  productPurchasedAr?: string;
}

export interface TestimonialsSectionConfig {
  isEnabled: boolean;
  mainTitleAr: string;
  subtitleAr: string;
  descriptionAr: string;
  backgroundColor: string;
  textColor?: string;
  displayCount: number;
  layoutType: 'grid' | 'carousel';
  items: CmsTestimonialItem[];
}

export interface DesignTokens {
  primaryGreen: string;
  darkGreen: string;
  accentGold: string;
  lightGold: string;
  backgroundColor: string;
  surfaceColor: string;
  fontFamily: 'Amiri' | 'Cairo' | 'Tajawal' | 'IBM Plex Sans Arabic' | 'Playfair Display';
  baseFontSizePx: number;
  buttonRadius: 'pill' | 'rounded' | 'sharp';
  enableGlowEffects: boolean;
}

export interface SeoPageConfig {
  pagePath: string;
  pageNameAr: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords: string[];
}

export interface SeoConfig {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  pages: SeoPageConfig[];
}

export interface FooterBadge {
  id: string;
  titleAr: string;
  subtitleAr: string;
  icon: 'award' | 'shield' | 'truck' | 'lock' | 'sparkles';
  isVisible?: boolean;
  order?: number;
}

export interface FooterLink {
  id: string;
  labelAr: string;
  href: string;
  openInNewTab?: boolean;
  isVisible?: boolean;
  order?: number;
}

export interface FooterColumn {
  id: string;
  titleAr: string;
  icon?: string;
  isVisible?: boolean;
  order?: number;
  links: FooterLink[];
}

export interface SocialLinkItem {
  id: string;
  platform: 'instagram' | 'whatsapp' | 'tiktok' | 'twitter' | 'facebook' | 'youtube' | 'linkedin' | 'custom';
  labelAr: string;
  url: string;
  isVisible: boolean;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
}

export interface ContactInfo {
  whatsappNumber: string;
  whatsappPrefilledMessageAr: string;
  customerSupportEmail: string;
  supportPhone: string;
  workingHoursAr: string;
  addressAr: string;
}

export interface FooterConfig {
  logoUrl?: string;
  brandNameAr?: string;
  brandSloganAr: string;
  aboutTextAr: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  badges: FooterBadge[];
  columns: FooterColumn[];
  contact: ContactInfo;
  social: SocialLinks;
  socialItems?: SocialLinkItem[];
  copyrightTextAr: string;
  vatOrCrNumberAr: string;
}

export interface ShopPromoBanner {
  isEnabled: boolean;
  badgeAr?: string;
  titleAr: string;
  descriptionAr: string;
  buttonTextAr: string;
  buttonLink: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface ShopPageConfig {
  heroBadgeAr: string;
  mainTitleAr: string;
  subtitleAr: string;
  bannerImageUrl?: string;
  searchPlaceholderAr: string;
  allCategoriesLabelAr: string;
  sortFeaturedLabelAr: string;
  sortPriceHighLabelAr: string;
  sortPriceLowLabelAr: string;
  sortRatingLabelAr: string;
  resultsCountTemplateAr: string;
  resetFiltersLabelAr: string;
  gridColumns: 2 | 3 | 4;
  addToCartButtonTextAr: string;
  quickViewButtonTextAr: string;
  showLabBatchTag: boolean;
  showOriginRegionTag: boolean;
  showRatingStars: boolean;
  emptyStateTitleAr: string;
  emptyStateDescAr: string;
  emptyStateButtonTextAr: string;
  promoBanner: ShopPromoBanner;
}

// 1. Dynamic Attribute
export interface ProductAttribute {
  id: string;
  nameAr: string;        // e.g., 'اللون', 'الرائحة', 'القوام', 'بلد المنشأ', 'المصدر'
  valueAr: string;       // e.g., 'عنبري داكن', 'زهري دافئ', 'كثيف حريري'
  icon?: string;         // e.g., 'droplet', 'sparkles', 'map-pin', 'feather', 'shield', 'award'
  isVisible: boolean;
  order: number;
}

// 2. Dynamic Content Block
export type ProductBlockType =
  | 'rich_text'
  | 'image'
  | 'image_text'
  | 'icons_grid'
  | 'faq'
  | 'quote'
  | 'divider'
  | 'custom_html';

export interface ProductContentBlock {
  id: string;
  type: ProductBlockType;
  titleAr?: string;
  bodyAr?: string;
  imageUrl?: string;
  imageAltAr?: string;
  imagePosition?: 'left' | 'right';
  quoteAuthorAr?: string;
  faqItems?: { id: string; question: string; answer: string }[];
  iconsGridItems?: { id: string; titleAr: string; descAr: string; icon?: string }[];
  customHtml?: string;
  isVisible: boolean;
  order: number;
}

// 3. Dynamic Product Tab
export interface ProductTab {
  id: string;
  slug: string;
  titleAr: string;         // e.g., 'تفاصيل المنتج الطبيعي', 'الفوائد الصحية', 'طرق الاستخدام', 'الأسئلة الشائعة'
  badgeAr?: string;
  isVisible: boolean;
  order: number;
  isSystemReviewsTab?: boolean;
  blocks: ProductContentBlock[];
}

// 4. Product Details Page Global CMS Configuration
export interface ProductPageGlobalConfig {
  defaultShippingTextAr: string;        // "شحن لجميع محافظات مصر"
  defaultVatTextAr: string;             // "شامل ضريبة القيمة المضافة"
  defaultTrustBadgeTextAr: string;      // "نقاء موثق وخام 100%"
  defaultStockAvailableTextAr: string;  // "متوفر بالمستودع"
  defaultStockOutTextAr: string;        // "نفد من المخزون"
  relatedProductsTitleAr: string;       // "منتجات طبيعية متناغمة قد تنال إعجابكم"
  reviewsHeadingAr: string;             // "آراء المقتنين"
  addReviewHeadingAr: string;           // "شاركنا انطباعك عن تجربة هذا المنتج"
  addReviewSubheadingAr: string;        // "تقييمك يسهم في إثراء سجل دار زاد للنقاء."
  addReviewButtonTextAr: string;        // "إرسال التقييم"
  
  // Section Visibility Controls
  showBreadcrumbs: boolean;
  showWishlistAndShare: boolean;
  showRatingStars: boolean;
  showCompareAtPrice: boolean;
  showVatMessage: boolean;
  showShippingMessage: boolean;
  showTrustBadges: boolean;
  showStockStatus: boolean;
  showQuantityStepper: boolean;
  showAttributesGrid: boolean;
  showTabsSection: boolean;
  showRelatedProducts: boolean;
  showLabBatch: boolean;                // Default: false
  showSensoryProfile: boolean;          // Default: false
  
  // Global Default Tabs Template
  defaultTabs: ProductTab[];
  defaultAttributes: ProductAttribute[];
}

export interface CartDrawerConfig {
  // A. Header
  drawerTitleAr: string;
  headerBadgeAr?: string;

  // B. Free Shipping Progress Area
  showFreeShippingBar: boolean;
  freeShippingThreshold: number;
  freeShippingRemainingTextAr: string;
  freeShippingEligibleTextAr: string;

  // C. Gift Packaging Section
  showGiftPackaging: boolean;
  giftPackagingTitleAr: string;
  giftPackagingSubtitleAr: string;
  giftMessagePlaceholderAr: string;

  // D. Coupon Section
  showCouponSection: boolean;
  couponPlaceholderAr: string;
  couponButtonTextAr: string;
  couponActiveLabelAr: string;

  // E. Summary Labels
  subtotalLabelAr: string;
  discountLabelAr: string;
  shippingLabelAr: string;
  freeShippingLabelAr: string;
  totalLabelAr: string;
  vatNoteAr?: string;

  // F. Action Buttons & Navigation
  checkoutButtonTextAr: string;
  showViewCartLink: boolean;
  viewCartLinkTextAr: string;

  // G. Empty State
  emptyStateTitleAr: string;
  emptyStateDescAr: string;
  emptyStateButtonTextAr: string;
  emptyStateButtonLink: string;
}

export interface CmsSettingsDocument {
  version: number;
  updatedAt: string;
  publishedAt?: string;
  hero: HeroConfig;
  homepageSections: HomepageSection[];
  storyPage: StoryPageConfig;
  shopPage: ShopPageConfig;
  productDetailPage: ProductPageGlobalConfig;
  cartDrawer: CartDrawerConfig;
  announcementBar: AnnouncementBarConfig;
  navigation: NavigationMenuConfig;
  testimonials: TestimonialsSectionConfig;
  design: DesignTokens;
  seo: SeoConfig;
  footer: FooterConfig;
}
