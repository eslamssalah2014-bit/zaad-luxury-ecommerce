'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';
import { DEFAULT_CMS_SETTINGS } from '@/lib/services/cmsService';
import { AnnouncementBarConfig, NavigationMenuConfig } from '@/types/cms';

interface HeaderProps {
  initialAnnouncement?: AnnouncementBarConfig;
  initialNavigation?: NavigationMenuConfig;
}

export default function Header({ initialAnnouncement, initialNavigation }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, openDrawer, total } = useCart();
  const { currentCurrency, setCurrency, formatPrice } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [announcement, setAnnouncement] = useState<AnnouncementBarConfig>(
    initialAnnouncement || DEFAULT_CMS_SETTINGS.announcementBar
  );
  const [navigation, setNavigation] = useState<NavigationMenuConfig>(
    initialNavigation || DEFAULT_CMS_SETTINGS.navigation
  );

  useEffect(() => {
    if (initialAnnouncement) setAnnouncement(initialAnnouncement);
    if (initialNavigation) setNavigation(initialNavigation);
  }, [initialAnnouncement, initialNavigation]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleNavItems = navigation.items.filter(item => item.isVisible);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 w-full">
      {/* Top Luxury Announcement Bar */}
      {announcement.isEnabled && (
        <div
          style={{
            backgroundColor: announcement.backgroundColor || '#07160c',
            color: announcement.textColor || '#f3e8cb'
          }}
          className="text-xs py-2 px-4 border-b border-zaad-800 tracking-wide transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: announcement.accentColor || '#d4af37' }}
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              ></span>
              <span className="font-medium">{announcement.messageTextAr}</span>
            </div>
            {announcement.secondaryTextAr && (
              <div className="hidden md:flex items-center gap-6 text-[11px]">
                <Link
                  href={announcement.linkUrl || '/story'}
                  style={{ color: announcement.accentColor || '#d4af37' }}
                  className="hover:opacity-80 transition-opacity flex items-center gap-1 font-bold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{announcement.secondaryTextAr}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-ivory-50/95 backdrop-blur-md shadow-luxury py-3 border-b border-ivory-300' : 'bg-ivory-100/90 backdrop-blur-sm py-4 border-b border-ivory-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zaad-800 hover:text-gold-600 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Primary Circular Brand Seal Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none transition-transform"
            aria-label="دار زاد للنقاء - الصفحة الرئيسية"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400/50 shadow-sm bg-white p-0.5 group-hover:border-gold-500 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
              <Image
                src={navigation.logoUrl || '/images/zaad-logo.png'}
                alt="زاد | دار النقاء"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {visibleNavItems.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id || link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-200 py-1 ${
                    isActive
                      ? 'text-zaad-800 font-semibold'
                      : 'text-charcoal-800/80 hover:text-zaad-800'
                  }`}
                >
                  <span>{link.nameAr}</span>
                  {link.badgeAr && (
                    <span className="mr-1.5 text-[9px] font-bold bg-gold-100 text-gold-800 border border-gold-300 px-1.5 py-0.2 rounded-full">
                      {link.badgeAr}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-gold-500 rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 text-xs font-semibold text-zaad-800 bg-ivory-200/80 hover:bg-ivory-300 px-2.5 py-1.5 rounded-full border border-ivory-300 transition-all"
              >
                <span>{currentCurrency.code}</span>
                <span className="text-gold-600">({currentCurrency.symbolAr})</span>
                <ChevronDown className="w-3 h-3 text-zaad-700" />
              </button>

              {currencyOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-ivory-300 py-1 z-50 text-right animate-fade-in">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-ivory-100 transition-colors ${
                        currentCurrency.code === code ? 'text-zaad-800 font-bold bg-gold-50/50' : 'text-charcoal-800'
                      }`}
                    >
                      <span>{CURRENCIES[code].nameAr}</span>
                      <span className="text-gold-600 font-mono">{code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 bg-zaad-800 hover:bg-zaad-700 text-white px-3.5 py-2 rounded-full shadow-sm hover:shadow-gold-glow transition-all gold-shimmer-btn"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-gold-300" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold-500 text-zaad-950 text-[10px] font-bold flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline-block">
                {total > 0 ? formatPrice(total) : 'الحقيبة'}
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory-50 border-b border-ivory-300 px-6 py-5 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-4">
            {visibleNavItems.map((link) => (
              <Link
                key={link.id || link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-zaad-800 py-2 border-b border-ivory-200 flex items-center justify-between"
              >
                <span>{link.nameAr}</span>
                {link.badgeAr && (
                  <span className="text-[10px] font-bold bg-gold-100 text-gold-800 border border-gold-300 px-2 py-0.5 rounded-full">
                    {link.badgeAr}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
