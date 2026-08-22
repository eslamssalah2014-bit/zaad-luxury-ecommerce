import { Product, Order, Category, Review, CmsSection, AuditLog, PaymentStatus, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CATEGORIES, INITIAL_REVIEWS, INITIAL_CMS, INITIAL_AUDIT_LOGS, INITIAL_USERS } from '../data/mockData';

// Global singleton state for demonstration & runtime persistence
class AppStateManager {
  private static instance: AppStateManager;
  private products: Product[] = [...INITIAL_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private reviews: Review[] = [...INITIAL_REVIEWS];
  private cms: CmsSection[] = [...INITIAL_CMS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  private constructor() {}

  public static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  // Products & Batches
  public getProducts(): Product[] {
    return this.products;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  public getProductByBatchNumber(batchNumber: string): Product | undefined {
    const cleanNum = batchNumber.trim().toUpperCase();
    return this.products.find(p => p.latestLabBatch?.batchNumber.toUpperCase() === cleanNum);
  }

  public addProduct(product: Product): Product {
    this.products.unshift(product);
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  // Orders & Payment Verifications
  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public getPendingVerificationOrders(): Order[] {
    return this.orders.filter(o => o.status === 'awaiting_verification' || o.paymentStatus === 'proof_submitted');
  }

  public createOrder(order: Order): Order {
    this.orders.unshift(order);
    // Add audit log
    this.addAuditLog({
      id: `aud-${Date.now()}`,
      userId: order.customerId || 'guest',
      userName: order.customerName,
      userRole: 'customer',
      action: 'CREATE_ORDER',
      entityType: 'ORDER',
      entityId: order.orderNumber,
      detailsAr: `تم إنشاء الطلب رقم ${order.orderNumber} بمبلغ إجمالي ${order.totalAmount} ${order.currency}`,
      ipAddress: '192.168.1.1',
      timestamp: new Date().toISOString()
    });
    return order;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, noteAr: string, adminName = 'إدارة العمليات'): Order | null {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.statusTimeline.push({
      status,
      timestamp: new Date().toISOString(),
      noteAr
    });

    this.addAuditLog({
      id: `aud-${Date.now()}`,
      userId: 'admin-1',
      userName: adminName,
      userRole: 'admin',
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'ORDER',
      entityId: order.orderNumber,
      detailsAr: `تحديث حالة الطلب إلى [${status}]: ${noteAr}`,
      ipAddress: '192.168.1.10',
      timestamp: new Date().toISOString()
    });

    return order;
  }

  public reviewPaymentProof(
    orderId: string,
    action: 'approve' | 'reject' | 'request_reupload',
    reviewerName: string,
    reason?: string
  ): Order | null {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order || !order.paymentProof) return null;

    const now = new Date().toISOString();
    order.paymentProof.reviewedBy = reviewerName;
    order.paymentProof.reviewedAt = now;

    if (action === 'approve') {
      order.paymentStatus = 'approved';
      order.paymentProof.status = 'approved';
      order.status = 'paid';
      order.statusTimeline.push({
        status: 'paid',
        timestamp: now,
        noteAr: `تم اعتماد إيصال الدفع البنكي (${order.paymentProof.transactionReference}) بنجاح والبدء في تجهيز الطلب الفاخر.`
      });

      // Deduct inventory
      order.items.forEach(item => {
        const product = this.products.find(p => p.id === item.productId);
        if (product) {
          product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
          product.reservedStock = Math.max(0, product.reservedStock - item.quantity);
        }
      });

      this.addAuditLog({
        id: `aud-${Date.now()}`,
        userId: 'admin-op-1',
        userName: reviewerName,
        userRole: 'operations',
        action: 'APPROVE_PAYMENT_PROOF',
        entityType: 'PAYMENT',
        entityId: order.orderNumber,
        detailsAr: `تم اعتماد إيصال الدفع بقيمة ${order.totalAmount} ${order.currency}. تم تحويل الحالة إلى مدفوع وجاري التجهيز.`,
        ipAddress: '192.168.1.10',
        timestamp: now
      });
    } else if (action === 'reject') {
      order.paymentStatus = 'rejected';
      order.paymentProof.status = 'rejected';
      order.paymentProof.rejectionReason = reason || 'الإيصال غير واضح أو لا يطابق المبلغ المطلوب';
      order.status = 'pending';
      order.statusTimeline.push({
        status: 'pending',
        timestamp: now,
        noteAr: `تم رفض الإيصال لسبب: ${order.paymentProof.rejectionReason}`
      });

      this.addAuditLog({
        id: `aud-${Date.now()}`,
        userId: 'admin-op-1',
        userName: reviewerName,
        userRole: 'operations',
        action: 'REJECT_PAYMENT_PROOF',
        entityType: 'PAYMENT',
        entityId: order.orderNumber,
        detailsAr: `تم رفض الإيصال: ${order.paymentProof.rejectionReason}`,
        ipAddress: '192.168.1.10',
        timestamp: now
      });
    } else if (action === 'request_reupload') {
      order.paymentStatus = 'reupload_requested';
      order.paymentProof.status = 'reupload_requested';
      order.paymentProof.rejectionReason = reason || 'يرجى إعادة رفع إيصال واضح يظهر به رقم العملية وتاريخ اليوم';
      order.statusTimeline.push({
        status: 'awaiting_verification',
        timestamp: now,
        noteAr: `طلب إعادة رفع إيصال: ${order.paymentProof.rejectionReason}`
      });

      this.addAuditLog({
        id: `aud-${Date.now()}`,
        userId: 'admin-op-1',
        userName: reviewerName,
        userRole: 'operations',
        action: 'REQUEST_REUPLOAD_PAYMENT_PROOF',
        entityType: 'PAYMENT',
        entityId: order.orderNumber,
        detailsAr: `طلب إعادة رفع إيصال الدفع: ${order.paymentProof.rejectionReason}`,
        ipAddress: '192.168.1.10',
        timestamp: now
      });
    }

    order.updatedAt = now;
    return order;
  }

  // Categories
  public getCategories(): Category[] {
    return this.categories;
  }

  // Reviews
  public getReviews(): Review[] {
    return this.reviews;
  }

  public getReviewsByProductId(productId: string): Review[] {
    return this.reviews.filter(r => r.productId === productId);
  }

  public addReview(review: Review): Review {
    this.reviews.unshift(review);
    return review;
  }

  // CMS
  public getCmsSections(): CmsSection[] {
    return this.cms;
  }

  public updateCmsSection(key: string, updates: Partial<CmsSection>): CmsSection | null {
    const idx = this.cms.findIndex(c => c.key === key);
    if (idx === -1) return null;
    this.cms[idx] = { ...this.cms[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.cms[idx];
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(log: AuditLog): void {
    this.auditLogs.unshift(log);
  }

  // KPI Analytics Calculations
  public getAnalytics() {
    const totalOrders = this.orders.length;
    const paidOrders = this.orders.filter(o => o.status === 'paid' || o.status === 'preparing' || o.status === 'packed' || o.status === 'shipped' || o.status === 'delivered' || o.status === 'completed');
    const awaitingVerification = this.orders.filter(o => o.status === 'awaiting_verification' || o.paymentStatus === 'proof_submitted').length;
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
    const totalCustomers = INITIAL_USERS.length + 124;
    const repeatCustomerRate = 38.4; // percentage
    const conversionRate = 4.2; // luxury benchmark percentage

    return {
      totalRevenue,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      awaitingVerification,
      averageOrderValue,
      totalCustomers,
      repeatCustomerRate,
      conversionRate,
      recentOrders: this.orders.slice(0, 5),
      monthlyRevenue: [
        { month: 'يناير', revenue: 42500, orders: 48 },
        { month: 'فبراير', revenue: 56800, orders: 62 },
        { month: 'مارس', revenue: 78900, orders: 84 },
        { month: 'أبريل', revenue: 92400, orders: 98 },
        { month: 'مايو', revenue: 114000, orders: 120 },
        { month: 'يونيو', revenue: 138500, orders: 145 },
        { month: 'يوليو', revenue: 162000, orders: 172 },
        { month: 'أغسطس', revenue: 198400, orders: 210 },
      ]
    };
  }
}

export const appState = AppStateManager.getInstance();
