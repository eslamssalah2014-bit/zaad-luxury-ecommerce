'use client';

import React from 'react';
import PoliciesManager from '@/components/admin/cms/PoliciesManager';
import Link from 'next/link';
import { ArrowRight, FileEdit } from 'lucide-react';

export default function AdminPoliciesPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ivory-400 font-arabic">
          <Link href="/admin" className="hover:text-gold-400 transition-colors">
            لوحة التحكم
          </Link>
          <span>/</span>
          <Link href="/admin/cms" className="hover:text-gold-400 transition-colors">
            إدارة المحتوى (CMS)
          </Link>
          <span>/</span>
          <span className="text-gold-400 font-bold">السياسات واللوائح</span>
        </div>

        <Link
          href="/admin/cms"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zaad-900 border border-zaad-800 text-ivory-300 hover:text-gold-400 text-xs transition-colors"
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>الذهاب لكافة أقسام CMS</span>
        </Link>
      </div>

      <PoliciesManager />
    </div>
  );
}
