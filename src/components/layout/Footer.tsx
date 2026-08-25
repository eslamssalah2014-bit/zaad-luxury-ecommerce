'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Truck,
  Lock,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Globe
} from 'lucide-react';
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

  const badgeIcons: Record<string, any> = {
    award: Award,
    shield: ShieldCheck,
    truck: Truck,
    lock: Lock,
    sparkles: Sparkles
  };

  const visibleBadges = (footer.badges || [])
    .filter((b) => b.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const visibleColumns = (footer.columns || [])
    .filter((c) => c.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Determine balanced column span
  const brandColSpan = visibleColumns.length <= 2 ? 'md:col-span-6' : visibleColumns.length === 3 ? 'md:col-span-3' : 'md:col-span-4';
  const linksColSpan = visibleColumns.length <= 2 ? 'md:col-span-3' : visibleColumns.length === 3 ? 'md:col-span-3' : 'md:col-span-2';

  const isDark =
    !footer.backgroundColor ||
    footer.backgroundColor.startsWith('#0') ||
    footer.backgroundColor.includes('zaad');

  return (
    <footer
      style={{
        backgroundColor: footer.backgroundColor || '#07160c',
        color: footer.textColor || '#fbf8f1'
      }}
      className="pt-16 pb-12 border-t-2 border-gold-600/40 relative overflow-hidden font-arabic transition-colors duration-300"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Quality Badges Tier */}
        {visibleBadges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-zaad-800/80 text-center sm:text-right">
            {visibleBadges.map((b) => {
              const Icon = badgeIcons[b.icon] || Award;
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-3.5 p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-zaad-900/60 border-gold-500/20 hover:border-gold-500/40'
                      : 'bg-white/80 border-ivory-300 shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-ivory-100' : 'text-zaad-900'}`}>{b.titleAr}</h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-ivory-400' : 'text-charcoal-600'}`}>{b.subtitleAr}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Footer Links - Dynamic Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 py-12 border-b border-zaad-800/80">
          
          {/* Brand Column */}
          <div className={`${brandColSpan} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-400/50 bg-white p-0.5 shadow-md shrink-0">
                <Image
                  src={footer.logoUrl || '/images/zaad-logo.png'}
                  alt={footer.brandNameAr || 'زاد | دار النقاء'}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className={`font-serif text-2xl font-bold tracking-widest ${isDark ? 'text-ivory-50' : 'text-zaad-900'}`}>
                  {footer.brandNameAr || 'ZAAD'}
                </span>
                {footer.brandSloganAr && (
                  <p className="text-[10px] text-gold-400 tracking-wider font-light">{footer.brandSloganAr}</p>
                )}
              </div>
            </div>

            {footer.aboutTextAr && (
              <p className={`text-xs leading-relaxed max-w-md ${isDark ? 'text-ivory-300/85' : 'text-charcoal-700'}`}>
                {footer.aboutTextAr}
              </p>
            )}
            
            {/* Direct Contact Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              {footer.contact?.whatsappNumber && (
                <a
                  href={`https://wa.me/${footer.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(footer.contact.whatsappPrefilledMessageAr || 'مرحباً دار زاد')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-400 hover:text-gold-300 flex items-center gap-1.5 font-bold transition-colors bg-zaad-900/70 border border-gold-500/30 px-3.5 py-1.5 rounded-full"
                >
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span>محادثة واتساب</span>
                </a>
              )}
              {footer.contact?.customerSupportEmail && (
                <a
                  href={`mailto:${footer.contact.customerSupportEmail}`}
                  className={`hover:text-gold-300 flex items-center gap-1.5 font-medium transition-colors ${
                    isDark ? 'text-ivory-300' : 'text-charcoal-700'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-gold-500" />
                  <span>{footer.contact.customerSupportEmail}</span>
                </a>
              )}
              {footer.contact?.supportPhone && (
                <a
                  href={`tel:${footer.contact.supportPhone.replace(/[^0-9+]/g, '')}`}
                  className={`hover:text-gold-300 flex items-center gap-1.5 font-medium transition-colors ${
                    isDark ? 'text-ivory-300' : 'text-charcoal-700'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-gold-500" />
                  <span dir="ltr">{footer.contact.supportPhone}</span>
                </a>
              )}
            </div>

            {/* Social Media Links with Inline Crisp SVGs */}
            <div className="pt-2 flex items-center gap-3">
              {footer.social?.instagram && (
                <a
                  href={footer.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-zaad-900 border border-gold-500/30 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-zaad-950 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {footer.social?.twitter && (
                <a
                  href={footer.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-full bg-zaad-900 border border-gold-500/30 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-zaad-950 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {footer.social?.facebook && (
                <a
                  href={footer.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-zaad-900 border border-gold-500/30 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-zaad-950 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {footer.social?.youtube && (
                <a
                  href={footer.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-zaad-900 border border-gold-500/30 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-zaad-950 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {footer.social?.linkedin && (
                <a
                  href={footer.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-zaad-900 border border-gold-500/30 text-gold-400 flex items-center justify-center hover:bg-gold-500 hover:text-zaad-950 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Dynamic Columns */}
          {visibleColumns.map((col) => {
            const visibleLinks = (col.links || [])
              .filter((l) => l.isVisible !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            return (
              <div key={col.id} className={linksColSpan}>
                <h4 className="text-sm font-bold text-gold-300 mb-4 border-r-2 border-gold-500 pr-2.5">
                  {col.titleAr}
                </h4>
                <ul className={`space-y-3 text-xs ${isDark ? 'text-ivory-300/90' : 'text-charcoal-700'}`}>
                  {visibleLinks.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        target={link.openInNewTab ? '_blank' : undefined}
                        rel={link.openInNewTab ? 'noreferrer' : undefined}
                        className="hover:text-gold-300 hover:translate-x-[-2px] inline-flex items-center gap-1 transition-all"
                      >
                        <span>{link.labelAr}</span>
                        {link.openInNewTab && <ExternalLink className="w-3 h-3 opacity-60" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

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
