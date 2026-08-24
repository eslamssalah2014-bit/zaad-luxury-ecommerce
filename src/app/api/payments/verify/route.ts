import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Enforce Super Admin Authorization
    const auth = await verifyAdminSession(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ success: false, error: auth.error || 'غير مصرح' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { orderId, action, reviewerName, reason } = body;

    if (!orderId || !action || !['approve', 'reject', 'request_reupload'].includes(action)) {
      return NextResponse.json({ success: false, error: 'معلمات طلب الاعتماد غير صالحة' }, { status: 400 });
    }

    const now = new Date().toISOString();
    let paymentStatus = 'proof_submitted';
    let orderStatus = 'awaiting_verification';

    if (action === 'approve') {
      paymentStatus = 'approved';
      orderStatus = 'paid';
    } else if (action === 'reject') {
      paymentStatus = 'rejected';
      orderStatus = 'pending';
    } else if (action === 'request_reupload') {
      paymentStatus = 'reupload_requested';
      orderStatus = 'awaiting_verification';
    }

    // 1. Update Order in Supabase
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        updated_at: now
      })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .select('*, items:order_items(*)')
      .single();

    if (updateError || !updatedOrder) {
      return NextResponse.json({ success: false, error: updateError?.message || 'الطلب غير موجود في Supabase' }, { status: 404 });
    }

    // 2. Update Payment Proof in Supabase
    await supabaseAdmin
      .from('payment_proofs')
      .update({
        status: paymentStatus,
        rejection_reason: reason || null,
        reviewed_at: now,
        reviewed_by: auth.user?.id || null
      })
      .eq('order_id', updatedOrder.id);

    // 3. AUTOMATIC INVENTORY DEDUCTION (When order payment is APPROVED)
    if (action === 'approve' && Array.isArray(updatedOrder.items) && updatedOrder.items.length > 0) {
      for (const item of updatedOrder.items) {
        try {
          const { data: product } = await supabaseAdmin
            .from('products')
            .select('id, name_ar, stock_quantity, sku')
            .eq('id', item.product_id)
            .single();

          if (product) {
            const currentStock = Number(product.stock_quantity ?? 0);
            const deductQty = Number(item.quantity || 1);
            const newStock = Math.max(0, currentStock - deductQty);

            await supabaseAdmin
              .from('products')
              .update({
                stock_quantity: newStock,
                updated_at: now
              })
              .eq('id', product.id);

            await supabaseAdmin.from('inventory_movements').insert({
              product_id: product.id,
              movement_type: 'sale_fulfillment',
              quantity_changed: -deductQty,
              quantity_after: newStock,
              reference_id: updatedOrder.order_number,
              reason: `خصم تلقائي لتأكيد سداد الطلب الملكي رقم ${updatedOrder.order_number} (${item.product_name_ar})`
            });
          }
        } catch (itemErr) {
          console.error(`Error deducting stock for product ${item.product_id}:`, itemErr);
        }
      }
    }

    // 4. Write immutable audit log to Supabase
    await supabaseAdmin.from('audit_logs').insert({
      user_name: reviewerName || auth.user?.email || 'إدارة العمليات والتدقيق المالي',
      user_role: auth.user?.role || 'super_admin',
      action: `PAYMENT_${action.toUpperCase()}`,
      entity_type: 'PAYMENT',
      entity_id: updatedOrder.order_number,
      details_ar: `قرار التدقيق المالي: [${action}] للطلب رقم ${updatedOrder.order_number}. ${reason ? 'الملاحظة: ' + reason : ''}`,
      ip_address: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: updatedOrder, source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
  }
}
