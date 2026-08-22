export type UserRole = 'super_admin' | 'admin' | 'operations' | 'customer_support' | 'customer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  vipTier: 'Gold' | 'Royal Platinum' | 'Black Diamond' | 'Standard';
  loyaltyPoints: number;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  itemCount: number;
}

export interface SensoryProfile {
  sweetness: number;    // 1 - 5
  floralAroma: number;  // 1 - 5
  density: number;      // 1 - 5 (Viscosity)
  intensity: number;    // 1 - 5
  crystallization: string; // 'عالي' | 'متوسط' | 'نادر'
}

export interface LabAnalysis {
  batchNumber: string;
  harvestSeason: string;
  harvestDate: string;
  testedDate: string;
  labName: string;
  moisturePercentage: number;   // e.g. 14.2% (Standard max is 20%)
  hmfLevel: number;             // Hydroxymethylfurfural mg/kg (Standard max 80, ZAAD is < 5)
  diastaseActivity: number;     // Enzyme activity in Schade units (ZAAD > 16)
  sucrosePercentage: number;    // Natural sugars vs free sucrose (< 1.5%)
  pollenPurityPercentage: number; // Single floral purity (e.g. 98.4%)
  certificatePdfUrl?: string;
  labSealImageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  categoryId: string;
  categoryNameAr: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockQuantity: number;
  reservedStock: number;
  lowStockThreshold: number;
  weightGrams: number;
  originRegionAr: string;
  originRegionEn: string;
  floralSourceAr: string;
  floralSourceEn: string;
  shortDescAr: string;
  fullStoryAr: string;
  healthBenefitsAr: string[];
  pairingSuggestionsAr: string[];
  storageInstructionsAr: string;
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  sensoryProfile: SensoryProfile;
  latestLabBatch: LabAnalysis;
  badge?: string; // 'موسم نادر' | 'إصدار ملكي خاص' | 'الأكثر طلباً'
}

export type OrderStatus =
  | 'pending'
  | 'awaiting_verification'
  | 'paid'
  | 'preparing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentMethod =
  | 'bank_transfer'
  | 'instapay'
  | 'vodafone_cash'
  | 'mada_card'
  | 'apple_pay';

export type PaymentStatus =
  | 'unpaid'
  | 'proof_submitted'
  | 'approved'
  | 'rejected'
  | 'reupload_requested';

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productSlug: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
  weightGrams: number;
}

export interface PaymentProof {
  id: string;
  orderId: string;
  receiptImageUrl: string;
  senderName: string;
  senderPhone?: string;
  senderBank?: string;
  transactionReference: string;
  transferDate: string;
  amountTransferred: number;
  status: PaymentStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  country: string; // 'المملكة العربية السعودية' | 'الإمارات العربية المتحدة' | 'مصر' | 'الكويت'
  city: string;
  district: string;
  street: string;
  buildingOrVilla?: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ZD-89421"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  luxuryGiftBoxIncluded: boolean;
  luxuryGiftMessage?: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: PaymentProof;
  trackingNumber?: string;
  courierName?: string;
  adminNotes?: string;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    noteAr: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productNameAr: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 - 5
  titleAr: string;
  commentAr: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'BATCH' | 'CMS' | 'SYSTEM';
  entityId: string;
  detailsAr: string;
  ipAddress: string;
  timestamp: string;
}

export interface CmsSection {
  id: string;
  key: string;
  titleAr: string;
  subtitleAr: string;
  headlineAr: string;
  bodyAr: string;
  ctaTextAr?: string;
  ctaLink?: string;
  imageUrl?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface CurrencyRate {
  code: 'SAR' | 'AED' | 'EGP' | 'USD' | 'KWD';
  symbolAr: string;
  rateToSar: number; // SAR base
}
