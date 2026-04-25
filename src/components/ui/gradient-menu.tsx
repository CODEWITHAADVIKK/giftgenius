"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  IoHomeOutline,
  IoCartOutline,
  IoGiftOutline,
  IoShareSocialOutline,
  IoHeartOutline,
} from "react-icons/io5";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  href?: string;
  action?: () => void;
}

const menuItems: MenuItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <IoHomeOutline />,
    gradientFrom: "#7C3AED",
    gradientTo: "#9B87F5",
  },
  {
    title: "Shop",
    href: "/products",
    icon: <IoCartOutline />,
    gradientFrom: "#56CCF2",
    gradientTo: "#2F80ED",
  },
  {
    title: "Gifts",
    href: "/gift-finder",
    icon: <IoGiftOutline />,
    gradientFrom: "#FF9966",
    gradientTo: "#E8A87C",
  },
  {
    title: "Share",
    icon: <IoShareSocialOutline />,
    gradientFrom: "#80FF72",
    gradientTo: "#7EE8FA",
    action: () => {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({
          title: "GiftGenius AI — India's Smartest Gift Platform",
          text: "Find the perfect gift with AI-powered recommendations!",
          url: window.location.href,
        }).catch(() => {});
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        // Simple visual feedback
        const el = document.createElement("div");
        el.textContent = "Link copied! ✓";
        el.style.cssText = "position:fixed;top:80px;left:50%;transform:translateX(-50%);background:#7C3AED;color:#fff;padding:8px 20px;border-radius:999px;font-size:13px;z-index:9999;animation:fadeIn 0.3s ease";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
      }
    },
  },
  {
    title: "Saved",
    href: "/products?ar=true",
    icon: <IoHeartOutline />,
    gradientFrom: "#ffa9c6",
    gradientTo: "#f434e2",
  },
];

export default function GradientMenu() {
  const router = useRouter();

  const handleClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <ul className="hidden md:flex gap-4">
      {menuItems.map(({ title, icon, gradientFrom, gradientTo }, idx) => (
        <li
          key={idx}
          onClick={() => handleClick(menuItems[idx])}
          style={
            {
              "--gradient-from": gradientFrom,
              "--gradient-to": gradientTo,
            } as React.CSSProperties
          }
          className="relative w-[48px] h-[48px] bg-[#1F2023] border border-[#2E2E38] shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[140px] hover:shadow-none group cursor-pointer"
        >
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100" />
          <span className="absolute top-[8px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[12px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-40" />
          <span className="relative z-10 transition-all duration-500 group-hover:scale-0 text-[#9CA3AF] text-lg pointer-events-none">
            {icon}
          </span>
          <span className="absolute text-white uppercase tracking-wider text-xs font-semibold transition-all duration-500 scale-0 group-hover:scale-100 pointer-events-none">
            {title}
          </span>
        </li>
      ))}
    </ul>
  );
}
