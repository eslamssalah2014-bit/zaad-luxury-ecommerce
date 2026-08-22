import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const orderId = searchParams.get('id');
    const orderNumber = searchParams.get('orderNumber') || searchParams.get('order_number');
    const search = searchParams.get('search');

    // Single order lookup by ID or Order Number
    if (orderId || orderNumber) {
      const identifier = (orderId || orderNumber || '').trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

      let singleQuery = supabaseAdmin
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          proof:payment_proofs(*)
        `);

      if (isUuid) {
        singleQuery = singleQuery.eq('id', identifier);
      } else {
        singleQuery = singleQuery.eq('order_number', identifier);
      }

      const { data, error } = await singleQuery.maybeSingle();
      if (error) {
        console.error('Error fetching single order from Supabase:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      if (!data) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: formatOrderRow(data), source: 'supabase' });
    }

    // Orders list query
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        proof:payment_proofs(*)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error querying orders in Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map(formatOrderRow);
    return NextResponse.json({ success: true, data: formatted, source: 'supabase' });
  } catch (error: any) {
    console.error('Exception in /api/orders GET:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Order = await request.json();
    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
    }

    const orderPayload = {
      order_number: body.orderNumber || `ZD-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: body.customerId && !body.customerId.startsWith('usr-guest') ? body.customerId : null,
      customer_name: body.customerName,
      customer_email: body.customerEmail || `${body.customerPhone}@customer.zaad.sa`,
      customer_phone: body.customerPhone,
      shipping_address: body.shippingAddress || { city: 'الرياض', district: 'العليا', street: 'شارع الملك فهد' },
      subtotal: body.subtotal,
      discount_amount: body.discountAmount || 0,
      shipping_fee: body.shippingFee || 0,
      luxury_gift_box_included: body.luxuryGiftBoxIncluded || false,
      luxury_gift_message: body.luxuryGiftMessage || null,
      total_amount: body.totalAmount,
      currency: body.currency || 'SAR',
      status: body.status || 'pending',
      payment_method: body.paymentMethod,
      payment_status: body.paymentStatus || 'unpaid',
      status_timeline: body.statusTimeline || [
        {
          status: 'pending',
          title: 'تم إنشاء الطلب الملكي',
          timestamp: new Date().toISOString(),
          notes: 'بانتظار تأكيد السداد'
        }
      ]
    };

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ success: false, error: orderError?.message || 'Failed to create order in Supabase' }, { status: 500 });
    }

    // Insert order items into Supabase
    const itemsPayload = body.items.map(item => ({
      order_id: orderData.id,
      product_id: item.productId,
      product_name_ar: item.productNameAr,
      product_slug: item.productSlug,
      product_image: item.productImage,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      weight_grams: item.weightGrams
    }));

    await supabaseAdmin.from('order_items').insert(itemsPayload);

    // Insert payment proof into Supabase if provided
    if (body.paymentProof) {
      await supabaseAdmin.from('payment_proofs').insert({
        order_id: orderData.id,
        receipt_image_url: body.paymentProof.receiptImageUrl,
        sender_name: body.paymentProof.senderName,
        sender_phone: body.paymentProof.senderPhone || null,
        sender_bank: body.paymentProof.senderBank || null,
        transaction_reference: body.paymentProof.transactionReference,
        transfer_date: body.paymentProof.transferDate || new Date().toISOString().split('T')[0],
        amount_transferred: body.paymentProof.amountTransferred,
        status: body.paymentProof.status || 'proof_submitted'
      });
    }

    return NextResponse.json({ success: true, data: orderData, source: 'supabase' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

function formatOrderRow(o: any): Order {
  // Handle both 1-to-1 object and 1-to-many array join representations from PostgREST
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
