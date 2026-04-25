"use client";
import { useState } from "react";

const FALLBACKS: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
  him: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
  her: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
  nature: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
};

interface ProductImageProps {
  src: string;
  alt: string;
  category?: "him" | "her" | "nature" | "default";
  className?: string;
}

export function ProductImage({ src, alt, category = "default", className }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!errored) {
          setImgSrc(FALLBACKS[category] || FALLBACKS.default);
          setErrored(true);
        }
      }}
    />
  );
}
