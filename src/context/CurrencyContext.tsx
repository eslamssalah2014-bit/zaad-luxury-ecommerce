'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'EGP' | 'SAR' | 'AED' | 'USD' | 'KWD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbolAr: string;
  nameAr: string;
  rateToEgp: number; // 1 EGP = X other currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  EGP: { code: 'EGP', symbolAr: 'ج.م', nameAr: 'جنيه مصري', rateToEgp: 1.0 },
  SAR: { code: 'SAR', symbolAr: 'ر.س', nameAr: 'ريال سعودي', rateToEgp: 0.077 },
  AED: { code: 'AED', symbolAr: 'د.إ', nameAr: 'درهم إماراتي', rateToEgp: 0.075 },
  USD: { code: 'USD', symbolAr: '$', nameAr: 'دولار أمريكي', rateToEgp: 0.020 },
  KWD: { code: 'KWD', symbolAr: 'د.ك', nameAr: 'دينار كويتي', rateToEgp: 0.0063 },
};

interface CurrencyContextType {
  currentCurrency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInEgp: number) => string;
  convertPrice: (amountInEgp: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('EGP');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zaad_currency') as CurrencyCode;
      if (saved && CURRENCIES[saved]) {
        setCurrencyCode(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code);
      try {
        localStorage.setItem('zaad_currency', code);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentCurrency = CURRENCIES[currencyCode];

  const convertPrice = (amountInEgp: number): number => {
    return Math.round(Number(amountInEgp || 0) * currentCurrency.rateToEgp * 100) / 100;
  };

  const formatPrice = (amountInEgp: number): string => {
    const converted = convertPrice(amountInEgp);
    return `${converted.toLocaleString('ar-EG')} ${currentCurrency.symbolAr}`;
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
