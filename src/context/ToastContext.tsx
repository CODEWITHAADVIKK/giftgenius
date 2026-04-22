"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, ShoppingBag } from "lucide-react";

type ToastType = "success" | "error" | "info" | "cart";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS = {
  success: <CheckCircle2 className="w-4 h-4 text-teal" />,
  error: <AlertCircle className="w-4 h-4 text-coral" />,
  info: <Info className="w-4 h-4 text-violet-light" />,
  cart: <ShoppingBag className="w-4 h-4 text-gold" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              className="liquid-glass-strong rounded-xl px-4 py-3 flex items-start gap-3 min-w-[280px]"
            >
              <div className="mt-0.5">{ICONS[toast.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-white/50 font-[var(--font-body)] mt-0.5 truncate">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-white/30 hover:text-white/60 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
