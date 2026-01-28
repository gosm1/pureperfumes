"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductCustomization } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, customization?: ProductCustomization) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const lastAddRef = React.useRef<{ id: string, time: number } | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ag_fragrance_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('ag_fragrance_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, customization?: ProductCustomization) => {
    const now = Date.now();
    // Debounce: verify if the same product was added less than 500ms ago
    if (lastAddRef.current &&
      lastAddRef.current.id === product.id &&
      now - lastAddRef.current.time < 500) {
      return;
    }
    lastAddRef.current = { id: product.id, time: now };
    setCart(prev => {
      // Find existing item with same product ID AND same customization
      const existing = prev.find(item =>
        item.id === product.id &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existing) {
        return prev.map(item =>
          item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, customization }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      clearCart, isCartOpen, setIsCartOpen, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
