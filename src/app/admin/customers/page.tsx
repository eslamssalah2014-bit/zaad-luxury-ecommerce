'use client';

import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Award, Phone, Mail, ShoppingBag, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCurrency } from '@/context/CurrencyContext';

export default function AdminCustomersPage() {
  const { formatPrice } = useCurrency();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomers() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'customer');

        if (!error && data && data.length > 0 && isMounted) {
          setCustomers(data.map((u: any) => ({
            id: u.id,
            fullName: u.full_name,
            email: u.email,
            phone: u.phone,
            vipTier: u.vip_tier || 'Standard',
            totalSpent: Number(u.total_spent || 0),
            ordersCount: Number(u.orders_count || 0),
            loyaltyPoints: Number(u.loyalty_points || 0)
          })));
        }
      } catch (err) {
        console.warn('Error fetching live customers from Supabase:', err);
      }
    }
    loadCustomers();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>علاقات كبار الشخصيات والنخبة المباشرة (VIP CRM)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          سجل العملاء والمقتنين المميزين
        </h1>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-6">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zaad-900 text-gold-400 font-serif text-xl font-bold flex items-center justify-center border-2 border-gold-400">
                  {c.fullName ? c.fullName[0] : 'ع'}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-zaad-900">{c.fullName}</h3>
                  <span className="text-[11px] text-gold-700 font-bold bg-gold-50 px-2.5 py-0.5 rounded-full border border-gold-200 mt-1 inline-block">
                    فئة العضوية: {c.vipTier}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center text-xs">
              <div>
                <span className="text-[10px] text-charcoal-700/70 block">القيمة الدائمة (LTV):</span>
                <span className="font-mono text-sm font-bold text-zaad-900">{formatPrice(c.totalSpent)}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700/70 block">إجمالي الطلبات:</span>
                <span className="font-mono text-sm font-bold text-zaad-900">{c.ordersCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700/70 block">نقاط الولاء:</span>
                <span className="font-mono text-sm font-bold text-gold-700">{c.loyaltyPoints}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-charcoal-700/80 pt-2 border-t border-ivory-200">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-600" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-gold-600" />
                <span>{c.phone || 'غير مسجل'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
