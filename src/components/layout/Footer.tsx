'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Sparkles, Truck, Lock, ArrowUpRight, MessageCircle, Mail, Phone, Clock, MapPin } from 'lucide-react';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { FooterConfig } from '@/types/cms';

interface FooterProps {
  initialFooter?: FooterConfig;
}

export default function Footer({ initialFooter }: FooterProps) {
  const [footer, setFooter] = useState<FooterConfig>(initialFooter || DEFAULT_CMS_SETTINGS.footer);

  useEffect(() => {
    if (initialFooter) setFooter(initialFooter);
  }, [initialFooter]);

  const badgeIcons = {
    award: Award,
    shield: ShieldCheck,
    truck: Truck,
    lock: Lock,
    sparkles: Sparkles
  };

  return (
    <footer className="bg-zaad-950 text-ivory-200 pt-16 pb-12 border-t-2 border-gold-600/40 relative overflow-hidden font-arabic">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Quality Badges Tier */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zaad-800 text-center sm:text-right">
          {footer.badges.map((b) => {
            const Icon = badgeIcons[b.icon] || Award;
            return (
              <div key={b.id} className="flex items-center gap-3.5 bg-zaad-900/60 p-4 rounded-lg border border-gold-500/20">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ivory-100">{b.titleAr}</h4>
                  <p className="text-[11px] text-ivory-400 mt-0.5">{b.subtitleAr}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-zaad-800/80">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400/50 bg-white p-0.5">
                <Image
                  src="/images/zaad-logo.png"
                  alt="زاد | دار النقاء"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-ivory-50">
                  Z<span className="text-gold-400 font-normal">AA</span>D
                </span>
                <p className="text-[10px] text-gold-400 tracking-wider">{footer.brandSloganAr}</p>
              </div>
            </div>
            <p className="text-xs text-ivory-300/80 leading-relaxed max-w-md">
              {footer.aboutTextAr}
            </p>
            
            {/* Direct Contact Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gold-400">
              {footer.contact?.whatsappNumber && (
                <a
                  href={`https://wa.me/${footer.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(footer.contact.whatsappPrefilledMessageAr || 'مرحباً دار زاد')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-300 flex items-center gap-1.5 font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span>محادثة واتساب مباشرة</span>
                </a>
              )}
              {footer.contact?.customerSupportEmail && (
                <a
                  href={`mailto:${footer.contact.customerSupportEmail}`}
                  className="hover:text-gold-300 flex items-center gap-1.5 font-medium transition-colors text-ivory-300"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{footer.contact.customerSupportEmail}</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Dynamic Columns */}
          {footer.columns.map((col) => (
            <div key={col.id}>
              <h4 className="text-sm font-bold text-gold-300 mb-4 border-r-2 border-gold-500 pr-2">{col.titleAr}</h4>
              <ul className="space-y-2.5 text-xs text-ivory-300">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} className="hover:text-gold-300 transition-colors">
                      {link.labelAr}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Copyright & Security */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory-400 gap-4">
          <div className="flex items-center gap-2">
            <span>{footer.copyrightTextAr}</span>
          </div>
          {footer.vatOrCrNumberAr && (
            <div className="flex items-center gap-4 text-[11px] text-ivory-400 font-mono">
              <span>{footer.vatOrCrNumberAr}</span>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
}
