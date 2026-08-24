import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { InventoryMovement } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    // 1. Fetch products with current stock levels
    const { data: products, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, name_ar, name_en, sku, slug, price, stock_quantity, reserved_stock, low_stock_threshold, images, category:categories(name_ar)')
      .order('name_ar', { ascending: true });

    if (prodError) {
      console.error('Error fetching inventory products:', prodError);
      return NextResponse.json({ success: false, error: prodError.message }, { status: 500 });
    }

    // 2. Fetch inventory movement logs
    const { data: movements, error: moveError } = await supabaseAdmin
      .from('inventory_movements')
      .select('*, product:products(name_ar, sku)')
      .order('created_at', { ascending: false })
      .limit(50);

    const formattedProducts = (products || []).map((p: any) => {
      const stock = Number(p.stock_quantity ?? 0);
      const reserved = Number(p.reserved_stock ?? 0);
      const threshold = Number(p.low_stock_threshold ?? 5);
      const available = Math.max(0, stock - reserved);

      let status = 'in_stock';
      if (stock === 0) status = 'out_of_stock';
      else if (stock <= threshold) status = 'low_stock';

      return {
        id: p.id,
        nameAr: p.name_ar,
        nameEn: p.name_en,
        sku: p.sku,
        slug: p.slug,
        price: Number(p.price),
        categoryNameAr: p.category?.name_ar || 'تصنيف ملكي',
        image: p.images?.[0] || '/images/zaad-logo.png',
        stockQuantity: stock,
        reservedStock: reserved,
        availableStock: available,
        lowStockThreshold: threshold,
        status
      };
    });

    const totalSkus = formattedProducts.length;
    const totalUnits = formattedProducts.reduce((sum, p) => sum + p.stockQuantity, 0);
    const lowStockCount = formattedProducts.filter(p => p.status === 'low_stock').length;
    const outOfStockCount = formattedProducts.filter(p => p.status === 'out_of_stock').length;

    const formattedMovements: InventoryMovement[] = (movements || []).map((m: any) => ({
      id: m.id,
      productId: m.product_id,
      productNameAr: m.product?.name_ar || 'محصول ملكي',
      batchId: m.batch_id,
      movementType: m.movement_type,
      quantityChanged: m.quantity_changed,
      quantityAfter: m.quantity_after,
      referenceId: m.reference_id,
      reason: m.reason,
      createdBy: m.created_by,
      createdAt: m.created_at
    }));

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalSkus,
          totalUnits,
          lowStockCount,
          outOfStockCount
        },
        products: formattedProducts,
        movements: formattedMovements
      },
      source: 'supabase'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { productId, actionType, quantity, reason, referenceId, reviewerName } = body;

    if (!productId || !quantity || !actionType) {
      return NextResponse.json({ success: false, error: 'المنتج والكمية ونوع الحركة حقول مطلوبة' }, { status: 400 });
    }

    // 1. Fetch current product stock
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('id, name_ar, stock_quantity, sku')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ success: false, error: 'المنتج غير موجود' }, { status: 404 });
    }

    const currentStock = Number(product.stock_quantity ?? 0);
    const changeQty = Number(quantity);
    let newStock = currentStock;

    if (actionType === 'restock_batch' || actionType === 'manual_add') {
      newStock = currentStock + changeQty;
    } else if (actionType === 'manual_deduct' || actionType === 'damage_loss') {
      newStock = Math.max(0, currentStock - changeQty);
    } else if (actionType === 'manual_set') {
      newStock = Math.max(0, changeQty);
    }

    const netDifference = newStock - currentStock;

    // 2. Update product stock in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        stock_quantity: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // 3. Log movement in inventory_movements table
    const movementType = actionType === 'restock_batch' || actionType === 'manual_add'
      ? 'restock_batch'
      : (actionType === 'damage_loss' ? 'damage_loss' : 'manual_adjustment');

    await supabaseAdmin.from('inventory_movements').insert({
      product_id: productId,
      movement_type: movementType,
      quantity_changed: netDifference,
      quantity_after: newStock,
      reference_id: referenceId || product.sku,
      reason: reason || (actionType === 'restock_batch' ? 'توريد دفعة مخزون جديدة' : 'تعديل جرد يدوي')
    });

    // 4. Record in audit_logs
    await supabaseAdmin.from('audit_logs').insert({
      user_name: reviewerName || auth.user?.email || 'إدارة العمليات',
      user_role: auth.user?.role || 'super_admin',
      action: 'INVENTORY_ADJUST',
      entity_type: 'INVENTORY',
      entity_id: product.sku,
      details_ar: `تعديل مخزون [${product.name_ar}]: من ${currentStock} إلى ${newStock} وحدة. السبب: ${reason || 'تعديل يدوي'}`,
      ip_address: '127.0.0.1'
    });

    return NextResponse.json({
      success: true,
      data: {
        productId,
        previousStock: currentStock,
        newStock,
        difference: netDifference
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
