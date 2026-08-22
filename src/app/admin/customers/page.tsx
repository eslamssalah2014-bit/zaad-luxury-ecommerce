'use client';

import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Award, Phone, Mail, ShoppingBag, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCurrency } from '@/context/CurrencyContext';
import { User } from '@/types';

export default function AdminCustomersPage() {
  const { formatPrice } = useCurrency();
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomers() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'customer');

        if (!error && data && isMounted) {
          const mapped: User[] = data.map((u: any) => ({
            id: String(u.id ?? ''),
            email: String(u.email ?? ''),
            fullName: String(u.full_name ?? 'مقتني مميز'),
            phone: u.phone ? String(u.phone) : undefined,
            role: 'customer',
            vipTier: (u.vip_tier as User['vipTier']) || 'Standard',
            totalSpent: Number(u.total_spent ?? 0),
            ordersCount: Number(u.orders_count ?? 0),
            loyaltyPoints: Number(u.loyalty_points ?? 0),
            createdAt: String(u.created_at ?? new Date().toISOString())
          }));
          setCustomers(mapped);
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
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 bg-gold-50 px-2.5 py-0.5 rounded-full border border-gold-200 mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>عضوية {c.vipTier}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-zaad-900">{c.fullName}</h3>
                <div className="text-xs text-charcoal-700/70 mt-1 flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-gold-600" />
                    {c.email}
                  </span>
                  {c.phone && (
                    <span className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      {c.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-12 h-12 rounded-full bg-zaad-900 text-gold-400 font-serif font-bold flex items-center justify-center text-sm shadow-md border border-gold-400">
                {c.fullName.slice(0, 2)}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-center text-xs">
              <div>
                <span className="text-charcoal-700/70 block text-[10px]">إجمالي الاقتناء:</span>
                <strong className="text-zaad-900 font-mono">{formatPrice(c.totalSpent)}</strong>
              </div>
              <div>
                <span className="text-charcoal-700/70 block text-[10px]">الطلبات:</span>
                <strong className="text-zaad-900 font-mono">{c.ordersCount}</strong>
              </div>
              <div>
                <span className="text-charcoal-700/70 block text-[10px]">نقاط النقاء:</span>
                <strong className="text-gold-700 font-mono">{c.loyaltyPoints}</strong>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
