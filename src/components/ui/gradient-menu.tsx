"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, ShoppingBag, Gift, Share2, Heart } from "lucide-react";

const menuItems = [
  { title: "Home",  gradientFrom: "#7C3AED", gradientTo: "#9B87F5", href: "/",            icon: "home"  },
  { title: "Shop",  gradientFrom: "#56CCF2", gradientTo: "#2F80ED", href: "/products",     icon: "shop"  },
  { title: "Gifts", gradientFrom: "#FF9966", gradientTo: "#E8A87C", href: "/gift-finder",  icon: "gift"  },
  { title: "Share", gradientFrom: "#80FF72", gradientTo: "#7EE8FA", href: null,            icon: "share" },
  { title: "Saved", gradientFrom: "#ffa9c6", gradientTo: "#f434e2", href: "/wishlist",     icon: "heart" },
];

function MenuIcon({ icon }: { icon: string }) {
  const cls = "w-5 h-5";
  switch (icon) {
    case "home":  return <Home className={cls} />;
    case "shop":  return <ShoppingBag className={cls} />;
    case "gift":  return <Gift className={cls} />;
    case "share": return <Share2 className={cls} />;
    case "heart": return <Heart className={cls} />;
    default:      return null;
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({ title: "GiftGenius AI", url: window.location.href }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const el = document.createElement("div");
      el.textContent = "Link copied!";
      el.style.cssText = `
        position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
        background:#7C3AED; color:white; padding:10px 20px;
        border-radius:999px; font-size:14px; z-index:9999;
        box-shadow:0 4px 20px rgba(124,58,237,0.4);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    });
  }
}

export default function GradientMenu() {
  const router = useRouter();

  return (
    <ul className="hidden md:flex gap-4">
      {menuItems.map((item) => (
        <li
          key={item.title}
          onClick={() => item.icon === "share" ? handleShare() : item.href && router.push(item.href)}
          style={{ "--gradient-from": item.gradientFrom, "--gradient-to": item.gradientTo } as React.CSSProperties}
          className="relative w-[48px] h-[48px] bg-[#1F2023] border border-[#2E2E38] shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[140px] hover:shadow-none group cursor-pointer select-none"
        >
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100" />

          <span className="absolute top-[8px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-40" />

          <span className="relative z-10 text-[#9CA3AF] transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">
            <MenuIcon icon={item.icon} />
          </span>

          <span className="absolute z-10 text-white uppercase tracking-wider text-xs font-semibold whitespace-nowrap scale-0 opacity-0 transition-all duration-300 delay-100 group-hover:scale-100 group-hover:opacity-100">
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
