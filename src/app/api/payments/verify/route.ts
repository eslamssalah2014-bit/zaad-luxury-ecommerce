import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, action, reviewerName, reason } = body;

    if (!orderId || !action || !['approve', 'reject', 'request_reupload'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid verification request parameters' }, { status: 400 });
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
      .select()
      .single();

    if (updateError || !updatedOrder) {
      return NextResponse.json({ success: false, error: updateError?.message || 'Order not found in Supabase' }, { status: 404 });
    }

    // 2. Update Payment Proof in Supabase
    await supabaseAdmin
      .from('payment_proofs')
      .update({
        status: paymentStatus,
        rejection_reason: reason || null,
        reviewed_at: now
      })
      .eq('order_id', updatedOrder.id);

    // 3. Write immutable audit log to Supabase
    await supabaseAdmin.from('audit_logs').insert({
      user_name: reviewerName || 'إدارة العمليات والتدقيق المالي',
      user_role: 'operations',
      action: `PAYMENT_${action.toUpperCase()}`,
      entity_type: 'PAYMENT',
      entity_id: updatedOrder.order_number,
      details_ar: `قرار التدقيق المالي: [${action}] للطلب رقم ${updatedOrder.order_number}. ${reason ? 'الملاحظة: ' + reason : ''}`,
      ip_address: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: updatedOrder, source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
