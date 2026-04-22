"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { products } from "@/lib/data";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  total: number;
  subtotal: number;
  itemCount: number;
  getProduct: (id: string) => Product | undefined;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gg-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("gg-cart", JSON.stringify(items));
  }, [items]);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    []
  );

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, item) => {
    const prod = getProduct(item.productId);
    return sum + (prod?.price ?? 0) * item.quantity;
  }, 0);

  const total = subtotal; // GST + shipping calculated at checkout

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        total,
        subtotal,
        itemCount,
        getProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
