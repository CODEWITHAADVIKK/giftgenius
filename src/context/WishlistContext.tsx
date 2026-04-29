"use client";

import React, {
  createContext, useContext, useEffect,
  useState, useCallback, useRef,
} from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => boolean;
  isWishlisted: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  toggleItem: () => false,
  isWishlisted: () => false,
  count: 0,
});

const STORAGE_KEY = "giftgenius_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (_e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (_e) {
      // storage full — ignore
    }
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = useCallback((item: WishlistItem): boolean => {
    let added = false;
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      added = true;
      return [...prev, item];
    });
    return added;
  }, []);

  const isWishlisted = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, isWishlisted, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
