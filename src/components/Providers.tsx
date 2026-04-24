"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { PWAProvider } from "@/components/PWAProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <PWAProvider>
            {children}
            <CartDrawer />
          </PWAProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
