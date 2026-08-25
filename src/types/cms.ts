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
}

export interface FooterLink {
  id: string;
  labelAr: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  titleAr: string;
  links: FooterLink[];
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
  brandSloganAr: string;
  aboutTextAr: string;
  badges: FooterBadge[];
  columns: FooterColumn[];
  contact: ContactInfo;
  social: SocialLinks;
  copyrightTextAr: string;
  vatOrCrNumberAr: string;
}

export interface CmsSettingsDocument {
  version: number;
  updatedAt: string;
  publishedAt?: string;
  hero: HeroConfig;
  homepageSections: HomepageSection[];
  storyPage: StoryPageConfig;
  announcementBar: AnnouncementBarConfig;
  navigation: NavigationMenuConfig;
  design: DesignTokens;
  seo: SeoConfig;
  footer: FooterConfig;
}
