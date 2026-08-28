import { ProductAttribute, ProductTab } from './cms';

export type UserRole = 'super_admin' | 'admin' | 'operations' | 'customer_support' | 'customer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'Royal VIP' | 'Black Diamond' | 'Royal Platinum';
  loyaltyPoints: number;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface SensoryProfile {
  sweetness: number;      // 1-5
  floralAroma: number;    // 1-5
  density: number;        // 1-5
  intensity: number;      // 1-5
  crystallization: string; // 'نادر' | 'بطيء' | 'متوسط' | 'سريع'
  cost_price?: number;
  visibility_status?: ProductVisibility;
  subcategory_id?: string | null;
  attributes?: ProductAttribute[];
  tabs?: ProductTab[];
  usage_instructions_ar?: string | null;
  custom_shipping_message?: string | null;
  custom_vat_message?: string | null;
  custom_trust_badge_text?: string | null;
}

export interface LabAnalysis {
  batchNumber: string;
  harvestSeason: string;
  harvestDate: string;
  testedDate: string;
  labName: string;
  moisturePercentage: number;   // Max 20%
  hmfLevel: number;             // Max 80 mg/kg
  diastaseActivity: number;     // Min 8
  sucrosePercentage: number;    // Max 5%
  pollenPurityPercentage: number; // e.g. 98.5%
  certificatePdfUrl?: string;
  labSealImageUrl?: string;
}

export type ProductVisibility = 'published' | 'draft' | 'hidden' | 'out_of_stock';

export interface Subcategory {
  id: string;
  categoryId: string;
  categoryNameAr?: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  isActive?: boolean;
  itemCount?: number;
  subcategories?: Subcategory[];
}

export interface HealthBenefitItem {
  title: string;
  description: string;
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
  subcategoryId?: string;
  subcategoryNameAr?: string;
  price: number;
  sellingPrice?: number;
  compareAtPrice?: number;
  comparePrice?: number;
  discountPercentage?: number;
  costPrice?: number; // Cost of goods sold (COGS)
  currency: string;
  stockQuantity: number;
  reservedStock: number;
  availableStock?: number;
  lowStockThreshold: number;
  weightGrams: number;
  originRegionAr?: string;
  originRegionEn?: string;
  floralSourceAr?: string;
  floralSourceEn?: string;
  shortDescAr: string;
  fullStoryAr: string;

  // Product-Specific Health Benefits (Titles + Descriptions)
  healthBenefits?: HealthBenefitItem[];
  healthBenefit1Title?: string;
  healthBenefit1Desc?: string;
  healthBenefit2Title?: string;
  healthBenefit2Desc?: string;
  healthBenefit3Title?: string;
  healthBenefit3Desc?: string;
  healthBenefit4Title?: string;
  healthBenefit4Desc?: string;
  healthBenefitsAr?: (string | HealthBenefitItem)[];

  // Product-Specific Usage and Storage
  usageInstructionsAr?: string;
  storageInstructionsAr?: string;

  pairingSuggestionsAr?: string[];
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  visibilityStatus?: ProductVisibility;
  rating: number;
  reviewCount: number;
  sensoryProfile?: SensoryProfile;
  latestLabBatch?: LabAnalysis;
  badge?: string;
  attributes?: ProductAttribute[];
  tabs?: ProductTab[];
  customShippingMessage?: string;
  customVatMessage?: string;
  customTrustBadgeText?: string;
  createdAt?: string;
  updatedAt?: string;
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
  costPrice?: number;
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

export type InventoryMovementType =
  | 'sale_reservation'
  | 'sale_fulfillment'
  | 'restock_batch'
  | 'return_restock'
  | 'damage_loss'
  | 'manual_adjustment'
  | 'audit_adjustment';

export interface InventoryMovement {
  id: string;
  productId: string;
  productNameAr?: string;
  batchId?: string;
  movementType: InventoryMovementType;
  quantityChanged: number;
  quantityAfter: number;
  referenceId?: string;
  reason: string;
  createdBy?: string;
  createdAt: string;
}

export interface ProfitReportItem {
  productId: string;
  productNameAr: string;
  sku: string;
  categoryNameAr: string;
  sellingPrice: number;
  costPrice: number;
  unitsSold: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMarginPercent: number;
  stockQuantity: number;
  status: ProductVisibility;
}

export interface FinancialKPIs {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  totalOrders: number;
  averageOrderValue: number;
  totalUnitsSold: number;
}

export interface TimeframeSales {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
  yearRevenue: number;
  yearOrders: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'BATCH' | 'CMS' | 'SYSTEM' | 'INVENTORY';
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
  code: 'EGP' | 'SAR' | 'AED' | 'USD' | 'KWD';
  symbolAr: string;
  rateToEgp: number; // EGP base
}
