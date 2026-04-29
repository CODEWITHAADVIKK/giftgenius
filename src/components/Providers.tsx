"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
