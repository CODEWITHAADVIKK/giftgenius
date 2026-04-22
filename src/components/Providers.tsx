"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartDrawer } from "@/components/CartDrawer";
import { PWAProvider } from "@/components/PWAProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <PWAProvider>
          {children}
          <CartDrawer />
        </PWAProvider>
      </CartProvider>
    </ToastProvider>
  );
}
