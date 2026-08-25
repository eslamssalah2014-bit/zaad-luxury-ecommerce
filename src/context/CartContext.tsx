'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, OrderItem } from '@/types';

interface CartContextType {
  items: OrderItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  appliedCoupon: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  isGiftBox: boolean;
  setIsGiftBox: (val: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isGiftBox, setIsGiftBox] = useState<boolean>(true);
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zaad_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zaad_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productNameAr: product.nameAr,
            productSlug: product.slug,
            productImage: product.images[0] || '/images/zaad-nature-honey-clover.jpg',
            price: product.price,
            quantity,
            total: product.price * quantity,
            weightGrams: product.weightGrams
          }
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    setGiftMessage('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ROYAL10' || clean === 'ZAAD10') {
      setAppliedCoupon(clean);
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      return { success: true, message: 'تم تطبيق خصم النخبة الملكي 10% بنجاح' };
    } else if (clean === 'VIP20') {
      setAppliedCoupon(clean);
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      return { success: true, message: 'تم تطبيق خصم كبار الشخصيات 20% بنجاح' };
    }
    return { success: false, message: 'رمز الخصم غير صالح أو منتهي الصلاحية' };
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const freeShippingThreshold = 600;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 45;
  const giftBoxFee = isGiftBox ? 0 : 0; // Complimentary luxury packaging by House of ZAAD
  const total = Math.max(0, subtotal - discount + shippingFee + giftBoxFee);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        applyCoupon,
        appliedCoupon,
        shippingFee,
        freeShippingThreshold,
        total,
        isGiftBox,
        setIsGiftBox,
        giftMessage,
        setGiftMessage,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
