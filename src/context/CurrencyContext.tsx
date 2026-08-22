'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'SAR' | 'AED' | 'EGP' | 'USD' | 'KWD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbolAr: string;
  nameAr: string;
  rateToSar: number; // 1 SAR = X other currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  SAR: { code: 'SAR', symbolAr: 'ر.س', nameAr: 'ريال سعودي', rateToSar: 1.0 },
  AED: { code: 'AED', symbolAr: 'د.إ', nameAr: 'درهم إماراتي', rateToSar: 0.98 },
  EGP: { code: 'EGP', symbolAr: 'ج.م', nameAr: 'جنيه مصري', rateToSar: 13.0 },
  USD: { code: 'USD', symbolAr: '$', nameAr: 'دولار أمريكي', rateToSar: 0.267 },
  KWD: { code: 'KWD', symbolAr: 'د.ك', nameAr: 'دينار كويتي', rateToSar: 0.082 },
};

interface CurrencyContextType {
  currentCurrency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInSar: number) => string;
  convertPrice: (amountInSar: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('SAR');

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

  const convertPrice = (amountInSar: number): number => {
    return Math.round(amountInSar * currentCurrency.rateToSar * 100) / 100;
  };

  const formatPrice = (amountInSar: number): string => {
    const converted = convertPrice(amountInSar);
    return `${converted.toLocaleString('ar-SA')} ${currentCurrency.symbolAr}`;
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
