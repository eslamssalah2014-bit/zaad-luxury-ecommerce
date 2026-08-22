'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { AuditLog } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLogs() {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && isMounted) {
          setLogs(data.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            userName: d.user_name,
            userRole: d.user_role,
            action: d.action,
            entityType: d.entity_type,
            entityId: d.entity_id,
            detailsAr: d.details_ar,
            ipAddress: d.ip_address,
            timestamp: d.created_at
          })));
        }
        if (isMounted) setLoading(false);
      } catch (e) {
        console.error('Error fetching audit logs from Supabase:', e);
        if (isMounted) setLoading(false);
      }
    }
    loadLogs();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs text-gold-700 font-bold bg-gold-50 px-3 py-0.5 rounded-full border border-gold-300 mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>سجل الرقابة والأمان الإداري المباشر (Supabase Audit Trail)</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zaad-900">
          سجل تدقيق العمليات والمطابقات
        </h1>
        <p className="text-xs text-charcoal-700/70 mt-1">
          توثيق فوري لكافة إجراءات الموظفين والعملاء وتعديلات المخزون واعتمادات الدفع المسجلة في Supabase.
        </p>
      </div>

      {/* Logs Table / Cards */}
      {loading ? (
        <div className="p-8 text-center text-zaad-900 font-serif">جاري تحميل سجل التدقيق الأمني من Supabase...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-ivory-300 text-charcoal-700">
          لا توجد سجلات تدقيق حالياً في قاعدة البيانات.
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-sm space-y-4">
          <div className="divide-y divide-ivory-200">
            {logs.map((log) => (
              <div key={log.id} className="py-4 first:pt-0 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                      log.action.includes('APPROVE') || log.action.includes('BOOT')
                        ? 'bg-green-100 text-green-800'
                        : log.action.includes('REJECT')
                        ? 'bg-red-100 text-red-800'
                        : 'bg-zaad-50 text-zaad-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-bold text-zaad-900">{log.userName}</span>
                    <span className="text-[10px] text-charcoal-700/60 font-mono">({log.userRole})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-charcoal-700/60 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(log.timestamp).toLocaleString('ar-SA')}</span>
                    <span>• IP: {log.ipAddress}</span>
                  </div>
                </div>

                <p className="text-charcoal-800 leading-relaxed font-light bg-ivory-50 p-3 rounded-xl border border-ivory-200">
                  {log.detailsAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
