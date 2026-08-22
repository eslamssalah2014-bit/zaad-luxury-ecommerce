import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const identifier = id.trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        proof:payment_proofs(*)
      `);

    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('order_number', identifier);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('Error fetching order by ID from Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: formatOrderRow(data),
      source: 'supabase'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

function formatOrderRow(o: any): Order {
  const rawProof = Array.isArray(o.proof)
    ? o.proof[0]
    : (o.proof || (Array.isArray(o.payment_proofs) ? o.payment_proofs[0] : o.payment_proofs) || null);

  const proofFormatted = rawProof ? {
    id: String(rawProof.id ?? ''),
    orderId: String(rawProof.order_id ?? o.id),
    receiptImageUrl: String(rawProof.receipt_image_url ?? '/images/zaad-logo.png'),
    senderName: String(rawProof.sender_name ?? o.customer_name ?? 'المحول'),
    senderPhone: rawProof.sender_phone ? String(rawProof.sender_phone) : undefined,
    senderBank: String(rawProof.sender_bank ?? 'مصرف الراجحي'),
    transactionReference: String(rawProof.transaction_reference ?? 'REF-' + o.order_number),
    transferDate: String(rawProof.transfer_date ?? o.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0]),
    amountTransferred: Number(rawProof.amount_transferred ?? o.total_amount ?? 0),
    status: rawProof.status || 'proof_submitted',
    rejectionReason: rawProof.rejection_reason ? String(rawProof.rejection_reason) : undefined,
    createdAt: String(rawProof.created_at ?? o.created_at ?? new Date().toISOString())
  } : undefined;

  return {
    id: o.id,
    orderNumber: o.order_number,
    customerId: o.customer_id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    shippingAddress: o.shipping_address,
    items: o.items?.map((item: any) => ({
      productId: item.product_id,
      productNameAr: item.product_name_ar,
      productSlug: item.product_slug,
      productImage: item.product_image,
      price: Number(item.price),
      quantity: item.quantity,
      total: Number(item.total),
      weightGrams: item.weight_grams
    })) || [],
    subtotal: Number(o.subtotal),
    discountAmount: Number(o.discount_amount),
    shippingFee: Number(o.shipping_fee),
    luxuryGiftBoxIncluded: o.luxury_gift_box_included,
    luxuryGiftMessage: o.luxury_gift_message,
    totalAmount: Number(o.total_amount),
    currency: o.currency,
    status: o.status,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    trackingNumber: o.tracking_number,
    courierName: o.courier_name,
    adminNotes: o.admin_notes,
    statusTimeline: o.status_timeline || [],
    paymentProof: proofFormatted,
    createdAt: o.created_at,
    updatedAt: o.updated_at
  };
}
