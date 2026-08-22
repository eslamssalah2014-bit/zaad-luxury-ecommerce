import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { FinancialKPIs, TimeframeSales, ProfitReportItem } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // 1. Fetch all products with pricing and costs
    const { data: products, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, name_ar, sku, price, compare_at_price, stock_quantity, visibility_status, sensory_profile, category:categories(name_ar)');

    if (prodErr) {
      console.error('Error fetching products for profit analytics:', prodErr);
      return NextResponse.json({ success: false, error: prodErr.message }, { status: 500 });
    }

    // 2. Fetch all orders with order_items
    const { data: orders, error: ordErr } = await supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (ordErr) {
      console.error('Error fetching orders for profit analytics:', ordErr);
      return NextResponse.json({ success: false, error: ordErr.message }, { status: 500 });
    }

    // Build Product Cost & Info Map
    const productMap = new Map<string, {
      nameAr: string;
      sku: string;
      categoryNameAr: string;
      sellingPrice: number;
      costPrice: number;
      stockQuantity: number;
      visibilityStatus: any;
    }>();

    (products || []).forEach((p: any) => {
      const selling = Number(p.price || 0);
      const cost = Number(p.cost_price ?? p.sensory_profile?.cost_price ?? Math.round(selling * 0.45));
      productMap.set(p.id, {
        nameAr: p.name_ar,
        sku: p.sku,
        categoryNameAr: p.category?.name_ar || 'تصنيف ملكي',
        sellingPrice: selling,
        costPrice: cost,
        stockQuantity: Number(p.stock_quantity ?? 0),
        visibilityStatus: p.visibility_status || p.sensory_profile?.visibility_status || 'published'
      });
    });

    // Date boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let totalRevenue = 0;
    let totalCost = 0;
    let totalOrders = 0;
    let totalUnitsSold = 0;

    const timeframeSales: TimeframeSales = {
      todayRevenue: 0,
      todayOrders: 0,
      weekRevenue: 0,
      weekOrders: 0,
      monthRevenue: 0,
      monthOrders: 0,
      yearRevenue: 0,
      yearOrders: 0
    };

    // Product sales accumulator map: productId -> unitsSold, revenue, cost
    const productSalesMap = new Map<string, { unitsSold: number; revenue: number; cost: number }>();

    (orders || []).forEach((ord: any) => {
      const isPaidOrVerified = ord.payment_status === 'approved' || ord.status === 'paid' || ord.payment_status === 'proof_submitted';
      const orderDate = new Date(ord.created_at);
      const orderTotal = Number(ord.total_amount || 0);

      if (isPaidOrVerified) {
        totalOrders += 1;
        totalRevenue += orderTotal;

        // Periodic accumulations
        if (orderDate >= startOfToday) {
          timeframeSales.todayRevenue += orderTotal;
          timeframeSales.todayOrders += 1;
        }
        if (orderDate >= startOfWeek) {
          timeframeSales.weekRevenue += orderTotal;
          timeframeSales.weekOrders += 1;
        }
        if (orderDate >= startOfMonth) {
          timeframeSales.monthRevenue += orderTotal;
          timeframeSales.monthOrders += 1;
        }
        if (orderDate >= startOfYear) {
          timeframeSales.yearRevenue += orderTotal;
          timeframeSales.yearOrders += 1;
        }

        // Process line items for product profitability and total cost
        (ord.items || []).forEach((item: any) => {
          const qty = Number(item.quantity || 1);
          const itemPrice = Number(item.price || 0);
          const itemTotal = Number(item.total || itemPrice * qty);
          
          const pInfo = productMap.get(item.product_id);
          const unitCost = pInfo ? pInfo.costPrice : Math.round(itemPrice * 0.45);
          const itemCost = unitCost * qty;

          totalCost += itemCost;
          totalUnitsSold += qty;

          const existing = productSalesMap.get(item.product_id) || { unitsSold: 0, revenue: 0, cost: 0 };
          existing.unitsSold += qty;
          existing.revenue += itemTotal;
          existing.cost += itemCost;
          productSalesMap.set(item.product_id, existing);
        });
      }
    });

    const grossProfit = totalRevenue - totalCost;
    const grossMarginPercent = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const financialKpis: FinancialKPIs = {
      totalRevenue,
      totalCost,
      grossProfit,
      grossMarginPercent,
      totalOrders,
      averageOrderValue,
      totalUnitsSold
    };

    // Product Profitability List
    const profitabilityReport: ProfitReportItem[] = [];
    productMap.forEach((pInfo, productId) => {
      const sales = productSalesMap.get(productId) || { unitsSold: 0, revenue: 0, cost: 0 };
      const itemGrossProfit = sales.revenue - sales.cost;
      const itemMargin = sales.revenue > 0
        ? Number(((itemGrossProfit / sales.revenue) * 100).toFixed(1))
        : Number((((pInfo.sellingPrice - pInfo.costPrice) / pInfo.sellingPrice) * 100).toFixed(1));

      profitabilityReport.push({
        productId,
        productNameAr: pInfo.nameAr,
        sku: pInfo.sku,
        categoryNameAr: pInfo.categoryNameAr,
        sellingPrice: pInfo.sellingPrice,
        costPrice: pInfo.costPrice,
        unitsSold: sales.unitsSold,
        totalRevenue: sales.revenue,
        totalCost: sales.cost,
        grossProfit: itemGrossProfit,
        profitMarginPercent: itemMargin,
        stockQuantity: pInfo.stockQuantity,
        status: pInfo.visibilityStatus
      });
    });

    // Sort by Most Profitable
    profitabilityReport.sort((a, b) => b.grossProfit - a.grossProfit);

    const mostProfitable = [...profitabilityReport].sort((a, b) => b.grossProfit - a.grossProfit).slice(0, 3);
    const bestSelling = [...profitabilityReport].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 3);
    const lowestMargin = [...profitabilityReport].sort((a, b) => a.profitMarginPercent - b.profitMarginPercent).slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        financialKpis,
        timeframeSales,
        profitabilityReport,
        highlights: {
          mostProfitable,
          bestSelling,
          lowestMargin
        }
      },
      source: 'supabase'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
